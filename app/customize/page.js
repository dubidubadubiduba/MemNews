'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SECTIONS } from '@/lib/keywords'

const MAX_KW = 13

const ALL_VALID_KEYWORDS = new Set(
  Object.values(SECTIONS).flatMap(s => Object.keys(s.keywords))
)

export default function CustomizePage() {
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('memnews_email')
    if (!stored) { router.push('/'); return }
    setEmail(stored)

    fetch(`/api/users?email=${encodeURIComponent(stored)}`)
      .then(r => r.json())
      .then(data => {
        if (data.user?.keywords?.length) {
          const valid = data.user.keywords.filter(k => ALL_VALID_KEYWORDS.has(k))
          setSelected(valid.slice(0, MAX_KW))
        }
      })
  }, [router])

  function toggle(kw) {
    setSelected(prev => {
      if (prev.includes(kw)) return prev.filter(k => k !== kw)
      if (prev.length >= MAX_KW) return prev
      return [...prev, kw]
    })
  }

  async function handleSave() {
    if (selected.length === 0) return
    setSaving(true)
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, keywords: selected }),
    })
    router.push('/news')
  }

  const atLimit = selected.length >= MAX_KW

  return (
    <main className="min-h-screen bg-[#F4F4F4] pb-24">
      <div className="bg-[#1428A0] px-6 py-5 text-center">
        <img src="/chipbird-logo-fixed.png" alt="ChipBird" className="h-8 mx-auto" />
        <p className="text-[#a0b4e8] text-xs mt-1">관심 키워드를 선택하세요 (최대 {MAX_KW}개)</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-4">
        {Object.entries(SECTIONS).map(([sectionName, sectionData], idx) => (
          <div key={sectionName} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3" style={{ backgroundColor: sectionData.color }}>
              <span className="text-white font-bold text-sm tracking-wide">
                Section {idx + 1} — {sectionName}
              </span>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-3">
              {Object.keys(sectionData.keywords).map(kw => {
                const checked = selected.includes(kw)
                const disabled = !checked && atLimit
                return (
                  <label
                    key={kw}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all select-none ${
                      checked
                        ? 'bg-[#1428A0] border-[#1428A0] text-white cursor-pointer'
                        : disabled
                          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-[#1428A0] hover:text-[#1428A0] cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(kw)}
                    />
                    {checked ? '✓' : ''} {kw}
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className={`text-sm font-medium ${atLimit ? 'text-[#1428A0]' : 'text-gray-500'}`}>
              {selected.length > 0 ? `${selected.length} / ${MAX_KW}개 선택됨${atLimit ? ' (최대)' : ''}` : '키워드를 선택해주세요'}
            </span>
            <span className="text-[11px] text-gray-300">여러 섹션에 걸친 키워드는 1개로 카운트</span>
          </div>
          <button
            onClick={handleSave}
            disabled={selected.length === 0 || saving}
            className="bg-[#1428A0] hover:bg-[#0f1f8a] disabled:opacity-40 text-white rounded-lg px-8 py-3 font-semibold text-sm transition-colors"
          >
            {saving ? '저장 중...' : '저장하고 시작하기'}
          </button>
        </div>
      </div>
    </main>
  )
}
