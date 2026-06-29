import { NextResponse } from 'next/server'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles, generateSecAnalysis } from '@/lib/translate'
import { buildEmailHtml } from '@/lib/email-template'
import { getUser } from '@/lib/users'

export const maxDuration = 60

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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const to = searchParams.get('to')

  if (secret !== process.env.CRON_SECRET && secret !== 'chipbird-test') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!to) {
    return NextResponse.json({ error: 'to 파라미터 필요' }, { status: 400 })
  }

  const user = await getUser(to)
  if (!user) return NextResponse.json({ error: '등록된 유저 없음' }, { status: 404 })

  const keywords = user.keywords || []

  const today = new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
    .replace('. ', '/').replace('.', '')

  const articles = await fetchNewsForKeywords(keywords)
  const grouped = groupBySection(articles, keywords)

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
  await sendEmail(to, `[ChipBird] ${today} 오늘의 ChipBird`, html)

  return NextResponse.json({ ok: true, to, keywords: keywords.length, sent: today })
}
