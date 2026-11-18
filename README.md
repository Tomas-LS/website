# Accessible Engineering Stories

A responsive portfolio for a mechanical engineer focused on assistive technology, wheelchair adaptations, and accessibility solutions. Project details and profile content are maintained in `src/content/`; image galleries support both supplied photographs and labelled placeholders.

## Development

Install [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/), then run:

```sh
bun install
bun run dev
```

Run the test suite, linter, and production build with:

```sh
bun run test
bun run lint
bun run build
```

## GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and deploys a static site when changes are pushed to `main`. For the first deployment, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow sets `STATIC_EXPORT=1` and uses `BASE_PATH` for the deployment URL. By default, project sites use `/<repository-name>/`; set the repository Actions variable `BASE_PATH` to `/` for a user or organization site or a custom domain.

### Profile details

Edit `src/content/profile.json` and replace each sample string with your profile details: name, professional title, specialization, location, email, phone, LinkedIn URL and its display label. Leave tagline and intro out of this file. This file is tracked in the public repository, and the published website is public too, so any details you enter will be visible to anyone—do not put private information here.

Commit and push the edit to `main` to trigger a new Pages build, or run **Actions → Deploy to GitHub Pages → Run workflow** manually.

## Project structure

- `src/content/` contains profile, skills, and project data.
- `src/routes/` contains the home, project, about, skills, and contact pages.
- `src/assets/` contains local project and portfolio images.
- `public/` contains static files served as-is.

The contact form validates its fields and opens a prefilled email in the visitor's mail application, so it works without a backend service.
