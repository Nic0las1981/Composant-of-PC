"""Build exact-reference image links; URL discovery never implies visual inspection."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VISUAL = ROOT / 'data/deep-review/visual/icons'
assets = {}
for row in json.loads((VISUAL / 'inspected-products.json').read_text()):
    if row.get('useAsPrimaryPhoto') and row.get('visuallyInspected'):
        assets[row['id']] = {
            'imageURL': row['imageURL'], 'sourceURL': row['sourceURL'],
            'inspection': 'visually-inspected',
        }

# A product API's thumbnail is explicitly associated with its unique part number.
# Open Graph lists are deliberately not used: many contain logos or unrelated variants.
gpu_index = ROOT / 'data/deep-review/gpu/indexes/inno3d-products.json'
gpu_matches = ROOT / 'data/deep-review/gpu/visual-references.json'
if gpu_index.exists() and gpu_matches.exists():
    by_mpn = {}
    for product in json.loads(gpu_index.read_text())['data']['products']:
        key = (product.get('part_no') or '').strip().upper()
        if key:
            by_mpn.setdefault(key, []).append(product)
    for row in json.loads(gpu_matches.read_text()):
        candidates = by_mpn.get((row.get('mpn') or '').strip().upper(), [])
        if len(candidates) != 1:
            continue
        product = candidates[0]
        url = product.get('thumb', {}).get('path', '')
        if not url.startswith('https://www.inno3d.com/'):
            continue
        if product['url'].rstrip('/') != row['sourceURL'].rstrip('/'):
            continue
        assets[row['id']] = {
            'imageURL': url, 'sourceURL': product['url'], 'mpn': product['part_no'],
            'inspection': 'manufacturer-catalogue',
        }

# Distinct board revisions may have different PCB layouts. Use an image only if
# there is one published asset for the matched model/revision, never an arbitrary
# first revision from a list of different images.
board_photos = ROOT / 'data/deep-review/motherboard/gigabyte/photos.json'
board_matches = ROOT / 'data/deep-review/motherboard/gigabyte/per-id.json'
if board_photos.exists() and board_matches.exists():
    matches = {row['id']: row for row in json.loads(board_matches.read_text())['records']}
    for identifier, photos in json.loads(board_photos.read_text()).items():
        match = matches.get(identifier, {})
        if match.get('status') != 'official_model_specifications':
            continue
        revision = match.get('archiveRevision')
        if revision:
            photos = [p for p in photos if revision in [r.strip() for r in (p.get('revision') or '').split('/')]]
        urls = {p['url'] for p in photos}
        if len(urls) != 1 or not photos:
            continue
        photo = photos[0]
        if not photo['url'].startswith('https://static.gigabyte.com/'):
            continue
        assets[identifier] = {
            'imageURL': photo['url'], 'sourceURL': photo['sourceURL'],
            'inspection': 'manufacturer-catalogue',
            **({'revision': photo['revision']} if photo.get('revision') else {}),
        }

# Dedicated product-image paths from exact manufacturer pages. A unique product
# asset is usable without claiming visual inspection. Generic OG banners, logos,
# invalid directory URLs and unresolved revision galleries are excluded.
def dedicated_product_image(url):
    return bool(re.match(r'^https://(?:storage-asset\.msi\.com/global/picture/product/[^/?]+\.(?:webp|png|jpg)|static\.gigabyte\.com/StaticFile/Image/Global/[^/]+/ProductRemoveBg/\d+|dlcdnwebimgs\.asus\.com/gain/[a-fA-F0-9-]+/?|www\.asus\.com/media/global/gallery/[^/?]+\.(?:png|jpg))$',url))

all_board_photos=ROOT/'data/deep-review/motherboard/official-photos.json'
if all_board_photos.exists():
    for identifier,record in json.loads(all_board_photos.read_text()).items():
        if identifier in assets:continue
        references=record.get('references',[])
        unique={r['url'] for r in references}
        if len(unique)!=1:continue
        photo=references[0]
        if not dedicated_product_image(photo['url']):continue
        source_urls=photo.get('sourceURLs') or ([photo['sourceURL']] if photo.get('sourceURL') else [])
        if not source_urls:continue
        assets[identifier]={'imageURL':photo['url'],'sourceURL':source_urls[0],'inspection':'manufacturer-catalogue'}

if gpu_matches.exists():
    for record in json.loads(gpu_matches.read_text()):
        if record['id'] in assets:continue
        urls=set(record.get('imageURLs',[]))
        if len(urls)!=1:continue
        url=next(iter(urls))
        if not dedicated_product_image(url):continue
        assets[record['id']]={'imageURL':url,'sourceURL':record['sourceURL'],'inspection':'manufacturer-catalogue',**({'mpn':record['mpn']} if record.get('mpn') else {})}

finish_proofs=ROOT/'data/deep-review/gpu/inspected-finish-proofs.json'
if finish_proofs.exists() and gpu_matches.exists():
    proofs={row['mpn']:row for row in json.loads(finish_proofs.read_text()) if row.get('visuallyInspected')}
    model_proofs={row.get('model'):row for row in proofs.values() if row.get('model')}
    for record in json.loads(gpu_matches.read_text()):
        proof=proofs.get(record.get('mpn')) or model_proofs.get(record.get('manufacturerModel') or record.get('model'))
        if proof and proof['sourceURL']==record['sourceURL']:
            assets[record['id']]={'imageURL':proof['imageURL'],'sourceURL':proof['sourceURL'],'inspection':'visually-inspected',**({'mpn':record['mpn']} if record.get('mpn') else {})}

# RAM galleries are tied to individually published SKUs. Only the exact byte
# image that was inspected is promoted; a family picture cannot stand in for it.
memory_dir=ROOT/'data/deep-review/memory-storage'
if (memory_dir/'visual-sources.json').exists() and (memory_dir/'visual-finish-resolutions.json').exists():
    reviewed={r['mpn']:r for r in json.loads((memory_dir/'visual-finish-resolutions.json').read_text())}
    for identifier,record in json.loads((memory_dir/'visual-sources.json').read_text()).items():
        proof=reviewed.get(record.get('mpn'))
        if not proof or proof['imageURL'] not in record.get('images',[]):continue
        if proof['sourceURL'] not in record.get('sourceURLs',[]):continue
        assets[identifier]={'imageURL':proof['imageURL'],'sourceURL':proof['sourceURL'],'mpn':record['mpn'],'inspection':'visually-inspected'}

target = ROOT / 'src/data/manufacturerImageAssets.ts'
target.write_text('// Generated by scripts/build-product-image-assets.py. Identity match is separate from visual inspection.\n'
                  + 'export const manufacturerImageAssets = '
                  + json.dumps(assets, ensure_ascii=False, indent=2) + ' as const;\n')
summary = {'total': len(assets), 'visuallyInspected': sum(a['inspection'] == 'visually-inspected' for a in assets.values()),
           'catalogueIdentityOnly': sum(a['inspection'] == 'manufacturer-catalogue' for a in assets.values())}
(VISUAL / 'primary-photo-summary.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary))
