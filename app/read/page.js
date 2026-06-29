'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function ReadContent() {
  const params = useSearchParams()
  const url = params.get('url')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!url) { setText('기사 주소가 없습니다.'); setLoading(false); return }
    setLoading(true)
    fetch(`/api/translate-article?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(d => setText(d.translated || d.error || '번역에 실패했습니다.'))
      .catch(() => setText('번역 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [url])

  return (
    <main className="min-h-screen bg-[#F4F4F4]">
      <div className="bg-[#1428A0] px-6 py-4 flex items-center justify-between">
        <img src="/chipbird-logo-fixed.png" alt="ChipBird" className="h-9" />
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
          >
            원문 보기 ↗
          </a>
        )}
      </div>
      <div className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="text-lg font-bold text-[#1428A0] mb-4">번역 전문</h1>
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <div className="w-5 h-5 border-2 border-[#1428A0] border-t-transparent rounded-full animate-spin" />
            번역하는 중입니다...
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">{text}</p>
        )}
      </div>
    </main>
  )
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center text-gray-400">로딩 중...</div>}>
      <ReadContent />
    </Suspense>
  )
}
