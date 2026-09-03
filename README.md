# Does SPARQL Federation Work in Practice?

[![Build and deploy](https://github.com/ecrum19/iswc-2026-slides/actions/workflows/deploy-gh-pages.yml/badge.svg)](https://github.com/ecrum19/iswc-2026-slides/actions/workflows/deploy-gh-pages.yml)

**Live deck:** https://ecrum19.github.io/iswc-2026-slides/

These slides are authored as HTML using the [Shower](https://github.com/shower/shower) framework.
The visual theme is defined in styles/edc-custom.css.

## Start editing

1. Open index.html and replace the sample slide copy.
2. Keep one main idea per slide and use the existing classes as a starting point.
3. Put images and diagrams in assets/; see assets/README.md.
4. Adjust the design tokens and layout in styles/edc-custom.css.

Starter sections include References, Supplemental Slides, and Acknowledgments;
keep, remove, or duplicate them to match the story of your deck.

The title, author, venue, date, and links are filled in by the generator. Pass
dates in ISO 8601 format (YYYY-MM-DD); the title slide gives that date a
compact, formal treatment.
If you create a deck manually, replace the remaining %...% metadata tokens first.

## Local development

Use Node.js 22.12 or newer. Install dependencies and start the Shower preview server:

~~~bash
npm install
npm run serve
~~~

Use the URL printed by Shower. The exact port is determined by the installed
Shower CLI rather than by this README.

## Build outputs

~~~bash
# Bundle a static version into prepared/
npm run bundle

# Create a PDF
npm run pdf

# Create an archive of the prepared deck
npm run archive
~~~

The generated prepared/ directory is ignored by Git.

## Deployment

Pushes to main run .github/workflows/deploy-gh-pages.yml. The workflow
bundles prepared/ and publishes it to the gh-pages branch. In the repository
settings, configure GitHub Pages to deploy from that branch the first time.

## Metadata

- Author: [Elias Crum](https://ecrum19.github.io/eliascrum/)
- Venue: [International Semantic Web Conference 2026 - Bari, IT](https://iswc2026.semanticweb.org/)
- Date: 2026-10-25
- Source: https://github.com/ecrum19/iswc-2026-slides/

## License

Presentation content is licensed under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), unless otherwise indicated.
This applies to presentation content authored for the deck; third-party logos,
fonts, and dependencies retain their own licenses or terms.
