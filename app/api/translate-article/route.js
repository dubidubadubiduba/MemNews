import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { kv } from '@vercel/kv'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url 없음' }, { status: 400 })

  const cacheKey = `full:${url}`
  const cached = await kv.get(cacheKey).catch(() => null)
  if (cached) return NextResponse.json(cached)

  let text = ''
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()
    text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)
  } catch {
    return NextResponse.json({ error: '기사를 불러올 수 없습니다.' }, { status: 502 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `다음 영어 기사 본문을 한국어로 번역하라. 보고서체(~함/~임/~됨)로. 회사명·제품명·브랜드명은 영문 유지(Samsung, NVIDIA, Apple, HBM, DDR5 등). 광고·네비·메뉴 등 불필요한 내용은 제외하고 기사 본문만 번역:\n\n${text}`,
      }],
    })
    const result = { translated: message.content[0].text.trim() }
    await kv.set(cacheKey, result, { ex: 86400 }).catch(() => {})
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: '번역 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
