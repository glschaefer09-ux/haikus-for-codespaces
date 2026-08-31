interface LogoProps {
  size?: number;
  className?: string;
}

/** Renders the same mark as branding/logo-mark.svg — kept in sync manually since Vite's raw SVG import isn't used here to avoid an extra build step for a handful of shapes. */
export function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cross PC AI"
    >
      <defs>
        <linearGradient id="crosspcai-gradient" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6D3FDE" />
          <stop offset="1" stopColor="#9146F3" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill="url(#crosspcai-gradient)" />
      <rect x="88" y="132" width="220" height="150" rx="24" fill="white" fillOpacity="0.92" />
      <rect x="204" y="230" width="220" height="150" rx="24" fill="white" />
      <path
        d="M300 305a30 30 0 0 1 30-30h6a30 30 0 0 1 21 9l7 7"
        stroke="#6D3FDE"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path d="M364 275v16h-16" stroke="#6D3FDE" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M228 335a30 30 0 0 1-30 30h-6a30 30 0 0 1-21-9l-7-7"
        stroke="#6D3FDE"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path d="M164 365v-16h16" stroke="#6D3FDE" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
