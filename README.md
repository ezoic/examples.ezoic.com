# examples.ezoic.com

Source for [https://examples.ezoic.com](https://examples.ezoic.com) — a public site
showing live, copyable example implementations of Ezoic technology.

Every page is a working publisher page using the same real integration code a publisher
would paste into their own site. The snippets on these pages are the actual integration,
not pseudo-code, so a publisher can copy them directly.

## Layout

```
site/
  index.html            Landing page with the example groups
  404.html              Styled not-found page
  assets/
    site.css            Shared stylesheet (no build step, no dependencies)
    site.js             Shared helper: copy buttons + the id-less debug bar
  idless/
    index.html          Index of the id-less showAds examples
    basic.html          One snippet after the second paragraph
    top.html            Snippet above the title (top_of_page)
    nosizes.html        showAds({}) mid-article, Ezoic picks the size
    multi.html          Four snippets through a long article
    sidebar.html        Snippets in a sidebar column and in content
    sync.html           Blocking loader, document.currentScript path
    queued.html         Loader injected late, document-order scan path
    selector.html       Marked .ezoicad divs with data-* config, one showAds('.ezoicad') call
    anchor.html         Programmatic placement via a CSS selector
    location.html       Named location placement, no anchor
    infinite.html       Infinite scroll: id exhaustion and recycling
  placeholders/
    index.html          Index of the placement-id examples
    basic.html          One dashboard placement div + showAds(id)
    multiple.html       Three divs, one batched showAds(id, id, id) call
    dynamic.html        Lazy-loaded content: showAds, destroyPlaceholders, re-show
    infinite.html       Infinite scroll with a unique id per batch (no reuse)
  game-sdk/
    index.html          Web Game SDK demo (cross-origin game + bridge log)
```

Pages are served as-is from `site/`. There is no build step, no npm, and no framework.

Internal links between pages are extensionless (for example `/idless/basic` and
`/game-sdk/`). On the live site `/x` resolves to `/x.html` and `/dir/` to
`/dir/index.html`.

## Adding a new example page

1. Copy an existing page in the relevant group (for example `site/idless/basic.html`)
   to a new file.
2. Keep the integration snippet literal. The live snippet is a real inline
   `<script>` element — the id-less resolver scans real inline scripts, so it must stay
   exactly where the ad should appear. The displayed copy of the snippet goes in a
   `<pre class="snippet"><code>` block as HTML-escaped text so it is shown, not executed.
3. Update the group index (`site/idless/index.html` or the landing page) with a one-line
   description linking to the new page using an extensionless path.
4. Load the page locally to confirm it renders and the snippet resolves.
5. On **id-less** pages, driver scripts that call `showAds` programmatically must never
   contain the literal token `showAds(` in code or comments — the id-less resolver scans
   inline scripts for that token to place ads, so use
   `window.ezstandalone["show" + "Ads"](...)` instead. This does not apply to
   placement-id pages (`site/placeholders/`): `showAds(147)` with numeric ids places into
   the matching `ezoic-pub-ad-placeholder-147` div, not at the script position.

## Local preview

Serve the `site/` directory with any static file server, for example:

```
cd site && python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Note that a plain static server does not resolve
extensionless URLs, so open pages with their `.html` extension locally
(for example `http://localhost:8000/idless/basic.html`).
