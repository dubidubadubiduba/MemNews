import { NextResponse } from 'next/server'
import { fetchNewsForKeywords } from '@/lib/rss'

export const maxDuration = 60

// 중복 제거된 뉴스 풀에서 직접소스 vs Google News 비중 진단
// GET /api/admin/sources?secret=chipbird-test
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== 'chipbird-test') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const pool = await fetchNewsForKeywords([]) // 중복 제거된 전체 풀
  const isG = (a) => (a.link || '').includes('news.google.com')
  const google = pool.filter(isG).length
  const direct = pool.length - google

  const bySource = {}
  for (const a of pool) {
    const s = (a.source || '?').slice(0, 40)
    bySource[s] = (bySource[s] || 0) + 1
  }
  const sourcesSorted = Object.fromEntries(
    Object.entries(bySource).sort((a, b) => b[1] - a[1])
  )

  return NextResponse.json({
    total: pool.length,
    direct,
    google,
    bySource: sourcesSorted,
  })
}
