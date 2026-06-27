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
    const sectionKeywords = Object.entries(sectionData.keywords)
      .filter(([kw]) => selectedKeywords.includes(kw))
      .flatMap(([, phrases]) => phrases)

    if (sectionKeywords.length === 0) {
      result[sectionName] = []
      continue
    }

    const matched = articles
      .filter(article => {
        const text = (article.title + ' ' + article.content).toLowerCase()
        return sectionKeywords.some(phrase => text.includes(phrase.toLowerCase()))
      })
      .slice(0, 3)

    result[sectionName] = matched
  }

  return result
}
