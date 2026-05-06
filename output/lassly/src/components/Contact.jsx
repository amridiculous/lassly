import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', stagger: 0.14,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
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
      id="contact"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '5rem 2rem 3rem',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem',
      }}>
        <p data-reveal style={sectionLabel}>Contact</p>

        <h2
          data-reveal
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: 'var(--ink)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Get in touch
        </h2>

        <a
          data-reveal
          href="mailto:Lassly2828@gmail.com"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--ink)',
            paddingBottom: '2px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Lassly2828@gmail.com
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '4.5rem auto 0',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={sectionLabel}>Lassly</span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '0.75rem',
          color: 'var(--muted)',
        }}>
          Just an artist. From India with love.
        </span>
        <span style={{ ...sectionLabel }}>©2025</span>
      </div>
    </section>
  )
}
