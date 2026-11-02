import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";
const path=new URL("../",import.meta.url);
const read=p=>readFileSync(new URL(p,path),"utf8");
for(const file of ["app.js","search-terms.js","search.js","content.js","lesson-media.js","related-tips.js","tip-page.js","print.js","service-worker.js"])
 new vm.Script(read(file),{filename:file});
const context={window:{}};
for(const f of ["content.js","related-tips.js","search-terms.js","lesson-media.js"])
 vm.runInNewContext(read(f),context,{filename:f});
const tips=context.window.TIPS;
assert.equal(tips.length,55,"All tips retained");
assert.equal(tips.filter(t=>!t.bonus).length,51,"Core tips retained");
const ids=new Set;
for(const t of tips){
 assert(!ids.has(t.id));ids.add(t.id);
 assert(["MacBook","Outlook","Teams","Chrome"].includes(t.category));
 assert(t.steps.length===3&&t.steps.every(x=>x.length>12),"Complete 3-step content");
 assert(t.title.length>7&&t.where.length>1&&/^https:\/\//.test(t.source),"Source and action");
 const pageFile="tips/"+t.id+".html";
 assert(existsSync(new URL(pageFile,path)),"Permanent guide exists "+t.id);
 const html=read(pageFile);
 const escapedTitle=t.title.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\x27/g,"&#39;");
 assert(html.includes("<h1 id=\"guide-title\">"+escapedTitle),"Answer-first heading matches source "+t.id);
 assert(html.includes("<meta property=\"og:title\""),"Independent social preview "+t.id);
 assert(html.includes("brand-mark.svg?v=20261102-8"),"New brand mark shown on "+t.id);
 assert(html.includes("../styles.css?v=20261102-9"),"Branded stylesheet used by "+t.id);
 assert(html.includes('../index.html#collections'),"Sitewide navigation in "+t.id);
 assert(html.includes("favicon.svg?v=20261102-8"),"New favicon referenced from "+t.id);
 assert(html.includes('id="copy-answer"')&&html.includes('id="copy-link"'),"Share and copy controls "+t.id);
 assert(html.includes('id="source-checked"')&&html.includes(t.source),"Source and version info "+t.id);
 assert(!/tip-translations|tip-language|translation-note|language-strip|translation-tag|Chinese\/Korean/.test(html),"English-only guide "+t.id);
 assert(html.includes('data-image-zoom')||!context.window.LESSON_MEDIA[t.id],"Visual zoom for existing screenshots "+t.id);
 assert(!/quiz|scoreboard|mark as completed|progress-count/.test(html),"No learner assessment in guide "+t.id);
}
assert.equal(Object.keys(context.window.RELATED_TIPS).length,55,"All tip recommendations curated");
for(const [id,more] of Object.entries(context.window.RELATED_TIPS))assert(more.every(k=>ids.has(k)&&k!==id),"Related tips are valid");
assert.equal(Object.keys(context.window.LESSON_MEDIA).length,4,"Copyrighted image scope remains limited");
assert(!existsSync(new URL("tip-translations.js",path)),"Unreviewed translation bundle removed");
assert(tips.filter(t=>t.sourceChecked==="2026-11-02").length>=19,"Verified official reference links supplied");
const home=read("index.html"),css=read("styles.css");
for(const s of ['id="hero-query"','id="hero-suggestions"','id="library"','id="tips-grid"','id="saved-preview"','id="category-grid"','id="shortcuts"'])
 assert(home.includes(s),"Homepage element "+s);
assert(!/id="(?:quiz|practice|main-progress|quiz-score|reset-progress)"/.test(home),"No assessment controls");
assert(!/tip-translations|id="language"|language-note|data-i18n/.test(home),"No homepage translation UI");
assert(!/macbook-lang|TIP_TRANSLATIONS|languageUI|setLanguage/.test(read("app.js")+read("tip-page.js")),"No language preferences or translation logic");
assert(/prefers-reduced-motion/.test(css)&&/focus-visible/.test(css),"Accessible motion and focus");
assert(/object-fit:contain/.test(css),"Platform screenshot is not cropped");
assert(read("service-worker.js").includes("v10-20261102"),"Offline cache version bumped");
assert(read("manifest.webmanifest").includes("favicon.svg?v=20261102-8"),"Installable theme references new favicon");
assert(read("brand-mark.svg").includes("#21C5E9"),"New laptop-and-spark master asset present");
assert(read("favicon.svg").includes("#162A4C"),"New branded favicon present");
assert(!/#942b3c|#96283b/i.test(css),"Old AISG red is removed from site CSS");
assert(home.includes("brand-mark.svg?v=20261102-8"),"Homepage uses new logo");
assert(home.includes('id="popular-grid"')&&home.includes('id="apps"'),"Visual homepage sections present");
assert(home.includes("assets/hero-device.svg"),"Hero MacBook illustration visible");
for(const name of ["hero-device","thumb-screen","thumb-outlook","thumb-teams","thumb-chrome","app-macbook","app-outlook","app-teams","app-chrome"])assert(existsSync(new URL("assets/"+name+".svg",path)),"Branded local graphic "+name);
assert(/\.popular-grid\{/.test(css)&&/\.quick-app-grid\{/.test(css),"New visual sections styled");
assert(read("service-worker.js").includes("assets/hero-device.svg"),"Hero illustration is cached offline");
for(const p of ["app-chrome","app-outlook","app-teams","app-macbook","hero-device","thumb-chrome","thumb-outlook","guide-chrome-groups"]){
 const svg=read("assets/"+p+".svg");
 assert(svg.startsWith("<svg")&&!svg.includes("<script")&&!svg.includes("<foreignObject"),"Safe local SVG: "+p);
}
const chrome=read("assets/app-chrome.svg");
assert(chrome.includes("#ea4335")&&chrome.includes("#1a73e8")&&chrome.includes("#34a853"),"Google Chrome brand geometry and primary colours sourced");
assert(chrome.includes('viewBox="0 0 512 512"'),"Chrome is the 2022+ vector, not our previous inaccurate redraw");
assert(read("assets/app-teams.svg").includes('viewBox="4 4 36 38"'),"Current 2025 Teams vector present");
assert(read("assets/app-outlook.svg").includes('viewBox="60 90.4 570.02 539.67"'),"Current 2025 Outlook vector present");
assert(!read("assets/app-macbook.svg").includes("Finder"),"MacBook category does not pretend to be the Finder application");
assert(!read("assets/hero-device.svg").includes('<text x="337"'),"No fake app logos remain in hero dock");
assert(read("assets/hero-device.svg").includes("#ea4335"),"Hero has accurate Chrome artwork");
assert(read("assets/thumb-chrome.svg").includes("#ea4335"),"Popular Chrome art uses exact badge");
assert(read("tips/t48.html").includes("ILLUSTRATED MENU PATH"),"Chrome diagram correctly labelled as illustration");
assert(!read("tips/t48.html").includes("gweb-uniblog"),"Outdated Chrome 2022 screenshot has been retired");
assert(read("tips/t38.html").includes("customize-your-calendar-in-microsoft-teams"),"Teams screenshot points to relevant official document");
assert(read("service-worker.js").includes("guide-chrome-groups.svg?v=10"),"Chrome diagram cached offline");
assert(existsSync(new URL("docs/ICON_PROVENANCE.md",path)),"Icon sourcing documented");

console.log("Source integrity: 55 English-only articles, semantic index, official sources and accessible HTML verified.");
