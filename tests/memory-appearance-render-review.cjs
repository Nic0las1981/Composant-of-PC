// Run against the Vite development server to inspect actual production components.
const {chromium}=require('playwright');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const out=path.resolve('release/memory-appearance-review');
const oracle=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',`
import {catalog} from './src/data/catalog.ts';
import {getVisualProfile} from './src/data/visualProfiles.ts';
import {getMemoryAppearance,memoryShapes} from './src/data/memoryAppearance.ts';
import {memoryAppearanceAssignments} from './src/data/memoryAppearanceAssignments.ts';
const rows=[];
for(const design of Object.keys(memoryShapes)){
 const candidates=catalog.filter(c=>getMemoryAppearance(c)===design);
 const c=candidates.find(c=>c.color==='#f0efeb')??candidates[0];
 if(c)rows.push({component:c,profile:getVisualProfile(c),design});
 else{
  // A dormant reviewed design is rendered as a labelled schematic fixture only;
  // it must not be counted as a resolved or newly introduced catalogue record.
  const base=catalog.find(c=>c.category==='ram'&&c.manufacturerPartNumber==='KF552C40BBK2-16');
  const component={...base,id:'review-only-'+design,name:'Fixture graphique hors catalogue : '+design,manufacturerPartNumber:memoryAppearanceAssignments[design][0],memoryHeatspreader:true};
  rows.push({component,profile:{...getVisualProfile(base),id:component.id},design,fixture:true});
 }
}
for(const rgb of [true,false]){const c=catalog.find(c=>getMemoryAppearance(c)==='trident-z5'&&c.rgb===rgb);rows.push({component:c,profile:getVisualProfile(c),design:'trident-z5'});}
console.log(JSON.stringify(rows));
`],{encoding:'utf8',maxBuffer:16*1024*1024}));
(async()=>{
 await fs.mkdir(out,{recursive:true});
 await fs.writeFile(path.join(out,'oracle.json'),JSON.stringify(oracle));
 await fs.writeFile(path.join(out,'review.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Memory appearance review</title><style>body{margin:0;background:#17201e;color:#e3ece5;font:14px Arial}#scene{height:950px}.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:20px}.card{border:1px solid #56645c;padding:12px}.card svg{width:100%;height:220px}.card p{margin:5px}</style></head><body><div id="root"></div><script type="module" src="./review.tsx"></script></body></html>');
 await fs.writeFile(path.join(out,'review.tsx'),`
import React from 'react';import {createRoot} from 'react-dom/client';
import {Canvas,useThree} from '@react-three/fiber';
import {useEffect} from 'react';
import {RamModel} from '/src/components/scene/HardwareModels.tsx';
import {HardwareSurfaceProvider} from '/src/components/scene/HardwarePrimitives.tsx';
import {SceneAnimationProvider} from '/src/components/scene/SceneAnimation.tsx';
import ProductArt from '/src/components/ProductArt.tsx';
import rows from './oracle.json';
function Inspect(){const {scene,gl}=useThree();useEffect(()=>{window.__memoryScene=scene;window.__memoryRenderer=gl;},[scene,gl]);return null;}
function App(){return <><div id="scene"><Canvas orthographic camera={{position:[0,0,8],zoom:340}} dpr={1} gl={{preserveDrawingBuffer:true}}>
<color attach="background" args={['#17201e']}/><ambientLight intensity={1.3}/><directionalLight position={[2,4,6]} intensity={3}/><directionalLight position={[-3,-2,4]} intensity={1}/>
<SceneAnimationProvider animated={false}><HardwareSurfaceProvider>{rows.map((r,i)=><group key={i} position={[(i%3-1)*1.43,1.03-Math.floor(i/3)*.69,0]} rotation={[.19,-.14,Math.PI/2]}><RamModel component={r.component} profile={r.profile} singleModule/></group>)}</HardwareSurfaceProvider></SceneAnimationProvider><Inspect/>
</Canvas></div><div className="icons">{rows.map((r,i)=><article className="card" key={i}><p>{i+1}. {r.design}</p><ProductArt component={r.component} category="ram" preferIllustration detailed/><p>{r.component.name}</p><small>{r.component.manufacturerPartNumber}</small></article>)}</div></>};
createRoot(document.getElementById('root')!).render(<App/>);
`);
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1100},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.FORGE_VISUAL_URL||'http://127.0.0.1:5173')+'/release/memory-appearance-review/review.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__memoryScene&&window.__memoryRenderer?.info.render.triangles>1000,null,{timeout:90000}).catch(async e=>{
    console.error('Browser errors:',errors);await page.screenshot({path:path.join(out,'failed-render.png')});throw e;
  });
  const geometry=await page.evaluate(()=>{
    const shells=[];window.__memoryScene.traverse(o=>{if(!o.name.startsWith('memory-shell-'))return;let meshes=0;let finite=true;const depth=[];
      o.traverse(m=>{if(!m.isMesh)return;meshes++;const p=m.geometry.attributes.position;for(let i=0;i<p.array.length;i++)if(!Number.isFinite(p.array[i]))finite=false;m.geometry.computeBoundingBox();const box=m.geometry.boundingBox.clone();m.updateWorldMatrix(true,false);box.applyMatrix4(m.matrixWorld);depth.push([box.min.z,box.max.z]);});
      shells.push({name:o.name,meshes,finite,depth});});return{shells,calls:window.__memoryRenderer.info.render.calls,triangles:window.__memoryRenderer.info.render.triangles};
  });
  assert.equal(geometry.shells.length,oracle.length);assert.ok(geometry.shells.every(s=>s.finite&&s.meshes>0));assert.deepEqual(errors,[]);
  await page.locator('#scene').screenshot({path:path.join(out,'memory-3d.png')});
  await page.locator('.icons').screenshot({path:path.join(out,'memory-icons.png')});
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify({rows:oracle.map(r=>({design:r.design,id:r.component.id,mpn:r.component.manufacturerPartNumber,rgb:r.component.rgb,fixture:r.fixture??false})),geometry,errors},null,2));
  console.log(JSON.stringify({output:out,models:geometry.shells.length,catalogueModels:oracle.filter(r=>!r.fixture).length,fixtures:oracle.filter(r=>r.fixture).length,calls:geometry.calls,triangles:geometry.triangles,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
