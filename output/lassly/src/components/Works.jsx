import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WORKS } from '../config/works'

gsap.registerPlugin(ScrollTrigger)

export default function Works() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || WORKS.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0, y: 24, duration: 0.9, ease: 'power2.out', stagger: 0.09,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.62rem',
    fontWeight: 400,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  }

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          data-reveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '3rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: 'var(--ink)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            Selected Works
          </h2>
          {WORKS.length > 0 && (
            <span style={labelStyle}>{WORKS.length} pieces</span>
          )}
        </div>

        {WORKS.length === 0 ? (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '0.9rem',
              color: 'var(--muted)',
              paddingTop: '1rem',
            }}
          >
            Works coming soon.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2px',
            }}
          >
            {WORKS.map((w, i) => (
              <div key={i} data-reveal style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ aspectRatio: w.aspect, overflow: 'hidden' }}>
                  <img
                    src={`/assets/artwork/${w.file}`}
                    alt={w.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '0.75rem 0 2rem' }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 400,
                    color: 'var(--ink)',
                    marginBottom: '0.25rem',
                  }}>
                    {w.title}
                  </p>
                  <p style={{ ...labelStyle, letterSpacing: '0.08em' }}>
                    {w.medium} · {w.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
