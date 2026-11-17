## Project rules

- Portfolio content (profile, projects, skills) lives in `src/content/*.ts`; pages render from these files so the owner can add projects without touching layout code.
- Keep the site static: no database or paid APIs. The contact form validates with zod (`src/lib/contact.ts`) and opens a `mailto:` link so it works on static hosting.
- Gallery items without `src` render as labelled placeholder frames for CAD drawings, sketches and test photos not yet supplied.
- Do not edit files marked as automatically generated unless the change specifically requires it.
