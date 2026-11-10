// Multiple physical envelopes exercise all eight category renderers and compare
// actual frame timings. Software Chromium timings are not hardware FPS promises.
const {chromium}=require('playwright');const assert=require('node:assert/strict');
const fs=require('node:fs/promises');const {execFileSync}=require('node:child_process');
const defaults=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',"import {defaultSelection} from './src/data/catalog.ts';console.log(JSON.stringify(defaultSelection));"],{encoding:'utf8'}));
const cases=[['panoramic-air',defaults],['white-airflow-aio',{...defaults,case:'case-4000d-white',cooler:'cooler-lfiii360-argb-white'}],['mini-itx',{...defaults,cpu:'cpu-7600',motherboard:'mb-a620i',cooler:'cooler-l9a',case:'case-terra',psu:'psu-sf750'}]];
(async()=>{const output=process.env.FORGE_RENDER_OUTPUT||'/tmp/forge-renderers-after';await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const reports=[];
 try{for(const [name,selection] of cases){
  const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.setDefaultTimeout(40000);
  await context.route('https://raw.githubusercontent.com/**',route=>route.abort());
  await page.addInitScript(selection=>localStorage.setItem('forge-workbench-v1',JSON.stringify({selection,animated:false})),selection);
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'&&!message.location().url.startsWith('https://raw.githubusercontent.com/'))errors.push('Console: '+message.text());});
  await page.goto(process.env.FORGE_TEST_URL||'http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();const scene=page.locator('.visualizer .pc-scene');await scene.locator('canvas').waitFor();
  await page.locator('.visualizer').scrollIntoViewIfNeeded();await page.waitForTimeout(1600);
  const frames=await page.evaluate(()=>new Promise(resolve=>{const intervals=[];let previous=performance.now();const tick=now=>{intervals.push(now-previous);previous=now;if(intervals.length===40)resolve(intervals);else requestAnimationFrame(tick);};requestAnimationFrame(tick);}));
  frames.sort((a,b)=>a-b);const metrics=await scene.evaluate(el=>({calls:Number(el.dataset.renderCalls),triangles:Number(el.dataset.renderTriangles),geometries:Number(el.dataset.renderGeometries)}));
  assert.ok(metrics.calls>0&&metrics.calls<500,name+' draw call budget');assert.ok(metrics.triangles>0&&metrics.triangles<150000,name+' triangle budget');
  await page.locator('.visualizer').screenshot({path:output+'/'+name+'-assembled.png',timeout:60000});
  await page.getByRole('button',{name:'Vue éclatée',exact:true}).click();await page.waitForTimeout(1000);await page.locator('.visualizer').screenshot({path:output+'/'+name+'-exploded.png',timeout:60000});
  assert.deepEqual(errors,[]);reports.push({name,...metrics,medianFrameMs:frames[20],p95FrameMs:frames[38],approximateSoftwareFps:Math.round(1000/frames[20])});await context.close();
 }
 await fs.writeFile(output+'/metrics.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
