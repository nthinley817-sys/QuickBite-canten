export default function Logomark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#F97316" />
      <path d="M11 22c0-5 4-9 9-9s9 4 9 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M9 22h22a2 2 0 0 1-2 2.6c-.4 2.6-2.6 4.4-5.2 4.4H16.2c-2.6 0-4.8-1.8-5.2-4.4A2 2 0 0 1 9 22z"
        fill="#fff"
      />
      <path
        d="M17 10.5c0-1 .8-1.6.8-2.6M20 9.5c0-1 .8-1.6.8-2.6M23 10.5c0-1 .8-1.6.8-2.6"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".9"
      />
    </svg>
  );
}
