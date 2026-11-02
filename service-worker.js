/* Offline support for the static productivity reference site. */
const CACHE_NAME="macbook-productivity-v7-20261102-english-only";
const STATIC_ASSETS=[
  "./","./index.html","./styles.css?v=20261102-7","./app.js?v=7","./search.js?v=6","./search-terms.js?v=6","./related-tips.js?v=6","./tip-page.js?v=7",
  "./content.js","./lesson-media.js?v=20261102-4","./favicon.svg?v=20261102-3",
  "./print.html","./print.js","./manifest.webmanifest"
];
self.addEventListener("install",event=>event.waitUntil(
  caches.open(CACHE_NAME).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener("activate",event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("macbook-productivity-")&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
  const url=new URL(request.url);
  if(request.mode==="navigate"){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(url.pathname,copy)).catch(()=>{});}
      return response;
    }).catch(async()=>{
      const cache=await caches.open(CACHE_NAME);
      return await cache.match(url.pathname)||await cache.match("./index.html");
    }));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok&&[".js",".css",".svg",".webmanifest"].some(ext=>url.pathname.endsWith(ext))){
      const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(request,copy)).catch(()=>{});
    }
    return response;
  })));
});
