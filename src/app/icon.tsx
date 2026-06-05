import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

// Silhueta SVG de vaca (path inline, sem dependência de emoji/fonte)
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#1a237e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '80px',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="360"
        height="360"
        style={{ display: 'flex' }}
      >
        {/* Corpo */}
        <ellipse cx="50" cy="58" rx="30" ry="20" fill="white" />
        {/* Cabeça */}
        <ellipse cx="78" cy="45" rx="14" ry="11" fill="white" />
        {/* Focinho */}
        <ellipse cx="88" cy="48" rx="6" ry="5" fill="#e0c8a0" />
        {/* Narinas */}
        <circle cx="86" cy="49" r="1.2" fill="#b09070" />
        <circle cx="90" cy="49" r="1.2" fill="#b09070" />
        {/* Orelha */}
        <ellipse cx="73" cy="36" rx="5" ry="3" fill="white" transform="rotate(-20 73 36)" />
        {/* Chifres */}
        <line x1="75" y1="35" x2="72" y2="27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="34" x2="79" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pernas */}
        <rect x="28" y="74" width="8" height="18" rx="4" fill="white" />
        <rect x="40" y="74" width="8" height="18" rx="4" fill="white" />
        <rect x="52" y="74" width="8" height="18" rx="4" fill="white" />
        <rect x="63" y="74" width="8" height="18" rx="4" fill="white" />
        {/* Cauda */}
        <path d="M20 55 Q10 50 12 62 Q14 70 20 68" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Manchas */}
        <ellipse cx="45" cy="52" rx="8" ry="6" fill="#1a237e" />
        <ellipse cx="60" cy="60" rx="6" ry="5" fill="#1a237e" />
        {/* Úbere */}
        <ellipse cx="42" cy="76" rx="8" ry="5" fill="#f4a0b0" />
      </svg>
    </div>,
    { ...size }
  );
}
