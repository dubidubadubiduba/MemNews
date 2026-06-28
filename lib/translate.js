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

async function translateBatch(articles) {
  if (!articles.length) return []

  const input = articles.map((a, i) => ({
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

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array found')
    return JSON.parse(match[0])
  } catch {
    return articles.map((a, i) => ({
      id: i,
      title_ko: a.title,
      summary_ko: a.content?.slice(0, 200) || '',
    }))
  }
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

  // Cache fresh translations with 24h TTL
  await Promise.all(
    freshTranslations.map((t, i) => {
      const article = uncachedArticles[i]
      if (!article?.link) return Promise.resolve()
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
