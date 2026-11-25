/* ToTest · Kit de juegos «aprende jugando»
   Motor común: presentador al estilo Pokémon, escenario en canvas, vidas, preguntas bonus, repaso final.
   Cada juego aporta su escena (dibujo + animaciones de acierto/fallo) y usa las preguntas de un test de ToTest. */
(function(){
window.ToTestGames=window.ToTestGames||{};
const CSS=`
.kv{--kc:#1f4fd1}
.kv-head{background:#16181c;color:#fff;padding:14px max(5vw,16px)}
.kv-head .wrap{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.kv-head a{color:#fff;text-decoration:none;font-weight:700;min-height:44px;display:inline-flex;align-items:center}
.kv-head h1{font-size:clamp(22px,3.4vw,30px)}
.kv-head button{min-height:44px;border-radius:22px;border:1.5px solid #4a4f58;background:#23262c;color:#fff;cursor:pointer;font-size:16px;padding:0 14px}
.kv-main{max-width:880px;margin:0 auto;padding:18px max(3vw,10px) 40px}
.kv-hud{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px;font-weight:700}
.kv-bar{flex:1 1 180px;height:12px;border-radius:6px;background:var(--line);overflow:hidden}.kv-bar i{display:block;height:100%;background:var(--kc);transition:width .5s}
.kv-lives{display:flex;gap:4px;align-items:center;font-size:22px;line-height:1;white-space:nowrap}
.kv-lives .off{opacity:.2;filter:grayscale(1)}
.kv-pts{font-family:"Archivo Black",sans-serif;font-weight:400;white-space:nowrap;background:#16181c;color:#fff;border-radius:6px;padding:4px 10px}
.kv-stage{position:relative;border-radius:10px;overflow:hidden;border:3px solid #16181c;background:#222}
.kv-stage canvas{display:block;width:100%;height:auto;image-rendering:auto}
.kv-stage.pix canvas{image-rendering:pixelated}
.kv-title{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle,rgba(22,24,28,.55),rgba(22,24,28,.9));backdrop-filter:blur(3px);transition:opacity .4s}.kv-title.off{opacity:0;pointer-events:none}
.kv-poster{height:92%;aspect-ratio:3/4;border-radius:10px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.6);animation:kvPo 3s ease-in-out infinite alternate}.kv-poster svg{width:100%;height:100%;display:block}@keyframes kvPo{from{transform:rotate(-1.5deg) translateY(0)}to{transform:rotate(1.5deg) translateY(-6px)}}
.kv-stampbox{position:absolute;inset:0;pointer-events:none}
.kv-stamp{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%) rotate(-7deg);font-family:"Archivo Black",sans-serif;font-size:clamp(24px,5.6vw,48px);color:#fff;padding:6px 18px;border:5px solid #fff;border-radius:10px;background:#e0731a;box-shadow:0 8px 0 rgba(0,0,0,.3);white-space:nowrap;animation:kvSt .35s cubic-bezier(.2,1.6,.5,1)}
.kv-stamp.bad{background:#b42318}.kv-stamp.good{background:#18794e}.kv-stamp.gold{background:#c98a00}
@keyframes kvSt{from{transform:translate(-50%,-50%) rotate(-7deg) scale(2.2);opacity:0}}
.kv-box{position:relative;margin-top:-6px;background:#fffdf4;color:#16181c;border:4px solid #16181c;border-radius:12px;box-shadow:inset 0 0 0 3px var(--kc),0 6px 0 rgba(0,0,0,.18);padding:16px 18px 16px 112px;min-height:150px}
.kv-host{position:absolute;left:10px;bottom:10px;width:92px;height:120px}
.kv-host svg{width:100%;height:100%}
.kv-host.talk{animation:kvBob .35s ease-in-out infinite alternate}
.kv-host .mo{opacity:0}.kv-host.talk .mo{animation:kvMo .26s steps(1) infinite}.kv-host.talk .mc{animation:kvMc .26s steps(1) infinite}.kv-host .lid{opacity:0;animation:kvLid 3.8s steps(1) infinite}
@keyframes kvMo{0%{opacity:1}50%{opacity:0}}@keyframes kvMc{0%{opacity:0}50%{opacity:1}}@keyframes kvLid{0%,93%{opacity:0}94%,100%{opacity:1}}@keyframes kvBob{to{transform:translateY(-4px) rotate(-2deg)}}
.kv-name{position:absolute;top:-16px;left:104px;background:#16181c;color:#fff;font-family:"Archivo Black",sans-serif;font-size:14px;padding:3px 12px;border-radius:6px;border-bottom:3px solid var(--kc)}
.kv-txt{font-size:18px;line-height:1.45;min-height:52px;margin:0}
.kv-txt b{color:#b42318}.kv-txt code,.kv-opt code{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:.88em;background:#eef1f6;padding:1px 5px;border-radius:4px;overflow-wrap:anywhere;color:#16181c}
.kv-rule{display:block;margin-top:8px;font-size:16px;color:#3c4249;border-left:4px solid var(--kc);padding-left:10px}
.kv-extra{margin-top:10px}
.kv-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}
.kv-opt{display:flex;gap:10px;align-items:center;text-align:left;min-height:48px;padding:8px 12px;border-radius:8px;border:2.5px solid #16181c;background:#fff;color:#16181c;font:700 16px/1.3 "Atkinson Hyperlegible",sans-serif;cursor:pointer;box-shadow:0 3px 0 #16181c;transition:transform .08s}
.kv-opt:hover{transform:translateY(-2px)}.kv-opt:active{transform:translateY(2px);box-shadow:none}
.kv-opt kbd{flex:none;width:28px;height:28px;border-radius:6px;background:var(--kc);color:#fff;display:grid;place-items:center;font:400 14px "Archivo Black",sans-serif;border:2px solid #16181c}
.kv-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.kv-next{display:inline-flex;align-items:center;gap:6px;min-height:46px;padding:8px 18px;border:0;border-radius:8px;background:#16181c;color:#fff;font:700 16px "Atkinson Hyperlegible",sans-serif;cursor:pointer}
.kv-next.alt{background:var(--kc)}
.kv-next.go::after{content:"▼";font-size:12px;animation:kvBl .7s steps(2) infinite}@keyframes kvBl{50%{opacity:0}}
.kv-end .big{font-family:"Archivo Black",sans-serif;font-size:clamp(28px,6vw,42px);line-height:1}
.kv-end ul{margin:10px 0 0;padding-left:20px;font-size:15px}.kv-end li{margin-bottom:8px}
.kv-help{color:var(--soft);font-size:14px;margin:12px 0 0;text-align:center}
@media(max-width:600px){.kv-box{padding:56px 12px 14px}.kv-host{left:auto;right:8px;top:-62px;bottom:auto;width:64px;height:84px}.kv-name{left:12px}.kv-txt{font-size:17px}.kv-opts{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.kv-host.talk,.kv-stamp,.kv-next.go::after{animation:none}}
`;

window.ToTestKit=function(G){return function(root,api){
 const esc=api.esc,rich=api.rich||esc;
 if(!document.getElementById("kv-css")){const st=document.createElement("style");st.id="kv-css";st.textContent=CSS;document.head.appendChild(st)}
 const LIVES=G.lives||3,BONUS=G.bonusEvery||5;
 root.innerHTML=`<div class="kv" style="--kc:${G.color}"><header class="kv-head"><div class="wrap"><a href="#">← ToTest</a><h1>${esc(G.title)}</h1><button type="button" id="kvSnd">Sonido: sí</button></div></header>
 <main class="kv-main"><div class="kv-hud" ${G.hud===false?'style="display:none"':""}><span id="kvProg">—</span><div class="kv-bar" aria-hidden="true"><i id="kvBar"></i></div><span class="kv-pts" id="kvPts">0</span><span class="kv-lives" id="kvLives"></span></div>
 <div class="kv-stage ${G.pixel?"pix":""}"><canvas id="kvCv" aria-label="${esc(G.canvasLabel||"Escena del juego")}"></canvas><div class="kv-stampbox" id="kvStamp"></div>${api.poster?`<div class="kv-title" id="kvTitle"><div class="kv-poster">${api.poster}</div></div>`:""}</div>
 <section class="kv-box" aria-live="polite"><div class="kv-host" id="kvHost">${G.host.svg}</div><span class="kv-name">${esc(G.host.name)}</span><p class="kv-txt" id="kvTxt"></p><div id="kvUI"></div></section>
 <p class="kv-help">Responde con las teclas 1-4 · Enter o espacio para continuar</p></main></div>`;
 const $=id=>document.getElementById(id),cv=$("kvCv"),ctx=cv.getContext("2d");
 let W=G.W||820,H=G.H||440,alive=true,raf=0,lastT=0;
 const K={ctx,S:{},W,H,esc,rich,api};

 /* sonido */
 let ac=null,snd=api.store.get("kv-snd")!==false;
 const A=()=>{if(!snd)return null;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume()}catch(e){ac=null}return ac};
 const tone=(f,d,type="square",v=.05,when=0)=>{const c=A();if(!c)return;const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)};
 const noise=(d,v=.15,freq=1200)=>{const c=A();if(!c)return;const b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type="bandpass";f.frequency.value=freq;s.buffer=b;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start()};
 K.SFX={tone,noise,good:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.16,"triangle",.07,i*.07)),bad:()=>{tone(220,.25,"sawtooth",.05);tone(165,.35,"sawtooth",.05,.18)},
  blip:()=>tone(880+Math.random()*120,.03,"square",.012),boom:()=>{noise(1,.35,300);tone(70,.7,"sine",.2)},jump:()=>{const c=A();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type="square";o.frequency.setValueAtTime(300,c.currentTime);o.frequency.exponentialRampToValueAtTime(900,c.currentTime+.15);g.gain.setValueAtTime(.05,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.2);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.22)},
  coin:()=>{tone(988,.08,"square",.05);tone(1319,.3,"square",.05,.08)},power:()=>[392,523,659,784,1046,1318].forEach((f,i)=>tone(f,.1,"square",.045,i*.06)),win:()=>[523,659,784,659,784,1046].forEach((f,i)=>tone(f,.2,"triangle",.07,i*.12)),
  over:()=>[392,330,262,196].forEach((f,i)=>tone(f,.3,"triangle",.07,i*.22))};
 $("kvSnd").onclick=()=>{snd=!snd;api.store.set("kv-snd",snd);$("kvSnd").textContent="Sonido: "+(snd?"sí":"no")};$("kvSnd").textContent="Sonido: "+(snd?"sí":"no");

 /* utilidades de dibujo para los juegos */
 K.rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h)};
 K.parts=[];K.bub=[];
 K.puff=(x,y,n,c,sp=60,r=6,life=1.2)=>{for(let i=0;i<n;i++)K.parts.push({x,y,vx:(Math.random()-.5)*sp*2,vy:(Math.random()-.5)*sp*2-20,r:r*(.5+Math.random()),c,life:life*(.6+Math.random()*.6),max:life*1.2,g:0})};
 K.say=(txt,at,dur=1.5,col="#fff")=>K.bub.push({txt,at:typeof at==="function"?at:()=>at,life:dur,col});
 K.ramp=(v,to,k,dt)=>v+(to-v)*Math.min(1,k*dt);
 K.stamp=(txt,cls,keep)=>{if(G.stamps===false)return;const b=$("kvStamp");b.innerHTML="";const d=document.createElement("div");d.className="kv-stamp "+(cls||"");d.textContent=txt;b.appendChild(d);if(!keep)setTimeout(()=>d.remove(),1500)};
 K.shake=0;K.flash=0;
 function bubble(txt,x,y,col){ctx.font="bold 15px 'Atkinson Hyperlegible',sans-serif";const w=ctx.measureText(txt).width+18;x=Math.max(w/2+4,Math.min(W-w/2-4,x));y=Math.max(40,y);ctx.fillStyle=col;ctx.strokeStyle="#16181c";ctx.lineWidth=2.5;K.rr(x-w/2,y-34,w,26,8);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-6,y-9);ctx.lineTo(x,y);ctx.lineTo(x+6,y-9);ctx.fill();ctx.fillStyle="#16181c";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(txt,x,y-21)}

 function size(){const w=cv.clientWidth||800;const mob=w<620;W=mob?(G.mW||G.W||820):(G.W||820);H=mob?(G.mH||G.H||440):(G.H||440);K.W=W;K.H=H;K.mob=mob;const dpr=Math.min(2,window.devicePixelRatio||1);if(G.pixel){cv.width=W;cv.height=H}else{cv.width=Math.round(w*dpr);cv.height=Math.round(w*H/W*dpr)}G.resize&&G.resize(K)}
 const ro=new ResizeObserver(size);ro.observe(cv);

 /* estado de partida */
 let set=null,deck=[],qi=0,lives=LIVES,pts=0,okN=0,fails=[],phase="idle",t=0,typing=0,advance=null,curOk=false,ended=false;
 K.phase=()=>phase;K.info=()=>({lives,pts,qi,n:deck.length,LIVES,okN});
 function hud(){$("kvProg").textContent=deck.length?`Pregunta ${Math.min(qi+1,deck.length)}/${deck.length}`:"—";$("kvBar").style.width=(deck.length?qi/deck.length*100:0)+"%";$("kvPts").textContent=pts+" pts";
  $("kvLives").innerHTML=Array.from({length:LIVES},(_,i)=>`<span class="${i<lives?"":"off"}">${G.lifeIcon||"❤️"}</span>`).join("");$("kvLives").setAttribute("aria-label",`Vidas: ${lives}`)}
 function talk(html,done,speed=16){clearInterval(typing);const el=$("kvTxt"),tmp=document.createElement("div");tmp.innerHTML=html;const full=tmp.textContent;let i=0;$("kvHost").classList.add("talk");el.textContent="";
  const fin=()=>{clearInterval(typing);typing=0;el.innerHTML=html;$("kvHost").classList.remove("talk");done&&done()};advance=fin;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return fin();
  typing=setInterval(()=>{i+=2;el.textContent=full.slice(0,i);if(i%6===0)K.SFX.blip();if(i>=full.length)fin()},speed)}
 function buttons(list){$("kvUI").innerHTML=`<div class="kv-btns">${list.map((b,i)=>`<button type="button" class="kv-next ${i?"alt":"go"}" data-i="${i}">${esc(b[0])}</button>`).join("")}</div>`;
  const bs=$("kvUI").querySelectorAll("button");bs.forEach(b=>b.onclick=()=>{advance=null;list[+b.dataset.i][1]()});advance=()=>bs[0].click();bs[0].focus({preventScroll:true})}
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
 const pick=a=>a[Math.random()*a.length|0];

 function intro(){phase="idle";ended=false;K.S={};G.setup&&G.setup(K);hud();
  const sets=G.sets.filter(s=>api.tests[s.id]);
  talk(G.introText,()=>buttons(sets.map(s=>[s.label,()=>start(s.id)])));}
 function start(id){const tt=$("kvTitle");if(tt)tt.classList.add("off");K.setId=id;set=api.tests[id];deck=shuffle(set.q).map(q=>({q:q[0],o:q[1],hint:q[2],rule:q[3],x:q[4]}));qi=0;lives=LIVES;pts=0;okN=0;fails=[];ended=false;K.S={};G.setup&&G.setup(K);A();hud();next()}
 function next(){if(qi>=deck.length)return win();const q=deck[qi];q.bonus=(qi+1)%BONUS===0;hud();phase="enter";t=0;$("kvUI").innerHTML="";
  if(q.bonus)K.stamp(G.bonusLabel||"⭐ PREGUNTA BONUS","gold");
  G.enter&&G.enter(K,q,qi);talk(esc(q.bonus?(G.bonusIntro||"¡Pregunta bonus! Si aciertas, ganas un premio."):pick(G.preLines||["¡Ahí va otra!"])),null,14)}
 function ask(){const q=deck[qi];phase="ask";
  talk(rich(q.q),()=>{const ord=shuffle(q.o.map((_,i)=>i));
   $("kvUI").innerHTML=(G.extra?G.extra(K,q):"")+`<div class="kv-opts">${ord.map((k,n)=>`<button type="button" class="kv-opt" data-k="${k}"><kbd>${n+1}</kbd><span>${rich(q.o[k])}</span></button>`).join("")}</div>`;
   $("kvUI").querySelectorAll(".kv-opt").forEach(b=>b.onclick=()=>answer(+b.dataset.k));$("kvUI").querySelector(".kv-opt").focus({preventScroll:true})},12)}
 function answer(k){if(phase!=="ask")return;advance=null;const q=deck[qi];curOk=k===0;$("kvUI").innerHTML="";
  $("kvTxt").textContent=curOk?"¡Veamos!":"Uy, uy, uy…";
  if(curOk){okN++;pts+=q.bonus?250:100}else{lives--;fails.push(q)}
  hud();phase="res";t=0;K.lost=!curOk&&lives<=0;
  (curOk?G.okStart:G.koStart)&&(curOk?G.okStart:G.koStart)(K,q)}
 function afterRes(){const q=deck[qi];
  if(!curOk&&lives<=0){phase="over";t=0;G.overStart&&G.overStart(K);K.SFX.over();K.stamp(G.overStamp||"GAME OVER","bad",true);setTimeout(()=>alive&&gameOver(),1800);return}
  let extra="";
  if(curOk&&q.bonus){if(lives<LIVES){lives++;extra=` <b style="color:#c98a00">⭐ ¡Bonus! Recuperas una vida.</b>`}else{pts+=250;extra=` <b style="color:#c98a00">⭐ ¡Bonus! Vidas a tope: +250 pts extra.</b>`}G.bonusGet&&G.bonusGet(K);K.SFX.power();hud()}
  phase="wait";
  talk(`${curOk?"<b style='color:#18794e'>¡Bien!</b> ":"<b>¡Fallo!</b> Era: "+rich(q.o[0])+". "}${esc(pick(curOk?G.okLines:G.koLines))}${extra} <span class="kv-rule">${rich(q.rule)}</span>`,
   ()=>buttons([[qi+1<deck.length?"Siguiente":"Ver resultado",()=>{qi++;next()}]]),10)}
 function recap(){return fails.length?`<p>Para repasar:</p><ul>${fails.map(f=>`<li><b>${rich(f.q)}</b><br>Correcta: ${rich(f.o[0])}. ${rich(f.rule)}</li>`).join("")}</ul>`:""}
 function finish(title,msg){ended=true;const n=Math.round(okN/deck.length*100)/10,best=api.store.get("kvbest:"+G.id+":"+set.id)||0;if(pts>best)api.store.set("kvbest:"+G.id+":"+set.id,pts);
  talk(`<span class="kv-end"><span class="big">${esc(title)}</span><br>${esc(msg)} Nota: <b style="color:#16181c">${String(n).replace(".",",")}/10</b> · ${okN}/${deck.length} aciertos · ${pts} pts${best&&pts<=best?` (récord: ${best}).`:pts>best?" · ¡nuevo récord!":"."}</span>`,
   ()=>{$("kvUI").innerHTML=`<div class="kv-end">${recap()}</div>`;const sets=G.sets.filter(s=>api.tests[s.id]);
    const box=document.createElement("div");$("kvUI").appendChild(box);
    box.innerHTML=`<div class="kv-btns">${[["Jugar otra vez",set.id],...sets.filter(s=>s.id!==set.id).map(s=>[s.label,s.id])].map((b,i)=>`<button type="button" class="kv-next ${i?"alt":"go"}" data-s="${b[1]}">${esc(b[0])}</button>`).join("")}</div>`;
    const bs=box.querySelectorAll("button");bs.forEach(b=>b.onclick=()=>{advance=null;start(b.dataset.s)});advance=()=>bs[0].click()},10)}
 function win(){phase="win";t=0;qi=deck.length;hud();G.winStart&&G.winStart(K);K.SFX.win();K.stamp(G.winStamp||"¡NIVEL SUPERADO!","good");finish(G.winTitle||"¡Lo has conseguido!",(G.winText||"")+" ")}
 function gameOver(){finish(G.overTitle||"Game over",G.overText||"Te has quedado sin vidas.")}

 function loop(now){if(!alive)return;const dt=Math.min(.05,(now-(lastT||now))/1000);lastT=now;t+=dt;
  if(phase==="enter"){if(G.enterStep?G.enterStep(K,t,dt):t>.8)ask()}
  else if(phase==="res"){(curOk?G.ok:G.ko)(K,t,dt);if(t>(G.dur||2.4))afterRes()}
  else if(phase==="over"){G.over&&G.over(K,t,dt)}
  else if(phase==="win"){G.win&&G.win(K,t,dt)}
  else G.idle&&G.idle(K,t,dt);
  K.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.life-=dt});K.parts=K.parts.filter(p=>p.life>0);K.bub.forEach(b=>b.life-=dt);K.bub=K.bub.filter(b=>b.life>0);
  K.shake=Math.max(0,K.shake-dt*20);K.flash=Math.max(0,K.flash-dt*2.5);
  ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);ctx.imageSmoothingEnabled=!G.pixel;
  if(K.shake)ctx.translate((Math.random()-.5)*K.shake,(Math.random()-.5)*K.shake);
  G.draw(K,now/1000);
  if(!G.pixel){const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.45)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  K.parts.forEach(p=>{ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.max*1.5));ctx.fillStyle=p.c;if(G.pixel)ctx.fillRect(Math.round(p.x-p.r/2),Math.round(p.y-p.r/2),Math.ceil(p.r),Math.ceil(p.r));else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()}});ctx.globalAlpha=1;
  K.bub.forEach(b=>{const[x,y]=b.at();bubble(b.txt,x,y,b.col)});
  if(K.flash){ctx.fillStyle=`rgba(255,255,255,${K.flash})`;ctx.fillRect(0,0,W,H)}
  if(phase==="ask"){ctx.strokeStyle=G.color;ctx.globalAlpha=.55+.35*Math.sin(now/250);const lw=G.pixel?2:8;ctx.lineWidth=lw;ctx.strokeRect(lw/2,lw/2,W-lw,H-lw);ctx.globalAlpha=1}
  raf=requestAnimationFrame(loop)}
 function onKey(e){if(!alive)return;if(phase==="ask"&&/^[1-4]$/.test(e.key)){const b=$("kvUI").querySelectorAll(".kv-opt")[+e.key-1];if(b){e.preventDefault();b.click()}return}
  if((e.key==="Enter"||e.key===" ")&&advance&&!(e.target&&e.target.closest&&e.target.closest("button"))){e.preventDefault();advance()}}
 document.addEventListener("keydown",onKey);
 $("kvTxt").parentNode.addEventListener("click",e=>{if(!e.target.closest("button")&&typing&&advance)advance()});
 size();intro();raf=requestAnimationFrame(loop);
 return()=>{alive=false;try{G.cleanup&&G.cleanup(K)}catch(e){}cancelAnimationFrame(raf);clearInterval(typing);ro.disconnect();document.removeEventListener("keydown",onKey);try{ac&&ac.close()}catch(e){}};
}};
})();

/* utilidades pixel compartidas */
(function(){const FONT={"0":"111101101101111","1":"010110010010111","2":"111001111100111","3":"111001111001111","4":"101101111001001","5":"111100111001111","6":"111100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001111",
 A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"001001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",O:"010101101101010",P:"110101110100100",Q:"010101101111011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111",
 "!":"010010010000010","?":"110001010000010","-":"000000111000000",":":"000010000010000",".":"000000000000010","+":"000010111010000","x":"000101010101000"," ":"000000000000000"};
function text(c,s,x,y,sc=1,col="#f4f4f4",sh="#1a1c2c",center){s=s.toUpperCase().replace(/Ñ/g,"\u0001").normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(center)x-=Math.round((s.length*4-1)*sc/2);
 for(let pass=sh?0:1;pass<2;pass++){c.fillStyle=pass?col:sh;const o=pass?0:Math.max(1,Math.ceil(sc/2));[...s].forEach((ch,k)=>{const g=FONT[ch]||FONT[" "];for(let b=0;b<15;b++)if(g[b]==="1")c.fillRect(Math.round(x+k*4*sc+(b%3)*sc+o),Math.round(y+Math.floor(b/3)*sc+o),sc,sc)})}}
FONT["#"]="101111101111101";FONT["\u0001"]="111000110101101";FONT["/"]="001001010100100";FONT["¡"]="010000010010010";FONT["¿"]="010000010100011";FONT[","]="000000000010100";FONT["'"]="010010000000000";FONT["(" ]="010100100100010";FONT[")"]="010001001001010";FONT["="]="000111000111000";FONT["*"]="000101010101000";FONT["%"]="101001010100101";
window.ToTestPix={FONT,text};
})();
