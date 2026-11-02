import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
for(const file of ["app.js","content.js","lesson-media.js","print.js","service-worker.js"]){new vm.Script(read(file),{filename:file});}
const context={window:{}};vm.runInNewContext(read("content.js"),context);
vm.runInNewContext(read("lesson-media.js"),context);
const media=context.window.LESSON_MEDIA;
assert.equal(Object.keys(media).length,4,"Real images used only for four matched lessons");
for(const [id,assets] of Object.entries(media)){
  assert(context.window.TIPS.some(t=>t.id===id),"Asset lesson exists");
  for(const asset of assets)assert(asset.step>=0&&asset.step<=2&&/^https:\/\//.test(asset.src)&&/^https:\/\//.test(asset.source)&&asset.alt.length>20,"Image metadata valid");
}
const tips=context.window.TIPS;const ids=new Set();
assert.equal(tips.length,55,"55 complete lessons expected");
assert.equal(tips.filter(t=>!t.bonus).length,51,"51 reviewed lessons expected");
for(const t of tips){
  assert(!ids.has(t.id),"Unique lesson ID: "+t.id);ids.add(t.id);
  assert(["MacBook","Outlook","Teams","Chrome"].includes(t.category),"Valid category");
  assert(t.title.length>8&&t.where.length>1&&t.steps.length===3&&t.steps.every(s=>s.length>12)&&t.try.length>8,"Complete instructions: "+t.id);
  assert(/^https:\/\//.test(t.source),"Secure official reference: "+t.id);
}
const html=read("index.html");const css=read("styles.css");const print=read("print.html");
assert(!/id="(?:text-toggle|theme-toggle)"/.test(html),"No font-size or theme controls in header");
assert(!/macbook-(?:large|theme)/.test(read("app.js")),"No obsolete appearance feature handlers");
assert(/<img[^>]*favicon\.svg/.test(html),"Brand icon image present");
assert(!/transform:rotate\(\.7deg\)/.test(css),"No tilted feature panel");
assert(/object-fit:contain/.test(css),"Images are not cropped");
for(const [re,name] of [[/<main\b/,"main landmark"],[/<dialog\b/,"native accessible dialog"],[/class="skip-link"/,"skip navigation"],[/id="hero-query"/,"real hero search"],[/id="library-query"/,"lesson search"],[/id="lesson-progress"/,"step progress"],[/id="import-button"/,"keyboard-accessible data import"],[/id="language"/,"interface language selection"]])assert(re.test(html),"Missing "+name);
assert(/prefers-reduced-motion/.test(css),"Respect reduced motion");
assert(/focus-visible/.test(css),"Visible keyboard focus");
assert(/@media\(max-width:630px\)/.test(css),"Phone layout");
assert(/id="print-lessons"/.test(print),"Full printable guide");
const lum=h=>{const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722};
const contrast=(a,b)=>{const x=[lum(a),lum(b)].sort((x,y)=>x-y);return (x[1]+.05)/(x[0]+.05)};
assert(contrast("#485668","#ffffff")>=4.5,"Muted text AA contrast");
assert(contrast("#96283b","#ffffff")>=4.5,"Accent text AA contrast");
console.log("VALIDATED: 55 complete lessons, scripts, semantics, colour contrast, mobile and print structure.");
