import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
  showWordmark?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const sizes = {
  sm: { box: 'w-11 h-11', img: 'h-7' },
  md: { box: 'w-14 h-14', img: 'h-9' },
};

export default function Logo({
  variant = 'light',
  size = 'sm',
  showWordmark = true,
  href = '/',
  className = '',
  onClick,
}: LogoProps) {
  const boxClass =
    variant === 'dark'
      ? 'bg-white border-white/20'
      : 'bg-white border-outline';

  const tile = (
    <div
      className={`${boxClass} ${sizes[size].box} p-2 rounded-md border flex items-center justify-center shrink-0 shadow-sm`}
    >
      <img
        alt="Logo SIGAP"
        className={`${sizes[size].img} w-auto object-contain`}
        src="/assets/images/sigap.png"
      />
    </div>
  );

  const wordmark = showWordmark ? (
    <span
      className={`font-display font-bold text-2xl tracking-tight uppercase ${
        variant === 'dark' ? 'text-white' : 'text-primary'
      }`}
    >
      SIGAP
    </span>
  ) : null;

  return href ? (
    <Link
      href={href}
      aria-label="SIGAP"
      onClick={onClick}
      className={`flex items-center gap-3 min-h-[44px] w-max shrink-0 ${className}`}
    >
      {tile}
      {wordmark}
    </Link>
  ) : (
    <div className={`flex items-center gap-3 min-h-[44px] w-max shrink-0 ${className}`}>
      {tile}
      {wordmark}
    </div>
  );
}
