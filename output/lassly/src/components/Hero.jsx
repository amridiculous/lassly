import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { OBJECTS } from '../config/objects'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { label: 'About',             href: '#about',   dropdown: false },
  { label: 'Miniatures',        href: '#',        dropdown: true  },
  { label: 'On Growth',         href: '#',        dropdown: false },
  { label: 'On paper',          href: '#',        dropdown: true  },
  { label: 'Blog',              href: '#',        dropdown: true  },
  { label: 'Free Downloadable', href: '#',        dropdown: false },
  { label: 'Shop',              href: '#',        dropdown: false },
  { label: 'Contact',           href: '#contact', dropdown: false },
]

// Paper rip variants — noise shaped by filter type, frequency sweep, and duration
const RIP_VARIANTS = {
  building:      { dur: 0.42, f0: 600,  f1: 200,  q: 0.7, vol: 0.32 }, // slow cardboard tear
  chilis:        { dur: 0.07, f0: 5000, f1: 8000, q: 1.8, vol: 0.18 }, // quick thin snip
  umbrella:      { dur: 0.28, f0: 1800, f1: 3200, q: 1.2, vol: 0.22 }, // smooth medium rip
  'striped-pole':{ dur: 0.14, f0: 3000, f1: 5500, q: 2.2, vol: 0.20 }, // crisp sharp tear
  'key-rack':    { dur: 0.36, f0: 1000, f1: 600,  q: 0.9, vol: 0.28 }, // heavy dragging rip
  tiny:          { dur: 0.05, f0: 7000, f1: 9500, q: 1.5, vol: 0.14 }, // tiny paper snip
}

function getRipVariant(src) {
  for (const key of Object.keys(RIP_VARIANTS)) {
    if (src.includes(key)) return RIP_VARIANTS[key]
  }
  return { dur: 0.18, f0: 2500, f1: 4000, q: 1.2, vol: 0.2 }
}

function playSound(src) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const v = getRipVariant(src)

    // White noise buffer
    const bufLen = Math.ceil(ctx.sampleRate * v.dur)
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

    const source = ctx.createBufferSource()
    source.buffer = buf

    // Bandpass filter with frequency sweep — mimics the tearing propagation
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = v.q
    filter.frequency.setValueAtTime(v.f0, ctx.currentTime)
    filter.frequency.linearRampToValueAtTime(v.f1, ctx.currentTime + v.dur)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(v.vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + v.dur)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start(ctx.currentTime)
    source.onended = () => ctx.close()
  } catch (_) {}
}

export default function Hero() {
  const centerRef    = useRef(null)
  const wrapperRefs  = useRef([])
  const parallaxRefs = useRef([])

  function handleNavClick(href) {
    return (e) => {
      e.preventDefault()
      if (href !== '#') document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleObjectHover(i) {
    const wrapper = wrapperRefs.current[i]
    if (!wrapper) return
    const base = OBJECTS[i].rotate
    gsap.killTweensOf(wrapper, 'rotation')
    gsap.to(wrapper, {
      rotation: base + 14,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      onStart: () => playSound(OBJECTS[i].src),
    })
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      OBJECTS.forEach((obj, i) => {
        if (wrapperRefs.current[i]) gsap.set(wrapperRefs.current[i], { rotation: obj.rotate })
      })

      if (reduced) {
        gsap.set(centerRef.current, { opacity: 1 })
        gsap.set(wrapperRefs.current, { opacity: 1 })
        return
      }

      gsap.set(centerRef.current, { opacity: 0, y: 24 })
      gsap.set(wrapperRefs.current, { opacity: 0, scale: 0.9 })

      gsap.to(centerRef.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', delay: 0.2 })
      gsap.to(wrapperRefs.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', stagger: 0.12, delay: 0.4 })

      wrapperRefs.current.forEach((el, i) => {
        if (!el || !OBJECTS[i] || OBJECTS[i].floatAmp === 0) return
        gsap.to(el, {
          y: `+=${OBJECTS[i].floatAmp}`,
          duration: OBJECTS[i].floatDur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        })
      })

      parallaxRefs.current.forEach((el, i) => {
        if (!el || !OBJECTS[i]) return
        const speed = OBJECTS[i].zIndex === 1 ? -55 : OBJECTS[i].zIndex === 2 ? -32 : -14
        gsap.to(el, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: 'var(--bg)' }}
    >
      {/* Top nav bar */}
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(0.8rem, 2vw, 2rem)',
          padding: '1.4rem 2rem',
          flexWrap: 'wrap',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={handleNavClick(item.href)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: '0.78rem',
              color: 'var(--ink)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.4' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            {item.dropdown && (
              <svg width="8" height="6" viewBox="0 0 10 7" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                <path d="M1 1L5 5.5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
            {item.label}
          </a>
        ))}
      </nav>

      {/* Floating objects */}
      {OBJECTS.map((obj, i) => (
        <div
          key={obj.src}
          ref={(el) => { wrapperRefs.current[i] = el }}
          onMouseEnter={() => handleObjectHover(i)}
          style={{
            position: 'absolute',
            top: obj.top,
            left: obj.left,
            zIndex: obj.zIndex,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <img
            ref={(el) => { parallaxRefs.current[i] = el }}
            src={`/assets/artwork/${obj.src}`}
            alt=""
            data-float
            style={{
              width: obj.width,
              height: 'auto',
              display: 'block',
              mixBlendMode: obj.blend || 'normal',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}

      {/* Centered logo + bio */}
      <div
        ref={centerRef}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', zIndex: 4,
          pointerEvents: 'none', userSelect: 'none',
          width: 'min(90vw, 520px)',
        }}
      >
        <img
          src="/assets/brand-assets/logo.png"
          alt="Lassly"
          style={{ width: 'clamp(100px, 12vw, 200px)', height: 'auto', display: 'block', margin: '0 auto' }}
        />
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--muted)', marginTop: '1.1rem',
        }}>
          Mixed Media Artist
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.9, marginTop: '1rem',
        }}>
          Rooted in Crafts-based Hard Material Design from India, my practice spans
          miniature dioramas, painting, and graphic visuals — weaving together art,
          media, and storytelling to illuminate the overlooked.
        </p>
      </div>
    </section>
  )
}
