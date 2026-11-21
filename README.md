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

- `src/content/profile.json` contains the editable profile and contact details.
- `src/content/common.json` contains shared navigation, footer, and accessibility labels.
- `src/content/home.json`, `about.json`, `skills-tools.json`, `contact.json`, and `projects-page.json` hold page copy and labels.
- `src/content/projects/` contains one editable JSON file per project. The temporary filenames are `project-1.json`, `project-2.json`, and `project-3.json`; filenames are labels for now and do not affect URLs. Add a JSON file there with a unique slug and order to add a project; its static route is discovered automatically.
- `src/routes/` contains the home, project, about, skills, and contact pages.
- `src/assets/` contains local project and portfolio images. In JSON, set an image path to its filename, or use a relative subfolder such as `Extras/drawing.jpg` for `src/assets/Extras/drawing.jpg`. An optional `assets/` prefix is also accepted.
- `public/` contains static files served as-is.

Only image files referenced by the page and project JSON are bundled. Gallery entries without an image path render as labelled placeholders; add a path, alt description and caption to populate one. The contact form's labels, validation messages and mailto copy are editable in `src/content/contact.json`; profile details remain in `src/content/profile.json`. The form opens a prefilled email in the visitor's mail application, so it works without a backend service.
