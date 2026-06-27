import Parser from 'rss-parser'
import { RSS_SOURCES, SECTIONS } from './keywords'

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 MemNews/1.0' },
  customFields: { item: ['content:encoded', 'description'] },
})

export async function fetchNewsForKeywords(selectedKeywords) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000

  const relevantSources = RSS_SOURCES.filter(source =>
    source.tags.some(tag => selectedKeywords.includes(tag))
  )
  const uniqueUrls = [...new Set(relevantSources.map(s => s.url))]

  const results = await Promise.allSettled(uniqueUrls.map(url => fetchFeed(url, cutoff)))

  const allItems = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  const seen = new Set()
  const deduped = allItems.filter(item => {
    const key = item.link || item.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return deduped
}

async function fetchFeed(url, cutoff) {
  try {
    const feed = await parser.parseURL(url)
    return feed.items
      .filter(item => {
        const pubDate = new Date(item.pubDate || item.isoDate || 0).getTime()
        return pubDate >= cutoff
      })
      .map(item => ({
        title: (item.title || '').trim(),
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        content: extractContent(item),
        source: feed.title || url,
      }))
  } catch {
    return []
  }
}

function extractContent(item) {
  const raw =
    item['content:encoded'] ||
    item.content ||
    item.contentSnippet ||
    item.description ||
    item.summary ||
    ''
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1000)
}

export function groupBySection(articles, selectedKeywords) {
  const result = {}

  for (const [sectionName, sectionData] of Object.entries(SECTIONS)) {
    const keywordPhrases = Object.entries(sectionData.keywords)
      .filter(([kw]) => selectedKeywords.includes(kw))
      .map(([kw, phrases]) => ({ kw, phrases }))

    if (keywordPhrases.length === 0) {
      result[sectionName] = []
      continue
    }

    const seen = new Set()
    const matched = []
    const maxPerKeyword = sectionName === '제품' ? 3 : 2

    for (const { kw, phrases } of keywordPhrases) {
      let kwCount = 0
      for (const article of articles) {
        if (kwCount >= maxPerKeyword) break
        if (matched.length >= 10) break
        const key = article.link || article.title
        if (seen.has(key)) continue
        const text = (article.title + ' ' + article.content).toLowerCase()
        if (phrases.some(phrase => text.includes(phrase.toLowerCase()))) {
          seen.add(key)
          matched.push({ ...article, matchedKeyword: kw })
          kwCount++
        }
      }
      if (matched.length >= 10) break
    }

    result[sectionName] = matched
  }

  return result
}
