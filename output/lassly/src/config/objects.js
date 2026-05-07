// Hero floating nav objects.
// icon: path served from public/assets/icons/
// width: rendered width (SVGs are square — height auto-scales)
// top/left: position as % of hero section
// rotate: degrees (positive = clockwise)
// zIndex: 1 (far back, moves most on scroll) to 3 (near front, moves least)
// floatAmp: vertical float travel in px (0 = no float)
// floatDur: seconds for one float cycle
// label + href: text label beneath and click-to-scroll nav target

// LEFT cluster  — objects stay within left: 0–35% so centre logo stays clear
// RIGHT cluster — objects stay within left: 60–100%

export const OBJECTS = [
  // ── LEFT — work top, shop lower-middle; mirrors right-side rhythm ──
  { icon: '/assets/icons/work.svg', width: '14vw', top: '8%',  left: '1%',  rotate: -5,  zIndex: 1, floatAmp: 7, floatDur: 4.5, label: 'Work',              href: '#works'   },
  { icon: '/assets/icons/shop.svg', width: '14vw', top: '54%', left: '13%', rotate: 11,  zIndex: 2, floatAmp: 5, floatDur: 5.1, label: 'Shop',              href: '#'        },
  // ── RIGHT ──
  { icon: '/assets/icons/free-downloadable.svg', width: '13vw', top: '6%',  left: '65%', rotate: 7,  zIndex: 1, floatAmp: 8, floatDur: 3.8, label: 'Free Downloadable', href: '#'        },
  { icon: '/assets/icons/contact.svg',           width: '15vw', top: '46%', left: '76%', rotate: 9,  zIndex: 3, floatAmp: 4, floatDur: 6.0, label: 'Contact',           href: '#contact' },
]
