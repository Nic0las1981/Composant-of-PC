"""Run with Blender's Python: blender -b --python this-file.

Reduces reference meshes for a complete PC scene; not for dimensional analysis.
"""
from pathlib import Path
import hashlib
import json
import math
import bpy

ROOT = Path(__file__).resolve().parents[1]
targets = {'frame':7000,'rotor':6000,'pads':1800,'label':64}
for path in sorted((ROOT/'public/models/noctua').glob('*.glb')):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(path))
    counts = {}
    for obj in list(bpy.data.objects):
        if obj.type != 'MESH': continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        before = len(obj.data.polygons)
        mod = obj.modifiers.new('Browser visualization LOD','DECIMATE')
        mod.ratio = min(1,targets[obj.name]/before)
        mod.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=mod.name)
        for polygon in obj.data.polygons: polygon.use_smooth=True
        obj.data.set_sharp_from_angle(angle=math.radians(35))
        counts[obj.name] = len(obj.data.polygons)
        obj.select_set(False)
    bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',export_yup=True,export_normals=True,export_materials='NONE',export_cameras=False,export_lights=False)
    proof_path=ROOT/'data/deep-review/visual/cad'/(path.stem+'-mesh.json')
    proof=json.loads(proof_path.read_text())
    proof['optimizedTriangles']=counts
    proof['optimizedBytes']=path.stat().st_size
    proof['optimizedSHA256']=hashlib.sha256(path.read_bytes()).hexdigest()
    proof['optimization']='Blender collapse decimation; reference visualization, not a measurement mesh'
    proof_path.write_text(json.dumps(proof,indent=2))
    print(json.dumps({'model':path.stem,'triangles':counts,'bytes':path.stat().st_size}),flush=True)
