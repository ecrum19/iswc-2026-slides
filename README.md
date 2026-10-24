# Does SPARQL federation work in the real world?

**A longitudinal case study over large biological SPARQL endpoints**

In-Use Paper Presentation at the [International Semantic Web Conference (ISWC) 2026](https://iswc2026.semanticweb.org/), Bari, Italy · 25 October 2026

**▶ View the slides: https://ecrum19.github.io/iswc-2026-slides/**

## About the talk

Federated SPARQL lets one query combine data from many independent endpoints without copying it centrally, but it is mostly evaluated on controlled benchmarks. We followed 67 real federated queries, written by domain experts against 20+ large public biological endpoints, across four time points from Spring 2025 to Spring 2026, comparing manual (`SERVICE`) and algorithmic federation.

- Algorithmic federation returned non-empty results far less often than manual federation (2.3% vs. 47.3% execution success rate).
- Success declined over the year for both approaches as endpoints evolved under growing demand.
- Reliable federation needs coordination between users, engine developers and endpoint maintainers, for example by publishing endpoint limits with [VoRD](https://github.com/ecrum19/vord).

## Viewing the slides

- **Overview:** the page opens on a grid of all slides. Click a slide to present from there, or click **▶ Present** to start from slide 1 in full screen.
- **Full screen:** press **F** at any time to toggle full screen (press **F** or Esc to leave it).
- **Navigate:** → / ← (or Space, Page Down / Page Up) step through slides and their animations; Home / End jump to the first or last slide.
- **Exit:** press Esc to return to the overview.
- **Supplementary slides** (S1–S15) follow the conclusions, in three groups: terms and definitions (S1–S3), details behind the main slides in the order the talk refers to them (S4–S11), and further material (S12–S15). Slides S5, S8 and S12 embed live charts from the results explorer; click **LIVE ↗** to open the full chart. These need an internet connection; offline, a static figure is shown instead.

## Paper, data and tools

- **Paper:** [Crum et al., ISWC 2026](https://ecrum19.github.io/eliascrum/publications/real-world-federation-iswc-2026/paper)
- **Interactive results explorer:** https://ecrum19.github.io/fed-survey-results/
- **Results data and queries:** https://github.com/ecrum19/fed-survey-results
- **VoRD, Vocabulary of Restrictive Datasets:** https://github.com/ecrum19/vord · [documentation](https://ecrum19.github.io/vord/)

## Authors

[Elias Crum](https://orcid.org/0009-0005-3991-754X)¹ · [Bryan-Elliott Tam](https://orcid.org/0000-0003-3467-9755)¹ · [Jonni Hanski](https://orcid.org/0009-0004-0721-2169)¹ · [Ana-Claudia Sima](https://orcid.org/0000-0003-3213-4495)² · [Tarcisio Mendes de Farias](https://orcid.org/0000-0002-3175-5372)² · [Jerven Bolleman](https://orcid.org/0000-0002-7449-1266)³ · [Ruben Taelman](https://orcid.org/0000-0001-5118-256X)¹

1. [IDLab](https://idlab.ugent.be/), [Ghent University](https://www.ugent.be/en) – [imec](https://www.imec-int.com/en), Belgium
2. [SIB Swiss Institute of Bioinformatics](https://www.sib.swiss/), Lausanne, Switzerland
3. [Swiss-Prot group](https://www.expasy.org/resources/uniprotkb-swiss-prot), SIB Swiss Institute of Bioinformatics, Geneva, Switzerland

## How these slides were made

The deck is a single HTML page ([`index.html`](index.html)) with a custom stylesheet ([`styles/edc-custom.css`](styles/edc-custom.css)). It uses no slide-authoring application.

- **Slide engine:** [Shower](https://shwr.me/) ([`@shower/core`](https://github.com/shower/core)) with the [Material theme](https://github.com/shower/material), restyled for this talk. The [Shower CLI](https://github.com/shower/cli) bundles the deck for publishing.
- **Diagrams and icons:** hand-written inline SVG, animated with CSS transitions as each build step appears.
- **Live charts:** slides S5, S8 and S12 load figures from the [results explorer](https://ecrum19.github.io/fed-survey-results/) at view time, with static images as an offline fallback.
- **Typography:** [KoHo](https://fonts.google.com/specimen/KoHo) from Google Fonts.
- **Logos:** endpoint and institution logos belong to their respective owners and are used to identify those resources. The [RDF logo](https://www.w3.org/RDF/) (W3C) marks every SPARQL endpoint icon.
- **Hosting:** a [GitHub Actions workflow](.github/workflows/deploy-gh-pages.yml) builds the deck on every push to `main` (`npm run bundle`) and publishes it to [GitHub Pages](https://pages.github.com/).
- **Authoring assistance:** the slide content and design were developed with the help of [Claude Code](https://claude.com/claude-code) (Anthropic) and reviewed by the authors.

To run the slides locally, install [Node.js](https://nodejs.org/) 22.12 or later and run `npm install`, then `npm run serve`.

To export a PDF, run `npm run pdf:builds` for one page per build step, so paging through the PDF replays the slides' reveals. It writes `slides.pdf` ([`scripts/pdf-builds.mjs`](scripts/pdf-builds.mjs); needs Google Chrome, [Ghostscript](https://www.ghostscript.com/) and an internet connection for the fonts). For one page per slide with every build step shown, run `npm run pdf`, which writes `slides-final-state.pdf`.

## License

Presentation content is licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), unless otherwise indicated. Third-party logos, fonts and libraries retain their own licenses or terms.
