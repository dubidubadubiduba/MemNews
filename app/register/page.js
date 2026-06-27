'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      sessionStorage.setItem('memnews_email', email)

      if (data.user && data.user.keywords?.length > 0) {
        router.push('/news')
      } else {
        router.push('/customize')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#1428A0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <h1 className="text-4xl font-bold text-[#1428A0] text-center tracking-widest mb-1">
          MemNews
        </h1>
        <p className="text-center text-gray-500 text-xs mb-8 leading-relaxed">
          이메일을 등록하면 매일 아침 7시에<br />맞춤 뉴스레터를 받을 수 있어요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="이메일 주소 입력"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            autoFocus
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1428A0] focus:ring-1 focus:ring-[#1428A0] transition"
          />
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1428A0] hover:bg-[#0f1f8a] disabled:opacity-60 text-white rounded-lg py-3 font-semibold text-sm transition-colors"
          >
            {loading ? '확인 중...' : '다음'}
          </button>
        </form>
      </div>
    </main>
  )
}
