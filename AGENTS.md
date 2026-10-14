# cv-site

Single-page portfolio for Viktor Vasylyshyn. Astro 7 + Tailwind CSS 4, fully static, deployed to Vercel (`*.vercel.app`). `CLAUDE.md` is a symlink to this file.

## Audience and positioning

Primary audience: clients and companies that need AI automation (Make, n8n, Zapier). Copy speaks the client's language: what gets automated and what it saves, not tech jargon. Junior roles (Python, DevOps, QA) are secondary.

## Sections (in order)

Hero → About → How I work → Projects → Skills → Education → Contact.
There is no Experience section (no commercial experience yet); "How I work" replaces it. A CV download button appears only when `cvUrl` is set in the profile data.

## Content lives in data, not code

- All copy, links and project info live in `src/content/` (YAML), validated by schemas in `src/content.config.ts`.
- Every record holds shared fields (links, stack, images) plus `en:` and `pl:` blocks with the localized text.
- Components must never hardcode user-facing text. Interface strings (nav, buttons, labels) go in `src/content/ui.yaml`.

## i18n

EN is the default at `/`, PL lives at `/pl/` (Astro built-in i18n routing). Every page sets `lang`, canonical and `hreflang` alternates.

## Design (concept A, "flow diagram")

- Hero: inline SVG automation flow (trigger → steps → result) whose nodes light up in sequence. This is the only ambient animation on the page.
- A thin connector line on the left links the sections like nodes in n8n.
- Tokens: bg `#EEF1F4`, ink `#1B2330`, muted `#5B6675`, lines `#C9D1DB`, accent `#2B59C3` (one accent only). Dark theme uses the same roles.
- Font: Schibsted Grotesk only (self-hosted via Fontsource), hierarchy through weight and size.
- Avoid: all-caps eyebrow labels, cards with identical shadows, fade-in on every section, a `→` appended to links.
- Respect `prefers-reduced-motion`, visible keyboard focus, AA contrast in both themes.

## Performance and SEO

Near-zero client JS (only the theme toggle). Images go through `astro:assets`. Target Lighthouse 95+ in every category.

## Working with Viktor

Viktor is learning Claude Code: briefly explain what you are doing and why. Work in the agreed stages and commit after each one.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`. Run `npm run build` to check that the site builds.

Full documentation: https://docs.astro.build. Consult these guides before working on related tasks:

- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
- [Images](https://docs.astro.build/en/guides/images/)
