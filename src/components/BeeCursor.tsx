import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function BeeCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Main cursor — tight spring
  const springX = useSpring(cursorX, { damping: 28, stiffness: 400 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 400 });

  // Outer ring — looser, lags behind for a trailing effect
  const ringX = useSpring(cursorX, { damping: 20, stiffness: 120 });
  const ringY = useSpring(cursorY, { damping: 20, stiffness: 120 });

  // Glow blob — even looser
  const glowX = useSpring(cursorX, { damping: 30, stiffness: 80 });
  const glowY = useSpring(cursorY, { damping: 30, stiffness: 80 });

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, textarea, select, [role="button"], [tabindex]');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseover', onOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient glow blob */}
      <motion.div
        className="fixed pointer-events-none z-[9995]"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-amber-400/10 blur-2xl"
          animate={{
            width: isHovering ? 80 : 48,
            height: isHovering ? 80 : 48,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed pointer-events-none z-[9996]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border border-amber-400/40"
          animate={{
            width: isHovering ? 40 : isClicking ? 20 : 32,
            height: isHovering ? 40 : isClicking ? 20 : 32,
            opacity: isClicking ? 0.3 : 0.7,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Dot cursor — snappy, follows immediately */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-amber-400"
          animate={{
            width: isClicking ? 20 : isHovering ? 12 : 16,
            height: isClicking ? 20 : isHovering ? 12 : 16,
            opacity: isClicking ? 1 : 0.9,
            boxShadow: isHovering
              ? '0 0 16px 5px rgba(245,158,11,0.6)'
              : isClicking
              ? '0 0 24px 6px rgba(245,158,11,0.8)'
              : '0 0 10px 4px rgba(245,158,11,0.35)',
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  );
}
