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

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and deploys a static site. It sets `STATIC_EXPORT=1` and uses `BASE_PATH` for the deployment URL. By default, project sites use `/<repository-name>/`; set the repository Actions variable `BASE_PATH` to `/` for a user or organization site or a custom domain.

## Project structure

- `src/content/` contains profile, skills, and project data.
- `src/routes/` contains the home, project, about, skills, and contact pages.
- `src/assets/` contains local project and portfolio images.
- `public/` contains static files served as-is.

The contact form validates its fields and opens a prefilled email in the visitor's mail application, so it works without a backend service.
