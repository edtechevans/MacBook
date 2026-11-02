/* Client-side task search. No external API, account, tracking or personal data. */
(function(){
  "use strict";
  const stop=new Set(["how","do","does","i","we","can","the","a","an","to","in","on","of","at","with","please","is","it","my","me","you","your","some","this","that","for","using","use","get","make"]);
  const synonyms=window.SEARCH_TERMS||{};
  const phraseRules=(window.SEARCH_INTENTS||[]).map(x=>({regex:new RegExp(x.regex,"i"),ids:x.ids}));
  const norm=s=>String(s??"").normalize("NFKD").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
  const words=s=>norm(s).split(/\s+/).filter(t=>t.length>0);
  const important=q=>words(q).filter(w=>!stop.has(w));
  const distance=(a,b)=>{
    if(Math.abs(a.length-b.length)>2)return 3;
    const v=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){
      let prev=v[0];v[0]=i;
      for(let j=1;j<=b.length;j++){const p=v[j];v[j]=Math.min(v[j]+1,v[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=p;}
    }
    return v[b.length];
  };
  const tokens=new Map();
  function build(tips){
    tokens.clear();
    for(const t of tips){
      const title=words(t.title),alias=words(synonyms[t.id]||"");
      const detail=words([t.category,t.where,...t.steps,t.note||""].join(" "));
      tokens.set(t.id,{title:new Set(title),alias:new Set(alias),detail:new Set(detail),titlePhrase:norm(t.title),aliasPhrase:norm(synonyms[t.id]||"")});
    }
  }
  function quality(w,set,weight){
    if(set.has(w))return weight;
    if(w.length<4)return 0;
    const cutoff=w.length>=8?2:1;
    for(const s of set){if(s.length>=4&&Math.abs(s.length-w.length)<=cutoff&&distance(w,s)<=cutoff)return Math.max(1,weight*.36);}
    return 0;
  }
  function search(tips,query,{limit=55,category="All",savedOnly=null}={}){
    const q=norm(query),tokensQuery=important(query);
    const rules=phraseRules.filter(r=>r.regex.test(q));
    const ranked=[];
    tips.forEach((t,i)=>{
      if(category!=="All"&&t.category!==category)return;
      if(savedOnly instanceof Set&&!savedOnly.has(t.id))return;
      const x=tokens.get(t.id);if(!x)return;
      if(!tokensQuery.length){ranked.push({tip:t,score:0,index:i});return;}
      let matched=0,score=0;
      for(const w of tokensQuery){
        const p=Math.max(quality(w,x.title,11),quality(w,x.alias,7),quality(w,x.detail,2.6));
        if(p>0){matched++;score+=p;}
      }
      const coverage=matched/tokensQuery.length;
      if(x.titlePhrase.includes(q))score+=40;
      if(x.aliasPhrase.includes(q))score+=18;
      if(coverage<.34)score=0;
      score*=Math.pow(coverage,1.3);
      for(const r of rules){const pos=r.ids.indexOf(t.id);if(pos!==-1)score+=290-pos*35;}
      if(score>0)ranked.push({tip:t,score,index:i});
    });
    ranked.sort((a,b)=>b.score-a.score||a.index-b.index);
    return ranked.slice(0,limit).map(x=>({...x.tip,_rank:x.score}));
  }
  window.TIP_SEARCH={build,search,normalize:norm};
})();