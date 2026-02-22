import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  /** Size in pixels — defaults to matching surrounding text (1em) */
  size?: number;
}

/**
 * Cybee brand logo component.
 * By default, sizes itself to match surrounding text via `1em`.
 * Pass an explicit `size` (px) or override via `className` (e.g. `w-6 h-6`).
 */
export function Logo({ className = '', showText = false, size }: LogoProps) {
  // If an explicit pixel size is given, use it. Otherwise default to 1.5em
  // so the logo visually matches the font-size of the surrounding text.
  const sizeStyle = size
    ? { width: size, height: size }
    : undefined;

  const sizeClass = size ? '' : 'w-[1.5em] h-[1.5em]';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <motion.img
        src="/cybee-logo.png"
        alt="Cybee"
        className={`${sizeClass} object-contain flex-shrink-0`}
        style={sizeStyle}
        draggable={false}
        initial={{ scale: 0.8, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.1 }}
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = 'none';
          const fallback = img.nextSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {showText && (
        <span className="text-xl font-bold text-white tracking-tight">
          Cy<span className="text-amber-500">bee</span>
        </span>
      )}
    </div>
  );
}
