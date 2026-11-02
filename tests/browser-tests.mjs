import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
import {chromium} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const base="http://127.0.0.1:8080/";
mkdirSync("test-artifacts",{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const ctx=await browser.newContext({viewport:{width:1380,height:900}});
const page=await ctx.newPage();
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
const yes=async(condition,msg)=>{assert(condition,msg);console.log("PASS: "+msg);};
async function axe(label){
 const res=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
 if(res.violations.length)console.log("ACCESSIBILITY VIOLATIONS",JSON.stringify(res.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))));
 await yes(res.violations.length===0,label+" WCAG 2.2 AA");
}
async function load(path){await page.goto(base+path,{waitUntil:"domcontentloaded"});}
try{
 await load("");
 await yes(await page.locator("#hero-title").isVisible(),"Homepage loads with visible search");
 await yes((await page.locator("#result-count").textContent()).includes("55 guides"),"All 55 guides accessible");
 await yes(await page.locator("#category-grid .quick-app").count()===4,"Four pastel application buttons");
 await yes(await page.locator("#popular-grid .popular-card").count()===4,"Four illustrated popular tips render");
 await yes(await page.locator("#category-grid .quick-app-icon").evaluateAll(images=>images.length===4&&images.every(i=>i.complete&&i.naturalWidth>0)),"All four updated application icons load");
 await yes(await page.locator("#popular-grid .popular-art img").evaluateAll(images=>images.length===4&&images.every(i=>i.complete&&i.naturalWidth>0)),"All task illustration previews load");
 const chromeSource=await page.evaluate(()=>fetch("./assets/app-chrome.svg?v=10").then(r=>r.text()));
 await yes(chromeSource.includes("#ea4335")&&chromeSource.includes("#1a73e8"),"Chrome logo colours match the sourced SVG");

 const heroBox=await page.locator(".hero-search").boundingBox();
 const deviceBox=await page.locator(".hero-device").boundingBox();
 await yes(heroBox.x+heroBox.width<=deviceBox.x+deviceBox.width*95/750+8,"Search bar does not overlap the visible laptop screen");
 await yes(await page.locator(".hero-device img").evaluate(img=>img.complete&&img.naturalWidth>0),"Homepage MacBook artwork is loaded");
 await yes(await page.locator('#category-grid [data-category="MacBook"] small').textContent().then(t=>t.includes("24 tips")),"Counts use real MacBook guides");
 await yes(await page.locator('#category-grid [data-category="Outlook"] small').textContent().then(t=>t.includes("15 tips")),"Counts use real Outlook guides");
 await yes(await page.locator('#popular-grid a[href="./tips/t22.html"]').count()===1,"Popular guide links to permanent Mac help");
 await yes(await page.locator('#main-nav [href="#collections"]').count()===1,"Collections is in the primary navigation");
 await yes(await page.locator(".brand-mark img").getAttribute("src").then(s=>s.includes("brand-mark.svg")),"New laptop-and-spark mark used on homepage");
 await yes(await page.locator(".brand-mark img").evaluate(img=>img.complete&&img.naturalWidth>0),"New logo renders successfully");
 await yes(await page.locator("link[rel=icon]").getAttribute("href").then(s=>s.includes("favicon.svg?v=20261102-8")),"New favicon linked from homepage");
 await yes(await page.locator("#tips-grid .tip-card").count()===12,"First useful answers immediately visible");
 await yes(await page.locator("#main-nav a").count()===4,"All four reference navigation sections");
 await yes(await page.locator("#language, #language-note, [data-i18n]").count()===0,"No homepage language selector or translation hooks");
 await yes(await page.locator(".hero-feature,.feature-tip,#quiz-options,#main-progress").count()===0,"Removed presentation and testing UI");
 await page.screenshot({path:"test-artifacts/answer-first-home-desktop.png",fullPage:true});
 await axe("Homepage");
 await page.locator("#hero-query").fill("mute Teams messages");
 await yes(await page.locator("#hero-suggestions [role=option]").count()>=2,"Instant suggestions appear");
 await yes((await page.locator("#hero-suggestions [role=option]").first().textContent()).includes("notification"),"Best suggestion matches notification intent");
 await page.locator("#hero-query").press("ArrowDown");
 await page.locator("#hero-query").press("Enter");
 await yes(page.url().endsWith("/tips/t41.html"),"Keyboard selection opens permanent guide");
 await yes(await page.locator("#guide-title").isVisible(),"Answer-first article loads");
 await yes(await page.locator('.article-top-nav [href="../index.html#collections"]').count()===1,"Article has sitewide Collections navigation");
 await yes(await page.locator(".article-heading").evaluate(x=>getComputedStyle(x).backgroundImage.includes("gradient")),"Article heading carries the branded gradient");
 await yes(await page.locator(".brand-mark img").getAttribute("src").then(s=>s.includes("brand-mark.svg")),"Logo appears on individual guides");
 await yes(await page.locator("#guide-title").textContent().then(t=>t.includes("notification")),"Correct guide title");
 await yes(await page.locator("#copy-answer").count()===1,"Prominent copyable quick action");
 await yes(await page.locator(".guide-step").count()===3,"Full text steps visible without JavaScript interaction");
 await yes(await page.locator(".related-guide-link").count()===3,"Curated related tips instead of arbitrary neighbours");
 await yes(await page.locator(".related-guide-link").first().getAttribute("href").then(h=>h.includes("t44")),"Relevant notification guide related first");
 await yes(await page.locator("#source-checked").textContent().then(t=>t.length>9),"Version/source caveat visible");
 await axe("Individual guide");
 await page.screenshot({path:"test-artifacts/answer-first-guide-desktop.png",fullPage:true});
 await page.locator("#tip-save").click();
 await yes((await page.locator("#tip-save").getAttribute("aria-pressed"))==="true","Save locally from any article");
 await page.reload({waitUntil:"domcontentloaded"});
 await yes((await page.locator("#tip-save").getAttribute("aria-pressed"))==="true","Saved state survives refresh");
 await page.locator("#toggle-guided").click();
 await yes(await page.locator(".guide-step:not([hidden])").count()===1,"Optional step-by-step view works");
 await page.locator("#step-next").click();
 await yes((await page.locator("#step-view-status").textContent()).includes("Step 2"),"Step navigation works");
 await page.locator("#toggle-guided").click();
 await yes(await page.locator(".guide-step:not([hidden])").count()===3,"All steps can be restored");

 await load("tips/t22.html");
 await yes(await page.locator(".vendor-shot").count()===1,"One genuine Mac screenshot avoids duplicate imagery");
 const image=page.locator(".vendor-shot").first();
 await yes(await image.evaluate(i=>getComputedStyle(i).objectFit==="contain"),"Publisher screenshot kept uncropped");
 await page.locator("[data-image-zoom]").first().click();
 await yes(await page.locator("#image-zoom").isVisible(),"Accessible image enlargement dialog opens");
 await page.locator("#zoom-close").click();
 await yes(!(await page.locator("#image-zoom").isVisible()),"Zoom closes and returns to guide");
 await yes(await page.locator("#tip-language, #translation-note, .language-strip, .translation-tag").count()===0,"No translation UI in screen recording guide");
 await yes((await page.locator("#guide-title").textContent()).includes("Capture"),"Original English title is retained");
 await yes((await page.locator(".article-steps").textContent()).includes("Press Shift + Command + 5"),"English guidance remains intact");
 await yes((await page.locator(".guide-feedback a").getAttribute("href")).includes("github.com"),"Correction link is actionable");
 await page.screenshot({path:"test-artifacts/answer-first-guide-screenshots.png",fullPage:true});
 for(const id of ["t24","t38","t48"]){
   await load("tips/"+id+".html");
   const firstImage=page.locator(".vendor-shot").first();
   if(await firstImage.count())await firstImage.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1700);
   const status=await page.locator(".vendor-shot").evaluateAll(items=>items.map(i=>({src:i.currentSrc||i.src,ready:i.complete&&i.naturalWidth>0})));
   const unavailable=await page.locator(".screenshot-unavailable").count();
   console.log("SOURCE_IMAGE_AUDIT "+JSON.stringify({tip:id,images:status,unavailable}));
   if(id==="t48"){
     await yes(await page.locator(".illustrated-guide").count()===1,"Chrome uses a clearly disclosed original instructional diagram");
     await yes(await page.locator(".illustrated-guide .vendor-shot").evaluate(i=>i.complete&&i.naturalWidth>0),"Chrome illustrated steps load");
     await yes(!(await page.locator(".platform-shot-heading").textContent()).includes("REAL PLATFORM SCREENSHOT"),"No false screenshot claim in Chrome guide");
   }
   await page.screenshot({path:"test-artifacts/image-audit-"+id+".png",fullPage:true});
 }


 await load("");
 await page.locator("#library-query").fill("put two windows side by side");
 await yes((await page.locator("#tips-grid .tip-card").first().textContent()).includes("Tile windows"),"Semantic search identifies split-window task");
 await page.locator("#library-query").fill("reopen closed Chrome tab");
 await yes((await page.locator("#tips-grid .tip-card").first().textContent()).includes("Restore a closed tab"),"Tab restoration beats browsing-session match");
 await page.locator("#library-query").fill("password manager");
 await yes((await page.locator("#result-count").textContent()).includes("0 guides"),"No unrelated search guesses");
 await page.locator("#clear-filters").click();
 await page.locator('#category-filters [data-filter="Teams"]').click();
 await yes((await page.locator("#result-count").textContent()).includes("8 guides"),"App filtering works");
 await page.locator("#clear-filters").click();
 await page.locator("#view-saved").click();
 await yes((await page.locator("#result-count").textContent()).includes("1 guide"),"Saved library shows saved guide");
 await page.once("dialog",d=>d.accept());
 await page.locator("#clear-saved").click();
 await yes((await page.locator("#saved-count").textContent()).includes("0 saved"),"Saved references can be cleared");
 await load("tips/t49.html");
 await yes(await page.locator("#tip-language, #translation-note, .language-strip, .translation-tag").count()===0,"No translation UI in Chrome guide");
 await yes((await page.locator(".article-steps").textContent()).length>35,"English guide is still readable");

 await page.setViewportSize({width:1536,height:1024});
 await load("");
 await yes(await page.locator("#popular-grid .popular-card").count()===4,"Reference-width desktop contains four popular tip cards");
 const cards=await page.locator("#popular-grid .popular-card").evaluateAll(items=>items.map(el=>el.getBoundingClientRect().y));
 await yes(cards.every(y=>Math.abs(y-cards[0])<2),"All featured desktop cards are aligned in one row");
 const apps=await page.locator("#category-grid .quick-app").evaluateAll(items=>items.map(el=>el.getBoundingClientRect().y));
 await yes(apps.every(y=>Math.abs(y-apps[0])<2),"Four desktop app cards align in one row");
 const brandRect=await page.locator(".wordmark").boundingBox();
 const navRect=await page.locator(".main-nav").boundingBox();
 const searchRect=await page.locator(".header-search").boundingBox();
 await yes(brandRect.x+brandRect.width+12<navRect.x&&navRect.x+navRect.width<searchRect.x,"Large-screen navigation spacing remains readable");
 const fullHero=await page.locator(".quick-hero").boundingBox();
 await yes(fullHero.height>=420&&fullHero.height<=485,"Reference hero keeps intended height at 1536px");
 await page.screenshot({path:"test-artifacts/reference-match-1536-top.png",clip:{x:0,y:0,width:1536,height:1024}});
 await page.setViewportSize({width:1380,height:900});
 await load("");
 await page.setViewportSize({width:375,height:812});
 await yes(await page.locator("#menu-toggle").isVisible(),"Mobile navigation appears");
 await page.screenshot({path:"test-artifacts/answer-first-home-mobile.png",fullPage:true});
 await yes(await page.locator("#library-title").isVisible(),"Tip library present on mobile");
 await yes(await page.locator("#popular-grid .popular-card").count()===4,"Visual popular tips remain on mobile");
 await yes(await page.locator('#category-grid [data-category="MacBook"] small').isVisible(),"Real app tip counts stay visible on mobile");
 await yes(await page.locator("#category-filters button").evaluateAll(items=>items.every(b=>Math.abs(b.getBoundingClientRect().top-items[0].getBoundingClientRect().top)<2)),"Mobile application filters stay on one accessible row");
 for(const width of [375,320]){
  await page.setViewportSize({width,height:760});
  const measure=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,offenders:[...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2}).slice(0,8).map(e=>({tag:e.tagName,id:e.id,cls:e.className?.toString().slice(0,60),right:Math.round(e.getBoundingClientRect().right)}))}));
  await yes(measure.scroll<=width+2,"No horizontal overflow at "+width+"px: "+JSON.stringify(measure));
 }
 await load("tips/t22.html");
 await page.screenshot({path:"test-artifacts/answer-first-guide-mobile.png",fullPage:true});
 const first=await page.locator(".quick-answer").boundingBox();
 await yes(first.width<=320,"Quick answer fits a narrow phone");
 await axe("Mobile guide");
 await load("print.html?tip=t22");
 await yes(await page.locator(".tip").count()===1,"Individual printable guide works");
 await load("print.html");
 await yes(await page.locator(".tip").count()===55,"Complete printable reference preserved");
 await yes(errors.length===0,"No uncaught JavaScript errors: "+errors.join("; "));
 console.log("END-TO-END REFERENCE V3 BROWSER CHECKS PASSED");
}finally{await browser.close();}
