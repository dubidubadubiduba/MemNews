import { ImageResponse } from 'next/og'

// URL 공유 시 썸네일: 삼성블루 배경 + 흰색 ChipBird 로고 (투명 PNG)
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LOGO_URL = 'https://mem-news-pi3h.vercel.app/chipbird-logo-white.png'

export default async function Image() {
  const logo = await fetch(LOGO_URL).then((r) => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1428A0',
        }}
      >
        {/* 원본 2816x1536 (비율 1.833) */}
        <img src={logo} width={840} height={458} style={{ objectFit: 'contain' }} />
      </div>
    ),
    { ...size },
  )
}
