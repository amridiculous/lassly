// Hero floating objects configuration.
// To add an object: drop the image into public/assets/artwork/, then add one entry here.
// Fields:
//   src       — filename in public/assets/artwork/
//   width     — rendered width in vw (scales with viewport)
//   top/left  — position as % of hero section
//   rotate    — degrees (positive = clockwise)
//   zIndex    — 1 (far back, moves most on scroll) to 3 (near front, moves least)
//   floatAmp  — vertical float travel in px (0 = no float)
//   floatDur  — seconds for one float cycle
//   blend     — 'multiply' (removes white bg) | 'screen' (removes black bg) | 'normal'

// LEFT cluster  — objects stay within left: 0–35% so centre logo stays clear
// RIGHT cluster — objects stay within left: 60–100%

export const OBJECTS = [
  // ── LEFT ──
  { src: 'building.png',     width: '24vw', top: '4%',  left: '2%',  rotate: -4,  zIndex: 1, floatAmp: 7, floatDur: 4.5, blend: 'normal'   },
  { src: 'tiny-object.png',  width: '11vw', top: '30%', left: '22%', rotate: -8,  zIndex: 3, floatAmp: 5, floatDur: 5.8, blend: 'normal'   },
  { src: 'chilis.png',       width: '16vw', top: '52%', left: '8%',  rotate: 12,  zIndex: 2, floatAmp: 5, floatDur: 5.1, blend: 'normal'   },
  // ── RIGHT ──
  { src: 'umbrella.png',     width: '20vw', top: '3%',  left: '63%', rotate: 7,   zIndex: 1, floatAmp: 8, floatDur: 3.8, blend: 'normal' },
  { src: 'striped-pole.png', width: '14vw', top: '22%', left: '72%', rotate: -14, zIndex: 2, floatAmp: 6, floatDur: 4.8, blend: 'normal' },
  { src: 'key-rack.png',     width: '17vw', top: '36%', left: '81%', rotate: 9,   zIndex: 3, floatAmp: 4, floatDur: 6.0, blend: 'normal' },
]
