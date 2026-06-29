import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Chipbird',
  description: '맞춤형 반도체·메모리 뉴스레터',
  openGraph: {
    title: 'Chipbird',
    description: '매일 아침, 밤새 바뀐 반도체 판도를 한국어로.',
    siteName: 'Chipbird',
    images: [{ url: 'https://memorynews-chipbird.vercel.app/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chipbird',
    description: '매일 아침, 밤새 바뀐 반도체 판도를 한국어로.',
    images: ['https://memorynews-chipbird.vercel.app/og.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={noto.className}>{children}</body>
    </html>
  )
}
