import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AYSMART ECO';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2f0b4f 0%, #0f172a 55%, #7c2d12 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>AYSMART ECO</div>
        <div style={{ fontSize: 28, marginTop: 12, opacity: 0.9 }}>Luxury real estate, hostels, and automotive marketplace</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
