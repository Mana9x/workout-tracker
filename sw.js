const V="sh-v1",FONTS="sh-fonts",CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // network first so a new upload shows up right away; cache is the offline fallback
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
  }else if(/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m);return m||f})));
  }
});
