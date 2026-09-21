import { NextResponse } from 'next/server'
import { isGoogleNewsUrl, resolveGoogleUrlCached } from '@/lib/gnews'

export const maxDuration = 30

// Google News 리다이렉트 링크를 실제 원문 URL로 풀어 302 이동시키는 엔드포인트.
// 메일·웹의 Google 출처 기사 제목이 이 경로를 거쳐 원문으로 연결됨.
// (오픈 리다이렉트 방지: Google News 링크만 허용)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const u = searchParams.get('u')
  if (!u || !isGoogleNewsUrl(u)) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  const real = await resolveGoogleUrlCached(u)
  // 복원 실패 시 원본 Google 링크로라도 이동(기존 동작 유지)
  return NextResponse.redirect(real || u, 302)
}
