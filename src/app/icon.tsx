import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '80px',
      }}
    >
      <div style={{ fontSize: 320, lineHeight: 1, display: 'flex' }}>🐄</div>
    </div>,
    { ...size }
  );
}
