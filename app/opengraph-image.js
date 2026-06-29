import { ImageResponse } from 'next/og'

// URL 공유 시 썸네일: 삼성블루 배경 + 흰색 ChipBird (Vercel에서 렌더링)
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1428A0',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: 8 }}>
          ChipBird
        </div>
        <div style={{ fontSize: 40, marginTop: 28, color: '#a0b4e8', letterSpacing: 3 }}>
          Semiconductor · Memory Newsletter
        </div>
      </div>
    ),
    { ...size },
  )
}
