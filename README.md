# ALIAS — project website

A static, single-page site for the ALIAS research project. There is no build step and no dependencies: plain HTML, CSS and JavaScript.

```
index.html              page structure and prose (hero, about, research pillars)
assets/css/style.css    all styling (light and dark mode)
assets/js/data.js       ← content you will edit most: facts, people, publications, contacts
assets/js/main.js       renders data.js and handles tabs, filters and BibTeX
assets/img/alias-mark.svg  logo and favicon
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

Almost everything that changes over time lives in **`assets/js/data.js`**:

- **`project`**: funder, funding programme, partners, and optionally the research period, grant reference (with link) and `fullName` (what the acronym stands for). Empty fields are hidden.
- **`people`**: each person has a `group` (`team`, `pi`, `researcher`, `associate`, `alumni`). Groups with no members are hidden, and with only one group its heading is left out. Put portraits in `assets/img/people/` and set `photo: "assets/img/people/name.jpg"`; leave it `null` to show initials.
- **`publications`**: sorted by `date` and grouped by year automatically. Tag each one with one or more `pillars` so the filter chips work. BibTeX is generated from the fields; paste a `bibtex` string to override it. Authors whose names match a team member are highlighted.
- **`contacts`**: the mail links in the Contact section.

Entries with `placeholder: true` show a red **Placeholder** tag. Delete that line once an entry is real.

The longer prose (hero text, "About ALIAS", the six pillar descriptions and their figures) is in `index.html`.

## Deploy on GitHub Pages

The site lives at **https://nl2g.github.io/alias/**, published from the `NL2G/alias` repository the same way as `NL2G/histobias`.

- `.github/workflows/deploy-pages.yml` publishes the repository root on every push to `main` (no build step).
- One-time setup in the repository: **Settings → Pages → Source: GitHub Actions**.
- To check a deploy, open the **Actions** tab of the repository.

All paths are relative, so the site also works from any other static host or subfolder.
