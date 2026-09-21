import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1428A0] flex flex-col items-center justify-center px-4 gap-6">
      <img src="/chipbird-logo-fixed.png" alt="ChipBird" className="h-48" />
      <div className="bg-white rounded-2xl shadow-2xl px-10 pt-6 pb-8 w-full max-w-md">
        <p className="text-center text-gray-400 text-sm mb-5 tracking-wide">
          반도체 · 메모리 뉴스레터
        </p>
        <p className="text-center text-gray-500 text-sm leading-relaxed mb-5 border-t border-b border-gray-100 py-4">
          매일 아침 6시, 12시간 먼저 일어나는 Early bird —<br />
          <span className="font-semibold text-[#1428A0]">Chip bird</span>와 함께 밤새 바뀐 반도체 판도를 확인하세요.
        </p>
        <Link
          href="/register"
          className="block text-center bg-[#1428A0] hover:bg-[#0f1f8a] text-white rounded-lg py-3 font-semibold text-sm transition-colors"
        >
          구독 시작하기
        </Link>
      </div>
    </main>
  )
}
