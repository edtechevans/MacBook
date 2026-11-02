import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
for(const file of ["app.js","content.js","lesson-media.js","print.js","service-worker.js"])
  new vm.Script(read(file),{filename:file});
const context={window:{}};
vm.runInNewContext(read("content.js"),context);
vm.runInNewContext(read("lesson-media.js"),context);
const tips=context.window.TIPS;
assert.equal(tips.length,55,"Must keep all 55 tips");
assert.equal(tips.filter(t=>!t.bonus).length,51,"Must preserve 51 reviewed tips");
const ids=new Set;
for(const t of tips){
  assert(!ids.has(t.id),"Unique tip ID: "+t.id);ids.add(t.id);
  assert(["MacBook","Outlook","Teams","Chrome"].includes(t.category),"Known application category");
  assert(t.title.length>7&&t.where.length>1,"Clear title and location");
  assert(t.steps.length===3&&t.steps.every(s=>s.length>12),"Complete instructions");
  assert(t.try.length>8&&/^https:\/\//.test(t.source),"Safe example and source");
}
const images=context.window.LESSON_MEDIA;
assert.equal(Object.keys(images).length,4,"Four screenshot-supported tips");
for(const [id,arr] of Object.entries(images)){
  assert(ids.has(id),"Image mapped to existing tip");
  for(const m of arr)assert(m.step>=0&&m.step<3&&/^https:\/\//.test(m.src)&&/^https:\/\//.test(m.source)&&m.alt.length>25,"Image metadata complete");
}
const html=read("index.html"),css=read("styles.css"),app=read("app.js"),print=read("print.html");
for(const [re,name] of [
  [/<main\b/,"main landmark"],[/class="skip-link"/,"skip link"],[/id="hero-query"/,"hero search"],
  [/id="library-query"/,"library search"],[/id="category-filters"/,"category filters"],
  [/id="collection-grid"/,"collections"],[/id="shortcut-sheet"/,"shortcut reference"],
  [/id="saved-preview"/,"saved tips"],[/<dialog\b/,"accessible native dialog"],
  [/id="mode-all"/,"all steps mode"],[/id="mode-guided"/,"optional guided mode"],
  [/id="language"/,"navigation languages"]
])assert(re.test(html),"Missing "+name);
assert(!/id="(?:quiz|practice|progress-count|progress-percent|main-progress|quiz-score|quiz-options|reset-progress|mark-done|quick-complete)"/.test(html),"No assessment or progress UI");
assert(!/macbook-completed|quizCorrect|quizIndex|markPractised|renderQuiz/.test(app),"No quiz or completion tracking in production code");
assert(/prefers-reduced-motion/.test(css)&&/focus-visible/.test(css),"Motion and keyboard accessibility");
assert(/object-fit:contain/.test(css),"Publisher images displayed without cropping");
assert(/@media\(max-width:630px\)/.test(css),"Responsive phone layout");
assert(/id="print-lessons"/.test(print),"Full printable reference retained");
const luminance=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=[luminance(a),luminance(b)].sort((a,b)=>a-b);return (x[1]+.05)/(x[0]+.05)};
assert(contrast("#516171","#ffffff")>=4.5,"Body muted text contrast");
assert(contrast("#942b3c","#ffffff")>=4.5,"Red accent text contrast");
console.log("PASS: 55 tips; reference library without quizzes or progress; accessibility and print foundations.");
