# DesignPlus Bootstrap Starter

A minimal Bootstrap 5 starter scaffold (HTML/CSS/JS) prepared for later conversion into an Odoo website module/theme.

## Quick start

1. Open `index.html` in your browser.
2. Edit styles in `assets/css/style.css` and scripts in `assets/js/main.js`.

## Structure

```
design_plus/
  index.html
  assets/
    css/
      style.css
    js/
      main.js
```

## Converting to an Odoo website

- Create a new Odoo module (e.g. `website_design_plus`).
- Move `assets/css/style.css` and `assets/js/main.js` into your module's static folder:
  - `website_design_plus/static/src/css/style.css`
  - `website_design_plus/static/src/js/main.js`
- Reference them in `__manifest__.py` under `assets` → `web.assets_frontend`.
- Convert sections from `index.html` into QWeb templates/snippets as needed:
  - Wrap each section in `<t t-name="website_design_plus.section_name"> ... </t>`.
  - Replace CDN Bootstrap with the Odoo-provided Bootstrap or package Bootstrap in assets if required.
- Create a page using `website.page` data or by adding a snippet to the website builder.

This starter keeps markup simple to ease the migration to Odoo's QWeb and asset pipeline.


