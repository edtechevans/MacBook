/* MacBook Productivity: reference-first, no assessments or completion tracking. */
(()=>{
"use strict";
const tips=Array.isArray(window.TIPS)?window.TIPS:[];
const tipMap=new Map(tips.map(t=>[t.id,t]));
const media=window.LESSON_MEDIA||{};
const categories=["All","MacBook","Outlook","Teams","Chrome"];
const symbols={MacBook:"⌘",Outlook:"✉",Teams:"▦",Chrome:"◎"};
const categoryText={
  MacBook:"Settings, windows, screen tools and everyday shortcuts.",
  Outlook:"Email, calendar, useful follow-ups and a calmer inbox.",
  Teams:"Meetings, chats, channels and fewer distractions.",
  Chrome:"Tabs, bookmarks, search and faster browsing."
};
const FEATURED=["t22","t24","t41","t51","t16","t28","t39","t48","t17","t31","t45","t50"];
const POPULAR=["t22","t24","t41","t51"];
const COLLECTIONS=[
  {title:"Everyday Mac essentials",desc:"The small Mac shortcuts and settings that make a big difference.",ids:["t16","t17","t21","t22","b01","t19"]},
  {title:"An easier inbox",desc:"Make email more purposeful, organise follow-ups and save time.",ids:["t24","t25","t27","t28","t31","t37"]},
  {title:"Fewer clicks, fewer interruptions",desc:"Keep the right things close and the unnecessary noise away.",ids:["t19","t41","t42","t44","t45","t48"]}
];
const SHORTCUTS=[
  ["Search your Mac","⌘ Space","t16"],
  ["Switch applications","⌘ Tab","t17"],
  ["Preview a file","Space","t21"],
  ["Screenshot and record","⇧ ⌘ 5","t22"],
  ["Find text on a page","⌘ F","t47"],
  ["Reopen a closed tab","⇧ ⌘ T","t51"]
];
const $=q=>document.querySelector(q);
const $$=q=>Array.from(document.querySelectorAll(q));
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function safeRead(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}}
const validIds=new Set(tips.map(t=>t.id));
const cleanIds=v=>Array.isArray(v)?v.filter(id=>typeof id==="string"&&validIds.has(id)):[];
let favourites=new Set(cleanIds(safeRead("macbook-favorites",[])));
let lang=["en","zh","ko"].includes(safeRead("macbook-lang","en"))?safeRead("macbook-lang","en"):"en";
let state={query:"",category:"All",savedOnly:false,sort:"recommended",shown:12,collection:null,tip:null,mode:"all",step:0,fromPush:false};
let previousFocus=null,announcementTimer=null,reading=null;
const TRANSLATIONS={
en:{
navTips:"All tips",navApps:"Browse apps",navCollections:"Collections",navShortcuts:"Shortcuts",navSaved:"Saved tips",search:"Search",menu:"Menu",
heroEyebrow:"YOUR EVERYDAY PRODUCTIVITY REFERENCE",heroTitle:"Less searching.",heroTitleEm:"More doing.",heroDesc:"Need to change a setting, find a shortcut or get more from your apps? Find a practical answer, see where to click and get on with your day.",searchTips:"Find a tip →",trySearch:"Try:",suggestScreen:"record my screen",suggestMail:"snooze an email",suggestTeam:"quiet Teams",heroCount:"practical tips across four everyday tools",
featureEyebrow:"QUICK START",featureCaption:"HAND-PICKED TIPS",featureTitle:"A few useful places to begin.",featureNote:"Open a tip for the steps, visuals and official support links.",
appsEyebrow:"BROWSE BY APPLICATION",appsTitle:"Four tools. Everything in one place.",appsDesc:"Choose the app you're working in, or head straight to the full tip library.",browseAll:"View all 55 tips ↗",
libraryEyebrow:"THE TIP LIBRARY",libraryTitle:"Find exactly what you need.",libraryDesc:"Search a task or browse the collection. Every guide includes clear steps and a useful reference.",clearFilters:"Clear filters ↺",savedOnly:"Saved only",showMore:"Show more tips ↓",
collectionsEyebrow:"USEFUL COLLECTIONS",collectionsTitle:"Sometimes you just need a starting point.",collectionsDesc:"Hand-picked tips for the small tasks that come up throughout a school day.",
shortcutsEyebrow:"QUICK REFERENCE",shortcutsTitle:"Shortcuts worth keeping close.",shortcutsDesc:"A few of the most useful Mac shortcuts in one place. No memorisation required—come back whenever you need them.",printGuide:"Open printable guide ↗",
savedEyebrow:"YOUR OWN REFERENCE SHELF",savedTitle:"Keep the useful ones handy.",savedDesc:"Tap the heart beside a tip to save it. Your saved tips stay in this browser, with no account required.",viewSaved:"See all saved tips →",clearSaved:"Clear saved",savedBoard:"Your saved tips",savedNote:"Private to this browser. Nothing is sent to a school server.",
bottomEyebrow:"ALWAYS HERE WHEN YOU NEED IT",bottomTitle:"A useful answer is never far away.",bottomDesc:"Bookmark this website and come back whenever you need a reminder.",backTop:"Search for another tip ↑",
backTips:"All tips",modeAll:"All steps",modeGuided:"One step at a time",whereLabel:"WHERE TO GO",tryHeading:"PRACTICAL EXAMPLE",helpHeading:"Can't find the setting? Read this",relatedTitle:"You might also find these useful"
},
zh:{
navTips:"所有技巧",navApps:"按应用浏览",navCollections:"精选合集",navShortcuts:"快捷键",navSaved:"已收藏",search:"搜索",menu:"菜单",
heroEyebrow:"日常效率参考指南",heroTitle:"少一点寻找。",heroTitleEm:"多一点行动。",heroDesc:"想调整设置、查找快捷键或提高应用效率？找到实用说明，了解操作位置，然后继续工作。",searchTips:"查找技巧 →",trySearch:"例如：",suggestScreen:"录制屏幕",suggestMail:"暂缓处理邮件",suggestTeam:"减少 Teams 通知",heroCount:"条实用技巧，涵盖四种日常工具",
featureEyebrow:"快速开始",featureCaption:"精选技巧",featureTitle:"从这些实用技巧开始。",featureNote:"打开技巧，查看步骤、图片和官方参考资料。",
appsEyebrow:"按应用浏览",appsTitle:"四种工具，集中查找。",appsDesc:"选择正在使用的应用，或直接查看全部技巧。",browseAll:"查看全部 55 条技巧 ↗",
libraryEyebrow:"技巧资源库",libraryTitle:"快速找到所需内容。",libraryDesc:"搜索任务或浏览合集，每条技巧都有明确步骤和参考资料。",clearFilters:"清除筛选 ↺",savedOnly:"只看收藏",showMore:"显示更多技巧 ↓",
collectionsEyebrow:"精选合集",collectionsTitle:"从这里轻松开始。",collectionsDesc:"为日常学校工作精选的实用技巧。",
shortcutsEyebrow:"快捷参考",shortcutsTitle:"值得收藏的快捷键。",shortcutsDesc:"常用 Mac 快捷键集中呈现，随时回来查阅。",printGuide:"打开打印版指南 ↗",
savedEyebrow:"我的参考收藏",savedTitle:"把实用技巧留在身边。",savedDesc:"点击心形图标收藏技巧，内容仅保存在当前浏览器中。",viewSaved:"查看已收藏技巧 →",clearSaved:"清除收藏",savedBoard:"我的收藏",savedNote:"仅保存在此浏览器，不会发送到学校服务器。",
bottomEyebrow:"随时可查",bottomTitle:"实用答案就在这里。",bottomDesc:"收藏本网站，随时回来查阅。",backTop:"搜索其他技巧 ↑",
backTips:"全部技巧",modeAll:"查看全部步骤",modeGuided:"逐步查看",whereLabel:"操作位置",tryHeading:"实际应用示例",helpHeading:"找不到设置？查看帮助",relatedTitle:"你可能也会用到"
},
ko:{
navTips:"전체 팁",navApps:"앱별 보기",navCollections:"추천 모음",navShortcuts:"단축키",navSaved:"저장한 팁",search:"검색",menu:"메뉴",
heroEyebrow:"일상 생산성 참고 가이드",heroTitle:"찾는 시간은 줄이고.",heroTitleEm:"실행은 더 빠르게.",heroDesc:"설정 변경, 단축키 찾기, 앱 활용이 필요하신가요? 명확한 단계와 화면 안내로 바로 해결하세요.",searchTips:"팁 찾기 →",trySearch:"예:",suggestScreen:"화면 녹화",suggestMail:"이메일 다시 알림",suggestTeam:"Teams 알림 줄이기",heroCount:"개의 실용 팁 · 4가지 도구",
featureEyebrow:"빠른 시작",featureCaption:"추천 팁",featureTitle:"이 팁부터 살펴보세요.",featureNote:"팁을 열어 단계와 이미지, 공식 안내를 확인하세요.",
appsEyebrow:"앱별 탐색",appsTitle:"네 가지 도구를 한곳에서.",appsDesc:"사용 중인 앱을 선택하거나 전체 팁을 살펴보세요.",browseAll:"팁 55개 모두 보기 ↗",
libraryEyebrow:"팁 자료실",libraryTitle:"필요한 답을 바로 찾으세요.",libraryDesc:"작업을 검색하거나 모음을 탐색하세요. 모든 팁에는 명확한 설명과 참고 자료가 있습니다.",clearFilters:"필터 초기화 ↺",savedOnly:"저장한 항목만",showMore:"팁 더 보기 ↓",
collectionsEyebrow:"추천 모음",collectionsTitle:"여기서 시작해 보세요.",collectionsDesc:"학교 일상에서 유용한 팁을 모았습니다.",
shortcutsEyebrow:"빠른 참고",shortcutsTitle:"자주 쓰는 단축키.",shortcutsDesc:"매일 유용한 Mac 단축키를 쉽게 찾아보세요.",printGuide:"인쇄용 가이드 열기 ↗",
savedEyebrow:"나만의 참고 자료",savedTitle:"필요한 팁을 저장하세요.",savedDesc:"하트 아이콘을 눌러 팁을 저장하세요. 현재 브라우저에만 보관됩니다.",viewSaved:"저장한 팁 보기 →",clearSaved:"저장 삭제",savedBoard:"저장한 팁",savedNote:"이 브라우저에만 저장되며 학교 서버로 전송하지 않습니다.",
bottomEyebrow:"필요할 때 언제든",bottomTitle:"유용한 답을 언제든 찾으세요.",bottomDesc:"웹사이트를 북마크하고 필요할 때 다시 찾아보세요.",backTop:"다른 팁 검색 ↑",
backTips:"전체 팁",modeAll:"모든 단계",modeGuided:"한 단계씩",whereLabel:"찾아갈 위치",tryHeading:"활용 예시",helpHeading:"설정을 찾을 수 없나요?",relatedTitle:"함께 보면 좋은 팁"
}
};
function saveFavourites(){try{localStorage.setItem("macbook-favorites",JSON.stringify([...favourites]));}catch{announce("Your browser could not save bookmarks.");}}
function announce(s){const n=$("#toast");n.textContent=s;n.classList.add("visible");clearTimeout(announcementTimer);announcementTimer=setTimeout(()=>n.classList.remove("visible"),2800);}
function navClose(){$("#main-nav").classList.remove("open");$("#menu-toggle").setAttribute("aria-expanded","false");}
function scrollToID(id){document.getElementById(id)?.scrollIntoView({block:"start",behavior:window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});navClose();}
function translate(){
  const d=TRANSLATIONS[lang]||TRANSLATIONS.en;
  $$("[data-i18n]").forEach(el=>{if(d[el.dataset.i18n]){el.textContent=d[el.dataset.i18n];el.lang=lang;}});
  $("#hero-query").placeholder=lang==="zh"?"你想做什么？":lang==="ko"?"무엇을 찾고 싶으세요?":"What would you like to do?";
  $("#library-query").placeholder=lang==="zh"?"搜索技巧、快捷键或任务":lang==="ko"?"팁, 단축키 또는 작업 검색":"Search tips, shortcuts or tasks…";
  $("#language-note").textContent=lang==="zh"?"导航支持中文；技巧说明目前以英文提供。":lang==="ko"?"메뉴는 한국어로 제공되며, 팁의 상세 설명은 영어입니다.":"Tip instructions are in English. Navigation can be translated.";
  $("#language").value=lang;
}
function renderPopular(){
  $("#popular-list").innerHTML=POPULAR.map(id=>{
    const t=tipMap.get(id);
    return '<button class="feature-tip" type="button" data-tip="'+id+'"><span class="feature-icon" aria-hidden="true">'+symbols[t.category]+'</span><span class="feature-content"><strong>'+escapeHTML(t.title)+'</strong><small>'+escapeHTML(t.category)+' · Clear instructions</small></span><span class="feature-arrow" aria-hidden="true">→</span></button>';
  }).join("");
}
function renderCategories(){
  $("#category-grid").innerHTML=categories.slice(1).map(c=>{
    const count=tips.filter(t=>t.category===c).length;
    return '<button class="category-card" type="button" data-category="'+c+'"><span class="category-icon" aria-hidden="true">'+symbols[c]+'</span><span class="category-name">'+c+'</span><span class="category-summary">'+escapeHTML(categoryText[c])+'</span><span class="category-footer">'+count+' tips · Explore →</span></button>';
  }).join("");
}
function renderFilters(){
  $("#category-filters").innerHTML=categories.map(c=>'<button type="button" data-filter="'+c+'" aria-pressed="'+(c===state.category)+'">'+c+'</button>').join("");
}
function filterStatus(){
  $$("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter===state.category)));
  $("#saved-only").checked=state.savedOnly;$("#sort-by").value=state.sort;
  $("#clear-filters").disabled=!(state.query||state.category!=="All"||state.collection||state.savedOnly||state.sort!=="recommended");
}
const STOP=new Set(["how","do","i","to","my","can","the","a","an","of","in","for","with","me","is","you","please","on","this"]);
const ALIASES={
  quiet:["notifications","mute","focus","disturb"],screen:["record","capture","screenshot"],record:["recording","screenshot","capture"],
  email:["outlook","mail","message"],tab:["tabs","chrome","browser"],close:["quit","closed","restore"],
  organise:["organize","folders","stacks","groups"],organize:["organise","folders","stacks","groups"],
  find:["search","spotlight","locate"],schedule:["meeting","calendar","send"],
  privacy:["focus","mute","notification"],shortcut:["command","keyboard","⌘"],
  screenshot:["screen","capture","record"],restore:["reopen","closed"]
};
function termScore(t,q){
  const words=q.toLowerCase().trim().split(/\s+/).filter(w=>w&&!STOP.has(w));
  if(!words.length)return 1;
  const title=t.title.toLowerCase(),body=[t.title,t.category,t.where,...t.steps,t.try,t.note].join(" ").toLowerCase();
  if(!words.every(w=>body.includes(w)||(ALIASES[w]||[]).some(a=>body.includes(a))))return 0;
  return words.reduce((n,w)=>n+(title.includes(w)?7:body.includes(w)?3:1),0);
}
function getResults(){
  const list=tips.filter(t=>(state.category==="All"||t.category===state.category)&&(!state.savedOnly||favourites.has(t.id))&&(!state.collection||state.collection.includes(t.id))&&termScore(t,state.query)>0);
  if(state.sort==="az")return list.sort((a,b)=>a.title.localeCompare(b.title));
  if(state.sort==="app")return list.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
  if(state.query)return list.sort((a,b)=>termScore(b,state.query)-termScore(a,state.query)||a.title.localeCompare(b.title));
  const order=[...FEATURED,...tips.map(t=>t.id)];
  return list.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
}
function renderTips(focusId){
  filterStatus();
  const results=getResults();
  $("#result-count").textContent=(state.savedOnly?"Saved · ":state.collection?"Collection · ":"")+results.length+" tip"+(results.length===1?"":"s")+" found"+(state.query?' for "'+state.query+'"':"");
  $("#tips-grid").innerHTML=results.slice(0,state.shown).map(t=>'<article class="tip-card"><div class="tip-card-top"><span class="tip-app">'+escapeHTML(t.category)+(t.bonus?" · BONUS":"")+'</span><button type="button" class="save-tip" data-save="'+t.id+'" aria-pressed="'+favourites.has(t.id)+'" aria-label="'+(favourites.has(t.id)?"Remove saved tip: ":"Save tip: ")+escapeHTML(t.title)+'" title="'+(favourites.has(t.id)?"Remove bookmark":"Save for later")+'">'+(favourites.has(t.id)?"♥":"♡")+'</button></div><h3>'+escapeHTML(t.title)+'</h3><p>'+escapeHTML(t.where)+'</p><div class="tip-card-bottom"><small>'+t.steps.length+' clear steps</small><button class="tip-open" data-tip="'+t.id+'" type="button" aria-label="Open tip: '+escapeHTML(t.title)+'">View tip →</button></div></article>').join("")||
    '<div class="empty-results"><h3>No matching tips</h3><p>Try another search or clear the filters.</p><button type="button" class="button outline" data-reset="true">See all tips</button></div>';
  $("#load-row").hidden=results.length<=state.shown;
  if(focusId){const next=$('[data-save="'+focusId+'"]');if(next)next.focus();else $("#library-query").focus();}
}
function renderCollections(){
  $("#collection-grid").innerHTML=COLLECTIONS.map((item,i)=>'<button class="collection-card" type="button" data-collection="'+i+'"><span class="collection-number">COLLECTION '+String(i+1).padStart(2,"0")+'</span><h3>'+escapeHTML(item.title)+'</h3><p>'+escapeHTML(item.desc)+'</p><span class="collection-count">'+item.ids.length+' tips</span><span class="collection-link">Explore collection →</span></button>').join("");
}
function renderShortcuts(){
  $("#shortcut-sheet").innerHTML=SHORTCUTS.map(([title,shortcut,id])=>'<button class="shortcut-row" type="button" data-tip="'+id+'" aria-label="'+escapeHTML(title)+": "+escapeHTML(shortcut)+'. Open tip"><span class="shortcut-label">'+escapeHTML(title)+'</span><kbd>'+escapeHTML(shortcut)+'</kbd><span class="shortcut-open" aria-hidden="true">↗</span></button>').join("");
}
function renderSaved(){
  const items=[...favourites].map(id=>tipMap.get(id)).filter(Boolean);
  $("#saved-count").textContent=items.length+" saved";
  $("#clear-saved").disabled=items.length===0;
  $("#saved-preview").innerHTML=items.length?items.slice(0,4).map(t=>'<div class="saved-item"><button type="button" data-tip="'+t.id+'">'+escapeHTML(t.title)+'</button><span>'+escapeHTML(t.category)+'</span></div>').join(""):'<div class="saved-empty"><strong>No bookmarks yet</strong><p>Save any useful tip with the heart icon. It will appear here when you return.</p></div>';
}
function changeFavourite(id,restoreFocus){
  if(!tipMap.has(id))return;
  const was=favourites.has(id);was?favourites.delete(id):favourites.add(id);
  saveFavourites();renderTips(restoreFocus?id:null);renderSaved();
  if(state.tip===id){
    const b=$("#tip-fav");b.setAttribute("aria-pressed",String(favourites.has(id)));b.textContent=favourites.has(id)?"♥":"♡";b.setAttribute("aria-label",favourites.has(id)?"Remove saved tip":"Save this tip");
  }
  announce(was?"Removed from saved tips.":"Saved for quick access.");
}
function reset(){
  state.query="";state.category="All";state.savedOnly=false;state.sort="recommended";state.collection=null;state.shown=12;
  $("#hero-query").value="";$("#library-query").value="";
  renderTips();
}
function selectCategory(cat){
  state.category=categories.includes(cat)?cat:"All";state.query="";state.collection=null;state.savedOnly=false;state.shown=55;
  $("#hero-query").value="";$("#library-query").value="";renderTips();scrollToID("library");
}
function searchFor(s,focus=true){
  state.query=s.trim();state.category="All";state.collection=null;state.savedOnly=false;state.shown=55;
  $("#hero-query").value=s;$("#library-query").value=s;renderTips();if(focus){scrollToID("library");$("#library-query").focus();}
}
function selectCollection(i){
  const c=COLLECTIONS[i];if(!c)return;state.collection=c.ids;state.category="All";state.query="";state.savedOnly=false;state.shown=55;
  $("#hero-query").value="";$("#library-query").value="";renderTips();scrollToID("library");announce("Showing "+c.title+".");
}
function safeSource(url){return /^https:\/\//.test(url||"")?url:"https://support.apple.com/guide/mac-help/welcome/mac";}
function visualMap(t,index){
  const parts=t.where.replace(/\s*;\s*/g," → ").split(/\s*→\s*/).map(s=>s.trim()).filter(Boolean).slice(0,5);
  const route=parts.length?parts:[t.category];const shortcut=route.at(-1)||"";
  const keyboard=/[⌘⇧⌥]/.test(shortcut)||/^Control\s*\+|^Space$/i.test(shortcut);
  const caption='<p class="visual-caption"><strong>Illustrative guide, not a screenshot.</strong> Names and menus may vary with software version.</p>';
  let interior="";
  if(keyboard){
    const keys=shortcut.replace(/Command/g,"⌘").replace(/Shift/g,"⇧").replace(/Option/g,"⌥").split(/\s*\+\s*|\s+/).filter(Boolean);
    interior='<div class="key-visual"><p class="key-visual-label">KEYBOARD SHORTCUT</p><div class="key-row">'+keys.map(x=>'<kbd>'+escapeHTML(x)+'</kbd>').join('<span class="key-plus" aria-hidden="true">+</span>')+'</div><p class="key-visual-note">Press these keys while working in the relevant app.</p></div>';
    if(t.id==="t22"||t.id==="b02")interior+='<div class="mock-toolbar"><span>Screenshot controls</span><div class="toolbar-items"><span>▣ Capture</span><span class="toolbar-feature">◉ Record</span><span>⚙ Options</span></div></div>';
  }else{
    const nav={
      MacBook:["System Settings","General","Desktop & Dock","Trackpad","Control Center"],
      Outlook:["Mail","Inbox","Calendar","Settings","Rules"],
      Teams:["Activity","Chat","Teams","Calendar","Settings"],
      Chrome:["Tabs","Address bar","Bookmarks","History","Settings"]
    }[t.category];
    const label={MacBook:"macOS",Outlook:"Outlook",Teams:"Microsoft Teams",Chrome:"Google Chrome"}[t.category];
    const target=route[Math.min(index,route.length-1)];
    interior='<div class="visual-screen"><div class="visual-sidebar"><b>'+escapeHTML(label)+'</b>'+nav.map(n=>'<span class="visual-sidebar-entry '+(t.where.toLowerCase().includes(n.toLowerCase())?"is-related":"")+'">'+escapeHTML(n)+'</span>').join("")+'</div><div class="visual-main"><div class="visual-main-title"><h4>Where to look</h4><span class="visual-active-badge">'+escapeHTML(t.category)+'</span></div>'+(t.category==="Chrome"?'<div class="visual-address">⌕ &nbsp; Address bar</div>':"")+'<div class="visual-crumbs">'+route.map((n,i)=>'<span class="visual-crumb '+(i===Math.min(index,route.length-1)?"current":"")+'">'+escapeHTML(n)+'</span>').join('<span class="visual-chevron" aria-hidden="true">›</span>')+'</div><div class="visual-target"><span class="visual-target-dot" aria-hidden="true"></span><div><strong>'+escapeHTML(target)+'</strong><small>Find this control or a similarly named menu</small></div><span class="visual-target-arrow" aria-hidden="true">◀</span></div></div></div>';
  }
  return '<div class="visual-map" aria-hidden="true"><div class="visual-top"><span class="visual-dots"><i></i><i></i><i></i></span><span>'+escapeHTML(t.category)+' · Visual guide</span><span class="visual-top-right">GUIDE</span></div>'+interior+'</div>'+caption;
}
function mediaAt(t,index){return (media[t.id]||[]).find(m=>m.step===index)||null;}
function visualAt(t,index){
  const m=mediaAt(t,index);
  if(!m||!/^https:\/\//.test(m.src)||!/^https:\/\//.test(m.source))return visualMap(t,index);
  const credit=m.vendor==="Microsoft Support"?"Used with permission from Microsoft.":"Source: "+m.vendor+".";
  return '<figure class="platform-shot"><div class="platform-shot-heading"><span>REAL PLATFORM SCREENSHOT</span><span class="shot-source">'+escapeHTML(m.vendor)+'</span></div>'+
    '<div class="platform-shot-frame"><img class="vendor-shot" src="'+escapeHTML(m.src)+'" alt="'+escapeHTML(m.alt)+'" decoding="async" loading="eager"></div>'+
    '<figcaption><strong>'+escapeHTML(m.caption)+'</strong><p>'+escapeHTML(m.note)+'</p><div class="shot-links"><a href="'+escapeHTML(m.source)+'" target="_blank" rel="noopener noreferrer">Official guidance ↗</a><a href="'+escapeHTML(m.src)+'" target="_blank" rel="noopener noreferrer">Full-size original ↗</a></div><small class="shot-credit">'+escapeHTML(credit)+' Displayed without cropping or annotation.</small></figcaption></figure>'+
    '<details class="visual-alternative"><summary>Show illustrated alternative</summary>'+visualMap(t,index)+'</details>';
}
function attachVisualFallback(scope){
  scope.querySelectorAll("img.vendor-shot").forEach(img=>{
    const failed=()=>{
      const frame=img.closest(".platform-shot");if(!frame||!frame.isConnected)return;
      const p=document.createElement("p");p.className="screenshot-unavailable";p.textContent="The publisher's image could not load. An illustrated alternative is available below.";
      frame.replaceWith(p);const detail=p.nextElementSibling;if(detail?.classList.contains("visual-alternative"))detail.open=true;
    };
    img.addEventListener("error",failed,{once:true});
    if(img.complete&&!img.naturalWidth)failed();
  });
}
function renderAll(t){
  const originals=(media[t.id]||[]);
  $("#tip-steps").innerHTML=t.steps.map((s,i)=>'<li><div class="step-copy">'+escapeHTML(s)+'</div>'+(originals.some(m=>m.step===i)?'<div class="step-visual">'+visualAt(t,i)+'</div>':"")+'</li>').join("");
  $("#tip-illustration").innerHTML=originals.length?"":visualMap(t,0);
  attachVisualFallback($("#all-steps"));
}
function renderGuided(){
  const t=tipMap.get(state.tip);if(!t)return;
  const i=state.step;
  $("#guided-position").textContent="Step "+(i+1)+" of "+t.steps.length;
  $("#guided-heading").textContent="Step "+(i+1);
  $("#guided-text").textContent=t.steps[i];
  $("#guided-image").innerHTML=visualAt(t,i);
  $("#guided-prev").disabled=i===0;
  $("#guided-next").textContent=i===t.steps.length-1?"See all steps →":"Next step →";
  attachVisualFallback($("#guided-steps"));
}
function setMode(mode){
  state.mode=mode==="guided"?"guided":"all";
  $("#mode-all").setAttribute("aria-pressed",String(state.mode==="all"));
  $("#mode-guided").setAttribute("aria-pressed",String(state.mode==="guided"));
  $("#all-steps").hidden=state.mode!=="all";
  $("#guided-steps").hidden=state.mode!=="guided";
  if(state.mode==="guided")renderGuided();
  $(".dialog-content").scrollTop=0;
}
function renderRelated(t){
  const same=tips.filter(x=>x.category===t.category&&x.id!==t.id);
  const selected=same.slice(0,2);
  $("#related-wrap").hidden=selected.length===0;
  $("#related-tips").innerHTML='<div class="related-grid">'+selected.map(x=>'<button class="related-tip" data-tip="'+x.id+'" type="button"><span>'+escapeHTML(x.title)+'</span><span aria-hidden="true">→</span></button>').join("")+'</div>';
}
function helpFor(t){
  const byApp={
    MacBook:"Mac settings and controls can differ by macOS version, keyboard and school-managed restrictions.",
    Outlook:"New Outlook for Mac and Outlook in the browser may show different menus. The account type can also affect availability.",
    Teams:"Teams can show combined Chat and Teams views, depending on the version and school account.",
    Chrome:"Make sure Chrome is the active application. Some menu options depend on your Chrome version."
  }[t.category];
  return (t.note?"<p><strong>For this tip:</strong> "+escapeHTML(t.note)+"</p>":"")+
    "<ul><li>Check that you're using the correct app and the latest available version.</li><li>"+escapeHTML(byApp)+"</li><li>Use the official support link below for current, vendor-specific instructions.</li></ul>";
}
const dialog=$("#tip-dialog");
function renderTip(id,pushed=false){
  const t=tipMap.get(id);if(!t)return;
  cancelSpeech();
  state.tip=id;state.mode="all";state.step=0;state.fromPush=pushed;
  if(!dialog.open){previousFocus=document.activeElement;dialog.showModal();}
  $("#tip-kicker").textContent=t.category.toUpperCase()+(t.bonus?" · BONUS TIP":" · HOW-TO GUIDE");
  $("#tip-title").textContent=t.title;
  $("#tip-intro").textContent="A practical reference to follow on your own device. Use the step-by-step view if you'd prefer one instruction at a time.";
  $("#tip-location").textContent=t.where;
  $("#tip-try").textContent=t.try;
  $("#tip-help-body").innerHTML=helpFor(t);
  $("#tip-help").open=false;
  $("#tip-reviewed").textContent="Content reviewed 2 Nov 2026 · menus may vary";
  $("#tip-official").href=safeSource(t.source);
  $("#tip-fav").textContent=favourites.has(id)?"♥":"♡";
  $("#tip-fav").setAttribute("aria-pressed",String(favourites.has(id)));
  $("#tip-fav").setAttribute("aria-label",favourites.has(id)?"Remove saved tip":"Save this tip");
  $("#mode-all").setAttribute("aria-pressed","true");
  $("#mode-guided").setAttribute("aria-pressed","false");
  $("#all-steps").hidden=false;$("#guided-steps").hidden=true;
  renderAll(t);renderRelated(t);
  $(".dialog-content").scrollTop=0;$("#tip-title").focus({preventScroll:true});
}
function openTip(id){
  if(!tipMap.has(id))return;
  if(dialog.open&&state.tip===id)return;
  if(dialog.open){
    history.replaceState({tip:id},"","#tip-"+id);
    renderTip(id,true);
  }else{
    history.pushState({tip:id},"","#tip-"+id);
    renderTip(id,true);
  }
}
function syncLocation(){
  const match=location.hash.match(/^#tip-([tb][0-9]{2})$/);
  if(match&&tipMap.has(match[1])){
    if(!dialog.open||state.tip!==match[1])renderTip(match[1],false);
    return;
  }
  if(dialog.open){
    cancelSpeech();dialog.close();state.tip=null;state.fromPush=false;
    if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    else $("#library-query").focus({preventScroll:true});
  }
}
function closeTip(){
  if(!dialog.open)return;
  if(state.fromPush)history.back();
  else{history.replaceState({},"","#library");syncLocation();}
}
function copyTip(){
  const url=location.origin+location.pathname+"#tip-"+state.tip;
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>announce("Tip link copied.")).catch(()=>prompt("Copy this link:",url));
  else prompt("Copy this link:",url);
}
function cancelSpeech(){if(reading){window.speechSynthesis?.cancel();reading=null;}const b=$("#listen-tip");if(b)b.textContent="▶ Listen to instructions";}
function listen(){
  const t=tipMap.get(state.tip);
  if(!t||!("speechSynthesis" in window))return;
  if(reading){cancelSpeech();return;}
  const words=[t.title,"Where to go: "+t.where,...t.steps.map((s,i)=>"Step "+(i+1)+". "+s),"Useful to try: "+t.try].join(". ");
  const utterance=new SpeechSynthesisUtterance(words);utterance.lang="en-US";utterance.rate=.92;
  utterance.onend=()=>{reading=null;$("#listen-tip").textContent="▶ Listen to instructions";};
  utterance.onerror=()=>{reading=null;$("#listen-tip").textContent="▶ Listen to instructions";};
  reading=utterance;speechSynthesis.speak(utterance);$("#listen-tip").textContent="■ Stop reading";
}
function mountListen(){
  if(!("speechSynthesis" in window))return;
  const button=document.createElement("button");button.id="listen-tip";button.className="listen-button";button.type="button";button.textContent="▶ Listen to instructions";button.addEventListener("click",listen);
  $(".tip-modes").insertAdjacentElement("afterend",button);
}
function setupEvents(){
  $("#hero-search").addEventListener("submit",e=>{e.preventDefault();searchFor($("#hero-query").value);});
  $("#library-query").addEventListener("input",e=>{state.query=e.target.value.trim();state.shown=55;$("#hero-query").value=e.target.value;renderTips();});
  $("#sort-by").addEventListener("change",e=>{state.sort=e.target.value;renderTips();});
  $("#saved-only").addEventListener("change",e=>{state.savedOnly=e.target.checked;state.collection=null;state.shown=55;renderTips();});
  $("#clear-filters").addEventListener("click",()=>{reset();$("#library-query").focus();});
  $("#load-more").addEventListener("click",()=>{state.shown=Math.min(state.shown+15,tips.length);renderTips();});
  $("#header-search").addEventListener("click",()=>{scrollToID("top");$("#hero-query").focus();});
  $("#menu-toggle").addEventListener("click",()=>{const isOpen=$("#main-nav").classList.toggle("open");$("#menu-toggle").setAttribute("aria-expanded",String(isOpen));});
  $$(".main-nav a").forEach(a=>a.addEventListener("click",navClose));
  $("#view-saved").addEventListener("click",()=>{reset();state.savedOnly=true;state.shown=55;renderTips();scrollToID("library");$("#library-query").focus();});
  $("#clear-saved").addEventListener("click",()=>{if(favourites.size===0)return;if(!confirm("Remove all saved tips from this browser?"))return;favourites.clear();saveFavourites();renderTips();renderSaved();announce("Saved tips cleared.");});
  $("#language").addEventListener("change",e=>{lang=e.target.value;try{localStorage.setItem("macbook-lang",JSON.stringify(lang));}catch{}translate();});
  $("#mode-all").addEventListener("click",()=>setMode("all"));$("#mode-guided").addEventListener("click",()=>setMode("guided"));
  $("#guided-prev").addEventListener("click",()=>{state.step=Math.max(0,state.step-1);renderGuided();$("#guided-heading").focus();});
  $("#guided-next").addEventListener("click",()=>{const t=tipMap.get(state.tip);if(state.step===t.steps.length-1){setMode("all");$("#mode-all").focus();return;}state.step++;renderGuided();$("#guided-heading").focus();});
  $("#tip-back").addEventListener("click",e=>{e.preventDefault();closeTip();});
  $("#tip-close").addEventListener("click",closeTip);
  $("#tip-fav").addEventListener("click",()=>changeFavourite(state.tip,false));
  $("#tip-copy").addEventListener("click",copyTip);
  $("#tip-print").addEventListener("click",()=>window.open("./print.html?tip="+encodeURIComponent(state.tip),"_blank","noopener"));
  dialog.addEventListener("cancel",e=>{e.preventDefault();closeTip();});
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeTip();});
  document.addEventListener("click",e=>{
    const button=e.target.closest("button");if(!button)return;
    if(button.dataset.tip){openTip(button.dataset.tip);return;}
    if(button.dataset.save){changeFavourite(button.dataset.save,true);return;}
    if(button.dataset.category){selectCategory(button.dataset.category);return;}
    if(button.dataset.filter){state.category=button.dataset.filter;state.collection=null;state.query="";state.shown=55;$("#hero-query").value="";$("#library-query").value="";renderTips();return;}
    if(button.dataset.searchTerm){searchFor(button.dataset.searchTerm);return;}
    if(button.dataset.collection){selectCollection(Number(button.dataset.collection));return;}
    if(button.dataset.reset){reset();$("#library-query").focus();}
  });
  document.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){
      e.preventDefault();
      if(dialog.open)closeTip();
      scrollToID("library");$("#library-query").focus();
    }
  });
  window.addEventListener("popstate",syncLocation);
  window.addEventListener("hashchange",syncLocation);
}
function init(){
  $("#hero-count").textContent=String(tips.length);
  renderPopular();renderCategories();renderFilters();renderTips();renderCollections();renderShortcuts();renderSaved();translate();mountListen();setupEvents();
  if(location.hash.startsWith("#tip-"))syncLocation();
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();