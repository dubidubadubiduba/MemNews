'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (!agreed) {
      setError('개인정보 수집·이용에 동의해주세요.')
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
    <main className="min-h-screen bg-[#1428A0] flex flex-col items-center justify-center px-4 gap-5">
      <img src="/chipbird-logo-white.png" alt="ChipBird" className="h-20" />
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <p className="text-center text-gray-500 text-xs mb-8 leading-relaxed">
          이메일을 등록하면 매일 아침 6시에<br />맞춤 뉴스레터를 받을 수 있어요.
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

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => { setAgreed(e.target.checked); setError('') }}
              className="mt-0.5 accent-[#1428A0]"
            />
            <span className="text-[11px] text-gray-500 leading-relaxed">
              이메일 주소는 뉴스레터 발송 목적으로만 사용되며, 개인정보 보호법에 따라 안전하게 보호됩니다.{' '}
              <span className="text-red-400 font-medium">(필수)</span>
            </span>
          </label>

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
