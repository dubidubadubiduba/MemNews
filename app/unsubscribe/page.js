'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function UnsubscribeContent() {
  const email = useSearchParams().get('email') || ''
  const [status, setStatus] = useState('idle') // idle | loading | done | error

  async function unsubscribe() {
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#1428A0] flex flex-col items-center justify-center px-4 gap-6">
      <img src="/chipbird-logo-fixed.png" alt="ChipBird" className="h-24" />
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 w-full max-w-md text-center">
        {status === 'done' ? (
          <>
            <p className="text-lg font-bold text-[#1428A0] mb-2">구독이 취소되었습니다</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {email} 님, 그동안 이용해 주셔서 감사합니다.<br />
              다시 구독하시려면 웹사이트에서 재등록하시면 됩니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-gray-800 mb-2">구독 취소</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              <span className="font-semibold text-[#1428A0]">{email || '(이메일 정보 없음)'}</span><br />
              더 이상 ChipBird 뉴스레터를 받지 않으시겠어요?
            </p>
            <button
              onClick={unsubscribe}
              disabled={!email || status === 'loading'}
              className="bg-[#1428A0] hover:bg-[#0f1f8a] disabled:opacity-40 text-white rounded-lg px-8 py-3 font-semibold text-sm transition-colors"
            >
              {status === 'loading' ? '처리 중...' : '구독 취소하기'}
            </button>
            {status === 'error' && (
              <p className="text-red-500 text-xs mt-3">오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1428A0]" />}>
      <UnsubscribeContent />
    </Suspense>
  )
}
