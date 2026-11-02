import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=s=>readFileSync(new URL("../"+s,import.meta.url),"utf8");
const ctx={window:{}};
for(const f of ["content.js","search-terms.js","search.js"])vm.runInNewContext(read(f),ctx,{filename:f});
const tips=ctx.window.TIPS;
const E=ctx.window.TIP_SEARCH;
E.build(tips);
const cases=[
  ["mute teams messages","t41"],
  ["turn off teams notifications","t41"],
  ["reopen closed chrome tab","t51"],
  ["undo close tab","t51"],
  ["put two windows side by side","b01"],
  ["split screen windows","b01"],
  ["find a file fast","t16"],
  ["save a website","t50"],
  ["screen record","t22"],
  ["do not disturb","t19"],
  ["schedule send outlook","t24"],
  ["delay an email","t24"],
  ["how to use stage manager","t13"],
  ["spotlite search","t16"],
  ["screen shot","t22"]
];
for(const [query,want] of cases){
 const got=E.search(tips,query,{limit:1})[0]?.id;
 assert.equal(got,want,JSON.stringify({query,want,got}));
 console.log("PASS: "+query+" -> "+got);
}
assert.equal(E.search(tips,"password manager").length,0,"Unknown topics must not produce unrelated guesses");
assert.equal(E.search(tips,"foobar zzz unknown").length,0,"Unknown task stays empty");
assert.equal(E.search(tips,"",{category:"Teams"}).length,8,"Application filtering");
console.log("All semantic and typo-tolerant task-search tests passed.");
