"""Validate the public distribution; runtime/browser acceptance lives in intake."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess
import json
import datetime

root=Path(__file__).resolve().parents[1]
web=root/'website'
class Resources(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        value=attrs.get('src','') if tag in ('img','script') else attrs.get('href','') if tag=='link' else ''
        if value.startswith('/web/'):
            path=web/value[5:].split('?')[0]
            assert path.is_file(), f'Missing asset: {path.relative_to(root)}'

pages=list(web.rglob('*.html'))
for page in pages:
    text=page.read_text()
    Resources().feed(text)
    if '/web/landing.css?' in text:
        assert text.count('/web/public-theme.css?')==1, page
        assert text.count('/web/public-theme.js?')==1, page
# Docs and blog bodies must be in the HTML a crawler gets, not only painted by
# docs.js/landing.js: one H1 and real text without running a script.
class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.words=0; self.h1=0
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style'): self.skip+=1
        if tag=='h1': self.h1+=1
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip-=1
    def handle_data(self, data):
        if not self.skip: self.words+=len(data.split())
for page in sorted((web/'docs').glob('*.html'))+sorted((web/'blog').glob('*.html')):
    parsed=Text(); parsed.feed(page.read_text())
    assert parsed.h1==1, f'{page.relative_to(root)}: {parsed.h1} <h1> without scripts, expected 1'
    assert parsed.words>=150, f'{page.relative_to(root)}: {parsed.words} words without scripts'
subprocess.run(['node',str(root/'scripts/prerender.mjs'),'--check'],check=True)
# The sitemap lists only humanrounds.org's own pages: the demo is a sandbox on
# another host, served noindex by its own app (sana-turnos demo mode).
sitemap=(web/'sitemap.xml').read_text()
assert 'demo.humanrounds.org' not in sitemap, 'sitemap.xml lists demo.humanrounds.org'
for script in ('public-theme.js','market-positioning.js'):
    subprocess.run(['node','--check',str(web/script)],check=True)
manifest=json.loads((web/'docs-shots/screenshots.json').read_text())
assert manifest['shots']['../clinical-summary-concept.png']['status'].startswith('Concept;')
out=Path.home()/'.claude/artifacts/human-rounds/public-mirror-ci'
out.mkdir(parents=True,exist_ok=True)
message=f'Public distribution passed: {len(pages)} pages and all referenced assets.\n'
(out/(datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'.log')).write_text(message)
print(message,end='')
