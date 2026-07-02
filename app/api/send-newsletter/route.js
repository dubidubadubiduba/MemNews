import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getAllUsers } from '@/lib/users'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles, generateSecAnalysis } from '@/lib/translate'
import { buildEmailHtml } from '@/lib/email-template'
import { SECTIONS } from '@/lib/keywords'

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'ChipBird', email: 'gipunbam@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
}

// 동시 실행 수를 제한하며 비동기 매핑 (레이트리밋·타임아웃 방지)
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function handler(request) {
  const authHeader = request.headers.get('authorization')
  const userAgent = request.headers.get('user-agent') || ''
  const { searchParams } = new URL(request.url)
  const testKey = searchParams.get('test') // 테스트 키
  const testTo = searchParams.get('to')     // 테스트 수신자(1명만)
  const isTest = testKey === 'send-test-9f3a' && !!testTo

  // 발송 리포트 조회(디버그): ?report=send-test-9f3a[&date=YYYY-MM-DD]
  const reportToken = searchParams.get('report')
  if (reportToken === 'send-test-9f3a') {
    const date = searchParams.get('date') ||
      new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
    const rep = await kv.get(`newsletter-report:${date}`).catch(() => null)
    return NextResponse.json(rep || { error: `해당 날짜 리포트 없음: ${date}` })
  }

  // 인증: ① 테스트 모드 ② Vercel Cron(user-agent) ③ CRON_SECRET(헤더 또는 ?key=)
  //  → 외부 정밀 스케줄러(cron-job.org 등)는 ?key=<CRON_SECRET> 로 호출
  const keyParam = searchParams.get('key')
  const isVercelCron = userAgent.toLowerCase().includes('vercel-cron')
  const hasSecret = !!process.env.CRON_SECRET &&
    (authHeader === `Bearer ${process.env.CRON_SECRET}` || keyParam === process.env.CRON_SECRET)

  if (!isTest && !isVercelCron && !hasSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 일요일(KST)은 발송 안 함 + 하루 1회만 발송(중복 방지)
  if (!isTest) {
    const kstWeekday = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul', weekday: 'short' })
    if (kstWeekday === 'Sun') {
      return NextResponse.json({ skipped: true, reason: '일요일은 발송하지 않음' })
    }
    const kstDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
    const lock = await kv.set(`newsletter-sent:${kstDate}`, Date.now(), { nx: true, ex: 23 * 3600 })
      .catch(() => 'OK')
    if (lock === null) {
      return NextResponse.json({ skipped: true, reason: '오늘 이미 발송됨', date: kstDate })
    }
  }

  // 테스트 모드: 전 구독자 대신 지정한 1명에게만, 전체 키워드로 발송
  const allKeywords = Object.values(SECTIONS).flatMap((s) => Object.keys(s.keywords))
  const users = isTest
    ? [{ email: testTo, keywords: allKeywords }]
    : await getAllUsers()
  const today = new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' })
    .replace('. ', '/').replace('.', '')

  const startedAt = new Date().toISOString()

  // RSS 풀은 전 유저 공통 → 한 번만 수집 (유저당 42피드 재수집 = 타임아웃 주원인 제거)
  const pool = await fetchNewsForKeywords([])

  // 매크로 분석 1회 + 인기 기사 번역 캐시 워밍 (전 유저 공유 → Claude 호출 대폭 절감)
  const popularArticles = Object.values(groupBySection(pool, allKeywords)).flat()
  const popularTranslated = await translateArticles(popularArticles) // tr: 캐시 워밍
  const globalAnalysis = await generateSecAnalysis(popularTranslated)

  // 유저별 처리: 동시 5개 제한(레이트리밋 방지). 번역은 위 워밍으로 대부분 캐시 적중
  const results = await mapLimit(users, 5, async (user) => {
    try {
      const grouped = groupBySection(pool, user.keywords || [])
      const sectionNames = Object.keys(grouped)
      const allArticles = sectionNames.flatMap(s => grouped[s])
      const translated = await translateArticles(allArticles)

      let idx = 0
      const translatedGrouped = {}
      for (const section of sectionNames) {
        const count = grouped[section].length
        translatedGrouped[section] = translated.slice(idx, idx + count)
        idx += count
      }

      const html = buildEmailHtml(translatedGrouped, today, globalAnalysis, user.email)
      await sendEmail(user.email, `[ChipBird] ${today} 오늘의 ChipBird`, html)
      return { email: user.email, status: 'sent' }
    } catch (err) {
      console.error('[send-newsletter] 발송 실패:', user.email, err)
      return { email: user.email, status: 'error', error: err.message }
    }
  })

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    subscribers: users.length,
    sent: results.filter(r => r.status === 'sent').length,
    errors: results.filter(r => r.status === 'error').length,
    results,
  }

  // 발송 리포트 저장(7일) → ?report=send-test-9f3a 로 조회
  if (!isTest) {
    const kstDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
    await kv.set(`newsletter-report:${kstDate}`, report, { ex: 7 * 24 * 3600 }).catch(() => {})
  }

  return NextResponse.json(report)
}

// Vercel Cron 은 GET 요청을 보냄. 수동 테스트(POST)도 가능하도록 둘 다 연결.
export const GET = handler
export const POST = handler
