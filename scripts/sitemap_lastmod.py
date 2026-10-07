#!/usr/bin/env python3
"""Rewrites website/sitemap.xml with a <lastmod> per URL taken from git.

A page's date is the last commit that touched the files carrying its text
(see SOURCES); a file with uncommitted edits counts as today. `changefreq`
and `priority` are dropped: Google ignores both, and a hand-kept value says
nothing a real date does not.

Usage:
  python3 scripts/sitemap_lastmod.py          # rewrite the sitemap
  python3 scripts/sitemap_lastmod.py --check  # exit 1 if a date is stale
Run it after a content change, in the same commit."""
import datetime
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "website"
SITEMAP = WEB / "sitemap.xml"
ORIGIN = "https://humanrounds.org"


def sources(path):
    """Files whose text a visitor reads at `path` (relative to website/).
    Docs and blog shells carry their own prerendered body (prerender.mjs)."""
    if path == "/":
        return ["landing.html", "landing.js"]
    if path == "/docs":
        return ["docs/index.html"]
    if path.startswith("/docs/"):
        return [f"docs/{path[6:]}.html"]
    if path.startswith("/blog/"):
        return [path[1:]]
    return [f"{path[1:]}.html"]


def last_change(rel):
    target = WEB / rel
    if not target.is_file():
        raise SystemExit(f"sitemap source missing: website/{rel}")
    dirty = subprocess.run(["git", "status", "--porcelain", "--", str(target)],
                           cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    if dirty:
        return datetime.date.today().isoformat()
    out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(target)],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    return out or datetime.date.today().isoformat()


def build(current):
    locs = re.findall(r"<loc>([^<]+)</loc>", current)
    rows = []
    for loc in locs:
        if not loc.startswith(ORIGIN):
            raise SystemExit(f"sitemap lists another host: {loc}")
        path = loc[len(ORIGIN):] or "/"
        date = max(last_change(rel) for rel in sources(path))
        rows.append(f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{date}</lastmod>\n  </url>\n")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "".join(rows) + "</urlset>\n")


def main():
    current = SITEMAP.read_text()
    fresh = build(current)
    if "--check" in sys.argv:
        if fresh != current:
            print("website/sitemap.xml lastmod is stale — run: python3 scripts/sitemap_lastmod.py",
                  file=sys.stderr)
            sys.exit(1)
        return
    if fresh != current:
        SITEMAP.write_text(fresh)
        print("rewrote website/sitemap.xml")


if __name__ == "__main__":
    main()
