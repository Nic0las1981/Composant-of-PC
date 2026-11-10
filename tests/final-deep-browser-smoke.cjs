const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const {openCatalogProductDetail}=require('./catalog-test-helpers.cjs');
const oracle=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',`
import {catalog,defaultSelection,getComponent} from './src/data/catalog.ts';
import {getProductImage} from './src/data/productImages.ts';
import {verifiedProducts} from './src/data/verifiedCatalog.ts';
const ids=['import-ssd-750788872ce5','import-ssd-fa2c155af873','import-ssd-44e692606522','cooler-nhd15','cooler-nhd12l'];
const model=catalog.find(c=>c.brand==='Addlink'&&c.name.startsWith('G55 1 ')&&verifiedProducts[c.id]?.identityKind==='manufacturer-model');
if(!model)throw Error('Integrated manufacturer-model SSD missing');
console.log(JSON.stringify({defaults:defaultSelection,components:Object.fromEntries(ids.map(id=>[id,getComponent(id)])),photos:Object.fromEntries(ids.map(id=>[id,getProductImage(id)])),model}));
`],{encoding:'utf8',maxBuffer:16*1024*1024}));
const url=process.env.FORGE_TEST_URL||'http://127.0.0.1:4183';
const output=process.env.FORGE_TEST_OUTPUT||'/tmp/forge-final-review';
async function pixels(page){await page.waitForFunction(()=>{const c=document.querySelector('.visualizer canvas');if(!c||c.width<128)return false;const gl=c.getContext('webgl2');if(!gl)return false;const p=new Uint8Array(128*128*4);gl.readPixels(c.width/2-64,c.height/2-64,128,128,gl.RGBA,gl.UNSIGNED_BYTE,p);let n=0;for(let i=3;i<p.length;i+=4)if(p[i]>20)n++;return n>100;},null,{polling:'raf',timeout:90000});}
(async()=>{
 await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-features=LocalNetworkAccessChecks,LocalNetworkAccessChecksWebSockets']});
 const reports=[];const errors=[];const remoteFailures=[];
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',ignoreHTTPSErrors:true});
   await context.route('https://raw.githubusercontent.com/**',r=>r.abort());
   await context.route(oracle.photos['cooler-nhd12l'].imageURL,r=>r.abort());
   const page=await context.newPage();page.setDefaultTimeout(60000);
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
   page.on('requestfailed',r=>{if(r.url().startsWith('https://'))remoteFailures.push({url:r.url(),reason:r.failure()?.errorText});});
   const storage=width===1440?'import-ssd-750788872ce5':'import-ssd-fa2c155af873';
   await page.addInitScript(selection=>localStorage.setItem('forge-workbench-v1',JSON.stringify({selection,animated:false})),{...oracle.defaults,storage,cooler:'cooler-nhd15'});
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
   if(!process.env.FORGE_FINAL_RENDER_ONLY){
   await page.getByRole('button',{name:'Choisir Stockage',exact:true}).click();
   const {dialog}=await openCatalogProductDetail(page,oracle.components['import-ssd-44e692606522'].name);
   const rows=dialog.locator('.cp-detail-specs dl > div');const all=await rows.count();assert.ok(all>15);
   const search=dialog.getByRole('textbox',{name:'Rechercher une caractéristique',exact:true});
   await search.fill('écriture');await page.waitForFunction(()=>document.querySelectorAll('.cp-detail-specs dl > div').length>0&&document.querySelectorAll('.cp-detail-specs dl > div').length<10);
   assert.ok((await rows.count())<all);assert.match(await dialog.locator('.cp-detail-specs').innerText(),/9500/);
   await dialog.locator('.cp-spec-search').scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/spec-search-${width}.png`});
   await search.fill('zzzinexistant987');await dialog.locator('.cp-spec-empty').waitFor();assert.equal(await rows.count(),0);
   await dialog.getByRole('button',{name:'Effacer la recherche de caractéristique',exact:true}).click();assert.equal(await rows.count(),all);
   await dialog.getByRole('button',{name:'Retour aux composants',exact:true}).click();
   await openCatalogProductDetail(page,oracle.model.name);
   const verified=dialog.getByRole('region',{name:'Références et offres vérifiées',exact:true});
   assert.match(await verified.innerText(),/MPN reste à confirmer/);
   assert.equal(await verified.locator('.cp-verified-offers').count(),0);
   assert.match(await verified.innerText(),/Addlink G55 1000 GB/);
   await verified.scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/manufacturer-model-${width}.png`});
   const bounds=await dialog.boundingBox();assert.ok(bounds.x>=-1&&bounds.x+bounds.width<=width+1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'Choisir Refroidissement',exact:true}).click();
   await openCatalogProductDetail(page,oracle.components['cooler-nhd15'].name);
   const art=page.locator('.cp-detail-art svg');
   await page.waitForFunction(()=>document.querySelector('.cp-detail-art svg')?.dataset.artMode==='manufacturer-photo',null,{timeout:60000});
   assert.equal(await art.locator('[data-art-part="hardware"]').getAttribute('opacity'),'0');
   await page.locator('.cp-detail-art').screenshot({path:`${output}/photo-loaded-${width}.png`});
   await dialog.getByRole('button',{name:'Retour aux composants',exact:true}).click();
   await openCatalogProductDetail(page,oracle.components['cooler-nhd12l'].name);
   await page.waitForTimeout(300);
   assert.equal(await art.getAttribute('data-art-mode'),'illustration');
   assert.equal(await art.locator('[data-art-part="hardware"]').getAttribute('opacity'),'1');
   await page.locator('.cp-detail-art').screenshot({path:`${output}/photo-fallback-${width}.png`});
   await page.keyboard.press('Escape');
   }
   await page.locator('.visualizer').scrollIntoViewIfNeeded();
   // Both builds use NH-D15 chromax: wait for the two official fan meshes,
   // rather than accepting the lighter procedural loading fallback.
   await page.waitForFunction(()=>+document.querySelector('.visualizer .pc-scene')?.dataset.renderTriangles>95000,null,{polling:'raf',timeout:90000});
   await pixels(page);
   const metrics=await page.locator('.visualizer .pc-scene').evaluate(el=>({calls:+el.dataset.renderCalls,triangles:+el.dataset.renderTriangles}));
   assert.ok(metrics.calls>0&&metrics.calls<500);assert.ok(metrics.triangles>0&&metrics.triangles<150000);
   await page.locator('.visualizer').screenshot({path:`${output}/ssd-${width}-assembled.png`,timeout:90000});
   await page.getByRole('button',{name:'Vue éclatée',exact:true}).click();await pixels(page);
   await page.locator('.visualizer').screenshot({path:`${output}/ssd-${width}-exploded.png`,timeout:90000});
   reports.push({width,storage,...metrics,technicalSearch:!process.env.FORGE_FINAL_RENDER_ONLY,manufacturerModel:!process.env.FORGE_FINAL_RENDER_ONLY,photoLoad:!process.env.FORGE_FINAL_RENDER_ONLY,photoFailureFallback:!process.env.FORGE_FINAL_RENDER_ONLY,noHorizontalOverflow:!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))});
   console.log('PASS final UX and 3D',reports.at(-1));await context.close();
  }
  assert.deepEqual(errors,[]);
 }finally{await fs.writeFile(output+'/report.json',JSON.stringify({url,reports,errors,remoteFailures},null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
