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
for script in ('public-theme.js','market-positioning.js'):
    subprocess.run(['node','--check',str(web/script)],check=True)
manifest=json.loads((web/'docs-shots/screenshots.json').read_text())
assert manifest['shots']['../clinical-summary-concept.png']['status'].startswith('Concept;')
out=Path.home()/'.claude/artifacts/human-rounds/public-mirror-ci'
out.mkdir(parents=True,exist_ok=True)
message=f'Public distribution passed: {len(pages)} pages and all referenced assets.\n'
(out/(datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'.log')).write_text(message)
print(message,end='')
