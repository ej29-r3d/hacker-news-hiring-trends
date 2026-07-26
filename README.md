# 'Who wants to be hired' now outnumbers 'Who is hiring'

Analysis of comment counts in Hacker News' two monthly job threads, January 2019 – July 2026. For the first time since the threads began pairing in July 2014, job-seeker comments exceed hiring comments.

**Article:** https://ej29-r3d.github.io/hn-hiring-crossover/

## What's here

- `article.md` — **the article text. Edit this file to change any copy**, then push; `index.html` renders it. Structure is positional: the `#` heading is the title, the first paragraph is the deck, the second is the byline, everything after the `---` rule is the footer. Charts embed via placeholder lines like `{{chart hiring-chart.html?embed=1&title=hide 640}}` (path + initial height). Preview locally with `python3 -m http.server` — markdown loading needs HTTP, not `file://`.
- `index.html` — thin renderer for `article.md` (client-side, via marked). The page `<title>` and meta description live here — update them too if the headline changes.
- `hiring-chart.html` — main chart: both series monthly, annotated with rate, layoff, and AI events. Hover any month for its counts and that month's events.
- `avg-by-year.html` — January–July monthly averages per year.
- `seeker-share.html` — job seekers' share of all thread comments per year, crossing 50% in 2026.
- `data/monthly-thread-comments.csv` — the counts.
- `data/fetch.py` — regenerates the CSV (no dependencies). Counts drift as spam gets flagged and the newest thread accumulates, so re-run before citing.
- `core/`, `themes/`, `composables/` — chart infrastructure from my [marketing analytics visualization library](https://github.com/ej29-r3d/marketing_analytics_visualization). D3 v7, zero build step, every chart is one self-contained HTML file. Append `?theme=T01`..`T20` to any chart URL to restyle it.

## Method

Counts are the comment totals on each month's "Ask HN: Who is hiring?" and "Ask HN: Who wants to be hired?" threads posted by [whoishiring](https://news.ycombinator.com/user?id=whoishiring) — see `data/fetch.py`. One thread per month per type (verified, no duplicates). A comment count is a proxy: one hiring comment can hide fifty openings, and HN skews senior and startup-heavy.
