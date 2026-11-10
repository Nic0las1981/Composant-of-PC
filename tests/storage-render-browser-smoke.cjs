const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const output=process.env.FORGE_TEST_OUTPUT||'/tmp/forge-final-review';await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1400,height:650}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(process.env.FORGE_STORAGE_TEST_URL||'http://127.0.0.1:4184');
  await page.waitForFunction(()=>[...document.querySelectorAll('article')].length===2&&[...document.querySelectorAll('article')].every(e=>+e.dataset.calls>0),null,{timeout:90000});
  await page.waitForTimeout(800);
  const models=await page.locator('article').evaluateAll(nodes=>nodes.map(e=>({id:e.id,heightMm:+e.dataset.documentedHeightMm,renderedHeightMm:+e.dataset.renderedHeightMm,thin:e.dataset.thinSpreader==='true',calls:+e.dataset.calls,triangles:+e.dataset.triangles,dimensions:JSON.parse(e.dataset.dimensions)})));
  assert.equal(models[0].heightMm,2.42);assert.equal(models[1].heightMm,9.2);
  assert.equal(models[0].thin,true);assert.equal(models[1].thin,false);
  for(const m of models){assert.ok(Math.abs(m.renderedHeightMm-m.heightMm)<.25,JSON.stringify(m));assert.ok(m.calls<30);assert.ok(m.triangles<15000);}
  assert.ok(models[1].renderedHeightMm/models[0].renderedHeightMm>3.5);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:output+'/storage-film-and-fins.png'});
  await fs.writeFile(output+'/storage-render-report.json',JSON.stringify({models,errors},null,2));console.log('PASS film and fins physical envelopes',models);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
