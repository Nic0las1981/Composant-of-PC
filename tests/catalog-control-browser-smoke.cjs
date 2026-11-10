const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {openCatalogProductDetail}=require('./catalog-test-helpers.cjs');
const targets=JSON.parse(execFileSync(process.execPath,['--import','tsx','--input-type=module','-e',`
import {catalog,categories} from './src/data/catalog.ts';
import {verifiedBulk} from './src/data/verifiedBulk.ts';
import {verifiedProducts} from './src/data/verifiedCatalog.ts';
import {catalogControlOutcomes} from './src/data/catalogControl.ts';
const counts=new Map();for(const c of catalog)counts.set(c.name,(counts.get(c.name)||0)+1);
const statuses=['primary_match','no_exact_match','ambiguous_variants','conflicting_reference'];
console.log(JSON.stringify(statuses.map(status=>{
const c=catalog.find(c=>counts.get(c.name)===1 && catalogControlOutcomes[c.id]?.status===status && (status==='primary_match'?verifiedBulk[c.id]:!verifiedProducts[c.id]));
if(!c)throw Error('Missing representative '+status);
return {name:c.name,status,label:categories.find(cat=>cat.id===c.category).label,mpn:verifiedBulk[c.id]?.mpn};
})));
`],{encoding:'utf8'}));

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   await context.route('https://raw.githubusercontent.com/**',route=>route.abort());
   const page=await context.newPage();page.setDefaultTimeout(30000);
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(process.env.FORGE_TEST_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
   await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
   for(const target of targets){
    await page.getByRole('button',{name:'Choisir '+target.label,exact:true}).click();
    await openCatalogProductDetail(page,target.name);
    const control=page.getByRole('region',{name:'État du contrôle de la référence',exact:true});
    assert.equal(await control.getAttribute('data-control-status'),target.status);
    assert.match(await control.textContent(),/Recherche PcComponentes effectuée/);
    const sources=page.getByRole('region',{name:'Références et offres vérifiées',exact:true});
    if(target.mpn){await sources.waitFor();assert.ok((await sources.textContent()).includes(target.mpn));}
    else assert.equal(await sources.count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.keyboard.press('Escape');
   }
   console.log('PASS primary, unmatched, ambiguous and conflicting references '+width+'px');
   await context.close();
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
