// Public-browser checks for model grouping, finish selection and precise RAM filters.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chooseOpenCatalogProduct, openCatalogProductDetail } = require('./catalog-test-helpers.cjs');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-variants-validation';
const oracle = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import { catalog } from './src/data/catalog.ts';
  import { getCatalogGroups, getVariantGroupId, getVariantLabel } from './src/lib/catalogVariants.ts';
  import { getMemoryDetails } from './src/lib/memoryDetails.ts';
  console.log(JSON.stringify({components:catalog.map(c=>({id:c.id,name:c.name,brand:c.brand,category:c.category,
    group:getVariantGroupId(c),groupName:c.variantGroupName||c.name,finish:getVariantLabel(c),
    memoryType:c.memoryType,memory:getMemoryDetails(c),source:c.source,price:c.price})),
    groups:getCatalogGroups().map(g=>({id:g.id,name:g.name,category:g.category,variants:g.variants.map(c=>c.id)}))}));
`], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
const byId = new Map(oracle.components.map(c=>[c.id,c]));
const modelCount = rows => new Set(rows.map(c=>c.group)).size;
const rgbBlack = byId.get('import-ram-23d5bd7fb588');
const rgbWhite = byId.get('import-ram-d9d314ba116a');
const oem = byId.get('oem-ram-samsung-m378a2k43eb1-cwe');

(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,
    args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const results=[], errors=[];
  let page, context;
  const watch = p=>{page=p;page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));};
  const modal=()=>page.getByRole('dialog');
  const memory=()=>page.locator('.memory-configurator');
  const scene=()=>page.locator('.studio-visualizer .pc-scene');
  const selection=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('forge-workbench-v1')).selection);
  const test=async(name,run)=>{
    if(process.env.FORGE_VARIANTS_TEST_MATCH&&!new RegExp(process.env.FORGE_VARIANTS_TEST_MATCH).test(name))return;
    try{await run();results.push({name,result:'PASS'});console.log('PASS',name);}
    catch(error){results.push({name,result:'FAIL',error:error.message});console.error('FAIL',name,error.message);
      await page.screenshot({timeout:60000,path:path.join(output,`variants-failure-${results.length}.png`)}).catch(()=>{});
      await page.keyboard.press('Escape').catch(()=>{});}
  };
  const open=async(category)=>{
    const close=page.getByRole('button',{name:'Fermer le catalogue',exact:true});
    if(await close.isVisible().catch(()=>false))await close.click();
    await page.getByRole('button',{name:`Choisir ${category}`,exact:true}).click();
    await modal().locator('.catalog-product').first().waitFor();
  };
  const choose=async(row)=>{
    await open({ram:'Mémoire vive',case:'Boîtier',cpu:'Processeur',motherboard:'Carte mère'}[row.category]);
    await chooseOpenCatalogProduct(page,row.name);
  };
  const filter=async(name,value)=>modal().getByRole('combobox',{name,exact:true}).selectOption(value);
  const count=async()=>parseInt(await modal().locator('.cp-results-summary [role="status"]').textContent(),10);
  const rows=async()=>{
    const ids=await modal().locator('.catalog-product').evaluateAll(nodes=>nodes.map(n=>n.dataset.componentId));
    return ids.map(id=>{assert.ok(byId.has(id));return byId.get(id);});
  };
  const assertResults=async(expected)=>{
    assert.equal(await count(),modelCount(expected));
    const eligible=new Set(expected.map(c=>c.id));
    const visible=await rows();
    assert.equal(visible.length,Math.min(36,modelCount(expected)));
    assert.ok(visible.every(c=>eligible.has(c.id)));
    assert.equal(modelCount(visible),visible.length);
  };
  const reset=async()=>{
    const close=page.getByRole('button',{name:'Fermer le catalogue',exact:true});
    if(await close.isVisible().catch(()=>false))await close.click();
    await page.getByRole('button',{name:'Réinitialiser',exact:true}).click();
    await modal().getByRole('button',{name:'Réinitialiser',exact:true}).click();
    await modal().waitFor({state:'hidden'});
  };
  const installCount=async(n)=>{
    await memory().getByRole('button',{name:`Installer ${n} barrettes`,exact:true}).click();
    await page.waitForFunction(n=>document.querySelector('.memory-configurator')?.dataset.installedCount===String(n),n);
  };
  const screenshot=async(name,target=page)=>target.screenshot({timeout:60000,path:path.join(output,name)});
  try{
    context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
    watch(await context.newPage());await page.goto(baseUrl,{waitUntil:'domcontentloaded'});await memory().waitFor();

    await test('Capacity per module selects 16 Go sticks independently of 32 Go kit totals',async()=>{
      await open('Mémoire vive');
      await filter('Filtrer par capacité par barrette','16');
      const perModule=oracle.components.filter(c=>c.category==='ram'&&c.memory.capacityPerModuleGB===16);
      await assertResults(perModule);
      assert.ok(perModule.some(c=>c.memory.totalCapacityGB===16));
      assert.ok(perModule.some(c=>c.memory.totalCapacityGB===32));
      assert.ok(perModule.some(c=>c.memory.totalCapacityGB===64));
      await filter('Filtrer par capacité','32');
      const kits=perModule.filter(c=>c.memory.totalCapacityGB===32);
      await assertResults(kits);assert.ok((await rows()).every(c=>c.memory.modulesPerKit===2));
      await screenshot('desktop-16gb-modules-32gb-kits.png');
    });

    await test('Samsung UDIMM 3200 distinguishes proven 16 Go 1Rx8 and 2Rx8 and draws bare green PCB',async()=>{
      await open('Mémoire vive');
      for(const [name,value] of [['Filtrer par marque','Samsung'],['Filtrer par génération mémoire','DDR4'],
        ['Filtrer par capacité par barrette','16'],['Filtrer par type de module mémoire','UDIMM'],['Filtrer par débit mémoire','3200']])await filter(name,value);
      for(const organization of ['1Rx8','2Rx8']){
        await filter('Filtrer par organisation mémoire',organization);
        const expected=oracle.components.filter(c=>c.category==='ram'&&c.brand==='Samsung'&&c.memory.capacityPerModuleGB===16&&c.memory.moduleKind==='UDIMM'&&c.memory.transferRateMTs===3200&&c.memory.organization===organization);
        assert.ok(expected.length>0);await assertResults(expected);
        assert.ok((await rows()).every(c=>c.memory.organization===organization));
      }
      assert.equal(await count(),1);assert.equal((await rows())[0].id,oem.id);
      const art=modal().locator('.catalog-product svg[data-component-id]');
      assert.equal(await art.getAttribute('data-component-id'),oem.id);
      assert.equal(await art.locator('[data-ram-construction="bare"]').count(),1);
      await modal().locator('.catalog-product').getByRole('button',{name:/^Détails de /}).click();
      const details=await modal().locator('.cp-detail-specs').textContent();
      for(const text of ['16 Go','UDIMM','2Rx8','1,2 V','M378A2K43EB1-CWE'])assert.ok(details.includes(text),text);
      assert.match(details,/1[\s\u00a0\u202f]?600 MHz/);
      assert.equal(await modal().locator('.cp-source a').getAttribute('href'),oem.source.url);
      assert.match(oem.source.url,/a5391203743ec9a263fe922d8a9fd55ad7891c68/);
      assert.match(await modal().locator('.cp-detail-price').textContent(),/Prix non renseigné/);
      await modal().locator('.cp-detail-art').scrollIntoViewIfNeeded();
      await screenshot('desktop-samsung-16gb-2rx8-detail.png');
    });

    await test('One 4000D model previews both finishes without installing then saves the chosen white case',async()=>{
      await open('Boîtier');
      await modal().getByPlaceholder('Rechercher un composant…').fill('4000D');
      const card=modal().locator(`[data-group-id=${JSON.stringify(byId.get('case-4000d').group)}]`);
      assert.equal(await card.count(),1);
      assert.equal(await card.locator('h3').textContent(),'4000D Airflow');
      const before=await selection();
      await card.getByRole('button',{name:'Aperçu Noir',exact:true}).click();
      const blackSvg=await card.locator('svg[data-component-id]').evaluate(e=>e.outerHTML);
      await card.getByRole('button',{name:'Aperçu Blanc',exact:true}).click();
      assert.equal(await card.getAttribute('data-component-id'),'case-4000d-white');
      assert.notEqual(await card.locator('svg[data-component-id]').evaluate(e=>e.outerHTML),blackSvg);
      assert.deepEqual(await selection(),before);
      await card.getByRole('button',{name:/^Détails de /}).click();
      const finishes=modal().getByRole('group',{name:'Coloris disponibles',exact:true});
      const whitePrice=await modal().locator('.cp-detail-price strong').textContent();
      await finishes.getByRole('button',{name:'Coloris Noir',exact:true}).click();
      assert.notEqual(await modal().locator('.cp-detail-price strong').textContent(),whitePrice);
      assert.equal(await modal().locator('.cp-detail-art svg').getAttribute('data-component-id'),'case-4000d');
      await finishes.getByRole('button',{name:'Coloris Blanc',exact:true}).click();
      assert.equal(await modal().locator('.cp-detail-art svg').getAttribute('data-component-id'),'case-4000d-white');
      assert.deepEqual(await selection(),before);
      await modal().locator('.cp-detail-art').scrollIntoViewIfNeeded();await screenshot('desktop-white-case-finish-detail.png');
      await modal().locator('.cp-detail-actions').getByRole('button',{name:'Choisir',exact:true}).click();
      await modal().waitFor({state:'hidden'});
      assert.equal((await selection()).case,'case-4000d-white');
      assert.equal(await scene().getAttribute('data-case-id'),'case-4000d-white');
      await page.getByRole('button',{name:/^Enregistrer↗?$/}).click();
      await modal().getByRole('textbox',{name:'Nom de la configuration'}).fill('Finition blanche vérifiée');
      await modal().getByRole('button',{name:'Enregistrer ma configuration',exact:true}).click();
      await choose(byId.get('case-4000d'));
      await page.getByRole('button',{name:'Mes configurations',exact:true}).first().click();
      await modal().locator('.saved-build').filter({hasText:'Finition blanche vérifiée'}).getByRole('button',{name:'Charger',exact:true}).click();
      await page.reload({waitUntil:'domcontentloaded'});await memory().waitFor();
      assert.equal((await selection()).case,'case-4000d-white');
      assert.equal(await scene().getAttribute('data-case-id'),'case-4000d-white');
      await scene().scrollIntoViewIfNeeded();await screenshot('desktop-white-case-3d.png',scene());
    });

    await test('Changing RAM finish preserves four installed modules and later preserves a mixed reference',async()=>{
      await reset();assert.equal(rgbBlack.group,rgbWhite.group);
      await choose(rgbBlack);await installCount(4);
      const before=await selection();assert.deepEqual(before.memory.slots,Array(4).fill(rgbBlack.id));
      await choose(rgbWhite);
      assert.deepEqual((await selection()).memory.slots,Array(4).fill(rgbWhite.id));
      assert.equal(await scene().getAttribute('data-ram-count'),'4');
      assert.equal(await scene().getAttribute('data-ram-capacity'),'64');
      assert.equal(await scene().getAttribute('data-ram-models'),Array(4).fill(rgbWhite.id).join(','));
      await memory().locator('[data-memory-slot="3"]').click();
      const picker=memory().locator('.mc-picker');
      await picker.getByRole('searchbox').fill('Vengeance RGB 32 Go DDR5');
      await picker.getByRole('button',{name:'Installer une barrette Corsair Vengeance RGB 32 Go DDR5 en B2',exact:true}).click();
      const mixed=await selection();assert.deepEqual(mixed.memory.slots,[rgbWhite.id,rgbWhite.id,rgbWhite.id,'ram-ddr5-32']);
      await choose(rgbBlack);
      assert.deepEqual((await selection()).memory.slots,[rgbBlack.id,rgbBlack.id,rgbBlack.id,'ram-ddr5-32']);
      assert.equal(await scene().getAttribute('data-ram-count'),'4');
      await page.reload({waitUntil:'domcontentloaded'});await memory().waitFor();
      assert.deepEqual((await selection()).memory.slots,[rgbBlack.id,rgbBlack.id,rgbBlack.id,'ram-ddr5-32']);
      await memory().scrollIntoViewIfNeeded();await screenshot('desktop-four-ram-mixed-after-finish.png',memory());
    });

    await test('Per-slot capacity and finish selectors preview a 16 Go stick before explicit installation',async()=>{
      await reset();await memory().locator('[data-memory-slot="0"]').click();
      const picker=memory().locator('.mc-picker');
      await picker.getByRole('combobox',{name:'Capacité par barrette dans cet emplacement',exact:true}).selectOption('16');
      const expected=oracle.components.filter(c=>c.category==='ram'&&c.memoryType==='DDR5'&&c.memory.capacityPerModuleGB===16);
      assert.equal(parseInt(await picker.getByRole('status').textContent(),10),modelCount(expected));
      for(const spec of await picker.locator('.mc-result-specs').allTextContents())assert.match(spec,/16 Go par barrette/);
      await picker.getByRole('searchbox').fill(rgbBlack.groupName);
      const card=picker.locator(`[data-group-id=${JSON.stringify(rgbBlack.group)}]`);
      assert.equal(await card.count(),1);const before=await selection();
      await card.getByRole('combobox',{name:`Finition de ${rgbBlack.groupName}`,exact:true}).selectOption(rgbWhite.id);
      assert.deepEqual(await selection(),before);
      await card.getByRole('button',{name:`Installer une barrette Corsair ${rgbWhite.name} en A1`,exact:true}).click();
      assert.equal((await selection()).memory.slots[0],rgbWhite.id);
      assert.equal(await scene().getAttribute('data-ram-capacity'),'48');
    });

    await test('Selected OEM RAM appears as real 16 Go modules in the 3D scene and canvas hover',async()=>{
      await reset();await choose(byId.get('cpu-5600'));await choose(byId.get('mb-b550'));await choose(oem);await installCount(2);
      assert.equal(await scene().getAttribute('data-ram-models'),`${oem.id},${oem.id}`);
      assert.equal(await scene().getAttribute('data-ram-capacity'),'32');
      await page.getByRole('button',{name:'Vue de profil',exact:true}).click();
      const exploded=page.getByRole('button',{name:'Vue éclatée',exact:true});
      if(await exploded.getAttribute('aria-pressed')!=='true')await exploded.click();
      await scene().scrollIntoViewIfNeeded();await page.mouse.move(2,2);await page.waitForTimeout(900);
      const bounds=await scene().locator('canvas').boundingBox();assert.ok(bounds&&bounds.width>300);
      let hit;const seen=new Set();
      for(const y of [.35,.4,.3,.45,.25,.5]){
        for(let i=0;i<71;i++){
          const point={x:bounds.x+bounds.width*(.28+i*.006),y:bounds.y+bounds.height*y};
          await page.mouse.move(point.x,point.y);await page.waitForTimeout(25);
          const category=await scene().getAttribute('data-hover-category');if(category)seen.add(category);
          if(category==='ram'){hit=point;break;}
        }if(hit)break;
      }
      assert.ok(hit,`Real canvas must raycast OEM RAM. Seen: ${[...seen]}`);
      const tooltip=await scene().locator('.pc-hover-card').textContent();
      assert.match(tooltip,/M378A2K43EB1-CWE/);assert.match(tooltip,/16 Go par barrette/);
      await screenshot('desktop-samsung-bare-ram-3d-hover.png',scene());
      await fs.writeFile(path.join(output,'oem-ram-hover.json'),JSON.stringify({hit,tooltip},null,2));
    });

    await context.close();context=undefined;
    await test('At 360px RAM filters, bare OEM detail and case finish controls stay navigable',async()=>{
      context=await browser.newContext({viewport:{width:360,height:844},deviceScaleFactor:1,isMobile:true,reducedMotion:'reduce'});
      watch(await context.newPage());await page.goto(baseUrl,{waitUntil:'domcontentloaded'});await memory().waitFor();
      await open('Mémoire vive');
      for(const [name,value] of [['Filtrer par capacité par barrette','16'],['Filtrer par marque','Samsung'],['Filtrer par type de module mémoire','UDIMM'],['Filtrer par organisation mémoire','2Rx8']])await filter(name,value);
      assert.equal(await count(),1);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360);
      await modal().locator('.cp-specific-filters').scrollIntoViewIfNeeded();await screenshot('mobile-ram-filters-360.png');
      await modal().locator('.catalog-product').getByRole('button',{name:/^Détails de /}).click();
      assert.equal(await modal().locator('.cp-detail-art svg').getAttribute('data-component-id'),oem.id);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360);
      await modal().locator('.cp-detail-art').scrollIntoViewIfNeeded();await screenshot('mobile-samsung-detail-360.png');
      await open('Boîtier');await openCatalogProductDetail(page,'4000D Airflow');
      await modal().getByRole('button',{name:'Coloris Blanc',exact:true}).click();
      const finishes=modal().getByRole('group',{name:'Coloris disponibles',exact:true});
      await finishes.scrollIntoViewIfNeeded();
      const box=await finishes.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=361);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360);
      await screenshot('mobile-case-finishes-360.png');
    });
    await test('No uncaught browser errors in finish and RAM flows',async()=>assert.deepEqual(errors,[]));
    await fs.writeFile(path.join(output,'variants-results.json'),JSON.stringify({baseUrl,results,errors},null,2));
    if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
  }finally{if(context)await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
