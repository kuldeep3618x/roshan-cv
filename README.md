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
- `dist/` is fully static and uses relative paths, so it can be hosted on any static host (GitHub Pages, Netlify, Azure Static Web Apps, SharePoint/OneDrive is not suitable).
- The contact section shows your phone number and email publicly once hosted. Remove them from `profile` in `src/data/cv.js` if you don't want that.
