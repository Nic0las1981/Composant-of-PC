const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const {openCatalogProductDetail} = require('./catalog-test-helpers.cjs');
const url = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';

(async () => {
  await fs.mkdir('/tmp/forge-verified-validation',{recursive:true});
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const errors=[];
  try {
    for (const width of [1440,390]) {
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      await context.route('https://raw.githubusercontent.com/**',route=>route.abort());
      const page=await context.newPage();page.setDefaultTimeout(30000);
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(url,{waitUntil:'domcontentloaded'});
      await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
      await page.getByRole('button',{name:'Choisir Processeur',exact:true}).click();
      await openCatalogProductDetail(page,'Ryzen 7 7800X3D');
      let panel=page.getByRole('region',{name:'Références et offres vérifiées',exact:true});
      await panel.waitFor();
      assert.match(await panel.textContent(),/100-100000910WOF/);
      assert.equal(await panel.locator('.cp-verified-offers li').count(),3);
      assert.match(await panel.locator('[data-retailer="PcComponentes"]').textContent(),/316,36/);
      assert.match(await panel.locator('[data-retailer="Fnac"]').textContent(),/Darty/);
      assert.match(await panel.textContent(),/24 h/);
      assert.equal(await panel.getByRole('link',{name:/Fabricant · AMD/}).count(),1);
      assert.equal(await panel.getByRole('link',{name:/Amazon.fr — MPN relevé, offre non confirmée/}).count(),1);
      assert.equal(await panel.locator('[data-retailer="Amazon"]').count(),0);
      await page.getByRole('region',{name:'État du contrôle de la référence',exact:true}).waitFor();
      await panel.screenshot({path:`/tmp/forge-verified-validation/offers-${width}.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Choisir Mémoire vive',exact:true}).click();
      await openCatalogProductDetail(page,'Vengeance RGB 32 Go DDR5');
      panel=page.getByRole('region',{name:'Références et offres vérifiées',exact:true});
      assert.match(await panel.textContent(),/CMH32GX5M2B6000Z30K/);
      assert.match(await panel.textContent(),/Dernier prix historique · hors budget/);
      assert.match(await page.getByRole('dialog').textContent(),/1,40 V/);
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Choisir Processeur',exact:true}).click();
      await openCatalogProductDetail(page,'Ryzen 7 9800X3D');
      await page.getByRole('dialog').locator('.cp-detail-actions').getByRole('button',{name:'Choisir',exact:true}).click();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.getByRole('heading',{name:'Votre PC. Vos règles.',exact:true}).waitFor();
      assert.match(await page.locator('.part-card').first().textContent(),/9800X3D/);
      assert.match(await page.locator('.part-card').first().textContent(),/396,59/);
      console.log(`PASS sources, exact variants, retired offers, persistence and responsive layout ${width}px`);
      await context.close();
    }
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
