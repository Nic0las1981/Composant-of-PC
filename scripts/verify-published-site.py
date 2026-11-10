"""Verify that GitHub Pages serves the exact local build, including licensed CAD."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://nic0las1981.github.io/Composant-of-PC/'
commit = subprocess.check_output(
    ['git', 'ls-remote', 'origin', 'refs/heads/gh-pages'], cwd=ROOT, text=True
).split()[0]
state = json.loads(subprocess.check_output(
    ['gh', 'api', 'repos/Nic0las1981/Composant-of-PC/pages/builds/latest'], text=True
))
assert state['commit'] == commit and state['status'] == 'built', {
    'commit': state['commit'], 'status': state['status']
}

def fetch(url):
    with urlopen(Request(url, headers={'Cache-Control': 'no-cache'}), timeout=60) as response:
        assert response.status == 200
        return response.read()

html = fetch(BASE + '?verify=' + commit)
assert html == (ROOT / 'dist/index.html').read_bytes(), 'Public HTML differs from local build'
assets = re.findall(r'(?:src|href)="([^\"]+\.(?:js|css))"', html.decode())
assets += ['./assets/' + p.name for p in (ROOT / 'dist/assets').glob('PcScene-*.js')]
assets += ['./models/noctua/' + name for name in (
    'nf-a15-chromax.glb', 'nf-a14x25r-g2.glb', 'nf-a12x25r.glb',
    'nf-a9x14.glb', 'README-Noctua.txt',
)]
assets += ['./catalog-packing-report.json']
for asset in dict.fromkeys(assets):
    relative = asset.removeprefix('./')
    public = fetch(urljoin(BASE, asset))
    local = (ROOT / 'dist' / relative).read_bytes()
    assert hashlib.sha256(public).digest() == hashlib.sha256(local).digest(), relative
    print('MATCH', relative, len(public))
print('Published commit, HTML, application bundles and manufacturer CAD match the local build.')
