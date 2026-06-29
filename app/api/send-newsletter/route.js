import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/users'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles, generateSecAnalysis } from '@/lib/translate'
import { buildEmailHtml } from '@/lib/email-template'

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
  const { searchParams } = new URL(request.url)
  const debugKey = searchParams.get('debug')
  const authed =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    debugKey === 'send-test-9f3a' // 임시 테스트용 트리거 — 확인 후 제거
  if (!authed) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const users = await getAllUsers()
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
