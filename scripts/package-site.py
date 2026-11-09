"""Create upload-ready static and source archives using Python's standard library."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
import hashlib

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
release = root / 'release'
if not (dist / 'index.html').is_file():
    raise SystemExit('Build missing. Run npm run build first.')
release.mkdir(exist_ok=True)

with ZipFile(release / 'forge-site.zip', 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(dist.rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(dist))

source_paths = ['src', 'public', 'scripts', 'tests', '.gitignore', 'package.json',
                'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json', 'README.md', 'PRIX.md', 'MISE-EN-LIGNE.txt']
with ZipFile(release / 'forge-sources.zip', 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for name in source_paths:
        item = root / name
        for path in sorted(item.rglob('*')) if item.is_dir() else [item]:
            if path.is_file():
                archive.write(path, Path('forge-sources') / path.relative_to(root))

hashes = []
for name in ['forge-site.zip', 'forge-sources.zip']:
    path = release / name
    with ZipFile(path) as archive:
        damaged = archive.testzip()
        if damaged:
            raise SystemExit(f'Archive verification failed: {damaged}')
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    hashes.append(f'{digest}  {name}')
    print(f'{name}: {path.stat().st_size:,} bytes — ZIP integrity verified')
(release / 'SHA256SUMS.txt').write_text('\n'.join(hashes) + '\n', encoding='utf-8')
print(f'Ready to upload: {release / "forge-site.zip"}')
