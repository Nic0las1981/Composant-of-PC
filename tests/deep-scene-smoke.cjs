// Physical renderer variants: official fan assets, inspected pump/case shapes,
// JavaScript and renderer errors, and bounded WebGL scene cost.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const defaults=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',"import {defaultSelection} from './src/data/catalog.ts';console.log(JSON.stringify(defaultSelection));"],{encoding:'utf8'}));
const variants=[
 ['nhd15-black',{case:'case-4000d',cooler:'cooler-nhd15'},'nf-a15-chromax'],
 ['nhd15-g2',{case:'case-5000d',cooler:'cooler-nhd15-g2'},'nf-a14x25r-g2'],
 ['nhd12l-asymmetric',{case:'case-ap201',cooler:'cooler-nhd12l'},'nf-a12x25r'],
 ['l9a-low',{cpu:'cpu-7600',motherboard:'mb-a620i',case:'case-terra',cooler:'cooler-l9a',psu:'psu-sf750'},'nf-a9x14'],
 ['l9i-black',{cpu:'cpu-14600kf',case:'case-q300l',cooler:'cooler-l9i-17xx'},'nf-a9x14'],
 ['digital-pop',{case:'case-pop-air-rgb',cooler:'cooler-ak620-digital'}],
 ['arctic-radial',{case:'case-7000d',cooler:'cooler-lfiii360-argb-white'}],
 ['kraken-cylinder',{case:'case-h9',cooler:'cooler-kraken360'}],
 ['capellix-octagon',{case:'case-4000d-white',cooler:'cooler-h150i360'}],
 ['infinity-meshify',{case:'case-meshify2',cooler:'cooler-ls720360'}],
 ['silent-loop-lancool',{case:'case-lancool3',cooler:'cooler-silentloop2-360'}],
];
async function waitForHardwarePixels(page) {
 await page.waitForFunction(()=>{
  const canvas=document.querySelector('.visualizer canvas');
  if(!canvas||canvas.width<128||canvas.height<128)return false;
  const gl=canvas.getContext('webgl2');if(!gl)return false;
  const pixels=new Uint8Array(128*128*4);
  gl.readPixels(Math.floor(canvas.width/2-64),Math.floor(canvas.height/2-64),128,128,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let occupied=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>20)occupied++;
  return occupied>100;
 },null,{polling:'raf',timeout:60000});
}
(async()=>{
 const directory=process.env.FORGE_RENDER_OUTPUT||'/tmp/forge-deep-scenes';await fs.mkdir(directory,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const reports=[];
 try{for(const [name,selection,asset] of variants){
  if(process.env.FORGE_RENDER_CASE&&!name.includes(process.env.FORGE_RENDER_CASE))continue;
  const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(60000);const errors=[],assets=[],imageTlsWarnings=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{
   if(message.type()!=='error'||message.location().url.startsWith('https://raw.githubusercontent.com/'))return;
   if(message.text().includes('ERR_CERT_AUTHORITY_INVALID')&&message.location().url.startsWith('https://'))imageTlsWarnings.push(message.location().url);
   else errors.push(message.text());
  });
  page.on('response',response=>{if(response.url().includes('/models/noctua/'))assets.push({url:response.url(),status:response.status()});});
  await context.route('https://raw.githubusercontent.com/**',route=>route.abort());
  await page.addInitScript(selection=>localStorage.setItem('forge-workbench-v1',JSON.stringify({selection,animated:false})),{...defaults,...selection});
  await page.goto(process.env.FORGE_TEST_URL||'http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
  const scene=page.locator('.visualizer .pc-scene');await scene.locator('canvas').waitFor();await scene.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.evaluate(()=>new Promise(resolve=>{let frames=0;const next=()=>++frames===4?resolve():requestAnimationFrame(next);requestAnimationFrame(next);}));
  const metrics=await scene.evaluate(el=>({calls:+el.dataset.renderCalls,triangles:+el.dataset.renderTriangles}));
  assert.ok(metrics.calls>0&&metrics.calls<500,`${name}: ${metrics.calls} calls`);
  assert.ok(metrics.triangles>0&&metrics.triangles<150000,`${name}: ${metrics.triangles} triangles`);
  if(asset)assert.ok(assets.some(item=>item.url.endsWith(asset+'.glb')&&item.status===200),`${name}: manufacturer asset loaded`);
  await waitForHardwarePixels(page);
  await page.locator('.visualizer').screenshot({path:`${directory}/${name}-assembled.png`,timeout:60000});
  await page.getByRole('button',{name:'Vue éclatée',exact:true}).click();await page.waitForTimeout(1200);
  await waitForHardwarePixels(page);
  await page.locator('.visualizer').screenshot({path:`${directory}/${name}-exploded.png`,timeout:60000});
  assert.deepEqual(errors,[],name+' renderer errors');reports.push({name,...metrics,assets,imageTlsWarnings});console.log('PASS',name,metrics);await context.close();
 }
 await fs.writeFile(directory+'/metrics.json',JSON.stringify(reports,null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
