/* MacBook Productivity / accessible, client-only learning experience */
(function () {
  "use strict";
  const allTips = Array.isArray(window.TIPS) ? window.TIPS : [];
  const validIds = new Set(allTips.map(t => t.id));
  const tipById = new Map(allTips.map(t => [t.id, t]));
  const CATEGORIES = ["All", "MacBook", "Outlook", "Teams", "Chrome"];
  const SYMBOLS = {MacBook:"⌘", Outlook:"✉", Teams:"▦", Chrome:"◎"};
  const CATEGORY_SUMMARY = {
    MacBook:"Get comfortable with settings, windows and shortcuts.",
    Outlook:"Spend less time in your inbox and calendar.",
    Teams:"Make meetings and communication work for you.",
    Chrome:"Find pages, manage tabs and browse with confidence."
  };
  const FEATURED = ["t16","t24","t40","t51","t22","t27","t41","t48","t17","t31","t38","t47"];
  const POPULAR = ["t22","t24","t41","t51"];
  const PATHS = [
    {title:"Feel at home on your Mac",intro:"Set up your device, move faster and make everyday actions feel natural.",ids:["t01","t11","t12","t16","t17","t21"],symbol:"⌘"},
    {title:"Take back your inbox",intro:"Create a calmer, more purposeful email routine you can maintain.",ids:["t23","t24","t25","t27","t28","t31"],symbol:"✉"},
    {title:"Protect your attention",intro:"Reduce unnecessary interruptions and stay organised across apps.",ids:["t19","t34","t41","t42","t46","t50"],symbol:"◉"}
  ];
  const QUIZ = [
    {question:"Which shortcut opens Spotlight search?",choices:["⌘ Space","⌘ T","⌘ F","Control + Space"],answer:0,tip:"t16"},
    {question:"How do you preview a selected file in Finder?",choices:["⌘ P","Space","⌘ L","⇧ ⌘ T"],answer:1,tip:"t21"},
    {question:"Which shortcut restores a closed Chrome tab?",choices:["⌘ W","⌘ R","⇧ ⌘ T","⌘ D"],answer:2,tip:"t51"},
    {question:"Which shortcut opens Mac screenshot controls?",choices:["⌘ 5","⇧ ⌘ 5","Control + 5","⌘ F"],answer:1,tip:"t22"},
    {question:"How do you quickly switch between open apps?",choices:["⌘ Tab","⌘ L","⌘ D","⌘ P"],answer:0,tip:"t17"},
    {question:"Which shortcut focuses the Chrome address bar?",choices:["⌘ E","⌘ L","⌘ T","⌘ H"],answer:1,tip:"t47"},
    {question:"What searches open Chrome tabs in the address bar?",choices:["@history","@bookmarks","@tabs","@files"],answer:2,tip:"t45"},
    {question:"What is Chrome's bookmark shortcut?",choices:["⌘ D","⇧ ⌘ D","⌘ P","⌘ S"],answer:0,tip:"t50"}
  ];
  const I18N = {
    en:{navLearn:"Explore",navPaths:"Learning paths",navPractice:"Practice",navProgress:"My learning",search:"Search",menu:"Menu",heroLabel:"THE EVERYDAY PRODUCTIVITY LAB",heroTitle:"A little more confident.",heroEm:"A lot more productive.",heroDesc:"Clear, practical help for the tools you use every day. Find an answer in seconds, or follow a guided lesson at your own pace.",findHelp:"Find help →",heroHint:"Try “record my screen”, “quiet Teams”, “schedule email”, or “restore tabs”.",walkthroughs:"walkthroughs",selfPaced:"Self-paced • No account needed",startHere:"START HERE",commonTasks:"Common tasks",oneUsefulThing:"What’s one useful thing you could learn today?",popularNote:"Each lesson includes clear steps, a visual guide, and something to try.",chooseToolLabel:"01 / CHOOSE WHAT YOU NEED",chooseToolTitle:"Find help that fits your day.",chooseToolDesc:"Start with an app, or search for a task. No need to know the technical name.",browseAll:"Browse all lessons ↗",tipLibrary:"The learning library",libraryDesc:"Search, filter and open any lesson. Save your favourites for later.",clearFilters:"Clear filters ↺",savedOnly:"Saved only",pathsLabel:"02 / LEARN WITH PURPOSE",pathsTitle:"Not sure where to start?",pathsDesc:"Choose a short learning path. Each one builds confidence through six useful skills.",practiceLabel:"03 / LEARN BY DOING",practiceTitle:"Try it. Remember it.",practiceDesc:"Practice the shortcuts that save small moments every day. Your result is for you, not a grade.",progressLabel:"04 / YOUR LEARNING",progressTitle:"Pick up where you left off.",progressDesc:"Save useful tips, track what you've actually tried and get a practical suggestion for what to explore next.",yourProgress:"Your progress",progressLocal:"Saved privately in this browser. Nothing is sent to a school server.",dataSettings:"Manage my learning data",backLessons:"Back to lessons",showMore:"Show more lessons ↓",tryAgain:"Try again ↺"},
    zh:{navLearn:"探索技巧",navPaths:"学习路径",navPractice:"练习",navProgress:"我的学习",search:"搜索",menu:"菜单",heroLabel:"日常效率学习中心",heroTitle:"多一点自信。",heroEm:"多一些效率。",heroDesc:"使用 MacBook、Outlook、Teams 和 Chrome 的实用指引。快速查找答案，或按自己的节奏逐步学习。",findHelp:"查找帮助 →",heroHint:"例如：录制屏幕、关闭 Teams 通知、定时发送邮件、恢复标签页。",walkthroughs:"项操作指引",selfPaced:"自主学习 · 无需账户",startHere:"从这里开始",commonTasks:"常见任务",oneUsefulThing:"今天想学会哪项实用技能？",popularNote:"每节课都包含操作步骤、示意图和练习。",chooseToolLabel:"01 / 选择需要的工具",chooseToolTitle:"轻松找到适合自己的帮助。",chooseToolDesc:"选择应用程序或直接搜索任务，无需知道技术术语。",browseAll:"浏览全部课程 ↗",tipLibrary:"学习资源库",libraryDesc:"搜索、筛选并打开课程，还可以收藏技巧。",clearFilters:"清除筛选 ↺",savedOnly:"仅看收藏",pathsLabel:"02 / 有目标地学习",pathsTitle:"不知道从哪里开始？",pathsDesc:"选择简短的学习路径，逐步建立信心。",practiceLabel:"03 / 动手练习",practiceTitle:"练一练，记得牢。",practiceDesc:"练习每天都能用到的快捷键。",progressLabel:"04 / 我的学习",progressTitle:"继续上次的学习。",progressDesc:"收藏技巧，记录练习进度并获得下一步建议。",yourProgress:"学习进度",progressLocal:"进度仅保存在此浏览器，不会发送到学校服务器。",dataSettings:"管理我的学习记录",backLessons:"返回课程",showMore:"显示更多课程 ↓",tryAgain:"再试一次 ↺"},
    ko:{navLearn:"팁 살펴보기",navPaths:"학습 경로",navPractice:"연습",navProgress:"내 학습",search:"검색",menu:"메뉴",heroLabel:"일상 생산성 학습 공간",heroTitle:"조금 더 자신 있게.",heroEm:"훨씬 더 효율적으로.",heroDesc:"MacBook, Outlook, Teams, Chrome를 위한 실용적인 안내입니다. 빠르게 답을 찾거나 차근차근 따라 해 보세요.",findHelp:"도움말 찾기 →",heroHint:"예: 화면 녹화, Teams 알림 줄이기, 이메일 예약, 탭 복원",walkthroughs:"개 안내",selfPaced:"자기 주도 학습 · 계정 불필요",startHere:"여기서 시작",commonTasks:"자주 하는 작업",oneUsefulThing:"오늘 어떤 기술을 배우고 싶나요?",popularNote:"각 수업에 단계별 설명과 그림, 연습이 있습니다.",chooseToolLabel:"01 / 필요한 도구 선택",chooseToolTitle:"나에게 맞는 도움을 찾아보세요.",chooseToolDesc:"앱을 고르거나 원하는 작업을 검색하세요.",browseAll:"모든 수업 보기 ↗",tipLibrary:"학습 자료실",libraryDesc:"수업을 검색하고 필터링하여 즐겨찾기에 저장하세요.",clearFilters:"필터 초기화 ↺",savedOnly:"저장한 항목만",pathsLabel:"02 / 목표별 학습",pathsTitle:"어디서 시작할지 모르겠나요?",pathsDesc:"짧은 학습 경로를 선택하고 차근차근 배워보세요.",practiceLabel:"03 / 직접 해 보기",practiceTitle:"연습하고 기억하세요.",practiceDesc:"매일 유용한 단축키를 연습해 보세요.",progressLabel:"04 / 나의 학습",progressTitle:"이어서 학습하세요.",progressDesc:"유용한 팁을 저장하고 진행 상황을 확인하세요.",yourProgress:"학습 진행",progressLocal:"진행 상황은 이 브라우저에만 저장됩니다.",dataSettings:"학습 데이터 관리",backLessons:"수업 목록으로",showMore:"수업 더 보기 ↓",tryAgain:"다시 시도 ↺"}
  };
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const localRead=(key,fallback)=>{
    try {const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw);}
    catch{return fallback;}
  };
  const cleanIds=arr=>Array.isArray(arr)?arr.filter(id=>typeof id==="string"&&validIds.has(id)):[];
  let done=new Set(cleanIds(localRead("macbook-completed",[])));
  let faves=new Set(cleanIds(localRead("macbook-favorites",[])));
  let recent=cleanIds(localRead("macbook-recent",[])).slice(0,8);
  let lang=["en","zh","ko"].includes(localRead("macbook-lang","en"))?localRead("macbook-lang","en"):"en";
  let state={query:"",category:"All",savedOnly:false,sort:"useful",visible:9,path:null,lesson:null,mode:"guided",step:0,fromPush:false,quizIndex:0,quizChoice:null,quizCorrect:0,quizWrong:[],quizDone:false};
  let previousFocus=null,noticeTimer=null,readAloud=null;
  function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function saveLocal(){try{localStorage.setItem("macbook-completed",JSON.stringify([...done]));localStorage.setItem("macbook-favorites",JSON.stringify([...faves]));localStorage.setItem("macbook-recent",JSON.stringify(recent));}catch{notify("This browser did not allow progress to be saved.");}}
  function notify(message){const t=$("#toast");t.textContent=message;t.classList.add("visible");clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>t.classList.remove("visible"),3500);}
  function scrollToId(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});closeNav();}
  function closeNav(){$("#main-nav").classList.remove("is-open");$("#menu-toggle").setAttribute("aria-expanded","false");}
  function applyTranslations(){const dict=I18N[lang]||I18N.en;$$("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(dict[key]){el.textContent=dict[key];el.setAttribute("lang",lang);}});$("#hero-query").placeholder=lang==="zh"?"您想做什么？":lang==="ko"?"어떤 작업을 배우고 싶나요?":"What would you like to do?";$("#library-query").placeholder=lang==="zh"?"搜索课程、快捷键或任务":lang==="ko"?"수업, 단축키, 작업 검색":"Search lessons, shortcuts, or tasks";$("#language-note").textContent=lang==="zh"?"导航提供中文；详细操作说明目前为英文。":lang==="ko"?"메뉴는 한국어로 제공되지만 세부 사용 안내는 영어입니다.":"Lesson instructions remain in English; navigation can be translated.";$("#language").value=lang;}
  function renderPopular(){$("#popular-list").innerHTML=POPULAR.map(id=>{const t=tipById.get(id);return '<button type="button" class="popular-item" data-tip="'+id+'"><span class="popular-icon" aria-hidden="true">'+SYMBOLS[t.category]+'</span><span class="popular-text"><strong>'+escapeHTML(t.title)+'</strong><small>'+escapeHTML(t.category)+' · 3 clear steps</small></span><span class="popular-arrow" aria-hidden="true">→</span></button>';}).join("");}
  function renderCategories(){$("#category-grid").innerHTML=CATEGORIES.slice(1).map(c=>'<button type="button" class="category-card" data-category="'+escapeHTML(c)+'"><span class="category-icon" aria-hidden="true">'+SYMBOLS[c]+'</span><span class="category-title">'+escapeHTML(c)+'</span><span class="category-detail">'+escapeHTML(CATEGORY_SUMMARY[c])+'</span><span class="category-count">'+allTips.filter(t=>!t.bonus&&t.category===c).length+' core lessons · Explore →</span></button>').join("");}
  function renderFilters(){$("#category-filters").innerHTML=CATEGORIES.map(c=>'<button type="button" data-filter="'+c+'" aria-pressed="false">'+c+'</button>').join("");updateFilterStates();}
  function updateFilterStates(){$$("[data-filter]").forEach(b=>{const yes=b.dataset.filter===state.category;b.setAttribute("aria-pressed",String(yes));});$("#saved-only").checked=state.savedOnly;$("#sort-by").value=state.sort;$("#clear-filters").disabled=!state.query&&state.category==="All"&&!state.savedOnly&&!state.path;}
  function scoreSearch(t,q){const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return 1;
    const title=t.title.toLowerCase(),corpus=[t.title,t.category,t.where,...t.steps,t.try,t.note].join(" ").toLowerCase();
    const synonyms={record:["screen record","capture","screenshot"],quiet:["mute","do not disturb","notification","focus"],find:["search","spotlight","locate"],schedule:["send","meeting","calendar"],tabs:["tab","chrome","browser"],email:["outlook","message","mail"],shortcut:["command","keyboard","⌘"],organize:["tidy","folder","stacks","group"],organise:["tidy","folder","stacks","group"]};
    return terms.every(word=>corpus.includes(word)||(synonyms[word]||[]).some(x=>corpus.includes(x)))?terms.reduce((n,word)=>n+(title.includes(word)?6:corpus.includes(word)?2:1),0):0;
  }
  function sortedResults(){const results=allTips.filter(t=>(state.category==="All"||state.category===t.category)&&(!state.savedOnly||faves.has(t.id))&&(!state.path||state.path.includes(t.id))&&scoreSearch(t,state.query)>0);
    if(state.sort==="az")return results.sort((a,b)=>a.title.localeCompare(b.title));
    if(state.sort==="app")return results.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
    if(state.query)return results.sort((a,b)=>scoreSearch(b,state.query)-scoreSearch(a,state.query)||a.title.localeCompare(b.title));
    const order=[...FEATURED,...allTips.map(t=>t.id)];
    return results.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
  }
  function renderTips(focusFavId){updateFilterStates();const results=sortedResults();
    const title=state.path?"Learning path · ":state.savedOnly?"Saved lessons · ":"";
    $("#result-count").textContent=title+results.length+" lesson"+(results.length===1?"":"s")+" found"+(state.query?' for "'+state.query+'"':"");
    const shown=results.slice(0,state.visible);
    $("#tips-grid").innerHTML=shown.map(t=>'<article class="tip-card"><div class="tip-top"><span class="tip-type">'+escapeHTML(t.category)+(t.bonus?" · BONUS":"")+'</span><button type="button" class="save-button" data-save="'+t.id+'" aria-pressed="'+faves.has(t.id)+'" aria-label="'+(faves.has(t.id)?"Remove saved lesson: ":"Save lesson: ")+escapeHTML(t.title)+'" title="'+(faves.has(t.id)?"Remove from saved":"Save for later")+'">'+(faves.has(t.id)?"♥":"♡")+'</button></div><h4>'+escapeHTML(t.title)+'</h4><p>'+escapeHTML(t.where)+'</p><div class="tip-bottom"><span class="status-small '+(done.has(t.id)?"complete":"")+'">'+(done.has(t.id)?"✓ Practised":t.steps.length+" short steps")+'</span><button type="button" class="tip-open" data-tip="'+t.id+'" aria-label="Open walkthrough: '+escapeHTML(t.title)+'">Open lesson →</button></div></article>').join("")||'<div class="empty-results"><h4>No lessons found</h4><p>Try a different word or remove your filters.</p><button class="button outline-button" type="button" data-reset="true">See all lessons</button></div>';
    $("#load-row").hidden=results.length<=state.visible;
    if(focusFavId){const b=$('[data-save="'+focusFavId+'"]');if(b)b.focus();else $("#library-query").focus();}
  }
  function setSearch(query,focus){state.query=query.trim();state.visible=55;$("#library-query").value=query;$("#hero-query").value=query;renderTips();if(focus){scrollToId("library");$("#library-query").focus();}}
  function setCategory(category,focusLibrary){state.category=CATEGORIES.includes(category)?category:"All";state.path=null;state.savedOnly=false;state.visible=18;renderTips();if(focusLibrary)scrollToId("library");}
  function resetFilters(){state.category="All";state.query="";state.path=null;state.savedOnly=false;state.sort="useful";state.visible=9;$("#hero-query").value="";$("#library-query").value="";renderTips();}
  function renderPaths(){$("#path-grid").innerHTML=PATHS.map((p,i)=>{const n=p.ids.filter(id=>done.has(id)).length;return '<button type="button" class="path-card" data-path="'+i+'"><span class="path-number">PATH '+String(i+1).padStart(2,"0")+' · '+p.ids.length+' SKILLS</span><h3>'+escapeHTML(p.title)+'</h3><p>'+escapeHTML(p.intro)+'</p><span class="path-progress">'+n+' of '+p.ids.length+' practised</span><progress max="'+p.ids.length+'" value="'+n+'" aria-label="'+escapeHTML(p.title)+' progress: '+n+' of '+p.ids.length+'">'+n+' / '+p.ids.length+'</progress><span class="path-start">Explore this path →</span></button>';}).join("");}
  function showPath(i){const p=PATHS[i];if(!p)return;state.path=p.ids;state.category="All";state.query="";state.savedOnly=false;state.visible=55;$("#hero-query").value="";$("#library-query").value="";renderTips();scrollToId("library");$("#library-query").focus();notify("Showing "+p.title);}
  function refreshProgress(){
    $("#hero-count").textContent=String(allTips.length);
    $("#progress-count").innerHTML=done.size+' <small>of '+allTips.length+' lessons</small>';
    const pc=Math.round(done.size/allTips.length*100);
    $("#progress-percent").textContent=pc+"%";$("#main-progress").value=done.size;$("#main-progress").max=allTips.length;
    const preferred=recent.length?tipById.get(recent[0])?.category:null;
    let next=allTips.find(t=>!done.has(t.id)&&t.category===preferred);
    if(!next)next=FEATURED.map(id=>tipById.get(id)).find(t=>t&&!done.has(t.id));
    if(!next)next=allTips.find(t=>!done.has(t.id))||allTips[0];
    if(next){$("#next-title").textContent=next.title;$("#next-description").textContent=next.where+" · "+next.steps.length+" steps to try";$("#next-open").dataset.tip=next.id;}
    renderPaths();
  }
  function toggleSaved(id,originButton){if(!tipById.has(id))return;if(faves.has(id))faves.delete(id);else faves.add(id);saveLocal();
    if(state.lesson===id){const b=$("#lesson-save");b.setAttribute("aria-pressed",String(faves.has(id)));b.textContent=faves.has(id)?"♥":"♡";b.setAttribute("aria-label",faves.has(id)?"Remove saved lesson":"Save this lesson");}
    renderTips(originButton?id:null);refreshProgress();notify(faves.has(id)?"Saved for later.":"Removed from your saved lessons.");
  }
  function markPractised(id){if(!tipById.has(id))return;done.add(id);saveLocal();refreshProgress();renderTips();$("#lesson-feedback").hidden=false;$("#lesson-feedback").textContent="Nicely done. This lesson is now in your completed list. You can return to it any time.";notify("Lesson marked as practised.");}
  function helpContent(t){const extra=t.note?'<p><strong>For this tip:</strong> '+escapeHTML(t.note)+'</p>':"";
    const appNote=t.category==="Outlook"?"Mac app and browser Outlook may have different labels. Check the account type and switch between Mail and Calendar as needed.":t.category==="Teams"?"Teams can display combined Chat and Teams views. Check the menu beside the chat or channel as well as Settings.":t.category==="Chrome"?"Make sure Chrome is the frontmost app and try its main menu if a shortcut is unavailable.":"Mac menus can differ by macOS version, keyboard layout and school-managed settings.";
    return extra+'<ul><li>Make sure the correct app is open and up to date.</li><li>'+escapeHTML(appNote)+'</li><li>If your screen is different, use the official help link below or ask the school technology team.</li></ul>';
  }
  function getSegments(t){let steps=t.where.replace(/\s*;\s*/g," → ").split(/\s*→\s*/).map(s=>s.trim()).filter(Boolean);
    if(steps.length>5)steps=steps.slice(0,5);return steps.length?steps:[t.category];}
  function visualMap(t,index){const parts=getSegments(t);const current=Math.min(index,parts.length-1);
    return '<div class="visual-map" aria-hidden="true"><div class="visual-top"><span class="visual-dots"><i></i><i></i><i></i></span><span>'+escapeHTML(t.category)+' — where to look</span><span>•••</span></div><div class="visual-screen"><div class="visual-sidebar"><b>'+escapeHTML(t.category.toUpperCase())+'</b><div></div><div></div><div></div><div></div></div><div class="visual-main"><h4>Follow this location path</h4><div class="visual-crumbs">'+parts.map((s,i)=>'<span class="visual-crumb '+(i===current?"current":"")+'">'+escapeHTML(s)+'</span>').join("")+'</div><div class="visual-line"></div><div class="visual-line short"></div></div></div></div><p class="visual-caption"><strong>Illustrative map, not a screenshot.</strong> Menus and controls may look different on your device.</p>';
  }
  const dialog=$("#lesson-dialog");
  function renderLesson(id,historyEntry){const t=tipById.get(id);if(!t)return;
    state.lesson=id;state.mode="guided";state.step=0;state.fromPush=!!historyEntry;
    if(!dialog.open){previousFocus=document.activeElement;dialog.showModal();}
    $("#lesson-kicker").textContent=t.category.toUpperCase()+(t.bonus?" · BONUS TIP":" · FACULTY GUIDE");
    $("#lesson-title").textContent=t.title;
    $("#lesson-intro").textContent="Follow these steps on your own Mac, or switch to Quick answer if you already know the basics.";
    $("#quick-where").textContent=t.where;
    $("#quick-steps").innerHTML=t.steps.map(s=>'<li>'+escapeHTML(s)+'</li>').join("");
    $("#quick-try").textContent=t.try;
    $("#help-body").innerHTML=helpContent(t);
    $("#lesson-help").open=false;
    $("#lesson-feedback").hidden=true;
    $("#lesson-save").setAttribute("aria-pressed",String(faves.has(id)));$("#lesson-save").textContent=faves.has(id)?"♥":"♡";
    $("#lesson-save").setAttribute("aria-label",faves.has(id)?"Remove saved lesson":"Save this lesson");
    $("#official-source").href=t.source&&/^https:\/\//.test(t.source)?t.source:"https://support.apple.com/guide/mac-help/welcome/mac";
    $("#last-reviewed").textContent="Content reviewed 2 Nov 2026 · menus may vary";
    $("#lesson-print").dataset.print=id;
    $("#mode-guided").setAttribute("aria-pressed","true");$("#mode-quick").setAttribute("aria-pressed","false");$("#guided-panel").hidden=false;$("#quick-panel").hidden=true;
    recent=[id,...recent.filter(x=>x!==id)].slice(0,8);saveLocal();refreshProgress();renderGuided();
    $(".lesson-body").scrollTop=0;$("#lesson-title").focus({preventScroll:true});
  }
  function goToTip(id){if(!tipById.has(id))return;if(dialog.open&&state.lesson===id)return;
    history.pushState({tip:id},"","#tip-"+id);renderLesson(id,true);}
  function showFromUrl(){const found=location.hash.match(/^#tip-([tb][0-9]{2})$/);if(found&&tipById.has(found[1])){
      if(dialog.open&&state.lesson===found[1])return;
      renderLesson(found[1],false);return;
    }
    if(dialog.open){dialog.close();state.lesson=null;state.fromPush=false;window.speechSynthesis?.cancel();document.body.classList.remove("dialog-active");
      if(previousFocus&&previousFocus.isConnected){previousFocus.focus({preventScroll:true});}else{$("#library-query").focus({preventScroll:true});}
    }
  }
  function requestClose(){if(!dialog.open)return;
    if(state.fromPush){history.back();return;}
    history.replaceState({},"","#library");showFromUrl();
  }
  function renderGuided(){const t=tipById.get(state.lesson);if(!t)return;
    const count=t.steps.length+1,index=state.step,practice=index===t.steps.length;
    $("#step-count").textContent=practice?"Practice and check":"Step "+(index+1)+" of "+t.steps.length;
    $("#step-percent").textContent=Math.round((index+1)/count*100)+"%";
    $("#lesson-progress").max=count;$("#lesson-progress").value=index+1;
    $("#step-heading").textContent=practice?"Try it yourself":("Step "+(index+1)+": "+(index===0?"Find the control":index===1?"Make the change":"Check and finish"));
    $("#step-description").textContent=practice?t.try:t.steps[index];
    $("#step-visual").innerHTML=practice?'<div class="try-box"><strong>CHECK YOUR LEARNING</strong><p>Try it on your own device. Did it work?</p></div><div class="lesson-outcome"><button type="button" class="button primary-button" data-outcome="worked">✓ Yes, it worked</button><button type="button" class="button outline-button" data-outcome="help">Not yet — help me</button></div>':visualMap(t,index);
    $("#step-prev").disabled=index===0;$("#step-next").hidden=practice;
    $("#step-next").textContent=index===t.steps.length-1?"Try it yourself →":"Next step →";
    $("#lesson-feedback").hidden=true;
  }
  function setMode(mode){state.mode=mode==="quick"?"quick":"guided";
    $("#mode-guided").setAttribute("aria-pressed",String(state.mode==="guided"));
    $("#mode-quick").setAttribute("aria-pressed",String(state.mode==="quick"));
    $("#guided-panel").hidden=state.mode!=="guided";$("#quick-panel").hidden=state.mode!=="quick";$("#lesson-feedback").hidden=true;
    $(".lesson-body").scrollTop=0;
  }
  function helpNow(){const details=$("#lesson-help");details.open=true;details.querySelector("summary").focus();details.scrollIntoView({block:"nearest"});notify("Try the alternative suggestions below.");}
  function copyLessonLink(){const url=location.origin+location.pathname+"#tip-"+state.lesson;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(()=>notify("Link copied.")).catch(()=>window.prompt("Copy this link:",url));}else window.prompt("Copy this link:",url);}
  function startSpeech(){if(!("speechSynthesis" in window)||!state.lesson)return;
    const btn=$("#speak-lesson");if(readAloud){speechSynthesis.cancel();readAloud=null;btn.textContent="▶ Listen to instructions";return;}
    const t=tipById.get(state.lesson);const content=[t.title,"Where to go: "+t.where,...t.steps.map((s,i)=>"Step "+(i+1)+". "+s),"Try it: "+t.try].join(". ");
    const utterance=new SpeechSynthesisUtterance(content);utterance.lang="en-US";utterance.rate=.92;utterance.onend=()=>{readAloud=null;btn.textContent="▶ Listen to instructions";};utterance.onerror=()=>{readAloud=null;btn.textContent="▶ Listen to instructions";};
    readAloud=utterance;speechSynthesis.speak(utterance);btn.textContent="■ Stop reading";
  }
  function mountSpeakButton(){if(!("speechSynthesis" in window))return;const btn=document.createElement("button");btn.id="speak-lesson";btn.className="listen-button";btn.type="button";btn.textContent="▶ Listen to instructions";btn.addEventListener("click",startSpeech);$(".mode-toolbar").insertAdjacentElement("afterend",btn);}
  function renderShortcuts(){const items=[["Spotlight","⌘ Space"],["Switch apps","⌘ Tab"],["Screen recording","⇧ ⌘ 5"],["Chrome: find on page","⌘ F"],["Restore closed tab","⇧ ⌘ T"]];$("#shortcut-list").innerHTML=items.map(i=>'<div class="shortcut-item"><span>'+escapeHTML(i[0])+'</span><kbd>'+escapeHTML(i[1])+'</kbd></div>').join("");}
  function renderQuiz(){if(state.quizDone){const total=QUIZ.length;$("#quiz-active").hidden=true;$("#quiz-results").hidden=false;$("#quiz-progress").textContent=total+" / "+total;
      $("#quiz-score").textContent=state.quizCorrect+" of "+total+" correct";
      $("#quiz-summary").textContent=state.quizCorrect===total?"You know these shortcuts well. Try them during your next working day.":"Great effort. Review any unfamiliar shortcuts below, then try another round.";
      $("#quiz-review").innerHTML=state.quizWrong.length?'<p>Good lessons to revisit:</p>'+state.quizWrong.map(id=>'<button class="button outline-button quiz-review-link" type="button" data-tip="'+id+'">'+escapeHTML(tipById.get(id)?.title||id)+' →</button>').join(""):"";return;
    }
    $("#quiz-active").hidden=false;$("#quiz-results").hidden=true;const q=QUIZ[state.quizIndex];
    $("#quiz-progress").textContent=(state.quizIndex+1)+" / "+QUIZ.length;
    $("#quiz-question").textContent=q.question;
    $("#quiz-options").innerHTML=q.choices.map((choice,i)=>'<button type="button" data-quiz-choice="'+i+'" aria-label="'+escapeHTML(choice)+'">'+escapeHTML(choice)+'</button>').join("");
    $("#quiz-next").disabled=true;
    $("#quiz-next").textContent=state.quizIndex===QUIZ.length-1?"See my result →":"Next question →";
    $("#quiz-feedback").textContent="Choose an answer.";
  }
  function chooseQuizAnswer(choice){if(state.quizChoice!==null)return;const q=QUIZ[state.quizIndex];state.quizChoice=choice;
    if(choice===q.answer)state.quizCorrect++;else state.quizWrong.push(q.tip);
    $$("[data-quiz-choice]").forEach(btn=>{const i=Number(btn.dataset.quizChoice);btn.disabled=true;if(i===q.answer)btn.classList.add("correct");else if(i===choice)btn.classList.add("incorrect");});
    $("#quiz-feedback").textContent=choice===q.answer?"Correct! Try this shortcut the next time you work.":"The answer is "+q.choices[q.answer]+". You can revisit the related lesson.";
    $("#quiz-next").disabled=false;
  }
  function advanceQuiz(){if(state.quizChoice===null)return;if(state.quizIndex===QUIZ.length-1)state.quizDone=true;else state.quizIndex++;state.quizChoice=null;renderQuiz();if(state.quizDone)$("#quiz-score").focus?.();}
  function restartQuiz(){state.quizIndex=0;state.quizChoice=null;state.quizCorrect=0;state.quizWrong=[];state.quizDone=false;renderQuiz();$("#quiz-question").focus();}
  function exportProgress(){const record={version:1,site:"MacBook Productivity",exportedAt:new Date().toISOString(),completed:[...done],favorites:[...faves],recent:recent};const blob=new Blob([JSON.stringify(record,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="macbook-learning-progress.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);notify("Your local progress file has been downloaded.");}
  async function importProgress(file){if(!file)return;if(file.size>100000){notify("This progress file is too large.");return;}
    try{const j=JSON.parse(await file.text());if(j.version!==1||!Array.isArray(j.completed)||!Array.isArray(j.favorites))throw new Error("Unexpected file format");
      if(!window.confirm("Replace the saved progress on this browser with the data in this file?"))return;
      done=new Set(cleanIds(j.completed));faves=new Set(cleanIds(j.favorites));recent=cleanIds(j.recent).slice(0,8);saveLocal();refreshProgress();renderTips();notify("Progress imported.");
    }catch{notify("Import failed. Please use a progress file exported from this website.");}finally{$("#import-progress").value="";}}
  function setupEvents(){
    $("#hero-search").addEventListener("submit",e=>{e.preventDefault();state.category="All";state.path=null;state.savedOnly=false;setSearch($("#hero-query").value,true);});
    $("#library-query").addEventListener("input",e=>{state.query=e.target.value.trim();state.visible=55;$("#hero-query").value=e.target.value;renderTips();});
    $("#sort-by").addEventListener("change",e=>{state.sort=e.target.value;renderTips();});
    $("#saved-only").addEventListener("change",e=>{state.savedOnly=e.target.checked;state.visible=55;state.path=null;renderTips();});
    $("#clear-filters").addEventListener("click",()=>{resetFilters();$("#library-query").focus();});
    $("#load-more").addEventListener("click",()=>{state.visible=Math.min(state.visible+15,allTips.length);renderTips();});
    $("#menu-toggle").addEventListener("click",()=>{const open=$("#main-nav").classList.toggle("is-open");$("#menu-toggle").setAttribute("aria-expanded",String(open));});
    $$(".main-nav a").forEach(a=>a.addEventListener("click",closeNav));
    $("#header-search").addEventListener("click",()=>{scrollToId("top");$("#hero-query").focus();});
    $("#text-toggle").addEventListener("click",()=>{const on=document.documentElement.dataset.largeText!=="true";document.documentElement.dataset.largeText=String(on);$("#text-toggle").setAttribute("aria-pressed",String(on));$("#text-toggle").setAttribute("aria-label",on?"Use standard text size":"Increase text size");try{localStorage.setItem("macbook-large",JSON.stringify(on));}catch{}});
    $("#theme-toggle").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme!=="dark";document.documentElement.dataset.theme=dark?"dark":"light";$("#theme-toggle").setAttribute("aria-pressed",String(dark));$("#theme-toggle").setAttribute("aria-label",dark?"Switch to light appearance":"Switch to dark appearance");try{localStorage.setItem("macbook-theme",JSON.stringify(dark?"dark":"light"));}catch{}});
    $("#language").addEventListener("change",e=>{lang=e.target.value;try{localStorage.setItem("macbook-lang",JSON.stringify(lang));}catch{}applyTranslations();});
    $("#view-saved").addEventListener("click",()=>{resetFilters();state.savedOnly=true;state.visible=55;renderTips();scrollToId("library");$("#library-query").focus();});
    $("#view-incomplete").addEventListener("click",()=>{const next=allTips.find(t=>!done.has(t.id));if(next)goToTip(next.id);else notify("You've practised every lesson. Well done!");});
    $("#export-progress").addEventListener("click",exportProgress);
    $("#import-progress").addEventListener("change",e=>importProgress(e.target.files[0]));
    $("#reset-progress").addEventListener("click",()=>{if(!window.confirm("Reset all saved and completed lessons on this browser? This cannot be undone unless you exported a backup."))return;done.clear();faves.clear();recent=[];saveLocal();refreshProgress();renderTips();notify("Learning progress cleared.");});
    $("#quiz-next").addEventListener("click",advanceQuiz);$("#quiz-restart").addEventListener("click",restartQuiz);
    $("#lesson-close").addEventListener("click",requestClose);$("#lesson-back").addEventListener("click",e=>{e.preventDefault();requestClose();});
    $("#lesson-save").addEventListener("click",()=>toggleSaved(state.lesson,false));
    $("#lesson-print").addEventListener("click",()=>window.open("./print.html?tip="+encodeURIComponent(state.lesson),"_blank","noopener"));
    $("#lesson-copy").addEventListener("click",copyLessonLink);
    $("#mode-guided").addEventListener("click",()=>setMode("guided"));$("#mode-quick").addEventListener("click",()=>setMode("quick"));
    $("#step-prev").addEventListener("click",()=>{state.step=Math.max(0,state.step-1);renderGuided();$("#step-heading").focus?.();});
    $("#step-next").addEventListener("click",()=>{const t=tipById.get(state.lesson);state.step=Math.min(t.steps.length,state.step+1);renderGuided();$("#step-heading").setAttribute("tabindex","-1");$("#step-heading").focus();});
    $("#quick-complete").addEventListener("click",()=>markPractised(state.lesson));$("#quick-help").addEventListener("click",helpNow);
    dialog.addEventListener("cancel",e=>{e.preventDefault();requestClose();});
    dialog.addEventListener("click",e=>{if(e.target===dialog)requestClose();});
    document.addEventListener("click",e=>{const tip=e.target.closest("[data-tip]");if(tip){goToTip(tip.dataset.tip);return;}
      const fav=e.target.closest("[data-save]");if(fav){toggleSaved(fav.dataset.save,true);return;}
      const cat=e.target.closest("[data-category]");if(cat){setCategory(cat.dataset.category,true);return;}
      const filter=e.target.closest("[data-filter]");if(filter){setCategory(filter.dataset.filter,false);return;}
      const path=e.target.closest("[data-path]");if(path){showPath(Number(path.dataset.path));return;}
      const choice=e.target.closest("[data-quiz-choice]");if(choice){chooseQuizAnswer(Number(choice.dataset.quizChoice));return;}
      if(e.target.closest("[data-reset]")){resetFilters();$("#library-query").focus();}
      const outcome=e.target.closest("[data-outcome]");if(outcome){outcome.dataset.outcome==="worked"?markPractised(state.lesson):helpNow();}
    });
    document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();if(dialog.open)requestClose();scrollToId("library");$("#library-query").focus();}});
    window.addEventListener("popstate",showFromUrl);window.addEventListener("hashchange",showFromUrl);
  }
  function init(){const savedTheme=localRead("macbook-theme","light");document.documentElement.dataset.theme=savedTheme==="dark"?"dark":"light";$("#theme-toggle").setAttribute("aria-pressed",String(savedTheme==="dark"));
    const large=localRead("macbook-large",false)===true;document.documentElement.dataset.largeText=String(large);$("#text-toggle").setAttribute("aria-pressed",String(large));
    $("#hero-count").textContent=String(allTips.length);renderPopular();renderCategories();renderFilters();renderShortcuts();renderTips();refreshProgress();renderQuiz();applyTranslations();mountSpeakButton();setupEvents();
    if(location.hash.startsWith("#tip-"))showFromUrl();
    if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();