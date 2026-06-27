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

위 뉴스들을 종합하여 삼성전자 Memory 반도체 사업부에 미칠 영향을 분석하라.
- 반드시 음슴체로 작성 (예: ~임, ~함, ~됨, ~볼 것으로 보임)
- 긍정적/부정적 영향을 구분하여 서술
- 200자 내외로 간결하게
- 근거가 되는 뉴스나 회사명을 구체적으로 언급
- JSON이나 마크다운 없이 순수 텍스트로만 출력`

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
