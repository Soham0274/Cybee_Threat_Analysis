/**
 * PageBackground — full-screen decorative background layer.
 * Produces a rich, multi-color gradient atmosphere with:
 *  • Amber/orange primary glow
 *  • Purple/violet accent glow
 *  • Teal/cyan secondary accent
 *  • Diagonal light-ray streaks
 *  • Subtle dot-grid texture
 *
 * Usage: drop <PageBackground /> as the FIRST child inside any page wrapper.
 * The parent must have `position: relative` and `overflow: hidden`.
 */
export function PageBackground({ variant = 'default' }: { variant?: 'default' | 'center' | 'subtle' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* ── Primary radial amber glow ── */}
      <div
        className="absolute"
        style={{
          top: variant === 'center' ? '30%' : '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: 900,
          height: variant === 'center' ? '70vh' : '80vh',
          background:
            variant === 'subtle'
              ? 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.25) 0%, rgba(234,88,12,0.10) 35%, transparent 72%)',
          filter: 'blur(1px)',
        }}
      />

      {/* ── Purple/violet accent glow (top-left) ── */}
      <div
        className="absolute"
        style={{
          top: '5%',
          left: '15%',
          width: '40vw',
          maxWidth: 500,
          height: '50vh',
          background:
            variant === 'subtle'
              ? 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.06) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.12) 0%, rgba(124,58,237,0.05) 40%, transparent 65%)',
          filter: 'blur(4px)',
        }}
      />

      {/* ── Teal/cyan accent glow (bottom-right) ── */}
      {variant !== 'subtle' && (
        <div
          className="absolute"
          style={{
            bottom: '10%',
            right: '10%',
            width: '35vw',
            maxWidth: 450,
            height: '40vh',
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.08) 0%, rgba(20,184,166,0.04) 40%, transparent 65%)',
            filter: 'blur(6px)',
          }}
        />
      )}

      {/* ── Secondary orange glow (offset right) ── */}
      {variant !== 'subtle' && (
        <div
          className="absolute"
          style={{
            top: '5%',
            left: '60%',
            width: '50vw',
            maxWidth: 600,
            height: '50vh',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.12) 0%, transparent 65%)',
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Rose/pink subtle accent (mid-left) ── */}
      {variant !== 'subtle' && (
        <div
          className="absolute"
          style={{
            top: '40%',
            left: '-5%',
            width: '30vw',
            maxWidth: 350,
            height: '35vh',
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.06) 0%, transparent 60%)',
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* ── Diagonal light rays ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 120px,
              rgba(245,158,11,0.025) 120px,
              rgba(245,158,11,0.025) 122px
            ),
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 240px,
              rgba(139,92,246,0.015) 240px,
              rgba(139,92,246,0.015) 243px
            ),
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 400px,
              rgba(6,182,212,0.010) 400px,
              rgba(6,182,212,0.010) 404px
            )
          `,
        }}
      />

      {/* ── Wide swept cone (top spotlight) ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0"
        style={{
          width: '140vw',
          height: '60vh',
          background:
            'conic-gradient(from 260deg at 50% -10%, transparent 20deg, rgba(245,158,11,0.07) 35deg, rgba(139,92,246,0.04) 50deg, rgba(6,182,212,0.03) 65deg, transparent 80deg)',
          filter: 'blur(8px)',
        }}
      />

      {/* ── Subtle dot grid ── */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(245,158,11,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
        }}
      />

      {/* ── Bottom gradient fade-out ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.6))',
        }}
      />
    </div>
  );
}
