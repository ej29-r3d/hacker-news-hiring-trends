# 'Who wants to be hired' now outnumbers 'Who is hiring'

Analysis of comment counts in Hacker News' two monthly job threads, January 2019 – July 2026. For the first time since the threads began pairing in July 2014, job-seeker comments exceed hiring comments.

**Article:** https://eli-kolesnikov.github.io/hn-hiring-crossover/

## What's here

- `index.html` — the article, three interactive charts embedded.
- `hiring-chart.html` — main chart: both series monthly, annotated with rate, layoff, and AI events. Hover any month for its counts and that month's events.
- `avg-by-year.html` — January–July monthly averages per year.
- `seeker-share.html` — job seekers' share of all thread comments per year, crossing 50% in 2026.
- `data/monthly-thread-comments.csv` — the counts.
- `data/fetch.py` — regenerates the CSV from the HN Algolia API (no dependencies). Counts drift as spam gets flagged and the newest thread accumulates, so re-run before citing.
- `core/`, `themes/`, `composables/` — chart infrastructure from my [marketing analytics visualization library](https://github.com/eli-kolesnikov/marketing_analytics_visualization). D3 v7, zero build step, every chart is one self-contained HTML file. Append `?theme=T01`..`T20` to any chart URL to restyle it.

## Method

Counts are `num_comments` on each month's "Ask HN: Who is hiring?" and "Ask HN: Who wants to be hired?" threads posted by [whoishiring](https://news.ycombinator.com/user?id=whoishiring), via the [HN Algolia API](https://hn.algolia.com/api). One thread per month per type (verified, no duplicates). A comment count is a proxy: one hiring comment can hide fifty openings, and HN skews senior and startup-heavy.
