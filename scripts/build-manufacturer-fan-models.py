"""Tessellate Noctua's public reference CAD for browser visualization only.

No measurements from this mesh are imported into technical product records.
Requires cadquery and numpy. Keeps a stationary frame and separate rotor.
"""
from pathlib import Path
import hashlib
import json
import struct
import tempfile
import zipfile
import cadquery as cq
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/deep-review/visual/cad'
OUT = ROOT / 'public/models/noctua'
MODELS = {
    'nf-a15-chromax': 'NF-A15_chromax_Public-CAD.zip',
    'nf-a14x25r-g2': 'NF-A14x25r_G2_Public-CAD.zip',
    'nf-a12x25r': 'NF-A12x25r_Public-CAD.zip',
    'nf-a9x14': 'NF-A9x14_Public-CAD.zip',
}

def convert(name, archive):
    payload = archive.read_bytes()
    with zipfile.ZipFile(archive) as z, tempfile.TemporaryDirectory() as temp:
        step = next(n for n in z.namelist() if n.lower().endswith(('.stp', '.step')))
        path = Path(temp) / Path(step).name
        path.write_bytes(z.read(step))
        solids = cq.importers.importStep(str(path)).val().Solids()
        readme = z.read(next(n for n in z.namelist() if 'readme' in n.lower())).decode()
    # Public assemblies contain frame, complete impeller, eight vibration pads
    # and rear label. Solid order and bounds are recorded for review below.
    if len(solids) != 11:
        raise ValueError(f'{name}: unexpected assembly; review solid mapping')
    boxes = [s.BoundingBox() for s in solids]
    bounds = [[b.xmin,b.ymin,b.zmin,b.xmax,b.ymax,b.zmax] for b in boxes]
    frame, rotor = boxes[:2]
    thin = int(np.argmin([frame.xlen, frame.ylen, frame.zlen]))
    if thin not in (0, 2):
        raise ValueError(f'{name}: unknown axis')
    # The rear label gives the true fan axis independently of uneven impellers.
    label_index = next(i for i,b in enumerate(boxes) if min(b.xlen,b.ylen,b.zlen) < 0.8 and max(b.xlen,b.ylen,b.zlen) < 50)
    label = boxes[label_index]
    origin = np.array([label.center.x,label.center.y,label.center.z])
    origin[thin] = [frame.center.x,frame.center.y,frame.center.z][thin]
    # Proper rotations, with intake/impeller facing local +Z.
    if thin == 0:
        matrix = np.array([[0,1,0],[0,0,-1],[-1,0,0]])
    else:
        direction = 1 if rotor.center.z > origin[2] else -1
        matrix = np.diag([1,direction,direction])
    grouped = { 'frame': [0], 'rotor': [1], 'pads': [i for i in range(2,11) if i != label_index], 'label': [label_index] }
    blob = bytearray()
    doc = {'asset': {'version':'2.0','generator':'FORGE / CadQuery / Noctua public visualization CAD','copyright':'Noctua — public reference CAD; see README-Noctua.txt'},
           'scene':0,'scenes':[{'nodes':[]}], 'nodes':[], 'meshes':[], 'bufferViews':[], 'accessors':[], 'buffers':[]}
    def accessor(values, kind, component_type, target):
        while len(blob)%4: blob.append(0)
        offset = len(blob)
        blob.extend(values.tobytes())
        view = len(doc['bufferViews'])
        doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':values.nbytes,'target':target})
        value = {'bufferView':view,'componentType':component_type,'count':len(values),'type':kind}
        if kind == 'VEC3':
            value.update(min=values.min(axis=0).tolist(),max=values.max(axis=0).tolist())
        doc['accessors'].append(value)
        return len(doc['accessors'])-1
    counts = {}
    for part, indices in grouped.items():
        vertices, faces = [], []
        for i in indices:
            v, f = solids[i].tessellate(0.22, 0.25)
            faces.extend([[a+len(vertices),b+len(vertices),c+len(vertices)] for a,b,c in f])
            vertices.extend([[p.x,p.y,p.z] for p in v])
        positions = ((np.array(vertices)-origin) @ matrix.T).astype('<f4')
        triangles = np.array(faces,dtype='<u4')
        normals = np.zeros_like(positions)
        face_normals = np.cross(positions[triangles[:,1]]-positions[triangles[:,0]],positions[triangles[:,2]]-positions[triangles[:,0]])
        for k in range(3): np.add.at(normals, triangles[:,k], face_normals)
        lengths = np.linalg.norm(normals,axis=1,keepdims=True)
        normals = (normals/np.maximum(lengths,1e-20)).astype('<f4')
        primitive = {'attributes': {'POSITION': accessor(positions,'VEC3',5126,34962),'NORMAL':accessor(normals,'VEC3',5126,34962)}, 'indices':accessor(triangles.flatten(),'SCALAR',5125,34963)}
        index = len(doc['nodes'])
        doc['scenes'][0]['nodes'].append(index)
        doc['nodes'].append({'name':part,'mesh':index})
        doc['meshes'].append({'name':part,'primitives':[primitive]})
        counts[part] = len(triangles)
    doc['buffers']=[{'byteLength':len(blob)}]
    meta = json.dumps(doc,separators=(',',':')).encode()
    meta += b' '*((-len(meta))%4)
    blob.extend(b'\0'*((-len(blob))%4))
    result = struct.pack('<III',0x46546c67,2,12+8+len(meta)+8+len(blob))+struct.pack('<II',len(meta),0x4e4f534a)+meta+struct.pack('<II',len(blob),0x004e4942)+blob
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/(name+'.glb')).write_bytes(result)
    (OUT/'README-Noctua.txt').write_text(readme)
    proof = {'model':name,'archive':archive.name,'sourceSHA256':hashlib.sha256(payload).hexdigest(),'outputSHA256':hashlib.sha256(result).hexdigest(),
             'bytes':len(result),'triangles':counts,'sourceSolidBoundsMm':bounds,'sourceAxisOriginMm':origin.tolist(),'sourceToLocalRotation':matrix.tolist(),
             'units':'millimetres','use':'Reference visualization only; manufacturer has modified some impeller details. Not a simulation or manufacturing model.'}
    (SOURCE/(name+'-mesh.json')).write_text(json.dumps(proof,indent=2))
    print(json.dumps({k:proof[k] for k in ('model','bytes','triangles')}),flush=True)

if __name__ == '__main__':
    for name, file in MODELS.items(): convert(name,SOURCE/file)
