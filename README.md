# HIDE ON PAPERWEIGHT

A quiet writing desk, built as a new project with its own Git history.

## Development

Node.js 20.9 or newer is required; use an actively supported Node.js LTS release.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Phase 1

- Next.js 16.4 App Router, React 19.3, TypeScript, Tailwind CSS 4.
- CSS paper motion, weighted glass landing, subtle human shadows, and a WebGL solid-glass hemisphere.
- A soft hand shadow enters first, then carries the glass diagonally from a low height and withdraws after setting it down. Placement contact at 2.4 seconds arrests the paper and starts a 650ms pressure motion: the rigid glass settles 6px then 3px, the paper depresses and flattens, and its contact shadow tightens. The title appears after that press and the hand withdraws. Reduced motion skips the sequence.
- The larger glass (252px desktop, 198px mobile) opens six ink-underlined links radially on desktop, in a compact two-column arrangement on mobile. The links have at least 52px hit areas and stagger in quietly.
- Native button/link semantics, Tab, Enter/Space, arrow keys, Home/End, Escape, outside-click dismissal, and reduced motion.
- All six section URLs are prerendered; the five remaining shells use `src/lib/navigation.ts`, and PRESSED has its own page. Unknown section names return 404.

Presentation lives in `src/components` and `src/app/globals.css`. The navigation registry contains only route identifiers and labels. Add actual editorial content in a separate data layer in Phase 2; none is fabricated here.

The glass is a solid hemisphere with a flat base, rendered once in a small WebGL canvas. Its shader traces light through both glass surfaces (IOR 1.52), samples an ivory paper surface, and combines Fresnel reflection, internal reflection, and window light. CSS supplies the contact shadow and caustic light on the surrounding paper. It does not sample the live DOM behind it. A CSS dome is retained as a fallback when WebGL is unavailable. No animation render loop, external 3D library, or raster asset is required. Cormorant Garamond is bundled locally with `next/font/local` and served by the site.

## Phase 2 — PRESSED

`src/content/pressed.ts` holds exactly two works: **다정한 무지** (강의실 / 서예실 / 다정한 무지) and **지금 모양** (one continuous manuscript). All four supplied original bodies are included verbatim, preserving spelling, spaces, punctuation, and paragraph breaks. The surrounding insertion instructions are excluded. A `null` body remains supported for future source material that has not been supplied. No prose, dates, future events, or calligraphy assets have been invented.

The timeline derives completed points from the work array and draws an unnamed fading future separately. Adding another work occupies the next formerly empty position. On narrow screens the same timeline scrolls horizontally. The first future circle reveals a pencil-like note on desktop hover or focus.

The reader presents three subtly offset sheets for the first work and one continuous sheet for the second. Chapter changes use a short lateral reveal; Korean text uses a restrained 620px maximum column, 18px type (17px mobile), and double line height. Body strings render unchanged with preserved line breaks, including both occurrences of 塞翁之馬 in their original context.

PRESSED reuses HOME's tokens, desk lighting, paper treatment, local Latin font, glass renderer, ink interactions, and navigation registry. Its smaller peripheral paperweight exposes all six routes and a quiet HOME link, with an inward desktop orbit and compact mobile arrangement. HOME itself is unchanged. Other sections remain Phase 1 shells.

The current upstream ESLint dependency chain includes an npm advisory for `braces` (GHSA-vfj7-8cjw-p6xm). There is no patched stable release at implementation time. It is a development dependency; do not downgrade Next.js to npm audit's proposed older major version. Check again when upstream releases a fix.

## Phase 3 — PORTRAIT

`src/content/portrait.ts` separates identity, person observations, and object-specific belonging notes. The supplied observation and six original names/descriptions are preserved. An optional artwork field renders only when actual artwork is supplied. The twenty PNGs in `public` were copied unchanged from the adjacent `hideonletter-renewal/public` project; no old Git history or profile UI was imported.

The page reuses PRESSED's internal sheet, lighting, arrival, paper texture, and typography rules. Peripheral navigation styles now live with the existing `PaperweightNavigation` component, which accepts the active section. HOME is unchanged; PRESSED's navigation appearance is unchanged.

The bag initially conceals all six objects. Opening it reveals a deterministic still life. Hover/focus exposes one paper annotation at a time; clicking/tapping or dragging counts as taking an object out. Closing the bag hides untaken objects and keeps taken objects on the paper. Mouse/pen dragging uses Pointer Events and pointer capture. Positions are bounded around the complete object plus note and normalized so resizing cannot lose an object. There is no persisted inventory or position storage. Touch retains vertical scrolling and ordinary tap selection; all content is accessible with native buttons and keyboard focus. Reduced motion uses the existing global rule.

Boundary tests (Node 22.18+): `node --experimental-strip-types --test tests/object-position.test.mjs`.

PORTRAIT now also includes LEE YUHYEON / 2004.12.17, her token and bag, and the ten belongings verified in the old `YH_BAG` data. A quiet name selector changes the sheet subject and resets transient bag state. No person observation has been invented for Yuhyeon; her observation space remains blank. Her existing object names and descriptions are unchanged. The development preview is `http://127.0.0.1:3000/portrait`; temporary production QA ports are not the main preview.

## Phase 4 — MARGINALIA

`src/content/marginalia.ts` contains new records only; no old Glossary has been imported. The supplied “잘 잤느냥?” / “잘 잤냥.” exchange is the only entry. Specification examples are excluded. The date remains `10.05.` without an inferred year. Wording and speaker attribution are preserved.

Add an entry to `marginaliaEntries` with a stable id, term, and notes. Append each new note to the existing entry's `notes` array in chronological observation order, preserving older notes. Dates, sources, style, work and portrait observation relations are optional. `echoes` preserves related utterances without turning the page into a chat UI. Related ids are reserved for future linking and do not create fabricated relationships.

The latest note is always readable. Focus, tap or click darkens the ink and reveals any older notes; Escape folds those secondary notes again. Their space stays reserved, preventing layout shift. Desktop clusters alternate among three deterministic positions in normal document flow, joining the main paper to the margins with restrained pencil rules. Mobile places each term and its notes together in reading order. Existing sheet, light, arrival, global reduced-motion rules and peripheral navigation are reused. Other pages remain unchanged.

## Phase 5 — MANUSCRIPT

The actual `manuscriptWorks` array in `src/content/manuscript.ts` is empty. No previous writing archive, PRESSED works, sample poems, invented titles or empty-state copy is imported. Three slightly offset, noninteractive blank sheets form the initial composition.

To add a selected work, append a `ManuscriptWork` with a stable `id`, a nonempty `revisions` array, and a `currentRevision` id matching one of those revisions. Each revision has a nonempty `sections` array; put the original string, including meaningful whitespace, in each section's `content`. A single section requires no chapter controls. Title, index, form, created date, status, author-supplied note, related ids and artwork plate are optional; no title or date is inferred. Plain strings are rendered as text, never parsed as HTML or rewritten.

Append revisions without overwriting earlier text. Labels and dates are optional; the reader only shows revision navigation when more than one revision exists. Actual `annotations` may contain a note, insertion or replacement note, or an underline/strike range targeting a section. Range offsets index the original string (JavaScript UTF-16 offsets, end exclusive). Invalid or overlapping ranges are ignored rather than removing original characters. Annotations and plates are absent unless provided.

PRESSED's 620px prose column, Korean type sizing, double line height, chapter reveal and return-control styles are reused. Poetry retains tabs, consecutive spaces, blank lines and indentation with `white-space: pre`; long lines scroll within a keyboard-focusable text region rather than breaking the poem or overflowing the page. Mobile bundles flow individually, retaining small paper offsets. Selecting a bundle focuses the reader heading; leaving returns focus to the original bundle. Reduced motion suppresses the new settling and lift effects through existing rules.

Renderer tests: `node --test tests/manuscript-render.test.mjs`. Interactive checks used an isolated temporary QA route with numeric/ASCII fixtures, then removed it before the final production build. Production still contains zero literary works. These checks covered multiple bundles, open/close and focus restoration, two revisions, chapter changes, poetry whitespace/horizontal reading, and mobile prose overflow.

## Phase 6 — BORROWED

BORROWED is a commission plate archive. Its 11 original files are in
`public/borrowed/`; original caption order is preserved in
`src/content/borrowed.ts`. No creator/date has been inferred. The artist handle
already present in the pair-exam subtitle is retained. Leon's obsolete Exchange
sentence and link are intentionally removed; the rest of the captions are intact.

`BorrowedWork` separates optional catalogue metadata from media:
- `image`: original file, intrinsic width/height, objective alt.
- `animated`: original GIF plus a `still` image. The index stays still; inspection
  plays the original unless reduced motion is requested. Playback can be paused.
- `document`: original PDF plus nonempty `pages` (file, width, height, optional
  extracted text). A PDF remains one plate irrespective of page count.

To add a commission, place its asset in `public/borrowed/` and add one entry to
`borrowedWorks`. Metadata is optional; a work without a title shows only its plate
number. Use actual intrinsic dimensions, never catalogue ratios to crop artwork.
For GIF/PDF asset preparation, `scripts/render-borrowed-assets.py` writes a still
frame or faithful 1800px-wide PDF page WebPs and prints a JSON manifest. Run it
with a Python environment containing Pillow and pypdfium2, passing the asset path;
merge its output into `src/content/borrowed-assets.json`, then reference that entry
from the work. The bundled Codex Python has both dependencies. This preparation
happens once when adding assets; no PDF dependency ships to the browser. Originals
are preserved byte-for-byte. PDF text is supplementary, never a replacement for
the original pagination and typography.

The canonical internal paper, lighting, title, arrival and glass navigation are
reused. Sequential plate placements vary deterministically without overlap; mobile
uses a full-width editorial sequence. Detail replaces the archive on the same
paper, focuses its caption, and returns focus/scroll to the chosen plate. Documents
have page navigation, a horizontally scrollable magnification, supplementary text
and a quiet original-file link. Images use lazy Next Image previews (quality 80)
and larger inspection images (95); GIF playback uses the unmodified original.

Validation: `npm run lint`, `npm run typecheck`, `npm run build`, and
`node --test tests/*.test.mjs`. `tests/fixtures/borrowed-originals.json` records the
source captions/order and SHA-256 hashes; tests check migration fidelity, every
asset/page, document counts and plate numbering. Existing reader/dragging tests
remain included. TO BE WRITTEN is still a route shell.

## Phase 7 — TO BE WRITTEN

One unfinished working sheet, using the canonical internal paper, ambient light,
header, arrival and peripheral glass navigation. No actual entries have been
provided: `src/content/to-be-written.ts` contains an empty array. Empty space has
no sample records, explanatory copy, stacked manuscripts or timeline marks.

Add one object to `toBeWrittenEntries`, in explicit editorial order:
- Required: `id`, `title`, `kind` (`given` or `unwritten`).
- Shared optional: `date`, user-provided fuzzy `when`, original `note`.
- Given: optional `medium`, `from`, `to`, status `given` or `kept`.
- Unwritten: optional status `unwritten` or `written`, `relatedPressedWorkId`.

Status defaults to the entry's kind. Kept/written records remain on the sheet;
they are never deleted or moved to another section. Status is expressed in text,
without checkboxes, badges or colour-only meaning. Direction is displayed only
from supplied values; one supplied endpoint never creates the other. Text and
fuzzy times remain as provided; dates are not inferred, parsed or used to sort.

An explicit relation on a written entry resolves against real PRESSED work IDs.
Only a valid relation gets a small numeral link to `/pressed#pressed-work-ID`.
The timeline's existing reading buttons now have matching IDs; the link brings
that memory into view, and its reading button opens the existing manuscript.
No work or relation is generated automatically. Invalid/future relations stay
unlinked. All notation is visible on touch and keyboard without hover.

The working lines are server-rendered; only the reused navigation is interactive.
Desktop uses restrained indentation and margin notation. Mobile moves notation
below the record to keep long titles/direction readable; notes preserve line breaks.
Reduced motion inherits the existing paper-arrival/global rules. There is no
playlist, editor or status-changing visitor UI. The obsolete dynamic section
shell is removed now that every main section has its own route.

Tests: `node --test tests/*.test.mjs`, plus lint/typecheck/build. Fixtures in
`tests/fixtures/to-be-written.mjs` contain letter-only titles for zero/one/mixed
entries, optional fields, kept/written, fuzzy time, long titles and relation
validation. The temporary browser fixture route is removed before the final build.

## Phase 8 — Initial release / global playlist

The root layout hosts one `PlaylistSlip` across HOME and the six existing routes.
Its small closed paper tab lives in the desk's lower-left corner; activation
reveals a scrollable paper track list. No audio controls, new route or seventh
menu item are added. There are no music audio assets: the old project's four UI
sound effects are not music sources and are not imported.

`src/content/playlist.ts` preserves the 15 original tracks from the adjacent old
project's `content/playlist.ts`, including their original titles, artists, IDs,
notes and relative order. Legends Never Die — Against The Current is the only
added record and appears first (16 tracks total). Old mood colours and turntable
presentation are not carried over. Display numbering/count is computed from the
array; descriptions remain data without crowding the slip.

The shared paper/ink/font/contact shadow remain canonical. The slip respects
safe-area insets and has bounded internal scrolling. Enter/Space activate the tab,
opening focuses the heading after its visibility settles, keyboard scrolling can
reach all tracks, and Escape/fold return focus to the tab. Outside pointer/focus
moves dismiss it. `src/lib/desk-objects.ts` coordinates playlist and paperweight
menus for keyboard as well as pointer activation, so they are not both open.
Root layout keeps the object stable between routes; there is no repeated intro.
Reduced motion removes its reveal movement.

Layering: content keeps its existing local object layers; peripheral playlist is
8, paperweight navigation is 10 (root CSS tokens). Root document language is now
Korean to match the main text. Inactive chapter/person controls and reader return
marks received only a contrast increase; their layout, typography, content and
motion are unchanged. Favicon/metadata and the established glass optics remain.
The visible bag image loads eagerly, and returning from BORROWED detail loads
the chosen preview eagerly (all other offscreen plates stay lazy). These address
observed LCP warnings without preloading the collection. No old dead UI
imports/dependencies were found to remove.

Release checks: lint, typecheck, production build and `node --test tests/*.test.mjs`.
Release tests verify exact original track preservation, one added track, all prior
content SHA-256 hashes and unchanged six-section navigation. Browser checks cover
320/430px phones, 768px tablet, 1280px desktop and 1920px wide desktop, plus page
interactions, playlist/navigation coordination, bounded scrolling and production
console inspection. The original literary text and commission originals are not
edited. No external music API/research or additional content was introduced.
