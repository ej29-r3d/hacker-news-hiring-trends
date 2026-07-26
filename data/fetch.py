#!/usr/bin/env python3
"""Regenerate monthly-thread-comments.csv from the HN Algolia API.

Counts are `num_comments` on the monthly "Ask HN: Who is hiring?" and
"Who wants to be hired?" threads posted by the `whoishiring` account.
Counts drift over time (spam gets flagged, the newest thread keeps
accumulating), so re-run this before publishing anything.
"""
import json
import re
import urllib.request

API = "https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&hitsPerPage=1000&page={}"
MONTHS = {m: i + 1 for i, m in enumerate(
    ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"])}

hits = []
for page in range(3):
    with urllib.request.urlopen(API.format(page)) as r:
        batch = json.load(r)["hits"]
    hits += batch
    if len(batch) < 1000:
        break

hiring, seekers = {}, {}
for h in hits:
    title = h.get("title") or ""
    m = re.match(r"Ask HN: Who is hiring\? \((\w+) (\d{4})\)", title)
    if m:
        hiring[f"{m.group(2)}-{MONTHS[m.group(1)]:02d}"] = h["num_comments"]
        continue
    m = re.match(r"Ask HN: Who wants to be hired\? \((\w+) (\d{4})\)", title)
    if m:
        seekers[f"{m.group(2)}-{MONTHS[m.group(1)]:02d}"] = h["num_comments"]

months = sorted(set(hiring) & set(seekers))
months = [m for m in months if m >= "2019-01"]
with open("monthly-thread-comments.csv", "w") as f:
    f.write("month,who_wants_to_be_hired,who_is_hiring\n")
    for m in months:
        f.write(f"{m},{seekers[m]},{hiring[m]}\n")
print(f"wrote {len(months)} months ({months[0]} .. {months[-1]})")
