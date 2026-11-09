// Selection-specific 3D validation using real canvas pointer events.
// Run with Vite or static hosting ready: node tests/scene-smoke.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-studio-validation';

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = [];
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('pageerror', error => errors.push(error.message));
    const dialog = () => page.getByRole('dialog');
    const scene = () => page.locator('.visualizer .pc-scene');
    const capture = async name => {
      await page.mouse.move(3, 3);
      await page.locator('.visualizer').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.locator('.visualizer').screenshot({ path: path.join(output, name + '.png') });
    };
    const open = async category => {
      await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
      await dialog().locator('.catalog-product').first().waitFor();
    };
    const chooseOpen = async name => {
      const card = dialog().locator('.catalog-product').filter({ has: page.getByRole('heading', { name, exact: true }) });
      assert.equal(await card.count(), 1, `Catalog must contain exactly one ${name}`);
      await card.getByRole('button', { name: 'Choisir', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
    };
    const choose = async (category, name) => { await open(category); await chooseOpen(name); };
    const test = async (name, run) => {
      try { await run(); results.push({name, result: 'PASS'}); console.log('PASS', name); }
      catch (error) {
        results.push({name, result: 'FAIL', error: error.message});
        console.error('FAIL', name, error.message);
        await page.screenshot({path:path.join(output, `scene-failure-${results.length}.png`), fullPage:true}).catch(()=>{});
        await page.keyboard.press('Escape').catch(()=>{});
      }
    };
    // Real raycast interaction: move the browser pointer over visible canvas pixels,
    // then read the tooltip produced by the component's event handlers.
    const hoverHardware = async (preferred = ['gpu', 'cooler', 'case', 'ram', 'motherboard']) => {
      await page.locator('.visualizer canvas').scrollIntoViewIfNeeded();
      await page.mouse.move(3,3);
      await page.waitForTimeout(700);
      const bounds = await page.locator('.visualizer canvas').boundingBox();
      assert.ok(bounds && bounds.width > 100 && bounds.height > 100);
      const axes = [.5,.4,.6,.3,.7,.25,.75,.2,.8];
      const seen = new Set();
      for (const y of axes) for (const x of axes) {
        const point = {x:bounds.x + bounds.width*x,y:bounds.y + bounds.height*y};
        await page.mouse.move(point.x, point.y);
        await page.waitForTimeout(70);
        const category = await scene().getAttribute('data-hover-category');
        if (category) seen.add(category);
        if (preferred.includes(category) && await scene().locator('.pc-hover-card').isVisible()) {
          const label = await scene().locator('.pc-hover-card strong').textContent();
          return {...point, category, label};
        }
      }
      throw Error('No requested hardware hover found through actual canvas pointer movement. Seen: ' + [...seen].join(', '));
    };
    await page.goto(baseUrl, {waitUntil:'domcontentloaded'});
    await page.getByRole('heading', {name:'Votre PC. Vos règles.'}).waitFor();
    await page.locator('.visualizer canvas').waitFor();
    if (process.env.FORGE_SCENE_MOBILE_ONLY !== '1') {
    // Geometry and raycast comparisons use a stable camera; motion-smoke exercises live animation.
    const animations = page.locator('.studio-view-toolbar .animation-toggle');
    if (await animations.getAttribute('aria-pressed') === 'true') await animations.click();
    await test('Default H6 panorama, dual-fan GPU and real air cooler are selected', async () => {
      assert.equal(await scene().getAttribute('data-case-id'),'case-h6');
      assert.equal(await scene().getAttribute('data-case-model'),'panoramic');
      assert.equal(await scene().getAttribute('data-gpu-fans'),'2');
      assert.equal(await scene().getAttribute('data-cooler-model'),'dual-tower');
      await capture('scene-h6-air');
    });
    await test('Real pointer hover names hardware and clicking selects the same component', async () => {
      const hit = await hoverHardware();
      assert.ok(hit.label.trim().length > 8);
      assert.match(hit.label, /H6 Flow|4070 SUPER|Phantom Spirit|Vengeance|B650/);
      await page.mouse.click(hit.x, hit.y);
      const selectedName = await page.locator('.scene-selection-bar .selected-part-copy strong').textContent();
      assert.ok(hit.label.includes(selectedName), `${hit.label} must identify selected ${selectedName}`);
      const shortcut = page.locator('.scene-part-shortcuts button[aria-pressed="true"]');
      assert.equal(await shortcut.count(),1);
      await fs.writeFile(path.join(output,'hover-default.json'),JSON.stringify(hit,null,2));
      // Mouse hover again after the click restores the real hover card for evidence.
      await page.mouse.move(hit.x+2,hit.y+2);
      await page.waitForTimeout(150);
      await page.locator('.visualizer').screenshot({path:path.join(output,'scene-hover-name.png')});
    });
    await test('Case replacement changes the modeled geometry across Terra, white 4000D and North', async () => {
      for(const [name,id,kind,file] of [
        ['Terra','case-terra','sandwich','scene-terra'],
        ['4000D Airflow · Blanc','case-4000d-white','airflow','scene-white-4000d'],
        ['North · Charcoal Black','case-north','wood-front','scene-north']
      ]) {
        await choose('Boîtier',name);
        assert.equal(await scene().getAttribute('data-case-id'),id);
        assert.equal(await scene().getAttribute('data-case-model'),kind);
        if (id === 'case-terra') {
          // Show a genuinely fitting compact assembly, rather than an ATX board
          // protruding from the deliberately incompatible small case.
          await choose('Processeur', 'Ryzen 5 7600');
          await choose('Carte mère', 'A620I Lightning WiFi');
          await choose('Refroidissement', 'NH-L9a-AM5');
          await choose('Alimentation', 'SF750 · 750 W');
          assert.doesNotMatch(await page.locator('.compatibility-banner strong').textContent(), /incompatibilité/);
        }
        await capture(file);
        if (id === 'case-terra') {
          await page.getByRole('button', {name:'Réinitialiser',exact:true}).click();
          await dialog().getByRole('button', {name:'Réinitialiser',exact:true}).click();
          assert.equal(await scene().getAttribute('data-case-id'),'case-h6');
        }
      }
      const hit = await hoverHardware(['case']);
      assert.match(hit.label,/North/);
      await page.mouse.click(hit.x,hit.y);
      assert.match(await page.locator('.scene-selection-bar .selected-part-copy strong').textContent(),/North/);
      await fs.writeFile(path.join(output,'hover-north.json'),JSON.stringify(hit,null,2));
    });
    await test('GPU replacement changes a two-fan model into a three-fan model', async () => {
      await choose('Carte graphique','GeForce RTX 4080 SUPER Gaming OC');
      assert.equal(await scene().getAttribute('data-gpu-model'),'gpu-4080s');
      assert.equal(await scene().getAttribute('data-gpu-fans'),'3');
      await page.getByRole('button',{name:'Vue de profil',exact:true}).click();
      await capture('scene-three-fan-gpu');
    });
    await test('Watercooling filter selects an AIO with its pump, radiator and tubes', async () => {
      await open('Refroidissement');
      const allCount=await dialog().locator('.catalog-product').count();
      assert.ok(allCount>=15);
      await dialog().getByRole('button',{name:'Watercooling',exact:true}).click();
      assert.equal(await dialog().getByRole('button',{name:'Watercooling',exact:true}).getAttribute('aria-pressed'),'true');
      const count=await dialog().locator('.catalog-product').count();
      assert.ok(count>=8&&count<allCount);
      for(const specs of await dialog().locator('.catalog-product .cp-spec-tags').allTextContents()) assert.match(specs,/Watercooling AIO/);
      await chooseOpen('iCUE H100i ELITE CAPELLIX XT');
      assert.equal(await scene().getAttribute('data-cooler-model'),'aio');
      await page.getByRole('button',{name:'Vue de profil',exact:true}).click();
      await capture('scene-aio-side');
      await page.getByRole('button',{name:'Vue trois quarts',exact:true}).click();
      await capture('scene-aio-perspective');
      // Hardware names must follow the newly selected cooler rather than the default ventirad.
      const hit=await hoverHardware(['cooler']);
      assert.match(hit.label,/H100i ELITE CAPELLIX XT/);
      await page.mouse.click(hit.x,hit.y);
      assert.match(await page.locator('.scene-selection-bar .selected-part-copy strong').textContent(),/H100i ELITE CAPELLIX XT/);
    });
    }
    await context.close();
    await test('Mobile sticky summary, brand and watercooling filters fit 390px and 360px', async () => {
      for(const width of [390,360]) {
        const mobileContext=await browser.newContext({viewport:{width,height:844},isMobile:true,deviceScaleFactor:1});
        try {
          const mobile=await mobileContext.newPage();
          mobile.on('pageerror',error=>errors.push(error.message));
          await mobile.goto(baseUrl,{waitUntil:'domcontentloaded'});
          await mobile.locator('.visualizer canvas').waitFor();
          assert.deepEqual(await mobile.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,inner:innerWidth})),{client:width,scroll:width,inner:width});
          assert.equal(await mobile.locator('.mobile-build-summary').isVisible(),true);
          await mobile.screenshot({path:path.join(output,`mobile-before-controls-${width}.png`)});
          await mobile.locator('.mobile-build-summary').getByRole('button',{name:'Composants',exact:true}).click();
          await mobile.getByRole('button',{name:'Choisir Refroidissement',exact:true}).click();
          const modal=mobile.getByRole('dialog');
          await modal.getByRole('button',{name:'Watercooling',exact:true}).click();
          await modal.getByRole('combobox',{name:'Filtrer par marque',exact:true}).selectOption('Corsair');
          const cards=modal.locator('.catalog-product');
          assert.ok(await cards.count()>=2);
          for(const text of await cards.locator('.cp-brand').allTextContents()) assert.equal(text,'Corsair');
          for(const text of await cards.locator('.cp-spec-tags').allTextContents()) assert.match(text,/Watercooling AIO/);
          assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),width);
          const rect=await modal.boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width);
          await mobile.screenshot({path:path.join(output,`mobile-cooler-filter-${width}.png`),fullPage:false});
          await modal.getByRole('button',{name:'Fermer le catalogue',exact:true}).click();
          await mobile.evaluate(()=>scrollTo(0,0));
          await mobile.mouse.move(0,0);
          await mobile.screenshot({path:path.join(output,`mobile-studio-${width}.png`),fullPage:true});
        } finally {await mobileContext.close();}
      }
    });
    await test('New scene has no uncaught browser runtime errors',async()=>assert.deepEqual(errors,[]));
    await fs.writeFile(path.join(output,'scene-results.json'),JSON.stringify({baseUrl,results,errors},null,2));
    if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
