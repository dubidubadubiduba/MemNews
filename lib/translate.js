import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
