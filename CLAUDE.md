# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Agentic Workflow

Before starting any work on this project, read the relevant agent file from:
`../../my-agency/agents/`

Follow the agent's instructions exactly for that phase of work. Agent sequence:

| Phase | Agent file | When to use |
|-------|-----------|-------------|
| 1 — Discovery | `planning-agent.md` | Starting a new project or major feature. Run rounds in order, wait for answers before proceeding. Output goes to `client.md`. |
| 2 — Design | `design-agent.md` | After planning is confirmed. Do not start until `client.md` exists. |
| 3 — Design QA | `design-qa-agent.md` | After design spec is written. Before any code. |
| 4 — Development | `developer-agent.md` | After design QA is signed off. |
| 5 — Code Review | `code-reviewer-agent.md` | After a dev pass is complete. |
| 6 — QA & Testing | `qa-test-agent.md` | Before any deploy or handoff. |

**Rule:** Never skip a phase or start a downstream phase without the upstream output confirmed.  
**Rule:** If a task is ambiguous about which phase it belongs to, default to the earliest unfinished phase.

---

## Project Status
The React app has not been scaffolded yet. When building, create `output/` as the project root using Vite + React + Tailwind + GSAP. All source code lives in `output/`.

## Stack & Commands

Once scaffolded, from the `output/` directory:

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
```

## Architecture

Single-page app, single route `/`. No router needed. Structure sections as separate React components mounted in order in `App.jsx`:
- `<Hero />` — full-viewport, scattered artwork images with GSAP drift-in animations
- `<Works />` — organic/loose layout, no grid
- `<About />` — two-column desktop, bio text verbatim from spec
- `<Current />` — informal note on current practice
- `<Contact />` — email link only, no form

**GSAP usage:** Use `gsap.context()` with a ref for all animations (cleanup on unmount). ScrollTrigger for parallax and scroll-reveal. Always add `prefers-reduced-motion` check before registering any timeline.

**Images:** All artwork is in `/input/artwork/` (project root, not `output/`). Reference them via Vite's `new URL('../../../input/artwork/filename.jpg', import.meta.url).href` or copy into `output/public/artwork/` at scaffold time.

**Tailwind config:** Extend with the project palette — `cream: '#F5F0E8'`, `ochre`, `cobalt`, `cardboard`. Set `fontFamily.script` to the chosen Google Font (Caveat recommended) and `fontFamily.sans` to a humanist sans (Inter or DM Sans).

---

# Client Context — LASSLY
## Version: 2.0 (redesign — single page, warm/playful direction)
## Previous spec: reviews/design-spec-v1.1-archived.md

---

## Identity
- Client name: LASSLY
- Full name: Mixed media artist, interdisciplinary researcher
- Location: India
- Target audience: Art collectors, gallery curators, cultural institutions,
  design-conscious buyers, international art audience
- Tone/personality: Intimate, handmade, playful-but-serious. The feeling of
  being invited into an artist's studio. Warmth first, authority second.
  Think: a carefully arranged worktable you could reach out and touch.

## Artist Bio (verbatim — use exactly this)
"With a foundation in Crafts based Hard Material Design from India, my
journey has expanded into interdisciplinary research that weaves together
art, media, experiential design, and storytelling. I am drawn to exploring
new mediums, and my current practice revolves around mixed media—crafting
intricate miniature dioramas, painting, and graphic visuals that evoke
nostalgia and capture moments while highlighting the often-overlooked
aspects of society."

---

## Project Goal
A single-page personal portfolio that feels like the artist's physical
world spilling onto the screen. Visitors should feel they are peering into
a worktable — miniatures, craft tools, paint, found objects scattered with
intention. The page is warm, tactile, and deeply personal before it is a
gallery. The work is the personality, not a product in a store.

---

## Visual Reference
- Primary reference: Jackie Hu portfolio (screenshot provided in
  /input/web-references/)
- What to take from it:
  - Warm cream background as the canvas
  - Scattered physical objects floating freely around the hero — not
    contained in boxes or grids
  - Handwritten/script font for the artist name — personal, not branded
  - Floating UI or object elements in corners that reward exploration
  - The feeling that the page is a surface with things resting on it
  - Minimal formal navigation — replaced by presence and scroll
  - A "currently working on" or equivalent personal section near the bottom
- What to make LASSLY's own — do NOT copy Jackie Hu directly:
  - Objects must be LASSLY's world: miniature pieces, craft tools (scalpel,
    cutting mat, acrylic tubes, wooden sticks), found materials, her hands
    holding pieces. Use the artwork photographs from /input/artwork/.
  - LASSLY's palette comes from her work — warm ochre, cobalt blue,
    raw cardboard brown, acrylic tube colours. Not Jackie Hu's palette.
  - The floating corner elements should feel like they belong to
    LASSLY's studio — a scattered sticker sheet, a tiny diorama propped
    against something, a paint-stained cutting mat corner.

---

## Hard Constraints
- Single page — all content on one scrolling page
- Fonts: Designer's choice — must include a handwritten/script font for
  the name. Suggest: "Caveat", "Nothing You Could Do", or "Sacramento"
  from Google Fonts. Body and metadata in a clean humanist sans.
- Background: Warm cream — derive exact value from the artwork photography
  tones. Approximately #F5F0E8 territory. Not white, not grey.
- Must have:
  - Hero section with name + floating objects
  - Short bio / about
  - Selected works (the miniatures — presented as scattered or loosely
    arranged, not in a rigid grid)
  - A "currently working on" or equivalent section
  - Contact (minimal — just email, no full form needed)
- Must NOT have:
  - Dark backgrounds
  - Rigid card grids
  - Formal navigation bar
  - Carousels
  - Stock photography or icons
  - Anything that feels like a commercial product page

---

## Works Available (use artwork from /input/artwork/)
1. The Pan Shop, India (2025) — cobalt blue, highly detailed
2. Barber Shop, India (2025) — amber yellow interior, electric pole
3. Santosh General Store, India (2025) — weathered browns, staircase
4. Joseph Bar (2025) — wide facade, red corrugated roof
5. Gully (2022) — narrow vertical, monochrome stone
6. Small objects: miniature door, bag, easel + painting, carrot crate
7. Process shots: hands working, cutting mat, tools in use

Use these as both content and as floating decorative elements on the page.
Process shots and detail shots work especially well as scattered objects.

---

## Layout Concept (describe to Design Agent)

### Hero Section
- Warm cream canvas, full viewport
- Artist name "LASSLY" in script/handwritten font, centered or
  slightly left of center
- Subtitle: "Mixed Media Artist" — small, tracked, humanist sans
- One-line bio or tagline beneath
- Scattered around the name: 4–6 artwork photographs or detail shots
  positioned as if placed on a table — slightly rotated, different sizes,
  no alignment to a grid. Some overlap the name area.
- Top-right corner: a floating "object" element — could be a miniature
  propped in a frame, a process shot, or a sticker-like element. This
  rewards the eye exploring the corner.
- Scroll indicator at bottom center — minimal, typographic

### Works Section
- Loose, organic layout — not a formal grid
- Works presented at different sizes reflecting their real-world scale
  (Gully being narrow and tall, Joseph Bar being wide, small objects
  being small)
- Title + year + materials in small label type beneath or beside each
- The arrangement should feel curated but not designed — like pieces
  set out on a table before framing

### About Section
- Two-column at desktop: bio text left, a photograph or process image right
- Warm, conversational — the bio text as provided verbatim
- "Based in India" and discipline tags beneath bio

### Currently Working On (or equivalent)
- A personal note about current practice or upcoming work
- Informal tone — not a press release
- Placeholder if no current project is specified

### Contact
- Minimal — just "Get in touch" as a heading and the email address
- Lassly2828@gmail.com
- No form — direct email link only

---

## Navigation
- No formal navigation bar
- Minimal floating links or scroll-based section indicators only
- Optional: 3 small icon-style links (Instagram, email, etc.) centered
  below the tagline on the hero — similar to the reference
- On mobile: same approach, just stacked

---

## Motion Design Intent
- Objects in the hero section: subtle floating/drift on load —
  each piece drifts in from a slightly different position, very slow,
  as if settling onto a table. Not bouncy. Gentle.
- Parallax on the scattered objects as you scroll — different depths
  move at slightly different rates (GSAP ScrollTrigger). This reinforces
  the physical / dimensional quality.
- Works section: fade + slight drift reveal on scroll
- Nothing fast, nothing sharp. Everything feels like it has weight.
- Respect prefers-reduced-motion throughout.

---

## Deliverable
- Page type: Single-page portfolio
- Framework: React (Vite) + JSX + Tailwind + GSAP
- Responsive: Yes, mobile-first
- On mobile: floating objects stack or reduce to 2–3 key pieces.
  The warmth and personality must survive on a small screen.

---

## Page Map (single page — sections only, no separate routes)
Single route: `/`
Sections (in order):
- Hero (#hero)
- Works (#works)
- About (#about)
- Currently Working On (#current)
- Contact (#contact)

---

## Web References
- Primary: Jackie Hu portfolio — /input/web-references/jackie-hu.png
  Take: scattered object layout, warm background, script name, corner
  elements, personal tone, "currently cooking" section concept
  Ignore: her specific objects, her colour palette, her content

---

## Input Files
- Artwork photos: /input/artwork/ (8 images provided)
- Web reference: /input/web-references/
- Brand assets (logo): /input/brand-assets/

---

## Contact
- Email: Lassly2828@gmail.com
