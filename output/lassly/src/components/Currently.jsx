import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Currently() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', stagger: 0.13,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const sectionLabel = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.62rem',
    fontWeight: 400,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  }

  return (
    <section
      id="currently"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '5rem 2rem',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}>
        <div>
          <p data-reveal style={{ ...sectionLabel, marginBottom: '2rem' }}>Currently Working On</p>
          <h2
            data-reveal
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: 'var(--ink)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              marginBottom: '1.5rem',
            }}
          >
            Something new<br />is taking shape.
          </h2>
          <p data-reveal style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '0.88rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
          }}>
            A new series is in the making —<br />built by hand, one layer at a time.<br />Check back soon.
          </p>
        </div>

        <div data-reveal>
          <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#C6C0B8' }}>
            <img
              src="/assets/about/current.jpg"
              alt="Work in progress"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
