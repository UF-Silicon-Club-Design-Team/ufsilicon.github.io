# UF Silicon Club

React 19, TypeScript, Vite, Tailwind CSS 4, GSAP and React Router. Uses the supplied club logo and the kickoff deck's pale background, monospace hierarchy, orange rules and circuit motifs.

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:5173/ufsilicon.github.io/.

```sh
npm run build
npm run preview
```

Production preview: http://localhost:4173/ufsilicon.github.io/.

## Routes and hosting

The repository belongs to `UF-Silicon-Club-Design-Team`, so this is a project site, despite its `ufsilicon.github.io` repository name. Vite's base is `/ufsilicon.github.io/` and the default deployment URL is:

https://uf-silicon-club-design-team.github.io/ufsilicon.github.io/

Hash routing keeps direct links and refreshes compatible with GitHub Pages without a server rewrite or redirect shim:

- `/#/` (under the repository base)
- `/#/digital`
- `/#/analog`
- `/#/fabrication`
- `/#/contact`
- `/#/projects`
- `/#/projects/01`
- `/#/projects/02`
- `/#/projects/03`
- `/#/projects/04`

Projects use a two-column desktop grid and a single column on narrow screens. Project 01 is the top-left digital placeholder; project 02 is the top-right analog placeholder. Projects 03 and 04 appear below, with wafer and layered-chip motifs. Each card opens its own placeholder page. Project names are intentionally omitted from visible content and metadata. Analog descriptions and specialties remain unset. Fabrication has a dedicated team page with team details left open. Contact has separate student and sponsor cards; its buttons intentionally have no action until contact destinations are supplied.

In GitHub, go to **Settings → Pages → Build and deployment → Source → GitHub Actions**. Push this work to `main`, or manually run **Deploy GitHub Pages**. The workflow installs from the lockfile, builds `dist`, uploads the Pages artifact and deploys it. No deployment has been performed from this workspace. If a custom domain is introduced, update Vite's base accordingly.

## Component structure

`@/` resolves to the repository root. The homepage mounts `components/ui/overprint-swarm-template.tsx`. Reusable UI belongs in `components/ui`, matching the supplied integration instructions and shadcn's configured aliases. `components.json` provides shadcn configuration; `src/lib/utils.ts` supplies `cn`, and the reusable Button uses Radix Slot. Global Tailwind and design styles are in `src/styles.css`. No additional provider or application state service is necessary.

## Overprint adaptation

The supplied component is the foundation of the homepage component, edited in place. Preserved and adapted: `travel`, `chooseHand`, `exitPoint`, `crewSize`, transform-independent `boxOf`, the `director`, `place`, `click`, `walk`, `glide`, `begin`, `fade`, `pen`, `drag`, `leave`, and crop-first `hero` staging. They execute in the mounted homepage; one shared GSAP timeline owns all drawing, signal movement, placement, pulses and exits.

`route` extends the original pen/glide pairing to SVG polylines. Each segment draws by stroke dash offset while its marker moves between the same measured endpoints with identical timing and linear easing. This permits exact horizontal, vertical and 45-degree segments. Pulses follow those vertices on the same timeline. Cursor glyphs and names became small signal dots. Frames, typing, festival data and unrelated stages were removed. The title, subtitle, navigation and team links are never hidden or animated.

ScrollTrigger and the sticky runway were removed. The adapted hero plays once on mount and settles in 4.8 seconds or less. A ResizeObserver remeasures routes; a resize during the intro settles it rather than restarting it. System fonts avoid font-load rebuilds. Reduced motion renders the finished decoration immediately and reacts to preference changes. A window resize listener also updates geometry. Unmount disconnects the observer, removes the resize and media listeners and reverts the GSAP context, including React StrictMode's setup/cleanup cycle.

The supplied reference PDF and original root logo are source assets. Only `public/logo.png` ships to the site. No remote fonts or stock photos are required.

## Verification performed

- Production TypeScript/Vite build passed.
- Headless Chrome: title visible during the intro; trace dash offsets advance to zero without scrolling; the timeline completes.
- Desktop and mobile screenshots inspected. No horizontal overflow at 320, 390 or 768 pixels.
- Reduced motion renders the finished state immediately; resizing and dispatching a resize event settles and remeasures without replay.
- Digital, Analog, Projects and the initial numbered project pages opened and refreshed. Subsequent expansion checks cover Fabrication, Contact and projects 03/04, all four project card links, the two-column/stacked grid, navigation, and the intentionally inactive contact buttons at 1440, 768, 390 and 320 pixels.
- Logo loaded from `/ufsilicon.github.io/logo.png`; no browser JavaScript errors in the route and animation checks.

Browser checks ran against the production preview, not only the development server. GitHub-hosted deployment still requires enabling Pages and pushing the changes.
