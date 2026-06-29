import { NextResponse } from 'next/server'
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

async function handler(request) {
  const authHeader = request.headers.get('authorization')
  const userAgent = request.headers.get('user-agent') || ''
  const { searchParams } = new URL(request.url)
  const testKey = searchParams.get('test') // 테스트 키
  const testTo = searchParams.get('to')     // 테스트 수신자(1명만)
  const isTest = testKey === 'send-test-9f3a' && !!testTo

  // 인증: ① 테스트 모드 ② Vercel Cron(user-agent로 식별, CRON_SECRET 미설정이어도 동작)
  //       ③ CRON_SECRET 일치(설정돼 있으면 더 안전)
  const isVercelCron = userAgent.toLowerCase().includes('vercel-cron')
  const hasSecret = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isTest && !isVercelCron && !hasSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 테스트 모드: 전 구독자 대신 지정한 1명에게만, 전체 키워드로 발송
  const allKeywords = Object.values(SECTIONS).flatMap((s) => Object.keys(s.keywords))
  const users = isTest
    ? [{ email: testTo, keywords: allKeywords }]
    : await getAllUsers()
  const today = new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' })
    .replace('. ', '/').replace('.', '')

  const results = []

  for (const user of users) {
    try {
      const articles = await fetchNewsForKeywords(user.keywords || [])
      const grouped = groupBySection(articles, user.keywords || [])

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

      const analysis = await generateSecAnalysis(translated)
      const html = buildEmailHtml(translatedGrouped, today, analysis)
      await sendEmail(user.email, `[ChipBird] ${today} 오늘의 ChipBird`, html)

      results.push({ email: user.email, status: 'sent' })
    } catch (err) {
      console.error('[send-newsletter] 발송 실패:', user.email, err)
      results.push({ email: user.email, status: 'error', error: err.message })
    }
  }

  return NextResponse.json({ subscribers: users.length, results })
}

// Vercel Cron 은 GET 요청을 보냄. 수동 테스트(POST)도 가능하도록 둘 다 연결.
export const GET = handler
export const POST = handler
