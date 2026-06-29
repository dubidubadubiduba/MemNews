import { ImageResponse } from 'next/og'

// URL 공유 시 썸네일: 삼성블루 배경(불투명) + 흰색 ChipBird 로고
// 투명 PNG가 Satori에서 투명을 뚫는 문제 → 로고 <img> 자체에도 배경색을 줘서
// 투명 픽셀 자리를 삼성블루로 채움
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LOGO_URL = 'https://memorynews-chipbird.vercel.app/chipbird-logo-white.png'

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
        <img
          src={logo}
          width={1200}
          height={630}
          style={{ backgroundColor: '#1428A0', objectFit: 'contain', padding: '110px 200px' }}
        />
      </div>
    ),
    { ...size },
  )
}
