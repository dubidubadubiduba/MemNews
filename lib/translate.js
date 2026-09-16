import Anthropic from '@anthropic-ai/sdk'
import { kv } from '@vercel/kv'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateSecAnalysis(articles) {
  if (!articles.length) return ''

  const summaries = articles
    .filter(a => a.title_ko || a.title)
    .slice(0, 30)
    .map(a => `- ${a.title_ko || a.title}: ${a.summary_ko || ''}`)
    .join('\n')

  const prompt = `다음은 오늘의 반도체·메모리 업계 뉴스 요약이다.

${summaries}

위 뉴스들에서 삼성전자 Memory 반도체 사업부(DRAM/NAND/HBM/SSD)에 직결되는 인과관계를 4개 추출하라.
각 항목은 "뉴스 이벤트(원인) → Samsung Memory 영향(결과)" 구조로, 긍정/부정 혼합.

반드시 아래 JSON 형식으로만 출력 (다른 텍스트 일절 금지):
{"chains":[
  {"trigger":"원인 — 25~30자 내외, 2줄 분량","impact":"Samsung Memory 영향 — 25~30자 내외, 2줄 분량","positive":true},
  {"trigger":"...","impact":"...","positive":false}
]}`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = message.content[0].text.trim()
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

// 배치가 크면 응답 JSON이 max_tokens 안에서 잘려 전체가 영문 폴백되는 문제가 있어
// 청크 단위로 쪼개 호출 → 한 청크가 실패해도 나머지는 정상 번역됨
const CHUNK_SIZE = 8

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function translateChunk(chunkArticles) {
  const input = chunkArticles.map((a, i) => ({
    id: i,
    title: a.title,
    content: a.content?.slice(0, 500) || '',
  }))

  const prompt = `You are a Korean tech news translator specializing in semiconductor and memory industry news.

Translate the following articles. For each article return:
- "title_ko": Korean title in 보고서체 style (concise, ~함/~임/~됨 endings, under 40 chars)
- "summary_ko": 2~3 sentence Korean summary in 보고서체 style

CRITICAL RULE — The following MUST remain in their original English form, never translated:
- Company names: Samsung, NVIDIA, Apple, Google, Microsoft, AMD, Intel, TSMC, SK Hynix, Micron, Qualcomm, Arm, Meta, Amazon, AWS, Tesla, Hyundai, BYD, Xiaomi, Sony, Nintendo, Dell, HP, Lenovo, SoftBank, Kioxia, SanDisk, Solidigm, Alibaba, Tencent, ByteDance, CXMT, YMTC, Nanya, JHICC, Mobileye, etc.
- Product/technology names: DRAM, NAND, HBM, HBM3E, HBM4, HBM4E, HBM5, DDR5, DDR4, LPDDR5X, LPDDR6, GDDR7, GDDR6, SSD, NVMe, CXL, UFS, eMMC, SOCAMM, LPCAMM, ePOP, PIM, CoWoS, TSV, PCIe, JEDEC, GAA, EUV, ASML, etc.
- Model/version names: GB200, B300, RTX 5090, M4 Pro, Blackwell, Rubin, etc.
- Acronyms: AI, GPU, CPU, SoC, NPU, ADAS, SDV, EV, IoT, XR, VR, etc.

Articles (JSON):
${JSON.stringify(input)}

Return ONLY a valid JSON array:
[{"id":0,"title_ko":"...","summary_ko":"..."},...]`

  // 일시적 오류(레이트리밋/타임아웃/JSON 파싱 실패) 대비 1회 재시도 후에만 영문 폴백
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = message.content[0].text
      const match = text.match(/\[[\s\S]*\]/)
      if (!match) throw new Error('No JSON array found')
      const parsed = JSON.parse(match[0])

      // 위치가 아닌 id로 매칭 → 모델이 순서를 바꾸거나 일부를 누락해도 안전
      return chunkArticles.map((_, i) => {
        const found = parsed.find(p => p.id === i)
        return found ? { title_ko: found.title_ko, summary_ko: found.summary_ko } : null
      })
    } catch (err) {
      if (attempt === 1) {
        console.error('[translate] 청크 번역 실패, 원문 유지:', err.message)
        return chunkArticles.map(() => null)
      }
    }
  }
}

async function translateBatch(articles) {
  if (!articles.length) return []

  const chunks = []
  for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
    chunks.push(articles.slice(i, i + CHUNK_SIZE))
  }

  // 청크별 동시 호출 수 제한(레이트리밋 방지)
  const chunkResults = await mapLimit(chunks, 3, translateChunk)

  return chunkResults.flat().map((t, i) => {
    const article = articles[i]
    return {
      id: i,
      title_ko: t?.title_ko || article.title,
      summary_ko: t?.summary_ko || article.content?.slice(0, 200) || '',
      failed: !t,
    }
  })
}

export async function translateArticles(articles) {
  if (!articles.length) return []

  // Check Redis cache per article URL
  const cacheChecks = await Promise.all(
    articles.map(a =>
      a.link ? kv.get(`tr:${a.link}`).catch(() => null) : Promise.resolve(null)
    )
  )

  const uncachedIndices = []
  const uncachedArticles = []
  articles.forEach((a, i) => {
    if (!cacheChecks[i]) {
      uncachedIndices.push(i)
      uncachedArticles.push(a)
    }
  })

  const freshTranslations = uncachedArticles.length > 0
    ? await translateBatch(uncachedArticles)
    : []

  // Cache fresh translations with 24h TTL (실패해 영문 폴백된 항목은 캐시하지 않음 → 다음 발송 때 재시도)
  await Promise.all(
    freshTranslations.map((t, i) => {
      const article = uncachedArticles[i]
      if (!article?.link || t.failed) return Promise.resolve()
      return kv
        .set(`tr:${article.link}`, { title_ko: t.title_ko, summary_ko: t.summary_ko }, { ex: 86400 })
        .catch(() => {})
    })
  )

  return articles.map((article, i) => {
    const cached = cacheChecks[i]
    if (cached) {
      return { ...article, title_ko: cached.title_ko, summary_ko: cached.summary_ko }
    }
    const freshIdx = uncachedIndices.indexOf(i)
    const t = freshTranslations[freshIdx]
    return {
      ...article,
      title_ko: t?.title_ko || article.title,
      summary_ko: t?.summary_ko || article.content?.slice(0, 200) || '',
    }
  })
}
