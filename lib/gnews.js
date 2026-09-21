import { kv } from '@vercel/kv'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

export function isGoogleNewsUrl(url) {
  try {
    return new URL(url).hostname.includes('news.google.com')
  } catch {
    return false
  }
}

// .../rss/articles/<ID>?... 또는 .../articles/<ID> 에서 기사 ID 추출
function extractId(url) {
  const m = (url || '').match(/\/articles\/([^?/]+)/)
  return m ? m[1] : null
}

// Google News RSS 링크(불투명 리다이렉트 URL)를 실제 원문 URL로 복원.
// 2단계: ① 기사 페이지에서 서명(sg)·타임스탬프(ts) 추출
//        ② batchexecute(garturlreq) 호출로 원문 URL 조회
export async function resolveGoogleUrl(url) {
  const id = extractId(url)
  if (!id) return null
  try {
    const pageRes = await fetch(`https://news.google.com/rss/articles/${id}`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(10000),
    })
    const html = await pageRes.text()
    const sg = html.match(/data-n-a-sg="([^"]+)"/)?.[1]
    const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1]
    if (!sg || !ts) return null

    const inner = JSON.stringify([
      'garturlreq',
      [['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1],
        'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
      id, Number(ts), sg,
    ])
    const freq = JSON.stringify([[['Fbv4je', inner, null, 'generic']]])
    const body = new URLSearchParams({ 'f.req': freq }).toString()

    const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute?rpcids=Fbv4je', {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body,
      signal: AbortSignal.timeout(10000),
    })
    const text = await res.text()
    // 응답의 garturlres 뒤에 오는 첫 URL 추출 (역슬래시/따옴표 전까지)
    const after = text.includes('garturlres') ? text.split('garturlres')[1] : text
    const m = after.match(/https?:\/\/[^\\"]+/)
    return m ? m[0] : null
  } catch {
    return null
  }
}

// id→원문 URL 매핑은 불변이라 Redis에 장기 캐시(30일). 캐시 적중 시 네트워크 호출 없음.
export async function resolveGoogleUrlCached(url) {
  const id = extractId(url)
  if (!id) return null
  const key = `gnews:${id}`
  const cached = await kv.get(key).catch(() => null)
  if (cached) return cached
  const real = await resolveGoogleUrl(url)
  if (real) kv.set(key, real, { ex: 30 * 24 * 3600 }).catch(() => {})
  return real
}
