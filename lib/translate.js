import Anthropic from '@anthropic-ai/sdk'

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

위 뉴스들을 종합하여 삼성전자 Memory 반도체 사업부(DRAM/NAND/HBM/SSD)에 미칠 영향을 아래 형식으로 출력하라.

출력 형식 (반드시 이 구조 그대로):
긍정적 영향
• [내용 — 음슴체, 1~2문장]
• [내용 — 음슴체, 1~2문장]
• [내용 — 음슴체, 1~2문장]

부정적 영향
• [내용 — 음슴체, 1~2문장]
• [내용 — 음슴체, 1~2문장]
• [내용 — 음슴체, 1~2문장]

규칙:
- 형식 외 서론·결론·설명 문장 일절 금지
- 음슴체 엄수 (예: ~임, ~함, ~됨, ~볼 것으로 보임, ~우려됨)
- 각 bullet은 50자 내외로 간결하게
- 구체적 회사명·제품명 언급, 경쟁사(SK Hynix·Micron·중국업체) 대비 시사점 포함
- 마크다운·JSON 없이 순수 텍스트로만 출력`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    return message.content[0].text.trim()
  } catch {
    return ''
  }
}

export async function translateArticles(articles) {
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

IMPORTANT: Keep all company names, product names, and brand names in their original English form. Do not translate names like Samsung, NVIDIA, Apple, Google, Microsoft, TSMC, Qualcomm, DRAM, NAND, HBM, etc.

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

    const translations = JSON.parse(match[0])

    return articles.map((article, i) => {
      const t = translations.find(x => x.id === i)
      return {
        ...article,
        title_ko: t?.title_ko || article.title,
        summary_ko: t?.summary_ko || article.content?.slice(0, 200) || '',
      }
    })
  } catch {
    return articles.map(a => ({
      ...a,
      title_ko: a.title,
      summary_ko: a.content?.slice(0, 200) || '',
    }))
  }
}
