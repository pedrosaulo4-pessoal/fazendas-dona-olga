import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
        borderRadius: '36px',
      }}
    >
      <div style={{ fontSize: 110, lineHeight: 1, display: 'flex' }}>🐄</div>
    </div>,
    { ...size }
  );
}
