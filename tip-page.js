/* Article enhancements: native accessibility, bookmarks, sharing and image zoom.
   Essential instructions remain in server-delivered HTML when JS is unavailable. */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const id=document.body.dataset.tipId;
const tip=(window.TIPS||[]).find(t=>t.id===id);
if(!tip)return;
const locale=window.TIP_TRANSLATIONS?.[id]||null;
let saved=new Set();
try{const arr=JSON.parse(localStorage.getItem("macbook-favorites")||"[]");if(Array.isArray(arr))saved=new Set(arr.filter(x=>typeof x==="string"));}catch{}
let noticeTimer=null;
function toast(s){const el=$("#tip-toast");el.textContent=s;el.classList.add("visible");clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove("visible"),2900);}
function copy(s){
 if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(s).then(()=>true).catch(()=>false);
 return Promise.resolve(false);
}
function fallbackCopy(s,label){copy(s).then(ok=>{if(ok)toast(label+" copied.");else{const text=prompt("Copy this text:",s);if(text!==null)toast("Use the selected text.");}});}
function setSaved(){
 const yes=saved.has(id);
 const btn=$("#tip-save");
 btn.setAttribute("aria-pressed",String(yes));
 btn.setAttribute("aria-label",yes?"Remove from saved tips":"Save this tip");
 btn.innerHTML=yes?"♥ Saved":"♡ Save for later";
}
$("#tip-save").addEventListener("click",()=>{
 if(saved.has(id))saved.delete(id);else saved.add(id);
 try{localStorage.setItem("macbook-favorites",JSON.stringify([...saved]));}catch{toast("This browser did not allow saving.");return;}
 setSaved();toast(saved.has(id)?"Saved on this device.":"Removed from saved tips.");
});
$("#copy-answer").addEventListener("click",()=>fallbackCopy(tip.where,"Quick answer"));
$("#copy-link").addEventListener("click",()=>fallbackCopy(location.href,"Guide link"));
$("#share-tip").addEventListener("click",()=>{
 if(navigator.share){navigator.share({title:tip.title,text:"How to: "+tip.title,url:location.href}).catch(()=>{});}
 else fallbackCopy(location.href,"Guide link");
});
$("#copy-correction").addEventListener("click",()=>{
 const msg="Guide: "+tip.title+"\nURL: "+location.href+"\nSoftware version (if known):\nWhat needs correcting:\nSuggested accurate wording:\n";
 fallbackCopy(msg,"Correction details");
});
const zoom=$("#image-zoom");
function updateZoom(fig){
 const img=fig.querySelector("img");
 if(!img)return;
 $("#zoom-image").src=img.currentSrc||img.src;
 $("#zoom-image").alt=img.alt;
 $("#zoom-caption").textContent=fig.querySelector("figcaption strong")?.textContent||tip.title;
 $("#zoom-source").href=fig.querySelector(".shot-links a")?.href||tip.source;
 zoom.showModal();
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-image-zoom]");if(b){const figure=b.closest("figure");if(figure)updateZoom(figure);}
});
$("#zoom-close").addEventListener("click",()=>zoom.close());
zoom.addEventListener("click",e=>{if(e.target===zoom)zoom.close();});
function imageReady(img){
 const frame=img.closest(".platform-shot-frame");
 if(!frame)return;
 if(img.complete&&img.naturalWidth){frame.classList.add("ready");return;}
 const error=()=>{
  const figure=img.closest(".platform-shot");
  if(!figure||!figure.isConnected)return;
  const note=document.createElement("p");note.className="screenshot-unavailable";note.textContent="This publisher image is unavailable right now. The written instructions and official reference remain below.";
  frame.replaceWith(note);
  figure.querySelector("[data-image-zoom]")?.remove();
 };
 img.addEventListener("load",()=>frame.classList.add("ready"),{once:true});
 img.addEventListener("error",error,{once:true});
 if(img.complete&&!img.naturalWidth)error();
}
$$("img.vendor-shot").forEach(imageReady);
const guideSteps=$$(".guide-step");
let stepIndex=0,guided=false;
function renderStepView(){
 guideSteps.forEach((s,i)=>s.hidden=guided&&i!==stepIndex);
 $("#step-view-status").textContent="Step "+(stepIndex+1)+" of "+guideSteps.length;
 $("#step-navigation").hidden=!guided;
 $("#step-view-status").hidden=!guided;
 $("#step-prev").disabled=stepIndex===0;
 $("#step-next").textContent=stepIndex===guideSteps.length-1?"Show all steps ↑":"Next step →";
 $("#toggle-guided").textContent=guided?"Show all steps":"One step at a time";
 $("#toggle-guided").setAttribute("aria-pressed",String(guided));
}
$("#toggle-guided").addEventListener("click",()=>{
 guided=!guided;stepIndex=0;renderStepView();
 if(guided)$("#step-view-status").focus({preventScroll:true});
});
$("#step-prev").addEventListener("click",()=>{stepIndex=Math.max(0,stepIndex-1);renderStepView();guideSteps[stepIndex].querySelector("h3")?.focus({preventScroll:true});});
$("#step-next").addEventListener("click",()=>{
 if(stepIndex===guideSteps.length-1){guided=false;renderStepView();$("#toggle-guided").focus();return;}
 stepIndex++;renderStepView();guideSteps[stepIndex].querySelector("h3")?.focus({preventScroll:true});
});
function setLanguage(choice){
 const selected=choice==="zh"||choice==="ko"?locale?.[choice]:null;
 const displayLanguage=selected?choice:"en";
 const heading=$("#guide-title"),headingOriginal=tip.title;
 heading.textContent=selected?.title||headingOriginal;
 heading.lang=displayLanguage;
 guideSteps.forEach((step,i)=>{const p=step.querySelector(".step-text");p.textContent=selected?.steps?.[i]||tip.steps[i];p.lang=displayLanguage;});
 const status=$("#translation-note");
 if(selected){status.textContent=choice==="zh"?"中文译文为供学习参考的草稿，软件界面名称请以实际英文标签为准。":"한국어 번역은 참고용 초안입니다. 실제 앱의 영문 메뉴 이름을 확인하세요.";status.hidden=false;}
 else if(choice!=="en"){status.textContent=choice==="zh"?"这项技巧的详细中文译文尚未完成审核；目前显示英文原文。":"이 팁의 한국어 상세 번역이 준비되지 않아 영어 원문을 표시합니다.";status.hidden=false;}
 else status.hidden=true;
 if(selected){document.documentElement.lang=choice;}
 else document.documentElement.lang="en";
}
$("#tip-language").addEventListener("change",e=>{setLanguage(e.target.value);try{localStorage.setItem("macbook-lang",e.target.value);}catch{}});
try{
 const pref=localStorage.getItem("macbook-lang")||"en";
 if(["en","zh","ko"].includes(pref)){$("#tip-language").value=pref;setLanguage(pref);}
}catch{}
function setPrintDate(){const n=$("#source-checked");if(!n)return;if(tip.sourceChecked)n.textContent="Official source checked 2 Nov 2026. Device menus may differ.";else n.textContent="Vendor help reference · verify menu labels for your app version.";}
setPrintDate();
setSaved();renderStepView();
})();