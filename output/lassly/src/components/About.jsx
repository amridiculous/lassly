import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tags = ['Mixed Media', 'Miniature Dioramas', 'Painting', 'Graphic Visuals', 'India']

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0, y: 22, duration: 0.9, ease: 'power2.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
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
      id="about"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p data-reveal style={{ ...sectionLabel, marginBottom: '2.5rem' }}>About</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}>
              About
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 300,
              color: 'var(--ink)',
              lineHeight: 1.85,
              opacity: 0.88,
            }}>
              With a foundation in Crafts based Hard Material Design from India, my journey has expanded
              into interdisciplinary research that weaves together art, media, experiential design, and
              storytelling. I am drawn to exploring new mediums, and my current practice revolves around
              mixed media—crafting intricate miniature dioramas, painting, and graphic visuals that evoke
              nostalgia and capture moments while highlighting the often-overlooked aspects of society.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {tags.map(t => (
                <span key={t} style={{
                  ...sectionLabel,
                  letterSpacing: '0.1em',
                  border: '1px solid var(--border)',
                  padding: '0.28rem 0.65rem',
                  borderRadius: '2px',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div data-reveal>
            <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#D4CEC6' }}>
              <img
                src="/assets/about/portrait.jpg"
                alt="Lassly"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
