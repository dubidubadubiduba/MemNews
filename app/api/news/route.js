import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getUser } from '@/lib/users'
import { fetchNewsForKeywords, groupBySection } from '@/lib/rss'
import { translateArticles, generateSecAnalysis } from '@/lib/translate'

// 선택 키워드 조합에 대한 짧은 해시 (키워드 바뀌면 캐시도 자동 분리)
function keywordHash(keywords) {
  const sig = [...keywords].sort().join('|')
  let h = 0
  for (let i = 0; i < sig.length; i++) h = (h * 31 + sig.charCodeAt(i)) >>> 0
  return h.toString(36)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const force = searchParams.get('refresh') === '1' // 강제 갱신용

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const user = await getUser(email)
  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 })

  const selectedKeywords = user.keywords || []

  // 결과 캐시: 같은 키워드면 30분간 동일 결과 반환 (새로고침 깜빡임 방지)
  const cacheKey = `news:${email}:${keywordHash(selectedKeywords)}`
  if (!force) {
    const cached = await kv.get(cacheKey).catch(() => null)
    if (cached) return NextResponse.json({ ...cached, cached: true })
  }

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

  const payload = { sections: translatedGrouped, analysis, updatedAt: new Date().toISOString() }
  await kv.set(cacheKey, payload, { ex: 1800 }).catch(() => {}) // 30분 캐시
  return NextResponse.json(payload)
}
