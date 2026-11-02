import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
import {chromium} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base="http://127.0.0.1:8080/";
mkdirSync("test-artifacts",{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const context=await browser.newContext({viewport:{width:1400,height:920}});
const page=await context.newPage();
const errors=[];
page.on("pageerror",err=>errors.push(err.message));
const verify=async(condition,label)=>{assert(condition,label);console.log("PASS: "+label);};

try {
  await page.goto(base,{waitUntil:"networkidle"});
  await verify(await page.locator("#hero-title").isVisible(),"Reference homepage loads");
  await verify((await page.locator("#result-count").textContent()).includes("55 tips"),"All 55 tips appear in library");
  await verify(await page.locator("#category-grid .category-card").count()===4,"MacBook Outlook Teams Chrome category tiles");
  await verify(await page.locator("#collection-grid .collection-card").count()===3,"Three useful collections rather than courses");
  await verify(await page.locator("#shortcut-sheet .shortcut-row").count()===6,"Shortcut reference without quizzes");
  await verify(await page.locator("#popular-list .feature-tip").count()===4,"Homepage hand-picked tips");
  await verify(await page.locator('#practice, #quiz-options, #quiz-score, #main-progress, #progress-count, #reset-progress, #quick-complete').count()===0,"No learner assessments, scores or completion controls");
  await verify(await page.locator(".brand-mark img").evaluate(i=>i.complete&&i.naturalWidth>0),"Improved logo loads");
  const cards=await page.locator("#popular-list .feature-tip").evaluateAll(items=>items.map(x=>{const r=x.getBoundingClientRect();return {x:r.x,w:r.width,h:r.height};}));
  await verify(cards.length===4&&cards.every(r=>Math.abs(r.x-cards[0].x)<1&&Math.abs(r.w-cards[0].w)<1),"Homepage cards share aligned left edge and width");
  await page.screenshot({path:"test-artifacts/reference-home-desktop.png",fullPage:true});
  const homeAxe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  if(homeAxe.violations.length)console.log("ACCESSIBILITY FINDINGS",JSON.stringify(homeAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,10)}))));
  await verify(homeAxe.violations.length===0,"Homepage automated WCAG 2.2 AA: "+homeAxe.violations.map(v=>v.id).join(", "));

  await page.locator("#hero-query").fill("record my screen");
  await page.locator("#hero-search button").click();
  await verify(await page.locator('#tips-grid [data-tip="t22"]').count()===1,"Everyday-language search finds screen recording");
  await page.locator('#tips-grid [data-tip="t22"]').click();
  await verify(await page.locator("#tip-dialog").isVisible(),"Tip opens as readable accessible dialog");
  await verify(await page.locator("#all-steps").isVisible()&&!await page.locator("#guided-steps").isVisible(),"All steps are the default, not a forced learning sequence");
  await verify(await page.locator("#tip-steps>li").count()===3,"All three written instructions visible");
  await verify(await page.locator("#tip-steps img.vendor-shot").count()===2,"Actual vendor screenshots placed beside relevant steps");
  await verify(await page.locator("#tip-try").textContent().then(x=>x.length>10),"Optional useful example present without completion tracking");
  await page.screenshot({path:"test-artifacts/reference-tip-all-steps.png"});
  await page.locator("#mode-guided").click();
  await verify(await page.locator("#guided-steps").isVisible()&&!await page.locator("#all-steps").isVisible(),"One-step view available as optional alternative");
  await page.locator("#guided-next").click();
  await verify(await page.locator("#guided-image img.vendor-shot").count()===1,"Matching vendor screenshot available in step view");
  await verify(await page.locator("#guided-image img.vendor-shot").evaluate(i=>getComputedStyle(i).objectFit==="contain"),"Publisher screenshot is not cropped");
  await verify(await page.locator("#guided-image .visual-alternative").count()===1,"Illustrative fallback is retained");
  const modalAxe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  await verify(modalAxe.violations.length===0,"Tip dialog automated WCAG 2.2 AA: "+modalAxe.violations.map(v=>v.id).join(", "));
  await page.goBack({waitUntil:"domcontentloaded"});
  await verify(!(await page.locator("#tip-dialog").isVisible()),"Browser Back closes tip without leaving site");

  await page.locator('#category-filters [data-filter="Teams"]').click();
  await verify((await page.locator("#result-count").textContent()).includes("8 tips"),"Teams filter shows all eight tips");
  await page.locator("#clear-filters").click();
  await page.locator('#tips-grid [data-save="t16"]').click();
  await verify((await page.locator('#tips-grid [data-save="t16"]').getAttribute("aria-pressed"))==="true","Save bookmark has accessible state");
  await verify((await page.locator("#saved-count").textContent()).includes("1 saved"),"Saved shelf updates immediately");
  await page.reload({waitUntil:"domcontentloaded"});
  await verify((await page.locator("#saved-count").textContent()).includes("1 saved"),"Saved tips persist after reload");
  await verify(await page.evaluate(()=>localStorage.getItem("macbook-completed")===null),"Reference does not write learning-completion data");
  await page.locator("#saved-only").check();
  await verify((await page.locator("#result-count").textContent()).includes("1 tip"),"Saved-only tip filter works");
  await page.locator("#clear-filters").click();

  await page.locator('#collection-grid [data-collection="0"]').click();
  await verify((await page.locator("#result-count").textContent()).includes("6 tips"),"Collection displays curated tips without progress tracking");
  await page.locator("#clear-filters").click();
  await page.locator('#shortcut-sheet [data-tip="t51"]').click();
  await verify((await page.locator("#tip-title").textContent()).includes("Restore a closed tab"),"Shortcut reference links directly to how-to tip");
  await page.locator("#tip-close").click();
  await page.once("dialog",d=>d.accept());
  await page.locator("#clear-saved").click();
  await verify((await page.locator("#saved-count").textContent()).includes("0 saved"),"Users can clear saved tips");

  await page.locator("#language").selectOption("zh");
  await verify((await page.locator("#hero-title").textContent()).includes("寻找"),"Chinese navigation translation works");
  await page.locator("#language").selectOption("ko");
  await verify((await page.locator("#hero-title").textContent()).includes("시간"),"Korean navigation translation works");
  await page.locator("#language").selectOption("en");

  for(const [id,step,domain] of [["t22",1,"apple.com"],["t24",1,"microsoft.com"],["t38",1,"microsoft.com"],["t48",0,"googleapis.com"]]){
    await page.goto(base+"#tip-"+id,{waitUntil:"domcontentloaded"});
    await verify(await page.locator("#tip-dialog").isVisible(),"Direct link opens tip "+id);
    const img=page.locator('#tip-steps>li:nth-child('+(step+1)+') img.vendor-shot');
    await verify((await img.getAttribute("src")).includes(domain),"Step-appropriate authentic screenshot for "+id);
    await verify(await page.locator(".platform-shot a").count()>=2,"Image has original publisher and support links");
    await page.locator("#tip-close").click();
  }

  await page.setViewportSize({width:375,height:812});
  await page.goto(base,{waitUntil:"domcontentloaded"});
  await verify(await page.locator("#menu-toggle").isVisible(),"Responsive menu appears on phone");
  await page.screenshot({path:"test-artifacts/reference-home-mobile.png",fullPage:true});
  await page.locator("#menu-toggle").click();
  await verify(await page.locator("#main-nav").isVisible(),"Mobile navigation opens");
  await page.locator("#menu-toggle").click();
  let size=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
  await verify(size.document<=size.viewport+2,"No 375px horizontal scrolling: "+JSON.stringify(size));
  await page.setViewportSize({width:320,height:760});
  size=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
  await verify(size.document<=size.viewport+2,"No 320px horizontal scrolling: "+JSON.stringify(size));
  await page.setViewportSize({width:375,height:812});
  await page.locator("#popular-list [data-tip='t22']").click();
  await page.screenshot({path:"test-artifacts/reference-tip-mobile.png"});
  const r=await page.locator("#tip-dialog").boundingBox();
  await verify(r.width<=377&&r.height<=814,"Mobile tip fits viewport");
  await verify(await page.locator("#tip-steps>li").count()===3,"All instructions visible on phone");
  await page.locator("#tip-close").click();

  await page.goto(base+"print.html?tip=t22");
  await verify((await page.locator("#print-lessons").textContent()).includes("Capture or record your screen"),"Printable single-tip reference");
  await page.goto(base+"print.html");
  await verify(await page.locator(".tip").count()===55,"Full printable reference includes 55 tips");
  await verify(errors.length===0,"No uncaught JavaScript browser errors: "+errors.join("; "));
  console.log("ALL REFERENCE-LIBRARY BROWSER TESTS PASSED");
} finally {await browser.close();}
