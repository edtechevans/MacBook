/* Search-first MacBook Productivity reference. No assessments, accounts or tracking. */
(function(){
"use strict";
const all=Array.isArray(window.TIPS)?window.TIPS:[];
const byId=new Map(all.map(t=>[t.id,t]));
const engine=window.TIP_SEARCH;
const related=window.RELATED_TIPS||{};
if(engine)engine.build(all);
const cats=["All","MacBook","Outlook","Teams","Chrome"];
const icons={MacBook:"⌘",Outlook:"✉",Teams:"▦",Chrome:"◎"};
const FEATURED=["t22","t24","t41","t51","b01","t16","t28","t48","t17","t31","t45","t50"];
const COLLECTIONS=[
 {title:"Everyday Mac essentials",desc:"Find things, arrange windows and make common tasks faster.",ids:["t16","t17","t21","t22","b01","t19"]},
 {title:"An easier inbox",desc:"Fewer interruptions, better follow-ups and more thoughtful email.",ids:["t24","t25","t27","t28","t31","t37"]},
 {title:"Fewer distractions",desc:"Reduce alerts and keep important conversations within reach.",ids:["t19","t41","t42","t44","t40","t43"]}
];
const SHORTCUTS=[["Search your Mac","⌘ Space","t16"],["Switch apps","⌘ Tab","t17"],["Preview a file","Space","t21"],["Record the screen","⇧ ⌘ 5","t22"],["Find on a webpage","⌘ F","t47"],["Restore a tab","⇧ ⌘ T","t51"]];
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tipLink=id=>"./tips/"+encodeURIComponent(id)+".html";
let favourites=new Set,language="en",focusOption=-1,toastTimer=null;
let state={query:"",category:"All",savedOnly:false,sort:"recommended",shown:12,collection:null};
try{const ids=JSON.parse(localStorage.getItem("macbook-favorites")||"[]");if(Array.isArray(ids))favourites=new Set(ids.filter(id=>byId.has(id)));}catch{}
try{language=localStorage.getItem("macbook-lang")||"en";}catch{}
const txt={
 en:{navTips:"Find tips",navShortcuts:"Shortcuts",navSaved:"Saved",search:"Search",menu:"Menu",heroEyebrow:"EVERYDAY PRODUCTIVITY · QUICK REFERENCE",heroTitle:"Find a tip.",heroTitleEm:"Get it done.",heroDesc:"Clear answers for MacBook, Outlook, Teams and Chrome. Search what you want to do, then follow the steps.",find:"Find a tip →",try:"Try:",browseApp:"Or browse an app",libraryEyebrow:"FIND THE ANSWER",libraryTitle:"What do you need help with?",libraryDesc:"Search with everyday language, filter by app, or choose a guide.",clearFilters:"Clear filters ↺",savedOnly:"Saved only",more:"Show more tips ↓",collectionsEyebrow:"BROWSE BY TASK",collectionsTitle:"A few good places to start.",collectionsDesc:"Small, useful collections for everyday work.",shortcutsTitle:"Shortcuts worth keeping close.",shortcutsDesc:"A few quick keyboard reminders. Click any one to see the full instructions.",print:"Printable guide ↗",savedEyebrow:"YOUR OWN REFERENCE SHELF",savedTitle:"Keep useful tips handy.",savedDesc:"Save guides with the heart icon. They stay in this browser, with no login required.",savedView:"View saved tips →",savedClear:"Clear saved"},
 zh:{navTips:"查找技巧",navShortcuts:"快捷键",navSaved:"已收藏",search:"搜索",menu:"菜单",heroEyebrow:"日常效率 · 快速参考",heroTitle:"找到技巧。",heroTitleEm:"马上完成。",heroDesc:"MacBook、Outlook、Teams 和 Chrome 的实用指导。搜索任务，按照步骤操作。",find:"查找技巧 →",try:"试试：",browseApp:"或按应用浏览",libraryEyebrow:"快速找到答案",libraryTitle:"你需要什么帮助？",libraryDesc:"使用日常语言搜索，按应用筛选，或选择指南。",clearFilters:"清除筛选 ↺",savedOnly:"仅看收藏",more:"更多技巧 ↓",collectionsEyebrow:"按任务浏览",collectionsTitle:"从这些任务开始。",collectionsDesc:"适用于日常工作的精选技巧。",shortcutsTitle:"常用快捷键。",shortcutsDesc:"点击快捷键查看完整说明。",print:"打印版指南 ↗",savedEyebrow:"个人收藏",savedTitle:"随时查阅实用技巧。",savedDesc:"点击心形图标收藏指南，仅保存在此浏览器中。",savedView:"查看收藏 →",savedClear:"清除收藏"},
 ko:{navTips:"팁 찾기",navShortcuts:"단축키",navSaved:"저장한 팁",search:"검색",menu:"메뉴",heroEyebrow:"일상 생산성 · 빠른 참고",heroTitle:"팁을 찾고.",heroTitleEm:"바로 해결하세요.",heroDesc:"MacBook, Outlook, Teams, Chrome의 실용적인 안내입니다. 원하는 작업을 검색하세요.",find:"팁 찾기 →",try:"예:",browseApp:"또는 앱별로 찾기",libraryEyebrow:"답 찾기",libraryTitle:"어떤 도움이 필요한가요?",libraryDesc:"일상적인 표현으로 검색하거나 앱별로 찾아보세요.",clearFilters:"필터 초기화 ↺",savedOnly:"저장한 항목만",more:"팁 더 보기 ↓",collectionsEyebrow:"작업별 탐색",collectionsTitle:"여기서 시작하세요.",collectionsDesc:"업무에 유용한 팁을 모았습니다.",shortcutsTitle:"자주 쓰는 단축키.",shortcutsDesc:"단축키를 눌러 전체 안내를 확인하세요.",print:"인쇄용 가이드 ↗",savedEyebrow:"개인 북마크",savedTitle:"유용한 팁을 저장하세요.",savedDesc:"하트 아이콘으로 저장하세요. 현재 브라우저에만 보관됩니다.",savedView:"저장한 팁 보기 →",savedClear:"저장 삭제"}
};
function notify(msg){const el=$("#toast");el.textContent=msg;el.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),2700);}
function save(){try{localStorage.setItem("macbook-favorites",JSON.stringify([...favourites]));}catch{notify("Unable to save in this browser.");}}
function hideNav(){$("#main-nav").classList.remove("open");$("#menu-toggle").setAttribute("aria-expanded","false");}
function scrollToId(id){hideNav();document.getElementById(id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
function languageUI(){if(!txt[language])language="en";for(const el of $$("[data-i18n]")){const s=txt[language][el.dataset.i18n];if(s){el.textContent=s;el.lang=language;}}
 $("#language").value=language;$("#hero-query").placeholder=language==="zh"?"例如：关闭 Teams 通知、录制屏幕":language==="ko"?"예: Teams 알림 끄기, 화면 녹화":"e.g. mute Teams, record screen, restore a tab";
 $("#library-query").placeholder=language==="zh"?"搜索任务或技巧…":language==="ko"?"작업 또는 팁 검색…":"Search a task or tip…";
 $("#language-note").textContent=language==="zh"?"15 项常用技巧有中文指导草稿，尚待专业术语审核；其他内容为英文。":language==="ko"?"주요 15개 팁에 한국어 번역 초안이 있으며 전문 검토가 필요합니다. 나머지는 영어입니다.":"15 priority guides include Chinese/Korean drafts; technical terminology review is pending.";
}
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
  const action=t.where.length<53?t.where:t.steps[0];
  return '<article class="tip-card answer-card"><div class="tip-card-top"><span class="tip-app">'+esc(t.category)+'</span><button class="save-tip" type="button" data-save="'+t.id+'" aria-pressed="'+favourites.has(t.id)+'" aria-label="'+(favourites.has(t.id)?"Remove saved guide: ":"Save guide: ")+esc(t.title)+'">'+(favourites.has(t.id)?"♥":"♡")+'</button></div><h3><a href="'+tipLink(t.id)+'">'+esc(t.title)+'</a></h3><p class="card-answer">'+esc(action)+'</p><div class="tip-card-bottom"><small>'+((window.TIP_TRANSLATIONS||{})[t.id]?"EN · 中文 · 한국어":"English")+'</small><a class="tip-open" href="'+tipLink(t.id)+'" aria-label="Read guide: '+esc(t.title)+'">See how →</a></div></article>';
 }).join("")||'<div class="empty-results"><h3>No exact answer yet</h3><p>Try a simpler word, a different phrase or browse one app. You can also suggest a new guide.</p><button class="button outline" type="button" data-reset="true">See all guides</button> <a class="button outline" href="https://github.com/edtechevans/MacBook/issues/new" target="_blank" rel="noopener noreferrer">Suggest a guide ↗</a></div>';
 $("#load-row").hidden=list.length<=state.shown;
 for(const b of $$("[data-filter]"))b.setAttribute("aria-pressed",String(b.dataset.filter===state.category));
 $("#saved-only").checked=state.savedOnly;$("#sort-by").value=state.sort;
 $("#clear-filters").disabled=!(state.query||state.category!=="All"||state.collection||state.savedOnly||state.sort!=="recommended");
}
function renderCategories(){
 const desc={MacBook:"Settings and shortcuts",Outlook:"Email and calendar",Teams:"Chat and meetings",Chrome:"Tabs and browsing"};
 $("#category-grid").innerHTML=cats.slice(1).map(c=>'<button class="quick-app" type="button" data-category="'+c+'"><span class="quick-app-icon" aria-hidden="true">'+icons[c]+'</span><span><strong>'+c+'</strong><small>'+desc[c]+'</small></span><span class="quick-app-chevron" aria-hidden="true">→</span></button>').join("");
 $("#category-filters").innerHTML=cats.map(c=>'<button type="button" data-filter="'+c+'" aria-pressed="'+(state.category===c)+'">'+c+'</button>').join("");
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
 $("#language").addEventListener("change",e=>{language=e.target.value;try{localStorage.setItem("macbook-lang",language);}catch{}languageUI();});
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
 $("#hero-count").textContent=all.length;
 renderCategories();renderGrid();renderCollections();renderShortcuts();renderSaved();languageUI();setup();
 if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();