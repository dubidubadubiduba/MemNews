'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SECTIONS } from '@/lib/keywords'

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
        if (data.user?.keywords?.length) setSelected(data.user.keywords)
      })
  }, [router])

  function toggle(kw) {
    setSelected(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    )
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

  return (
    <main className="min-h-screen bg-[#F4F4F4] pb-24">
      {/* Header */}
      <div className="bg-[#1428A0] px-6 py-5 text-center">
        <h1 className="text-2xl font-bold text-white tracking-widest">MemNews</h1>
        <p className="text-[#a0b4e8] text-xs mt-1">관심 키워드를 선택하세요</p>
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
                return (
                  <label
                    key={kw}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-all select-none ${
                      checked
                        ? 'bg-[#1428A0] border-[#1428A0] text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#1428A0] hover:text-[#1428A0]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
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

      {/* 저장 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            {selected.length > 0 ? `${selected.length}개 선택됨` : '키워드를 선택해주세요'}
          </span>
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
