import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { OBJECTS } from '../config/objects'

gsap.registerPlugin(ScrollTrigger)

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
  const aboutRef     = useRef(null)
  const wrapperRefs  = useRef([])
  const parallaxRefs = useRef([])

  function handleObjectClick(href) {
    if (href && href !== '#') document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleAboutHover() {
    if (!aboutRef.current) return
    gsap.killTweensOf(aboutRef.current, 'rotation')
    gsap.to(aboutRef.current, {
      rotation: 14,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      onStart: () => playSound(''),
    })
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
      onStart: () => playSound(''),
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

      if (aboutRef.current) {
        gsap.set(aboutRef.current, { rotation: 0 })
        gsap.to(aboutRef.current, {
          y: '+=5',
          duration: 4.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.9,
        })
      }

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
      {/* Scribble nav objects — outer div: rotation + float y; inner div: parallax y */}
      {OBJECTS.map((obj, i) => (
        <div
          key={obj.label ?? i}
          ref={(el) => { wrapperRefs.current[i] = el }}
          onMouseEnter={() => handleObjectHover(i)}
          onClick={() => handleObjectClick(obj.href)}
          style={{
            position: 'absolute',
            top: obj.top,
            left: obj.left,
            zIndex: obj.zIndex,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            ref={(el) => { parallaxRefs.current[i] = el }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.55rem',
              pointerEvents: 'none',
            }}
          >
            <img src={obj.icon} alt="" style={{ width: obj.width, height: 'auto', display: 'block' }} />
            {obj.label && (
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.6rem',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
              }}>
                {obj.label}
              </span>
            )}
          </div>
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
        {/* About — centered above logo, clickable, float + hover rotation */}
        <div
          ref={aboutRef}
          onClick={() => handleObjectClick('#about')}
          onMouseEnter={handleAboutHover}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '0.45rem', marginBottom: '1.6rem',
            cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <img
            src="/assets/icons/about.svg"
            alt=""
            style={{ width: 'clamp(80px, 13vw, 150px)', height: 'auto', display: 'block' }}
          />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.6rem', fontWeight: 400,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--muted)', whiteSpace: 'nowrap',
          }}>
            About
          </span>
        </div>

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
