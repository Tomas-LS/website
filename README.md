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

Set these repository variables at **Settings → Secrets and variables → Actions → Variables**. They are injected during the Pages build; any value included in a static site is public to site visitors, so do not store secrets here. Missing values use neutral placeholders, and an unset phone or LinkedIn URL is omitted as a contact link.

| Variable                      | Value                            |
| ----------------------------- | -------------------------------- |
| `VITE_PROFILE_NAME`           | Display name                     |
| `VITE_PROFILE_TITLE`          | Professional title               |
| `VITE_PROFILE_SPECIALIZATION` | Specialization                   |
| `VITE_PROFILE_LOCATION`       | Location                         |
| `VITE_PROFILE_EMAIL`          | Public contact email             |
| `VITE_PROFILE_PHONE`          | Optional public phone number     |
| `VITE_PROFILE_LINKEDIN_URL`   | Optional LinkedIn URL            |
| `VITE_PROFILE_LINKEDIN_LABEL` | Text shown for the LinkedIn link |
| `VITE_PROFILE_TAGLINE`        | Short tagline                    |
| `VITE_PROFILE_INTRO`          | Introductory paragraph           |

## Project structure

- `src/content/` contains profile, skills, and project data.
- `src/routes/` contains the home, project, about, skills, and contact pages.
- `src/assets/` contains local project and portfolio images.
- `public/` contains static files served as-is.

The contact form validates its fields and opens a prefilled email in the visitor's mail application, so it works without a backend service.
