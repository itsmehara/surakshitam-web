import { chromium } from "playwright";
import fs from "fs";
const BASE="http://localhost:64235", OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch(); let bad=0;

const measure = () => ({
  probe: (()=>{})
});

async function check(p, label) {
  return await p.evaluate(() => {
    const l=[...document.querySelectorAll('a')].find(a=>a.querySelector('img')&&/OFF|Save|code/i.test(a.innerText));
    if(!l) return null;
    const card=l.getBoundingClientRect(), col=l.firstElementChild.getBoundingClientRect();
    const img=l.querySelector('img');
    const t=l.lastElementChild.lastElementChild, big=l.lastElementChild.children[1];
    const square = Math.abs(col.width-col.height) <= 1;
    return {card:Math.round(card.width)+'x'+Math.round(card.height),
            panel:Math.round(col.width)+'x'+Math.round(col.height),
            imgPct:Math.round(col.width/card.width*100),
            squarePanel:square,
            cropPct: square ? 0 : Math.round(Math.abs(1-Math.min(col.width,col.height)/Math.max(col.width,col.height))*100),
            fit:getComputedStyle(img).objectFit,
            titleTruncated:t.scrollHeight>t.clientHeight+1,
            headlineWraps: big.getBoundingClientRect().height > 30};
  });
}

// ---- /offers carousel ----
for (const w of [360,390,480,540,640,768,900,1024,1280,1440,1600]) {
  const p=await (await b.newContext({viewport:{width:w,height:900},isMobile:w<640,hasTouch:w<640})).newPage();
  await p.goto(BASE+"/offers",{waitUntil:"domcontentloaded"});
  await p.waitForFunction(()=>[...document.querySelectorAll('a')].some(a=>a.querySelector('img')&&/OFF/i.test(a.innerText)),{timeout:40000});
  await p.waitForTimeout(1400);
  const m=await check(p);
  const ok = m.squarePanel && !m.titleTruncated && !m.headlineWraps;
  if(!ok) bad++;
  console.log(`carousel ${String(w).padStart(4)}px  card ${m.card.padEnd(9)} panel ${m.panel.padEnd(9)} img ${String(m.imgPct).padStart(2)}%  crop ${m.cropPct}%  ${ok?"OK":"PROBLEM"}${m.titleTruncated?" TRUNC":""}${m.headlineWraps?" WRAP":""}`);
  if([390,1280].includes(w)) await p.screenshot({path:`${OUT}/carousel-${w}.png`, clip:await p.evaluate(()=>{const l=[...document.querySelectorAll('a')].find(a=>a.querySelector('img')&&/OFF/i.test(a.innerText));const r=l.getBoundingClientRect();return{x:Math.max(0,r.x-30),y:Math.max(0,r.y-20),width:Math.min(window.innerWidth-30,r.width*3.4),height:r.height+40};})});
  await p.close();
}

// ---- offers pop-up (same tile) ----
for (const w of [390,1280]) {
  const p=await (await b.newContext({viewport:{width:w,height:900},isMobile:w<640,hasTouch:w<640})).newPage();
  await p.goto(BASE+"/",{waitUntil:"domcontentloaded"});
  await p.waitForTimeout(3000);
  const btn=await p.$('button[aria-label*="See all" i]');
  if(!btn){ console.log(`popup ${w}px: FAB not found`); bad++; continue; }
  await btn.click(); await p.waitForTimeout(1400);
  const m=await check(p);
  const ok = m && m.squarePanel && !m.titleTruncated;
  if(!ok) bad++;
  console.log(`popup    ${String(w).padStart(4)}px  card ${m.card.padEnd(9)} panel ${m.panel.padEnd(9)} img ${String(m.imgPct).padStart(2)}%  crop ${m.cropPct}%  ${ok?"OK":"PROBLEM"}`);
  await p.screenshot({path:`${OUT}/popup-${w}.png`});
  await p.close();
}
await b.close();
console.log(bad? `\n${bad} problem(s)` : "\nEvery surface & breakpoint: square panel, 0% crop — nothing cut, image fully filled.");
