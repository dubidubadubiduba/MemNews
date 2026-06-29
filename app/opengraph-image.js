import { ImageResponse } from 'next/og'

// URL 공유 시 썸네일: 삼성블루 배경(불투명) + 흰색 ChipBird 로고
// 로고는 background-image 로 올려 투명 영역에도 배경색이 항상 깔리게 함
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LOGO_URL = 'https://memorynews-chipbird.vercel.app/chipbird-logo-white.png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#1428A0',
          backgroundImage: `url(${LOGO_URL})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '760px 415px',
        }}
      />
    ),
    { ...size },
  )
}
