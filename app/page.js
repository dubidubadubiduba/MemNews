'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PasswordPage() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === 'asdf') {
      router.push('/register')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
      setPw('')
    }
  }

  return (
    <main className="min-h-screen bg-[#1428A0] flex flex-col items-center justify-center px-4 gap-6">
      <img src="/chipbird-logo-white.png" alt="ChipBird" className="h-28" />
      <div className="bg-white rounded-2xl shadow-2xl px-10 pt-6 pb-8 w-full max-w-md">
        <p className="text-center text-gray-400 text-xs mb-5 tracking-wide">
          반도체 · 메모리 뉴스레터
        </p>
        <p className="text-center text-gray-500 text-sm leading-relaxed mb-8 border-t border-b border-gray-100 py-4">
          매일 아침 6시, 12시간 먼저 일어나는 Early bird —<br />
          <span className="font-semibold text-[#1428A0]">Chip bird</span>와 함께 밤새 바뀐 반도체 판도를 확인하세요.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            autoFocus
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1428A0] focus:ring-1 focus:ring-[#1428A0] transition"
          />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="bg-[#1428A0] hover:bg-[#0f1f8a] text-white rounded-lg py-3 font-semibold text-sm transition-colors"
          >
            입장하기
          </button>
        </form>
      </div>
    </main>
  )
}
