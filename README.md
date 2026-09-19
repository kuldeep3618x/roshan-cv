# Roshan Kerketta — CV website

Single-page React site (Vite) built from the updated CV.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serve the built site
```

## Update content

All text lives in `src/data/cv.js` (profile, summary, projects, portfolio, skills, experience, credentials).
Components in `src/components/` only render that data, so CV edits never touch the layout.

The downloadable CV is `public/Roshan_Kerketta_CV.pdf`. Replace it when the CV changes.

## Notes

- Light and dark themes (follows the system setting, toggle in the nav, remembered per browser).
- `dist/` is fully static and uses relative paths, so it can be hosted on any static host (GitHub Pages, Netlify, Cloudflare Pages, Azure Static Web Apps).
- The contact section shows your phone number and email publicly once hosted. Remove them from `profile` in `src/data/cv.js` if you don't want that.

## Hosting (GitHub Pages)

The live site is served from the `gh-pages` branch, which holds only the built `dist/` output.
To publish an update: edit, `npm run build`, then push the contents of `dist/` (plus an empty `.nojekyll` file)
to the `gh-pages` branch. Source code lives on `main`.

If you later add the `workflow` permission to your GitHub token (`gh auth refresh -s workflow`), a GitHub Actions
workflow can build and deploy automatically on every push instead.

## Interactive demos

`demos/` holds the interactive demo windows shown on each tool page. After editing them run `npm run build:demos`,
which rebuilds `public/demos/index.html` (a single self-contained file embedded in the tool pages).
