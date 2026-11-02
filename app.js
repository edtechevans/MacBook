/* Search-first MacBook Productivity reference. No assessments, accounts or tracking. */
(function(){
"use strict";
const all=Array.isArray(window.TIPS)?window.TIPS:[];
const byId=new Map(all.map(t=>[t.id,t]));
const engine=window.TIP_SEARCH;
const related=window.RELATED_TIPS||{};
if(engine)engine.build(all);
const cats=["All","MacBook","Outlook","Teams","Chrome"];
const appArt={MacBook:"macbook",Outlook:"outlook",Teams:"teams",Chrome:"chrome"};
const popularIDs=["t22","t24","t41","t48"];
const popularArt={t22:"screen",t24:"outlook",t41:"teams",t48:"chrome"};
const popularTitles={t22:"Capture or record your screen",t24:"Schedule an email for later",t41:"Reduce notifications",t48:"Use tab groups to stay organised"};
const FEATURED=["t22","t24","t41","t48","t51","b01","t16","t28","t17","t31","t45","t50"];
const COLLECTIONS=[
 {title:"Everyday Mac essentials",desc:"Find things, arrange windows and make common tasks faster.",ids:["t16","t17","t21","t22","b01","t19"]},
 {title:"An easier inbox",desc:"Fewer interruptions, better follow-ups and more thoughtful email.",ids:["t24","t25","t27","t28","t31","t37"]},
 {title:"Fewer distractions",desc:"Reduce alerts and keep important conversations within reach.",ids:["t19","t41","t42","t44","t40","t43"]}
];
const SHORTCUTS=[["Search your Mac","⌘ Space","t16"],["Switch apps","⌘ Tab","t17"],["Preview a file","Space","t21"],["Record the screen","⇧ ⌘ 5","t22"],["Find on a webpage","⌘ F","t47"],["Restore a tab","⇧ ⌘ T","t51"]];
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tipLink=id=>"./tips/"+encodeURIComponent(id)+".html";
let favourites=new Set,focusOption=-1,toastTimer=null;
let state={query:"",category:"All",savedOnly:false,sort:"recommended",shown:12,collection:null};
try{const ids=JSON.parse(localStorage.getItem("macbook-favorites")||"[]");if(Array.isArray(ids))favourites=new Set(ids.filter(id=>byId.has(id)));}catch{}
function notify(msg){const el=$("#toast");el.textContent=msg;el.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),2700);}
function save(){try{localStorage.setItem("macbook-favorites",JSON.stringify([...favourites]));}catch{notify("Unable to save in this browser.");}}
function hideNav(){$("#main-nav").classList.remove("open");$("#menu-toggle").setAttribute("aria-expanded","false");}
function scrollToId(id){hideNav();document.getElementById(id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
function searchList(){let result=state.query?engine.search(all,state.query,{limit:55,category:state.category,savedOnly:state.savedOnly?favourites:null}):all.filter(t=>(state.category==="All"||t.category===state.category)&&(!state.savedOnly||favourites.has(t.id)));
 if(state.collection)result=result.filter(t=>state.collection.includes(t.id));
 if(state.sort==="az")result.sort((a,b)=>a.title.localeCompare(b.title));
 else if(state.sort==="app")result.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
 else if(!state.query){const order=[...FEATURED,...all.map(t=>t.id)];result.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));}
 return result;
}
function renderGrid(){
 const list=searchList();
 $("#result-count").textContent=list.length+" guide"+(list.length===1?"":"s")+" found"+(state.query?' for "'+state.query+'"':"");
 $("#tips-grid").innerHTML=list.slice(0,state.shown).map(t=>{
  const action=t.id==="t09"?"Off campus only · "+t.where:(t.where.length<53?t.where:t.steps[0]);
  return '<article class="tip-card answer-card"><div class="tip-card-top"><span class="tip-app"><img src="./assets/app-'+appArt[t.category]+'.svg?v=10" width="22" height="22" alt="" aria-hidden="true">'+esc(t.category)+'</span><button class="save-tip" type="button" data-save="'+t.id+'" aria-pressed="'+favourites.has(t.id)+'" aria-label="'+(favourites.has(t.id)?"Remove saved guide: ":"Save guide: ")+esc(t.title)+'">'+(favourites.has(t.id)?"♥":"♡")+'</button></div><h3><a href="'+tipLink(t.id)+'">'+esc(t.title)+'</a></h3><p class="card-answer">'+esc(action)+'</p><div class="tip-card-bottom"><small>'+t.steps.length+" clear steps"+'</small><a class="tip-open" href="'+tipLink(t.id)+'" aria-label="Read guide: '+esc(t.title)+'">See how →</a></div></article>';
 }).join("")||'<div class="empty-results"><h3>No exact answer yet</h3><p>Try a simpler word, a different phrase or browse one app. You can also suggest a new guide.</p><button class="button outline" type="button" data-reset="true">See all guides</button> <a class="button outline" href="https://github.com/edtechevans/MacBook/issues/new" target="_blank" rel="noopener noreferrer">Suggest a guide ↗</a></div>';
 $("#load-row").hidden=list.length<=state.shown;
 for(const b of $$("[data-filter]"))b.setAttribute("aria-pressed",String(b.dataset.filter===state.category));
 $("#saved-only").checked=state.savedOnly;$("#sort-by").value=state.sort;
 $("#clear-filters").disabled=!(state.query||state.category!=="All"||state.collection||state.savedOnly||state.sort!=="recommended");
}
function renderCategories(){
 $("#category-grid").innerHTML=cats.slice(1).map(c=>{
  const count=all.filter(t=>t.category===c).length;
  return '<button class="quick-app app-'+c.toLowerCase()+'" type="button" data-category="'+c+'" aria-label="Browse '+count+' '+c+' tips"><img class="quick-app-icon" src="./assets/app-'+appArt[c]+'.svg?v=10" width="62" height="62" alt="" aria-hidden="true"><span class="quick-app-content"><strong>'+c+'</strong><small>'+count+' tips</small></span><span class="quick-app-chevron" aria-hidden="true">→</span></button>';
 }).join("");
 $("#category-filters").innerHTML=cats.map(c=>'<button type="button" data-filter="'+c+'" aria-pressed="'+(state.category===c)+'">'+c+'</button>').join("");
}
function renderPopular(){
 $("#popular-grid").innerHTML=popularIDs.map(id=>{
  const t=byId.get(id);if(!t)return "";
  return '<a class="popular-card" href="'+tipLink(t.id)+'" aria-label="View guide: '+esc(t.title)+'"><span class="popular-art"><img src="./assets/thumb-'+popularArt[id]+'.svg?v=10" width="150" height="132" alt=""></span><span class="popular-info"><strong>'+esc(popularTitles[id]||t.title)+'</strong><span class="popular-meta"><img src="./assets/app-'+appArt[t.category]+'.svg?v=10" width="22" height="22" alt="">'+esc(t.category)+'</span></span><span class="popular-arrow" aria-hidden="true">→</span></a>';
 }).join("");
}
function renderCollections(){
 $("#collection-grid").innerHTML=COLLECTIONS.map((c,i)=>'<button type="button" class="collection-card" data-collection="'+i+'"><span class="collection-number">CURATED '+String(i+1).padStart(2,"0")+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><span class="collection-link">Browse '+c.ids.length+' guides →</span></button>').join("");
}
function renderShortcuts(){
 $("#shortcut-sheet").innerHTML=SHORTCUTS.map(([label,key,id])=>'<a class="shortcut-row" href="'+tipLink(id)+'" aria-label="'+esc(label)+": "+esc(key)+'. Open guide"><span class="shortcut-label">'+esc(label)+'</span><kbd>'+esc(key)+'</kbd><span class="shortcut-open" aria-hidden="true">↗</span></a>').join("");
}
function renderSaved(){
 const list=[...favourites].map(id=>byId.get(id)).filter(Boolean);
 $("#saved-count").textContent=list.length+" saved";$("#clear-saved").disabled=!list.length;
 $("#saved-preview").innerHTML=list.length?list.slice(0,5).map(t=>'<div class="saved-item"><a href="'+tipLink(t.id)+'">'+esc(t.title)+'</a><span>'+esc(t.category)+'</span></div>').join(""):'<div class="saved-empty"><strong>Your reference shelf is empty</strong><p>Tap a heart beside any guide to keep it here.</p></div>';
}
function toggle(id,focus){
 if(!byId.has(id))return;
 const was=favourites.has(id);was?favourites.delete(id):favourites.add(id);save();renderGrid();renderSaved();
 const btn=document.querySelector('[data-save="'+id+'"]');if(focus&&btn)btn.focus();
 notify(was?"Removed from saved guides.":"Saved in this browser.");
}
function clearFilters(){
 state={query:"",category:"All",savedOnly:false,sort:"recommended",shown:12,collection:null};
 $("#hero-query").value="";$("#library-query").value="";hideSuggest();renderGrid();
}
function category(c){state.category=cats.includes(c)?c:"All";state.query="";state.collection=null;state.savedOnly=false;state.shown=55;$("#hero-query").value="";$("#library-query").value="";hideSuggest();renderGrid();scrollToId("library");}
function search(q,toLibrary=true){state.query=q.trim();state.category="All";state.collection=null;state.savedOnly=false;state.shown=55;$("#hero-query").value=q;$("#library-query").value=q;hideSuggest();renderGrid();if(toLibrary){scrollToId("library");$("#library-query").focus();}}
function suggestions(q){
 if(q.trim().length<2)return [];
 return engine.search(all,q,{limit:5});
}
function hideSuggest(){$("#hero-suggestions").hidden=true;$("#hero-query").setAttribute("aria-expanded","false");$("#hero-query").removeAttribute("aria-activedescendant");focusOption=-1;}
function showSuggest(q){
 const list=suggestions(q);
 const el=$("#hero-suggestions");
 if(!list.length){hideSuggest();return;}
 focusOption=-1;
 el.innerHTML=list.map((t,i)=>'<li role="option" id="suggest-'+i+'" aria-selected="false" data-suggest="'+t.id+'" tabindex="-1"><span>'+esc(t.title)+'</span><small>'+esc(t.category)+'</small></li>').join("");
 el.hidden=false;$("#hero-query").setAttribute("aria-expanded","true");
}
function moveSuggest(delta){
 const items=$$("#hero-suggestions [role=option]");if(!items.length)return;
 focusOption=Math.max(0,Math.min(items.length-1,focusOption+delta));
 items.forEach((el,i)=>el.setAttribute("aria-selected",String(i===focusOption)));
 $("#hero-query").setAttribute("aria-activedescendant",items[focusOption].id);
}
function setup(){
 $("#hero-search").addEventListener("submit",e=>{
  e.preventDefault();
  const el=$$("#hero-suggestions [role=option]")[focusOption];
  if(el){location.href=tipLink(el.dataset.suggest);return;}
  search($("#hero-query").value);
 });
 $("#hero-query").addEventListener("input",e=>{showSuggest(e.target.value);});
 $("#hero-query").addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();moveSuggest(e.key==="ArrowDown"?1:-1);}
  if(e.key==="Escape")hideSuggest();
 });
 $("#hero-suggestions").addEventListener("click",e=>{const li=e.target.closest("[data-suggest]");if(li)location.href=tipLink(li.dataset.suggest);});
 document.addEventListener("click",e=>{if(!e.target.closest("#hero-search")&&!e.target.closest("#hero-suggestions"))hideSuggest();});
 $("#library-query").addEventListener("input",e=>{state.query=e.target.value.trim();state.shown=55;$("#hero-query").value=e.target.value;renderGrid();});
 $("#clear-filters").addEventListener("click",()=>{clearFilters();$("#library-query").focus();});
 $("#sort-by").addEventListener("change",e=>{state.sort=e.target.value;renderGrid();});
 $("#saved-only").addEventListener("change",e=>{state.savedOnly=e.target.checked;state.collection=null;state.shown=55;renderGrid();});
 $("#load-more").addEventListener("click",()=>{state.shown=Math.min(55,state.shown+15);renderGrid();});
 $("#header-search").addEventListener("click",()=>{scrollToId("top");$("#hero-query").focus();});
 $("#menu-toggle").addEventListener("click",()=>{const open=$("#main-nav").classList.toggle("open");$("#menu-toggle").setAttribute("aria-expanded",String(open));});
 for(const a of $$(".main-nav a"))a.addEventListener("click",hideNav);
 $("#view-saved").addEventListener("click",()=>{clearFilters();state.savedOnly=true;state.shown=55;renderGrid();scrollToId("library");});
 $("#clear-saved").addEventListener("click",()=>{if(!favourites.size||!confirm("Remove all saved guides from this browser?"))return;favourites.clear();save();renderGrid();renderSaved();notify("Saved guides cleared.");});
 document.addEventListener("click",e=>{
  const btn=e.target.closest("button");if(!btn)return;
  if(btn.dataset.save){toggle(btn.dataset.save,true);return;}
  if(btn.dataset.category){category(btn.dataset.category);return;}
  if(btn.dataset.filter){state.category=btn.dataset.filter;state.collection=null;state.query="";state.shown=55;$("#hero-query").value="";$("#library-query").value="";renderGrid();return;}
  if(btn.dataset.searchTerm){search(btn.dataset.searchTerm);return;}
  if(btn.dataset.collection){const c=COLLECTIONS[Number(btn.dataset.collection)];if(!c)return;clearFilters();state.collection=c.ids;state.shown=55;renderGrid();scrollToId("library");return;}
  if(btn.dataset.reset){clearFilters();$("#library-query").focus();}
 });
 document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();scrollToId("library");$("#library-query").focus();}});
}
function init(){
 const old=location.hash.match(/^#tip-([tb][0-9]{2})$/);
 if(old&&byId.has(old[1])){location.replace(tipLink(old[1]));return;}
 const tag=location.hash.match(/^#library\?app=(MacBook|Outlook|Teams|Chrome)$/);
 $("#hero-count").textContent=all.length;
 renderCategories();renderPopular();renderGrid();renderCollections();renderShortcuts();renderSaved();setup();
 if(tag)category(tag[1]);
 if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();