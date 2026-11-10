const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs/promises');
const defaults=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',"import {defaultSelection} from './src/data/catalog.ts';console.log(JSON.stringify(defaultSelection));"],{encoding:'utf8'}));
const selection={...defaults,motherboard:'import-mb-fd057324a4a8',gpu:'import-gpu-a682aa002297',ram:'import-ram-8b162aa67690',storage:'import-ssd-8a91162ac077',psu:'import-psu-3f7709be66e0'};
(async()=>{
 await fs.mkdir('/tmp/forge-individual-3d',{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});page.setDefaultTimeout(40000);
  await page.route('https://raw.githubusercontent.com/**',route=>route.abort());
  await page.addInitScript(selection=>localStorage.setItem('forge-workbench-v1',JSON.stringify({selection,animated:false})),selection);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.FORGE_TEST_URL||'http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
  const scene=page.locator('.visualizer .pc-scene');await scene.locator('canvas').waitFor();
  for(const [attribute,value] of Object.entries({'data-board-design':'steel-legend-b850','data-gpu-design':'steel-legend-rx9060xt','data-gpu-fans':'3','data-ram-design':'crucial-pro-overclocking,crucial-pro-overclocking','data-storage-design':'samsung-9100-pro','data-psu-design':'power-zone-2'}))assert.equal(await scene.getAttribute(attribute),value,attribute);
  await page.locator('.visualizer').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
  await page.locator('.visualizer').screenshot({path:'/tmp/forge-individual-3d/assembled.png',timeout:60000});
  await page.getByRole('button',{name:'Vue éclatée',exact:true}).click();await page.waitForTimeout(1000);
  await page.locator('.visualizer').screenshot({path:'/tmp/forge-individual-3d/exploded.png',timeout:60000});
  assert.deepEqual(errors,[]);
  console.log('PASS five individual 3D designs, exact fan/module count, assembled and exploded render, no page errors');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
