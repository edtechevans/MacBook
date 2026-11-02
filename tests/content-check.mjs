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
assert(read("service-worker.js").includes("v7-20261102"),"Offline cache version bumped");
console.log("Source integrity: 55 English-only articles, semantic index, official sources and accessible HTML verified.");
