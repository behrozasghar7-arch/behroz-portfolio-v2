# Behroz Portfolio 2026

Static HTML/CSS/JavaScript portfolio. No Node/npm dependency is required to serve the website.

## Key files

- `index.html` — production homepage.
- `assets/css/style.css` — site styling.
- `assets/js/main.js` — interactive behavior.
- `images/` and `assets/icons/` — site visuals.
- `src/body.html` and `src/tools/*.html` — editable source fragments for the HTML generator.
- `build.sh` — rebuilds `index.html` and `site.html` from source.
- `site.html` — generated preview fragment, not the production entrypoint.

## Local preview

Run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Editing workflow

To modify page sections, update the corresponding source files in `src/` and run `sh build.sh` from the repository root. This recreates `index.html` and `site.html`. For styling and interaction, edit the files under `assets/`.

## Vercel configuration (when approved)

Import the GitHub repository, use the **Other** framework preset and repository root as Root Directory. This is a static site; no build command is required if committing the generated `index.html`. Avoid running a build command during deployment unless needed.

## Before launch

- Verify canonical URLs and OG image match the final domain.
- Test across mobile and desktop and verify external project links.
- Confirm any custom Adobe Fonts kit ID before adding a Typekit stylesheet. The original ZIP had a placeholder URL; it has been removed in this prepared copy. Google Fonts remain linked.
- Review page content and accessibility with browser-based testing.

This package is prepared for review only; nothing has been pushed to GitHub or deployed.
