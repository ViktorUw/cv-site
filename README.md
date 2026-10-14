# cv-site

Viktor Vasylyshyn's portfolio site: a static one-page site in English (`/`) and Polish (`/pl/`), built with Astro and Tailwind CSS and deployed on Vercel.

## Commands

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm install`     | Install dependencies                             |
| `npm run dev`     | Start the local server at `localhost:4321`       |
| `npm run build`   | Build the static site into `dist/`               |
| `npm run preview` | Preview the built site locally                   |
| `npm run og`      | Regenerate the link-preview images (needs Chrome) |
| `npx astro check` | Type-check the code                              |

## Editing content

All text, links and project info live in `src/content/`. You never need to touch the components to change what the site says.

| File                    | What it controls                                          |
| ----------------------- | --------------------------------------------------------- |
| `profile.yaml`          | Name, role, headline, About text, photo, CV link, SEO text |
| `flow.yaml`             | The automation diagram in the hero                        |
| `process.yaml`          | The "How I work" steps                                    |
| `projects/*.yaml`       | One file per project; `order` sets the position           |
| `skills.yaml`           | Skill groups                                              |
| `education.yaml`        | Education, newest first                                   |
| `contacts.yaml`         | Contact links, in display order                           |
| `ui.yaml`               | Menu, section titles, buttons and other interface text    |

Every record has an `en:` and a `pl:` block. Fill in both, or the build stops and tells you which field is missing.

Lists (`flow`, `process`, `skills`, `education`, `contacts`) appear in the same order as in the file.

### Common tasks

- **Add a project:** copy a file in `src/content/projects/`, rename it and edit it. Set `status: planned` to show it as "in progress" without links.
- **Show the CV button:** put the PDF in `public/` (e.g. `public/cv.pdf`) and set `cvUrl: /cv.pdf` in `profile.yaml`.
- **Change the photo:** replace `src/assets/photo.jpg` (portrait works best), then run `npm run og` so link previews use it too.
- **Changed your name, role or headline?** Run `npm run og` to update the link-preview images.

## Deploying

Vercel rebuilds and publishes the site on every push to `main`. Before pushing, run `npm run build` to catch mistakes in the data files.

If the site address changes (e.g. a custom domain), update `site` in `astro.config.mjs`. Canonical links, the sitemap and `robots.txt` all follow it.
