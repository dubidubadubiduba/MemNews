import { NextResponse } from 'next/server'
import { getUser } from '@/lib/users'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles, generateSecAnalysis } from '@/lib/translate'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const user = await getUser(email)
  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 })

  const selectedKeywords = user.keywords || []
  const articles = await fetchNewsForKeywords(selectedKeywords)

  const grouped = groupBySection(articles, selectedKeywords)

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

  return NextResponse.json({ sections: translatedGrouped, analysis, updatedAt: new Date().toISOString() })
}
