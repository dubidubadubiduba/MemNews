import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/users'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles } from '@/lib/translate'
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
      sender: { name: 'MemNews', email: 'gipunbam@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const users = await getAllUsers()
  const today = new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
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

      const html = buildEmailHtml(translatedGrouped, today)
      await sendEmail(user.email, `[MemNews] ${today} 오늘의 MemNews`, html)

      results.push({ email: user.email, status: 'sent' })
    } catch (err) {
      results.push({ email: user.email, status: 'error', error: err.message })
    }
  }

  return NextResponse.json({ results })
}
