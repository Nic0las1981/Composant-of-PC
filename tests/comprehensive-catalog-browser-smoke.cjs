const {chromium}=require('playwright');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const {openCatalogProductDetail}=require('./catalog-test-helpers.cjs');
const targets=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',`
import{getComponent,categories}from './src/data/catalog.ts';
console.log(JSON.stringify(['mb-b550m-pro4','import-gpu-9258d48099b0','import-ssd-c684100ebdf8','cooler-ak620','cooler-silentloop2-360'].map(id=>{const c=getComponent(id);return{id,name:c.name,mpn:c.manufacturerPartNumber,label:categories.find(v=>v.id===c.category).label}})));
`],{encoding:'utf8'}));
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[];
 try{for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  await context.route('https://raw.githubusercontent.com/**',r=>r.abort());
  const page=await context.newPage();page.setDefaultTimeout(45000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.FORGE_TEST_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
  for(const target of targets){
   await page.getByRole('button',{name:'Choisir '+target.label,exact:true}).click();await openCatalogProductDetail(page,target.name);
   const dialog=page.getByRole('dialog');const review=page.getByRole('region',{name:'État du contrôle de la référence',exact:true});
   const source=page.getByRole('region',{name:'Références et offres vérifiées',exact:true});
   if(target.id==='import-ssd-c684100ebdf8'){
    assert.equal(await review.getAttribute('data-control-status'),'identity_conflict');assert.equal(await source.count(),0);
    assert.match(await dialog.locator('.cp-detail-price').textContent(),/Prix non renseigné/);
   }else{
    assert.equal(await review.getAttribute('data-control-status'),'individual_review');assert.ok((await source.textContent()).includes(target.mpn));
    if(target.id==='mb-b550m-pro4'){
     const specs=await dialog.locator('.cp-detail-specs').textContent();assert.match(specs,/RTL8111H/);assert.match(specs,/ALC1200/);assert.match(specs,/DisplayPort/);
    }
    if(target.id==='import-gpu-9258d48099b0'){assert.equal(target.mpn,'G506T-16GTCW');assert.equal(await source.locator('.cp-verified-offers').count(),0);}
    if(target.id==='cooler-ak620')assert.equal(target.mpn,'R-AK620-BKNNMT-G');
    if(target.id==='cooler-silentloop2-360')assert.match(await dialog.locator('.cp-detail-specs').textContent(),/27 mm hors ventilateurs/);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.keyboard.press('Escape');
  }
  console.log('PASS complete manual sections, exact white SKU, quarantined 4 TB price, corrected cooler identities '+width+'px');await context.close();
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
