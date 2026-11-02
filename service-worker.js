/* Offline support for static, non-sensitive learning content. */
const CACHE_NAME="macbook-productivity-v4-20261102-visuals";
const STATIC_ASSETS=["./","./index.html","./styles.css?v=20261102-4","./content.js","./lesson-media.js?v=20261102-4","./app.js?v=20261102-4","./favicon.svg?v=20261102-3","./print.html","./print.js","./manifest.webmanifest"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("macbook-productivity-")&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
  const url=new URL(req.url);
  if(req.mode==="navigate"){
    event.respondWith(fetch(req).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(url.pathname,copy)).catch(()=>{});}return resp;}).catch(async()=>{const cache=await caches.open(CACHE_NAME);return await cache.match(url.pathname)||await cache.match("./index.html");}));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(resp=>{if(resp.ok&&[".js",".css",".svg",".webmanifest"].some(ext=>url.pathname.endsWith(ext))){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});}return resp;})));
});