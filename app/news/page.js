'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SECTIONS } from '@/lib/keywords'

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function getDomain(url) {
  try { return new URL(url).hostname } catch { return '' }
}

function ArticleCard({ article }) {
  const domain = getDomain(article.link)
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : null
  const translateUrl = article.link
    ? `https://translate.google.com/translate?sl=auto&tl=ko&u=${encodeURIComponent(article.link)}`
    : '#'

  return (
    <div className="border-b border-gray-100 last:border-0 py-3">
      <div className="flex items-start gap-2">
        {article.matchedKeyword && (
          <span className="flex-shrink-0 mt-0.5 bg-[#1428A0] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide">
            {article.matchedKeyword}
          </span>
        )}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1428A0] font-semibold text-sm leading-snug hover:underline"
        >
          {article.title_ko || article.title}
        </a>
      </div>
      <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-3">
        {article.summary_ko}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1">
          {faviconUrl && (
            <img src={faviconUrl} alt="" className="w-3 h-3 flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
          )}
          <span className="text-gray-300 text-[11px]">{article.source}</span>
        </div>
        <div className="flex gap-1.5">
          <a
            href={translateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#1428A0] border border-[#C7CFEE] bg-[#EEF1FF] rounded px-1.5 py-0.5 hover:bg-[#dce3ff] transition-colors"
          >
            번역 보기
          </a>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 hover:bg-gray-50 transition-colors"
          >
            원문 보기
          </a>
        </div>
      </div>
    </div>
  )
}

function AnalysisCard({ analysis, sectionIndex }) {
  const chains = analysis?.chains || []

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[350px]">
      <div className="px-4 py-2.5 flex-shrink-0 flex items-center gap-2" style={{ backgroundColor: '#475569' }}>
        <span style={{ color: '#FBBF24', fontSize: '14px', lineHeight: 1 }}>★</span>
        <span className="text-white font-bold text-xs tracking-wide uppercase">
          Section {sectionIndex + 1} — 당사 Mem. 영향 분석
        </span>
      </div>
      <div className="px-4 py-2 overflow-y-auto flex-1 flex flex-col justify-around gap-1">
        {chains.length > 0 ? chains.map((chain, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-center leading-snug"
              style={{ backgroundColor: '#EEF1FF', color: '#1428A0', border: '1px solid #C7CFEE', wordBreak: 'keep-all' }}
            >
              {chain.trigger}
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
              <span className="text-gray-400 text-sm font-bold">→</span>
              <span className="text-[10px]">{chain.positive ? '📈' : '⚠️'}</span>
            </div>
            <div
              className="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-center leading-snug"
              style={chain.positive
                ? { backgroundColor: '#1428A0', color: '#FFFFFF', wordBreak: 'keep-all' }
                : { backgroundColor: '#0A1931', color: '#FFFFFF', wordBreak: 'keep-all' }}
            >
              {chain.impact}
            </div>
          </div>
        )) : (
          <p className="text-gray-300 text-xs text-center py-8">분석 중...</p>
        )}
      </div>
    </div>
  )
}

function SectionCard({ sectionName, sectionData, articles, sectionIndex }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[350px]">
      <div className="px-4 py-2.5 flex-shrink-0" style={{ backgroundColor: sectionData.color }}>
        <span className="text-white font-bold text-xs tracking-wide uppercase">
          Section {sectionIndex + 1} — {sectionName}
        </span>
      </div>
      <div className="px-4 py-2 overflow-y-auto flex-1">
        {articles && articles.length > 0 ? (
          articles.map((a, i) => <ArticleCard key={i} article={a} />)
        ) : (
          <p className="text-gray-300 text-xs py-4 text-center">해당 키워드 뉴스 없음</p>
        )}
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [sections, setSections] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const fetchNews = useCallback(async (userEmail) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/news?email=${encodeURIComponent(userEmail)}`)
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setSections(data.sections)
      setAnalysis(data.analysis || '')
      setUpdatedAt(data.updatedAt)
    } catch {
      setError('뉴스를 불러오지 못했습니다. 새로고침을 눌러주세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem('memnews_email')
    if (!stored) { router.push('/'); return }
    setEmail(stored)
    fetchNews(stored)
  }, [fetchNews, router])

  const sectionEntries = Object.entries(SECTIONS)

  return (
    <main className="min-h-screen bg-[#F4F4F4]">
      <div className="bg-[#1428A0] px-6 py-4 flex items-center justify-between">
        <img src="/chipbird-logo-white.png" alt="ChipBird" className="h-8" />
        <div className="flex items-center gap-3">
          {updatedAt && (
            <span className="text-[#a0b4e8] text-xs">업데이트 {formatTime(updatedAt)}</span>
          )}
          <button
            onClick={() => email && fetchNews(email)}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            {loading ? '로딩 중...' : '↻ 새로고침'}
          </button>
          <button
            onClick={() => router.push('/customize')}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
          >
            ⚙ 설정
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        {loading && !sections && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-[#1428A0] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">뉴스를 번역하는 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {sections && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionEntries.map(([name, data], idx) => (
              <SectionCard
                key={name}
                sectionName={name}
                sectionData={data}
                articles={sections[name] || []}
                sectionIndex={idx}
              />
            ))}
            {analysis && (
              <AnalysisCard analysis={analysis} sectionIndex={sectionEntries.length} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
