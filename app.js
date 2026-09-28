import { lessons as baynaLessons } from './data.js';
import { lessons as ahibbLessons } from './ahibb.js';
import { images as baynaImages } from './bayna-images.js';
import images01 from './ahibb-images-01.js';
import images02 from './ahibb-images-02.js';
import images03 from './ahibb-images-03.js';
import images04 from './ahibb-images-04.js';
import images05 from './ahibb-images-05.js';
import images06 from './ahibb-images-06.js';
import images07 from './ahibb-images-07.js';
import images08 from './ahibb-images-08.js';
import images09 from './ahibb-images-09.js';
import images10 from './ahibb-images-10.js';
import images11 from './ahibb-images-11.js';
import images12 from './ahibb-images-12.js';
import images13 from './ahibb-images-13.js';
import images14 from './ahibb-images-14.js';
import images15 from './ahibb-images-15.js';
import images16 from './ahibb-images-16.js';
const ahibbImages=Object.assign({},images01,images02,images03,images04,images05,images06,images07,images08,images09,images10,images11,images12,images13,images14,images15,images16);
const app=document.querySelector('#app');
const modes=[
 ['flash','↔','Flitskaartjes','Kijk, denk en draai je kaartje om.'],
 ['drag','↗','Sleep het woord','Welk woord hoort bij dit plaatje?'],
 ['quiz','؟','Woordquiz','Kies de betekenis van het woord.'],
 ['reverse','ع','Terug naar Arabisch','Herken het juiste Arabische woord.'],
 ['pairs','⇄','Zoek de maatjes','Verbind Arabisch met Nederlands.'],
 ['memory','▦','Memory','Onthoud waar de woordmaatjes liggen.'],
 ['build','✦','Woordbouwer','Zet de stukjes in de juiste volgorde.'],
 ['peek','◉','Raad het plaatje','Een wazig plaatje… wat zie jij?'],
 ['listen','♫','Luisteren','Luister en kies de Nederlandse betekenis.']
];
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=text=>`<span class="arabic" lang="ar" dir="rtl">${esc(text)}</span>`;
const nl=item=>`${esc(item[1])}${item[2]?`<span class="note">(${esc(item[2])})</span>`:''}`;
const shuffle=list=>{const result=[...list];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result};
const programs={bayna:{name:'Al-Arabiyyah Bayna Yaday Awladina',arabic:'العَرَبِيَّةُ بَيْنَ يَدَيْ أَوْلَادِنَا',books:12,lessons:baynaLessons},ahibb:{name:'Ik hou van Arabisch',arabic:'أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ',books:8,lessons:ahibbLessons}};
let activeProgram='bayna',activeBook=1,lessons=baynaLessons,game=null,delayed=null;
const completed=new Set();
function context(program,book=1){activeProgram=program;activeBook=book;lessons=programs[program].lessons}
const bookPath=()=>`#book/${activeProgram}/${activeBook}`;
const lessonPath=n=>`#lesson/${activeProgram}/${activeBook}/${n}`;
const playPath=(n,m)=>`#play/${activeProgram}/${activeBook}/${n}/${m}`;
function speak(item){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(item[0].replace(/\s*\([^)]*\)/g,''));voice.lang='ar-SA';voice.rate=.82;window.speechSynthesis.speak(voice)}
function listenButton(){return '<button class="button secondary listen-button" type="button">♫ Luister</button>'}
function visual(item,extra=''){
 const key=item[3];
 if(key.startsWith('ahibb:'))return `<div class="visual ${extra}"><img src="${ahibbImages[key]}" alt="Woordillustratie"></div>`;
 if(key.startsWith('digit:'))return `<div class="visual ${extra}"><span class="numeral">${key.split(':')[1]}</span></div>`;
 if(key==='and')return `<div class="visual multi ${extra}"><img src="${baynaImages.pen}" alt="Een pen"><span>+</span><img src="${baynaImages.paper}" alt="Papier"></div>`;
 if(key.startsWith('count:'))return `<div class="visual multi ${extra}">${Array.from({length:Number(key.split(':')[2])},()=>'<img src="${baynaImages.bag}" alt="Een tas">').join('')}</div>`;
 return `<div class="visual ${extra}"><img src="${baynaImages[key==='questionCandy'?'howCandy':key]}" alt="Illustratie bij het oefenwoord">${key==='questionCandy'?'<span class="question-mark">?</span>':''}</div>`;
}
const bookCovers = ["https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f45a947f.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f43992c5.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f463b201.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f476ac20.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f48891d1.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f4a2263e.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f4c7df4e.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f4fa09d7.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f5769d74.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f573ea70.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f523620d.png", "https://www.arabicforall.net/uploads/photos/shares/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA/5eba8f573b3d7.png"];
const ahibbCovers = ["https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-1_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-2_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-3_1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-4_Nouv_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-5_Nouv_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-6_Nouv_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-7_-1.png","https://editionsjsf.com/wp-content/uploads/2025/06/000_Collection-Jaime-8_-1.png"];
function home(){
 app.innerHTML=`<section class="hero"><div><div class="eyebrow">Welkom in jouw woordentuin</div><h1>Kleine woorden.<br>Grote <em>ontdekkingen.</em></h1><p>Ontdek Arabisch op jouw manier. Kies eerst jouw programma en oefen daarna met een boek.</p></div><div class="hero-art"><img src="${baynaImages.old1}" alt="Twee kinderen begroeten elkaar"><span class="floating" lang="ar" dir="rtl">السَّلَامُ عَلَيْكُمْ</span></div></section><div class="section-head"><h2>Kies jouw programma</h2></div><div class="programs">${Object.entries(programs).map(([id,p])=>`<a class="program" href="#program/${id}"><span class="eyebrow">Arabisch leren</span><h3>${p.name}</h3>${ar(p.arabic)}<span class="button">Bekijk de boeken →</span></a>`).join('')}</div>`;
}
function program(id){const p=programs[id];if(!p){location.hash='home';return}context(id);
 app.innerHTML=`<a class="back" href="#home">← Alle programma's</a><section class="intro"><div><span class="eyebrow">Kies jouw boek</span><h1>${p.name}</h1>${ar(p.arabic)}</div></section><div class="books">${Array.from({length:p.books},(_,i)=>`<article class="book ${i===0?'active':'muted'}">${i===0?'<span class="ribbon">Klaar om te ontdekken</span>':''}<div class="cover official-cover"><img src="${id==='bayna'?bookCovers[i]:ahibbCovers[i]}" alt="Omslag van boek ${i+1} van ${p.name}" referrerpolicy="no-referrer" loading="lazy"></div><h3>Boek ${i+1}</h3><div class="meta">${i===0?`${p.lessons.length} lessen · ${p.lessons.reduce((n,l)=>n+l.items.length,0)} kaarten`:'Een volgend avontuur'}</div>${i===0?`<a class="button" href="#book/${id}/${i+1}">Ontdek dit boek →</a>`:'<span class="soon">Komt binnenkort</span>'}</article>`).join('')}</div>`;
}
function book(){const p=programs[activeProgram];if(activeBook!==1){program(activeProgram);return}
 app.innerHTML=`<a class="back" href="#program/${activeProgram}">← Alle boeken</a><section class="intro"><div><span class="eyebrow">${p.name} · Boek 1</span><h1>Hallo, nieuwe woorden!</h1><p>Kies een les. Daarna kies jij hoe je wilt spelen.</p></div><img src="${baynaImages.book}" alt="Een open boek"></section><div class="section-head"><h2>Wat ontdek jij vandaag?</h2><p>Alle lessen zijn open.</p></div><div class="lessons">${lessons.map(l=>`<a class="lesson" href="${lessonPath(l.number)}" style="--tint:${l.light};--tone:${l.color}"><span class="lesson-num">${l.number}</span><div><h3>${esc(l.subtitle)}</h3><p>${l.items.length} kaarten · ${completed.has(`${activeProgram}-${l.number}`)?'Al geoefend ✓':'Klaar voor jou'}</p></div><span class="arrow">→</span></a>`).join('')}</div><p class="practice-note">Geen tijdsdruk. Je mag zo vaak oefenen als je wilt.</p>`;
}
function lesson(number){const l=lessons.find(l=>l.number===number);if(!l){location.hash=bookPath();return}
 app.innerHTML=`<a class="back" href="${bookPath()}">← Alle lessen</a><section class="intro"><div><span class="eyebrow">${programs[activeProgram].name} · Boek ${activeBook} · Les ${number}</span><h1>${esc(l.subtitle)}</h1></div><span class="pill">${l.items.length} kaarten om te ontdekken</span></section><div class="section-head"><h2>Hoe wil jij oefenen?</h2><p>Probeer ze allemaal!</p></div><div class="modes">${modes.map(m=>`<a class="mode" href="${playPath(number,m[0])}"><span class="mode-icon" aria-hidden="true">${m[1]}</span><h3>${m[2]}</h3><p>${m[3]}</p></a>`).join('')}</div><section class="word-list"><h2>Eerst even kijken?</h2><p>Dit zijn de woorden van deze les.</p>${l.items.map(i=>`<div class="word-row"><div>${nl(i)}</div>${ar(i[0])}</div>`).join('')}</section>`;
}
function start(number, mode) {
  const l=lessons.find(l=>l.number===number);
  if(!l || !modes.some(m=>m[0]===mode)){location.hash='book';return;}
  game={lesson:l,mode,index:0,items:mode==='flash'?l.items:shuffle(l.items),flipped:false,answered:false,score:0,attempted:false};
  if(mode==='pairs'||mode==='memory') preparePairs();
  renderGame();
}
function preparePairs(){
  game.batch=game.items.slice(game.index,game.index+4);game.matched=[];game.selected=[];game.locked=false;
  game.left=shuffle(game.batch.map((_,i)=>i));game.right=shuffle(game.batch.map((_,i)=>i));
  game.cards=shuffle(game.batch.flatMap((_,i)=>[{id:i,side:0},{id:i,side:1}]));
}
function shell(content, instruction) {
  const g=game,m=modes.find(m=>m[0]===g.mode);
  app.innerHTML=`<section class="game"><div class="game-top"><a href="${lessonPath(g.lesson.number)}" class="back" style="margin:0">← Kies een spel</a><span>Les ${g.lesson.number} · ${Math.min(g.index+1,g.items.length)} / ${g.items.length}</span></div><div class="progress" aria-label="Voortgang"><span style="width:${g.index/g.items.length*100}%"></span></div><h1>${m[2]}</h1><p class="instruction">${instruction}</p>${content}<div class="feedback" id="feedback" aria-live="polite"></div><div class="controls" id="controls"></div></section>`;
}
function feedback(text,good=false){const el=document.querySelector('#feedback');el.textContent=text;el.classList.toggle('good',good);}
function nextButton(){document.querySelector('#controls').innerHTML='<button class="button" id="next">Verder →</button>';document.querySelector('#next').onclick=next;}
function next(){game.index++;game.flipped=false;game.answered=false;game.attempted=false;renderGame();}
function options(item){
  const pool=shuffle(game.lesson.items.filter(i=>i!==item && i[0]!==item[0] && i[1]!==item[1]));
  return shuffle([item,...pool.slice(0,3)]);
}
function answer(chosen,item,button){
  if(game.answered)return;
  if(chosen===item){game.answered=true;game.score+=game.attempted?0:1;button?.classList.add('correct');feedback(`Goed gevonden! ${item[1]}${item[2]?' ('+item[2]+')':''}.`,true);document.querySelectorAll('.choice').forEach(b=>b.disabled=true);nextButton();}
  else {game.attempted=true;button?.classList.add('wrong');feedback('Bijna! Kijk nog eens rustig. Je mag opnieuw kiezen.');}
}
function renderGame(){
  const g=game;if(g.index>=g.items.length){finish();return;}const item=g.items[g.index];
  if(g.mode==='flash'){
    shell(`<button class="flash" id="flip" aria-label="Draai het kaartje om">${visual(item)}${g.flipped?`<div class="translation">${nl(item)}</div>`:ar(item[0])}<span class="note">↔ Tik om ${g.flipped?'het Arabisch':'de betekenis'} te zien</span></button>`,'Kijk naar het woord. Weet jij wat het betekent?');
    document.querySelector('#flip').insertAdjacentHTML('afterend',listenButton());document.querySelector('.listen-button').onclick=()=>speak(item);document.querySelector('.listen-button').onclick=()=>speak(item);document.querySelector('#flip').onclick=()=>{g.flipped=!g.flipped;renderGame();};
    document.querySelector('#controls').innerHTML=`<button class="button secondary" id="prev" ${g.index===0?'disabled':''}>← Vorige</button><button class="button" id="next">${g.index===g.items.length-1?'Klaar ✓':'Volgend kaartje →'}</button>`;
    document.querySelector('#prev').onclick=()=>{g.index--;g.flipped=false;renderGame();};document.querySelector('#next').onclick=next;return;
  }
  if(g.mode==='pairs'||g.mode==='memory'){renderPairs();return;}
  if(g.mode==='build'){renderBuild(item);return;}
  const opts=options(item);
  const needsCaption=game.lesson.items.filter(i=>i[3]===item[3]).length>1 || ['old1','old5','old2','old6','old3','old4','girl_you','girl_me','origin','from','call','here','this','questionCandy'].includes(item[3]);
  const prompt=g.mode==='listen'?listenButton():g.mode==='reverse'?`<h2>${nl(item)}</h2>`:g.mode==='quiz'?ar(item[0]):visual(item,g.mode==='peek'?'reveal':'')+(needsCaption?`<p>${nl(item)}</p>`:'');
  const instructions={listen:'Luister en kies de Nederlandse betekenis.',quiz:'Wat betekent dit Arabische woord?',reverse:'Hoe zeg je dit in het Arabisch?',drag:'Sleep het woord naar het plaatje. Je kunt ook op het woord tikken.',peek:'Herken jij het plaatje? Kies het passende Arabische woord.'};
  shell(`<div class="stage">${prompt}${g.mode==='drag'?'<div class="drop-zone" id="drop">Leg jouw woord hier neer ↓</div>':''}${g.mode==='peek'?'<button class="button secondary" id="hint">Maak het plaatje helder</button>':''}<div class="choices">${opts.map((o,i)=>`<button class="choice ${g.mode==='drag'?'drag-word':''}" data-option="${i}" ${g.mode==='drag'?'draggable="true"':''}>${(g.mode==='quiz'||g.mode==='listen')?nl(o):ar(o[0])}</button>`).join('')}</div></div>`,instructions[g.mode]);
  if(g.mode!=='listen'){document.querySelector('.stage').insertAdjacentHTML('afterbegin',listenButton());document.querySelector('.listen-button').onclick=()=>speak(item)}
  if(g.mode!=='listen'){document.querySelector('.stage').insertAdjacentHTML('afterbegin',listenButton());document.querySelector('.listen-button').onclick=()=>speak(item)}
  document.querySelectorAll('[data-option]').forEach(b=>{
    b.onclick=()=>answer(opts[Number(b.dataset.option)],item,b);
    b.ondragstart=e=>e.dataTransfer.setData('text/plain',b.dataset.option);
  });
  if(g.mode==='drag'){
    const drop=document.querySelector('#drop');drop.ondragover=e=>{e.preventDefault();drop.classList.add('over');};drop.ondragleave=()=>drop.classList.remove('over');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('over');const raw=e.dataTransfer.getData('text/plain');if(!/^\d+$/.test(raw)||!opts[Number(raw)])return;const i=Number(raw);answer(opts[i],item,document.querySelector(`[data-option="${i}"]`));if(g.answered)drop.innerHTML=ar(item[0]);};
    document.querySelectorAll('.drag-word').forEach(button => enableTouchDrag(button, drop, () => { answer(opts[Number(button.dataset.option)], item, button); if(g.answered) drop.innerHTML=ar(item[0]); }));
  }
  if(g.mode==='listen'){document.querySelector('.listen-button').onclick=()=>speak(item);setTimeout(()=>{if(game===g)speak(item)},120)}
  if(g.mode==='listen'){document.querySelector('.listen-button').onclick=()=>speak(item);setTimeout(()=>{if(game===g)speak(item)},120)}
  if(g.mode==='peek')document.querySelector('#hint').onclick=()=>{document.querySelector('.visual').classList.remove('reveal');document.querySelector('#hint').disabled=true;};
}
function renderPairs(){
 const g=game;
 if(g.mode==='pairs'){
  shell(`<div class="stage"><div class="pairs"><div class="pair-col">${g.left.map(id=>`<button class="tile ${g.matched.includes(id)?'matched':''}" data-id="${id}" data-side="0" ${g.matched.includes(id)?'disabled':''}>${ar(g.batch[id][0])}</button>`).join('')}</div><div class="pair-col">${g.right.map(id=>`<button class="tile ${g.matched.includes(id)?'matched':''}" data-id="${id}" data-side="1" ${g.matched.includes(id)?'disabled':''}>${nl(g.batch[id])}</button>`).join('')}</div></div></div>`,'Tik op een Arabisch woord en daarna op zijn Nederlandse maatje.');
 }else{
  shell(`<div class="stage"><div class="memory">${g.cards.map((c,i)=>`<button class="tile ${g.matched.includes(c.id)?'matched':''}" data-id="${c.id}" data-side="${c.side}" data-card="${i}" aria-label="Kaart ${i+1} omdraaien" ${g.matched.includes(c.id)?'disabled':''}>${g.matched.includes(c.id)?(c.side?nl(g.batch[c.id]):ar(g.batch[c.id][0])):'✦'}</button>`).join('')}</div></div>`,'Zoek twee kaartjes met dezelfde betekenis: Arabisch en Nederlands.');
 }
 document.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{
  if(g.locked||g.selected.some(s=>s.button===b))return;
  const id=Number(b.dataset.id),side=Number(b.dataset.side);
  if(g.mode==='pairs'&&g.selected.length&&g.selected[0].side===side){g.selected[0].button.classList.remove('selected');g.selected=[];}
  b.classList.add('selected');if(g.mode==='memory')b.innerHTML=side?nl(g.batch[id]):ar(g.batch[id][0]);
  g.selected.push({id,side,button:b});if(g.selected.length<2)return;
  const [a,c]=g.selected;
  if(a.id===c.id&&a.side!==c.side){g.matched.push(id);a.button.classList.add('matched');b.classList.add('matched');a.button.disabled=true;b.disabled=true;g.selected=[];feedback('Twee maatjes gevonden!',true);
    if(g.matched.length===g.batch.length){document.querySelector('#controls').innerHTML='<button class="button" id="batch-next">Verder →</button>';document.querySelector('#batch-next').onclick=()=>{g.index+=g.batch.length;preparePairs();renderGame();};}
  }else{g.locked=true;feedback('Die horen nog niet bij elkaar. Probeer nog eens.');delayed=setTimeout(()=>{if(game!==g)return;g.selected.forEach(s=>{s.button.classList.remove('selected');if(g.mode==='memory')s.button.textContent='✦';});g.selected=[];g.locked=false;},1100);}
 });
}
function renderBuild(item){
 const plain=item[0].split(' (')[0];
 const segments=plain.includes(' ')?plain.split(' '):Array.from(new Intl.Segmenter('ar',{granularity:'grapheme'}).segment(plain),s=>s.segment);
 const pieces=shuffle(segments.map((text,id)=>({text,id})));
 let picked=[];
 shell(`<div class="stage"><h2>${nl(item)}</h2><div class="drop-zone" id="assembled" dir="rtl"><span class="note">Begin rechts: tik op het eerste stukje.</span></div><div class="order-bank" dir="rtl">${pieces.map(p=>`<button class="choice" data-piece="${p.id}" lang="ar">${esc(p.text)}</button>`).join('')}</div><div class="controls"><button class="button secondary" id="reset-pieces">Opnieuw leggen</button><button class="button secondary" id="show-word">Bekijk het woord</button><button class="button" id="check-word">Controleer ✓</button></div></div>`,'Bouw het Arabische woord van rechts naar links.');
 document.querySelectorAll('[data-piece]').forEach(b=>b.onclick=()=>{if(game.answered)return;picked.push(Number(b.dataset.piece));b.disabled=true;document.querySelector('#assembled').innerHTML=ar(picked.map(i=>segments[i]).join(plain.includes(' ')?' ':''));});
 document.querySelector('#reset-pieces').onclick=()=>{if(!game.answered)renderBuild(item);};
 document.querySelector('#show-word').onclick=()=>feedback(plain);
 document.querySelector('#check-word').onclick=()=>{const correct=picked.length===segments.length&&picked.map(i=>segments[i]).join(plain.includes(' ')?' ':'')===plain;if(correct){game.answered=true;feedback('Mooi gebouwd!',true);nextButton();}else feedback('Kijk nog eens naar de volgorde. Met “Bekijk het woord” krijg je hulp.');};
}
function finish(){
 completed.add(`${activeProgram}-${game.lesson.number}`);
 app.innerHTML=`<section class="game done"><div class="medal" aria-hidden="true">✦</div><span class="eyebrow">Goed geoefend!</span><h1>Je woordentuin groeit.</h1><p>Je hebt ${game.items.length} woorden uit les ${game.lesson.number} geoefend.<br>Elk rondje helpt je een beetje verder.</p><div class="controls"><button class="button" id="again">Nog een rondje ↻</button><a class="button secondary" href="${lessonPath(game.lesson.number)}">Kies een ander spel</a><a class="button secondary" href="${bookPath()}">Alle lessen →</a></div><p class="practice-note">Je oefenstatus blijft zichtbaar zolang deze pagina open is.</p></section>`;
 document.querySelector('#again').onclick=()=>start(game.lesson.number,game.mode);
}
function route(){clearTimeout(delayed);const [page,p,a,n,m]=location.hash.slice(1).split('/');game=null;
 if(page==='program')program(p);
 else if(page==='book'){if(programs[p]&&Number(a)===1){context(p,1);book()}else location.hash=`#program/${programs[p]?p:'bayna'}`}
 else if(page==='lesson'){if(programs[p]&&Number(a)===1){context(p,1);lesson(Number(n))}else if(!programs[p]&&Number(p)){context('bayna');lesson(Number(p))}else home()}
 else if(page==='play'){if(programs[p]&&Number(a)===1){context(p,1);start(Number(n),m)}else if(!programs[p]&&Number(p)){context('bayna');start(Number(p),a)}else home()}
 else home();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);route();
// Installation stays optional; exercises also work in an ordinary browser tab.
const installDialog = document.querySelector('#install-dialog');
const installNow = document.querySelector('#install-now');
let installPrompt = null;
let workerRegistration = null;
const offlineStatus = document.querySelector('#offline-status');
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
document.querySelector('.install-open').onclick = () => installDialog.showModal();
document.querySelector('.dialog-close').onclick = () => installDialog.close();
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; installNow.hidden = false;
});
installNow.onclick = async () => {
  if (!installPrompt) return;
  await installPrompt.prompt(); await installPrompt.userChoice;
  installPrompt = null; installNow.hidden = true;
};
window.addEventListener('appinstalled', () => {
  installNow.hidden = true; installPrompt = null;
  document.querySelector('#download-state').textContent = 'Woordentuin is toegevoegd aan je apps. Veel speelplezier!';
});
function showOfflineReady() {
  offlineStatus.textContent = navigator.onLine ? '✓ De woordentuin is offline klaar' : '✓ Je oefent zonder internet';
  document.querySelector('#download-state').textContent = 'Beschikbare boeken en oefenillustraties zijn opgeslagen voor offlinegebruik. De boekomslagen laden met internet. Je tablet kan opgeslagen gegevens opruimen als er weinig ruimte is.';
  if (workerRegistration?.waiting) {
    const update = document.createElement('button'); update.className = 'button secondary'; update.textContent = 'Nieuwe versie openen';
    update.onclick = () => workerRegistration.waiting.postMessage('ACTIVATE_UPDATE'); offlineStatus.append(update);
  }
}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  offlineStatus.textContent = 'Oefeningen opslaan voor offlinegebruik…';
  let wasControlled = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasControlled) location.reload(); else { wasControlled = true; showOfflineReady(); }
  });
  navigator.serviceWorker.register('./sw.js').then(reg => {
    workerRegistration = reg;
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showOfflineReady(); });
    });
    return navigator.serviceWorker.ready;
  }).then(() => {
    showOfflineReady(); window.addEventListener('online', showOfflineReady); window.addEventListener('offline', showOfflineReady);
  }).catch(() => { offlineStatus.textContent = 'Offline opslaan is nog niet gelukt. Open de app opnieuw met internet.'; });
}
if (standalone()) document.querySelector('.install-open').textContent = 'App-info';

// Pointer capture enables real dragging on touchscreens without disabling page scrolling elsewhere.
function enableTouchDrag(button, drop, onDrop) {
  let drag = null;
  let suppressClick = false;
  button.addEventListener('click', event => {
    if (suppressClick) { event.stopImmediatePropagation(); event.preventDefault(); suppressClick = false; }
  }, true);
  button.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || button.disabled || !event.isPrimary) return;
    suppressClick = false;
    drag = {x:event.clientX,y:event.clientY,ghost:null,id:event.pointerId};
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.ghost && Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>10) {
      drag.ghost = document.createElement('div'); drag.ghost.className = 'drag-ghost'; drag.ghost.innerHTML = button.innerHTML; drag.ghost.setAttribute('aria-hidden','true'); document.body.append(drag.ghost);
    }
    if (!drag.ghost) return;
    drag.ghost.style.left = event.clientX+'px'; drag.ghost.style.top = event.clientY+'px';
    const rect = drop.getBoundingClientRect();
    drop.classList.toggle('over',event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom);
  });
  function end(event) {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.ghost) {
      suppressClick = true;
      const rect=drop.getBoundingClientRect();
      if (event.type==='pointerup'&&event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom) onDrop();
      drag.ghost.remove();
    }
    drop.classList.remove('over'); drag=null;
  }
  button.addEventListener('pointerup',end); button.addEventListener('pointercancel',end);
}
