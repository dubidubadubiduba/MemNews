import Parser from 'rss-parser'
import { kv } from '@vercel/kv'
import { RSS_SOURCES, SECTIONS } from './keywords'

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 MemNews/1.0' },
  customFields: { item: ['content:encoded', 'description'] },
})

export async function fetchNewsForKeywords(selectedKeywords) {
  const cutoff = Date.now() - 12 * 60 * 60 * 1000

  const results = await Promise.allSettled(RSS_SOURCES.map(s => fetchFeed(s.url, cutoff)))

  const allItems = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  // 직접소스를 앞에 둬서(원문 URL 보존), 같은 기사면 Google News 버전이 버려지게 함
  allItems.sort((a, b) => {
    const ag = (a.link || '').includes('news.google.com') ? 1 : 0
    const bg = (b.link || '').includes('news.google.com') ? 1 : 0
    return ag - bg
  })

  // 정규화 제목 기준 중복 제거 → 직접소스 + Google News로 같은 기사가 두 번 들어오는 것 방지
  const seen = new Set()
  const deduped = allItems.filter(item => {
    const key = normTitle(item.title) || item.link
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return deduped
}

// 중복 판정용 제목 정규화: 소문자화 + 끝의 " - 출처"(Google News) 제거 + 공백 정리
function normTitle(t) {
  return (t || '')
    .toLowerCase()
    .replace(/\s+[-–—|]\s+[^-–—|]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const withinCutoff = cutoff => item =>
  new Date(item.pubDate || 0).getTime() >= cutoff

async function fetchFeed(url, cutoff) {
  try {
    const feed = await parser.parseURL(url)
    const items = feed.items.map(item => ({
      title: (item.title || '').trim(),
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || '',
      content: extractContent(item),
      source: feed.title || url,
    }))
    // 성공 시 1시간 백업 캐시 — 다음 번 이 피드가 실패하면 폴백으로 사용
    kv.set(`feed:${url}`, items, { ex: 3600 }).catch(() => {})
    return items.filter(withinCutoff(cutoff))
  } catch {
    // 실패 시 마지막 정상 수집분으로 폴백 (cutoff는 그대로 적용돼 오래된 건 제외됨)
    const cached = await kv.get(`feed:${url}`).catch(() => null)
    return Array.isArray(cached) ? cached.filter(withinCutoff(cutoff)) : []
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

function phraseMatches(text, phrase) {
  if (text.includes(phrase)) return true
  const words = phrase.split(' ').filter(w => w.length >= 3)
  return words.length >= 2 && words.every(w => text.includes(w))
}

export function groupBySection(articles, selectedKeywords) {
  const result = {}
  // 섹션이 달라도 같은 기사가 양쪽에 중복 노출되지 않도록, 전 섹션이 공유하는 dedup 집합
  const seen = new Set()

  for (const [sectionName, sectionData] of Object.entries(SECTIONS)) {
    const keywordPhrases = Object.entries(sectionData.keywords)
      .filter(([kw]) => selectedKeywords.includes(kw))
      .map(([kw, phrases]) => ({ kw, phrases }))

    if (keywordPhrases.length === 0) {
      result[sectionName] = []
      continue
    }

    const matched = []
    const maxPerKeyword = 1

    for (const { kw, phrases } of keywordPhrases) {
      if (matched.length >= 10) break

      const lowerPhrases = phrases.map(p => p.toLowerCase())
      const scored = articles
        .map(article => {
          const key = article.link || article.title
          if (seen.has(key)) return null
          const titleLower = article.title.toLowerCase()
          const allText = titleLower + ' ' + article.content.toLowerCase()
          const titleMatches = lowerPhrases.filter(p => phraseMatches(titleLower, p)).length
          const totalMatches = lowerPhrases.filter(p => phraseMatches(allText, p)).length
          if (totalMatches === 0) return null
          const pubTime = new Date(article.pubDate || 0).getTime()
          // 전문보기 안 되는 Google News 기사는 우선순위 아래로 (0=직접소스, 1=구글)
          const isGoogle = (article.link || '').includes('news.google.com') ? 1 : 0
          return { article, key, titleMatches, totalMatches, pubTime, isGoogle }
        })
        .filter(Boolean)
        .sort((a, b) =>
          a.isGoogle - b.isGoogle ||
          b.titleMatches - a.titleMatches ||
          b.totalMatches - a.totalMatches ||
          b.pubTime - a.pubTime
        )

      let kwCount = 0
      for (const { article, key } of scored) {
        if (kwCount >= maxPerKeyword || matched.length >= 10) break
        seen.add(key)
        matched.push({ ...article, matchedKeyword: kw })
        kwCount++
      }
    }

    result[sectionName] = matched
  }

  return result
}
