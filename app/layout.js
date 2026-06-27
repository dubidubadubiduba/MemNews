import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'MemNews',
  description: '맞춤형 반도체·메모리 뉴스레터',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={noto.className}>{children}</body>
    </html>
  )
}
