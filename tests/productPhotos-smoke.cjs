// Real browser image loading and error recovery, independently of the WebGL scene.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
body{background:#101815;color:#edf2ea;font:14px Arial;margin:24px}#root{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{background:#202c27;border:1px solid #43534a;border-radius:16px;padding:18px}svg{width:100%;height:260px}.card p{margin:8px 0}
</style></head><body><div id="root"></div><script type="module">
import RefreshRuntime from '/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;
const React=(await import('/node_modules/.vite/deps/react.js')).default;
const {createRoot}=(await import('/node_modules/.vite/deps/react-dom_client.js')).default;
const {default:ProductArt}=await import('/src/components/ProductArt.tsx');
const {catalog,getComponent}=await import('/src/data/catalog.ts');
const {getProductImage}=await import('/src/data/productImages.ts');
const root=createRoot(document.getElementById('root'));
window.renderPhotoReview=(ids)=>root.render(React.createElement(React.Fragment,null,...ids.map(id=>{const component=getComponent(id);return React.createElement('article',{key:id,className:'card'},React.createElement(ProductArt,{component,category:component.category,detailed:true}),React.createElement('p',null,component.name),React.createElement('small',null,getProductImage(id)?.inspection??'Illustration du boîtier physique'));})));
window.photoSamples=['cooler-nhd15',catalog.find(c=>getProductImage(c)?.imageURL.includes('static.gigabyte.com')).id,catalog.find(c=>getProductImage(c)?.imageURL.includes('inno3d.com')).id,'cpu-7800x3d'];
window.renderPhotoReview(window.photoSamples);
</script></body></html>`;
(async()=>{
 const output=process.env.FORGE_ICON_OUTPUT||'release/core-icon-review';await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-features=LocalNetworkAccessChecks,LocalNetworkAccessChecksWebSockets']});
 try{
  // The managed test runner's HTTPS proxy is not in Chromium's certificate store.
  // This affects this isolated test context only, never the shipped application.
  const context=await browser.newContext({viewport:{width:1300,height:850},ignoreHTTPSErrors:true});const page=await context.newPage();const errors=[];const network=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('Failed to load resource'))errors.push(message.text());});
  page.on('requestfailed',request=>network.push({url:request.url(),reason:request.failure()?.errorText}));
  await page.route('**/icon-photo-review',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto((process.env.FORGE_TEST_URL||'http://127.0.0.1:5173')+'/icon-photo-review');
  try{await page.waitForFunction(()=>['cooler-nhd15','mb-b760-ds3h-ddr4'].every(id=>document.querySelector('svg[data-component-id="'+id+'"]')?.dataset.artMode==='manufacturer-photo'),{},{timeout:45000});}
  catch(error){await page.screenshot({path:output+'/photo-loading-debug.png',fullPage:true});await fs.writeFile(output+'/photo-loading-debug.json',JSON.stringify({errors,network,body:await page.locator('body').innerText(),states:await page.locator('svg').evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.componentId,mode:node.dataset.artMode,href:node.querySelector('image')?.getAttribute('href')})))},null,2));throw error;}
  const samples=await page.evaluate(()=>window.photoSamples);
  // Inno3D's CDN intermittently denies requests from the managed network. Its
  // natural fallback is recorded; Noctua/Gigabyte success above is mandatory.
  await page.waitForFunction(()=>document.querySelectorAll('svg[data-art-mode="manufacturer-photo"]').length===3,{},{timeout:10000}).catch(()=>{});
  assert.equal(await page.locator('svg[data-component-id="cpu-7800x3d"]').getAttribute('data-art-mode'),'illustration');
  assert.equal(await page.locator('svg[data-art-mode="manufacturer-photo"] [data-art-part="hardware"]').first().getAttribute('opacity'),'0');
  await page.screenshot({path:output+'/manufacturer-photos.png',fullPage:true});
  const loadedPhotos=await page.locator('svg[data-art-mode="manufacturer-photo"]').evaluateAll(nodes=>nodes.map(node=>node.dataset.componentId));
  const photoStates=await page.locator('svg').evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.componentId,mode:node.dataset.artMode})));
  // A new exact photo whose request fails must leave its reconstructed product visible.
  await page.route('https://cdn.noctua.at/media/nh_d12l_1.jpg',route=>route.abort());
  await page.evaluate(()=>window.renderPhotoReview(['cooler-nhd12l']));
  await page.waitForFunction(()=>document.querySelector('svg[data-component-id="cooler-nhd12l"]'));
  await page.waitForTimeout(500);
  assert.equal(await page.locator('svg').getAttribute('data-art-mode'),'illustration');
  assert.equal(await page.locator('[data-art-part="hardware"]').getAttribute('opacity'),'1');
  assert.equal(await page.locator('[data-art-part="manufacturer-photo"]').getAttribute('opacity'),'0');
  assert.ok(await page.locator('[data-art-part="asymmetric-front-tower"]').count());
  await page.screenshot({path:output+'/photo-failure-fallback.png'});
  assert.deepEqual(errors,[]);
  await fs.writeFile(output+'/photo-browser-report.json',JSON.stringify({loadedPhotos,photoStates,illustration:samples[3],errorFallback:'cooler-nhd12l',errors,network},null,2));
  console.log(JSON.stringify({loadedPhotos:loadedPhotos.length,verifiedFallback:true,errors}));
  await context.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
