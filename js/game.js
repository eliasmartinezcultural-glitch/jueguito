(function(){
"use strict";
const D=window.VP_DATA,canvas=document.getElementById("world"),ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const $=id=>document.getElementById(id);
const STORAGE="villa-pelon-luna-v2";
const state={player:{x:310,y:430,speed:3,dir:"down",frame:0},clock:8,day:1,weather:"sun",weatherTicks:0,energy:100,xp:0,inventory:[],flags:{},activeQuest:0,completed:[],dialogOpen:false,lastSave:0,nearby:null,cam:{x:0,y:0},walkTimer:0};
const keys=new Set();
const weatherTypes={sun:{label:"Soleado",icon:"☀",fx:"🌿 Brisa suave",tint:null},cloud:{label:"Nublado",icon:"☁",fx:"☁ Nubes viajeras",tint:"rgba(74,93,105,.10)"},rain:{label:"Lluvia",icon:"🌧",fx:"🌧 Lluvia patagónica",tint:"rgba(42,76,103,.22)"},wind:{label:"Viento",icon:"🍃",fx:"🍃 Viento del valle",tint:"rgba(192,173,115,.08)"}};
function randWeather(){const r=Math.random();state.weather=r<.52?"sun":r<.74?"cloud":r<.9?"wind":"rain";state.weatherTicks=1200+Math.random()*1800;updateWeatherUI()}
function load(){try{const s=JSON.parse(localStorage.getItem(STORAGE)||"null");if(s&&s.version===2){Object.assign(state,s.state);state.dialogOpen=false;}}catch(e){}}
function save(){try{const copy={...state,dialogOpen:false,nearby:null};localStorage.setItem(STORAGE,JSON.stringify({version:2,state:copy}));$("saveLabel").textContent="Partida guardada · Día "+state.day;}catch(e){$("saveLabel").textContent="Guardado local no disponible"}}
function currentQuest(){return D.quests[state.activeQuest]||D.quests[D.quests.length-1]}
function done(id){return !!state.flags[id]}
function completeObjective(id){state.flags[id]=true;const q=currentQuest();if(q&&q.objectives.every(o=>done(o.id))&&!state.completed.includes(q.id)){state.completed.push(q.id);state.xp+=q.reward.xp;if(q.reward.item&&!state.inventory.includes(q.reward.item))state.inventory.push(q.reward.item);if(state.activeQuest<D.quests.length-1)state.activeQuest++;showDialog("✦ Misión completada",q.title,"¡Luna descubrió algo importante! Ganó "+q.reward.xp+" puntos de experiencia y guardó un recuerdo en su mochila.",[{label:"Seguir explorando",effect:"close"}]);}
updateUI();save()}
function objectiveTarget(id){const q=currentQuest();return q&&q.objectives.some(o=>o.target===id&&!done(o.id))}
function showDialog(kicker,title,text,choices=[]){state.dialogOpen=true;$("dialogShade").hidden=false;$("dialogIcon").textContent="✿";$("dialogKicker").textContent=kicker;$("dialogTitle").textContent=title;$("dialogBody").textContent=text;const holder=$("dialogChoices");holder.innerHTML="";choices.forEach((c,i)=>{const b=document.createElement("button");b.textContent=c.label;b.className=i===0?"correct":"soft";b.onclick=()=>handleEffect(c.effect);holder.appendChild(b)});if(!choices.length){const b=document.createElement("button");b.textContent="Seguir";b.onclick=closeDialog;holder.appendChild(b)}$("closeDialog").focus()}
function closeDialog(){state.dialogOpen=false;$("dialogShade").hidden=true}
function handleEffect(effect){if(effect==="close"){closeDialog();return}closeDialog();switch(effect){
case"startQuest":showDialog("CAPÍTULO 1","Una pregunta para las vacaciones","Luna abre su cuaderno. Para entender el agua, va a escuchar a quienes viven aquí, recorrer los canales y observar la chacra.",[{label:"¡Empezar!",effect:"close"}]);break;
case"notebook":addItem("cuaderno de campo");showDialog("OBJETO","Cuaderno de campo","Luna guardó un cuaderno para anotar lugares, historias y preguntas.");break;
case"hintGate":showDialog("PISTA","Seguí el canal","Rosa señala hacia la compuerta que conecta la historia del río con la distribución del agua. Buscá la estructura de madera junto al canal.");break;
case"clueWater":addItem("pista del riego");completeObjective("talk-rosa");showDialog("PISTA REGISTRADA","El agua necesita un camino","Luna anotó: captar el agua, conducirla y distribuirla requiere infraestructura y organización.");break;
case"visitOrchard":completeObjective("visit-orchard");showDialog("OBSERVACIÓN","La chacra cambia con el tiempo","Las plantas, las tareas y el uso del agua siguen ciclos. Luna anotó que observar también es una forma de investigar.");break;
case"clueOrchard":addItem("nota de la chacra");completeObjective("meet-tomas");showDialog("RECUERDO","Historias de trabajo","Luna guardó una nota sobre los trabajos y los ritmos de la vida rural.");break;
case"map":mapDialog();break;
case"journal":journalDialog();break;
case"day":showDialog("EL DÍA AVANZA","Hora de descansar","La energía se recupera cuando Luna vuelve a casa de sus abuelos. El mundo seguirá su ritmo al día siguiente.");break;
default:break}}
function addItem(name){if(!state.inventory.includes(name))state.inventory.push(name);updateUI();save()}
function interact(){if(state.dialogOpen){closeDialog();return}const p=state.player;let nearest=null,dist=70;const things=[...D.npc.map(n=>({...n,...npcPosition(n)})),...D.objects];things.forEach(o=>{const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<dist){nearest=o;dist=d}});if(!nearest){showDialog("EXPLORACIÓN","Seguí caminando","Acercate a una persona, una compuerta, una planta o un cartel para descubrir algo.");return}
if(nearest.role){npcInteract(nearest);return}objectInteract(nearest)}
function npcInteract(n){if(n.id==="abuelo"){completeObjective("ask-mateo");showDialog("EN CASA","Abuelo Mateo",D.dialogue.abuelo.text,D.dialogue.abuelo.choices);return}if(n.id==="rosa"){completeObjective("talk-rosa");showDialog("HISTORIA DEL RIEGO",D.dialogue.rosa.title,D.dialogue.rosa.text,D.dialogue.rosa.choices);return}if(n.id==="tomas"){completeObjective("meet-tomas");showDialog("VIDA RURAL",D.dialogue.tomas.title,D.dialogue.tomas.text,D.dialogue.tomas.choices);return}}
function objectInteract(o){if(o.once&&state.flags["found-"+o.id]){showDialog("CUADERNO DE LUNA",o.name,"Luna ya registró este descubrimiento. Podés seguir explorando para encontrar otra pista.");return}
state.flags["found-"+o.id]=true;let text="",kicker="DESCUBRIMIENTO";
switch(o.id){
case"notebook":addItem("cuaderno de campo");text="Un cuaderno con hojas en blanco. Luna decide usarlo para registrar sus preguntas y descubrimientos.";completeObjective("ask-mateo");break;
case"gate":text="Una compuerta permite regular el paso del agua. Las obras de riego transformaron la vida productiva del valle. La escena es esquemática: no representa una estructura histórica específica.";addItem("dibujo de una compuerta");completeObjective("inspect-gate");break;
case"watermark":text="La marca en la ribera invita a pensar en las crecidas y en cómo cambia el río. Para conocer un episodio histórico concreto, habrá que consultar documentos y testimonios contrastados.";addItem("apunte sobre el río");completeObjective("find-river");break;
case"orchard":text="Luna observa los frutales y anota una pregunta: ¿cómo cambió el paisaje cuando se extendieron los sistemas de riego?";addItem("hoja de frutal");completeObjective("visit-orchard");break;
case"picada":text="Picada 21: un camino que conecta lugares de trabajo y vida cotidiana. En esta versión es un punto de exploración; su recorrido preciso se verificará con cartografía local antes de dibujarlo como exacto.";addItem("croquis de camino");completeObjective("find-picada");break;
default:text="Luna registró un detalle del paisaje."}
showDialog(kicker,o.name,text,[{label:"Anotar en el cuaderno",effect:"close"}]);updateUI();save()}
function journalDialog(){const q=currentQuest();const lines=[];lines.push("Día "+state.day+" · "+formatTime()+" · "+weatherTypes[state.weather].label);lines.push("");lines.push("MISIONES");D.quests.forEach((m,i)=>lines.push((state.completed.includes(m.id)?"✓ ":"○ ")+m.title));lines.push("");lines.push("OBJETIVOS ACTUALES");if(q)q.objectives.forEach(o=>lines.push((done(o.id)?"✓ ":"○ ")+o.text));lines.push("");lines.push("OBJETOS");lines.push(state.inventory.length?state.inventory.join(", "):"Todavía no hay objetos.");lines.push("");lines.push("REGLA DE MEMORIA: lo documentado se distingue de los recuerdos y de la ficción del juego.");showDialog("CUADERNO DE LUNA","Lo que voy descubriendo",lines.join("\n"),[{label:"Volver al mundo",effect:"close"}])}
function mapDialog(){showDialog("MAPA DE EXPLORACIÓN","Villa Pelón, un mundo conectado","El mapa jugable se organiza en zonas conectadas: casa y pueblo; canal y ribera; chacras y parcelas; bardas al norte; Picada 21 como corredor de tránsito. Es un diseño original inspirado en la estructura territorial de la localidad real, no una reproducción de un plano protegido.",[{label:"Volver al mundo",effect:"close"}])}
function formatTime(){const h=Math.floor(state.clock)%24,m=Math.floor((state.clock%1)*60);return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")}
function updateWeatherUI(){$("weatherIcon").textContent=weatherTypes[state.weather].icon;$("weatherLabel").textContent=weatherTypes[state.weather].label;$("weatherShort").textContent=weatherTypes[state.weather].label;$("weatherFX").textContent=weatherTypes[state.weather].fx}
function timeLabel(){const h=state.clock;return h>=6&&h<12?"Mañana":h>=12&&h<18?"Tarde":h>=18&&h<21?"Atardecer":"Noche"}
function updateUI(){const q=currentQuest();if(q){$("chapterTag").textContent=q.chapter;$("questTitle").textContent=q.title;$("questText").textContent=q.description;const completed=q.objectives.filter(o=>done(o.id)).length;$("questProgressText").textContent=completed+" / "+q.objectives.length+" descubrimientos";$("questPercent").textContent=Math.round(completed/q.objectives.length*100)+"%";$("questMeter").style.width=(completed/q.objectives.length*100)+"%";$("objectives").innerHTML="";q.objectives.forEach(o=>{const li=document.createElement("li");li.textContent=o.text;li.className=done(o.id)?"done":"";$("objectives").appendChild(li)})}else{$("questTitle").textContent="Más historias por descubrir";$("questText").textContent="La aventura continúa."}
$("clockLabel").textContent=formatTime();$("timeOfDay").textContent=timeLabel();$("energyValue").textContent=Math.round(state.energy)+"%";$("inventoryValue").textContent=state.inventory.length+" objetos";$("inventoryText").textContent=state.inventory.length?"Luna guarda con cuidado todo lo que encuentra.":"Todavía está vacía. Explorá con curiosidad: cada objeto puede ayudar a entender una historia.";$("inventoryChips").innerHTML="";state.inventory.forEach(i=>{const s=document.createElement("span");s.textContent="✦ "+i;$("inventoryChips").appendChild(s)});const near=nearestThing();$("nearbyText").textContent=near?"Cerca: "+near.name+". ¡Podés interactuar!":"Caminá para encontrar personas, lugares y pistas.";$("areaLabel").textContent=areaName(state.player.x,state.player.y)}
function areaName(x,y){if(x<400&&y<160)return"BARDAS Y SENDEROS";if(x<420)return"RIBERA DEL RÍO";if(y>800)return"PICADA 21";if(x>600&&y>200)return"CHACRAS Y PARCELAS";if(x>380&&x<850)return"PUEBLO";return"CASA DE LOS ABUELOS"}
function nearestThing(){let n=null,d=68;[...D.npc.map(o=>({...o,...npcPosition(o)})),...D.objects].forEach(o=>{const z=Math.hypot(o.x-state.player.x,o.y-state.player.y);if(z<d){n=o;d=z}});return n}
function isBlocked(x,y){if(x<14||y<18||x>D.map.width-14||y>D.map.height-18)return true;for(const o of [{x:255,y:285,w:68,h:58},{x:450,y:335,w:64,h:62},{x:645,y:310,w:64,h:60},{x:740,y:450,w:64,h:60},{x:470,y:520,w:64,h:60},{x:685,y:550,w:64,h:60},{x:790,y:335,w:64,h:60}]){if(x>o.x&&x<o.x+o.w&&y>o.y&&y<o.y+o.h)return true}return false}
function move(dx,dy){if(state.dialogOpen)return;const p=state.player;const nx=p.x+dx,ny=p.y+dy;if(!isBlocked(nx,p.y))p.x=nx;if(!isBlocked(p.x,ny))p.y=ny;if(dx||dy){p.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");p.frame++;state.walkTimer++;if(state.walkTimer%10===0)state.energy=Math.max(0,state.energy-.15);updateUI();if(state.walkTimer%4===0)save()}}
function npcPosition(n){const hour=state.clock;const s=n.schedule.find(z=>hour>=z.from&&hour<z.to);return s||n}
function drawWorld(){
const p=state.player,W=canvas.width,H=canvas.height;state.cam.x=Math.max(0,Math.min(D.map.width-W,p.x-W/2));state.cam.y=Math.max(0,Math.min(D.map.height-H,p.y-H/2));const ox=state.cam.x,oy=state.cam.y;
ctx.fillStyle="#a5cb8b";ctx.fillRect(0,0,W,H);
for(let y=0;y<D.map.height;y+=32)for(let x=0;x<D.map.width;x+=32){const a=(x*13+y*7)%11;if(a<2){ctx.fillStyle=a?"#98c17f":"#b3d191";ctx.fillRect(x-ox+5,y-oy+7,4,3)}}
 // northern dry rocky ridges
ctx.fillStyle="#b9a27c";ctx.fillRect(-ox,-oy,D.map.width,154);for(let i=0;i<85;i++){const x=(i*71)%D.map.width,y=(i*37)%135;ctx.fillStyle=i%3?"#a28d6c":"#d3bc90";ctx.fillRect(x-ox,y-oy,14+(i%3)*7,5+(i%4)*3)} 
 // river along west, curved segments
ctx.fillStyle="#d8c39a";ctx.fillRect(-ox,0,420,1120);ctx.fillStyle="#4a9fb8";ctx.beginPath();ctx.moveTo(0-ox,0-oy);ctx.lineTo(230-ox,0-oy);ctx.lineTo(280-ox,180-oy);ctx.lineTo(245-ox,380-oy);ctx.lineTo(300-ox,590-oy);ctx.lineTo(250-ox,790-oy);ctx.lineTo(300-ox,1120-oy);ctx.lineTo(0-ox,1120-oy);ctx.closePath();ctx.fill();ctx.strokeStyle="#8dd0d5";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(180-ox,0-oy);ctx.lineTo(225-ox,180-oy);ctx.lineTo(190-ox,380-oy);ctx.lineTo(235-ox,590-oy);ctx.lineTo(195-ox,790-oy);ctx.lineTo(235-ox,1120-oy);ctx.stroke();
 // canal and branches
ctx.strokeStyle="#b89f70";ctx.lineWidth=25;ctx.beginPath();ctx.moveTo(270-ox,100-oy);ctx.lineTo(420-ox,190-oy);ctx.lineTo(550-ox,190-oy);ctx.lineTo(550-ox,610-oy);ctx.stroke();ctx.strokeStyle="#338da8";ctx.lineWidth=13;ctx.stroke();ctx.strokeStyle="#82cbd0";ctx.lineWidth=2;ctx.stroke();
ctx.strokeStyle="#b9a071";ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(550-ox,360-oy);ctx.lineTo(780-ox,360-oy);ctx.lineTo(1000-ox,470-oy);ctx.stroke();ctx.strokeStyle="#3a91ab";ctx.lineWidth=7;ctx.stroke();
 // Picada 21 long route
ctx.strokeStyle="#ad966d";ctx.lineWidth=58;ctx.beginPath();ctx.moveTo(-ox,845-oy);ctx.lineTo(1600-ox,845-oy);ctx.stroke();ctx.strokeStyle="#d4bd8e";ctx.lineWidth=44;ctx.stroke();ctx.strokeStyle="#8e805f";ctx.lineWidth=2;ctx.setLineDash([18,12]);ctx.beginPath();ctx.moveTo(-ox,845-oy);ctx.lineTo(1600-ox,845-oy);ctx.stroke();ctx.setLineDash([]);
 // rural fields and rows
for(let j=0;j<6;j++){for(let i=0;i<5;i++){const x=640+i*175,y=220+j*115;if(x>1570||y>790)continue;ctx.fillStyle=(i+j)%2?"#9cc780":"#a8ce89";ctx.fillRect(x-ox,y-oy,145,80);ctx.strokeStyle="#759c63";ctx.lineWidth=2;for(let r=0;r<5;r++){ctx.beginPath();ctx.moveTo(x+8-ox,y+12+r*13-oy);ctx.lineTo(x+135-ox,y+12+r*13-oy);ctx.stroke()}for(let t=0;t<6;t++){const tx=x+18+t*20,ty=y+12+(t%4)*13;drawTree(tx-ox,ty-oy,(i+t)%2)}}}
 // town grid and buildings
for(let y=320;y<640;y+=80){ctx.fillStyle="#c6aa7a";ctx.fillRect(400-ox,y-oy,480,20)}for(let x=420;x<850;x+=90){ctx.fillStyle="#c6aa7a";ctx.fillRect(x-ox,300-oy,18,360)}
const buildings=[{x:455,y:335,c:"#d9a276"},{x:650,y:310,c:"#e9d4a2"},{x:745,y:450,c:"#d5a1a0"},{x:475,y:520,c:"#c3d8bb"},{x:690,y:550,c:"#d9bd82"},{x:795,y:335,c:"#c9b6d8"},{x:850,y:595,c:"#e8d7b7"}];buildings.forEach(b=>drawHouse(b.x-ox,b.y-oy,b.c));
 // home
drawHouse(260-ox,285-oy,"#d6ad82");drawTree(225-ox,280-oy,1);drawTree(470-ox,275-oy,0);
 // water gate marker
ctx.fillStyle="#7a5636";ctx.fillRect(400-ox,170-oy,24,26);ctx.fillStyle="#e5c783";ctx.fillRect(405-ox,176-oy,14,4);ctx.fillRect(405-ox,185-oy,14,4);
 // orchard label & route label
ctx.fillStyle="#234333";ctx.font="bold 14px monospace";ctx.fillText("CHACRAS",1060-ox,200-oy);ctx.fillText("PUEBLO",575-ox,290-oy);ctx.fillText("PICADA 21",690-ox,820-oy);ctx.fillText("RIBERA",95-ox,610-oy);ctx.fillText("BARDAS",650-ox,60-oy);
 // object markers
D.objects.forEach(o=>{if(Math.abs(o.x-p.x)>W&&Math.abs(o.y-p.y)>H)return;const x=o.x-ox,y=o.y-oy;ctx.fillStyle="#fff5d9";ctx.strokeStyle="#31503a";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="#31503a";ctx.font="bold 12px monospace";ctx.fillText(o.type==="water"?"~":o.type==="orchard"?"✦":o.type==="sign"?"!":"?",x-4,y+4)});
 // NPCs according to schedule
D.npc.forEach(n=>{const pos=npcPosition(n),x=pos.x-ox,y=pos.y-oy;drawPerson(x,y,n.color||"#b86c57",n.id);if(Math.hypot(pos.x-p.x,pos.y-p.y)<100){ctx.fillStyle="#fff8e6";ctx.fillRect(x-34,y-35,68,18);ctx.strokeStyle="#34513b";ctx.strokeRect(x-34,y-35,68,18);ctx.fillStyle="#263d31";ctx.font="bold 10px system-ui";ctx.fillText(n.name.split(",")[0],x-29,y-23)}});
 // Luna
drawPerson(p.x-ox,p.y-oy,"#477f9c","luna");
 // day/night tint
let tint=null;if(state.clock>=20||state.clock<5.5)tint="rgba(20,34,67,.52)";else if(state.clock>=18.5)tint="rgba(222,125,75,.20)";else if(state.clock<7)tint="rgba(248,205,129,.13)";if(tint){ctx.fillStyle=tint;ctx.fillRect(0,0,W,H)}
if(weatherTypes[state.weather].tint){ctx.fillStyle=weatherTypes[state.weather].tint;ctx.fillRect(0,0,W,H)}
if(state.weather==="rain"){ctx.strokeStyle="#d8eef4aa";ctx.lineWidth=1;for(let i=0;i<70;i++){const x=(i*47+state.walkTimer*2)%W,y=(i*71+state.walkTimer*5)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+10);ctx.stroke()}}
}
function drawTree(x,y,variant){ctx.fillStyle="#77543a";ctx.fillRect(x-3,y+2,7,15);ctx.fillStyle=variant?"#3e7a4d":"#578c4b";ctx.fillRect(x-11,y-10,22,15);ctx.fillRect(x-7,y-16,14,9);ctx.fillStyle="#a4c56d";ctx.fillRect(x-4,y-11,5,4)}
function drawHouse(x,y,c){ctx.fillStyle="#8c6547";ctx.fillRect(x,y+16,58,39);ctx.fillStyle=c;ctx.fillRect(x+4,y+20,50,31);ctx.fillStyle="#985c4a";ctx.beginPath();ctx.moveTo(x-5,y+21);ctx.lineTo(x+29,y);ctx.lineTo(x+64,y+21);ctx.closePath();ctx.fill();ctx.fillStyle="#654a37";ctx.fillRect(x+25,y+34,12,21);ctx.fillStyle="#8dc4c9";ctx.fillRect(x+9,y+27,10,10);ctx.fillRect(x+40,y+27,9,10)}
function drawPerson(x,y,c,id){ctx.fillStyle="#617c51";ctx.fillRect(x-7,y+10,15,5);ctx.fillStyle=c;ctx.fillRect(x-6,y-1,12,14);ctx.fillStyle="#edc29a";ctx.fillRect(x-5,y-11,10,10);ctx.fillStyle=id==="luna"?"#4b3527":"#68472e";ctx.fillRect(x-6,y-13,12,4);if(id==="luna"){ctx.fillStyle="#edb8c5";ctx.fillRect(x-7,y+2,4,9);ctx.fillStyle="#f7d68d";ctx.fillRect(x+3,y+2,4,9)}ctx.fillStyle="#614a38";ctx.fillRect(x-5,y+12,4,5);ctx.fillRect(x+2,y+12,4,5)}
function loop(){if(!state.dialogOpen){let dx=0,dy=0;if(keys.has("ArrowLeft")||keys.has("a"))dx=-2.7;if(keys.has("ArrowRight")||keys.has("d"))dx=2.7;if(keys.has("ArrowUp")||keys.has("w"))dy=-2.7;if(keys.has("ArrowDown")||keys.has("s"))dy=2.7;if(dx&&dy){dx*=.707;dy*=.707}if(dx||dy)move(dx,dy)}state.clock+=.003;if(state.clock>=24){state.clock=0;state.day++;state.energy=Math.min(100,state.energy+20);randWeather();save()}state.weatherTicks--;if(state.weatherTicks<=0)randWeather();$("clockLabel").textContent=formatTime();$("timeOfDay").textContent=timeLabel();drawWorld();requestAnimationFrame(loop)}
window.addEventListener("keydown",e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();if(k==="e"||e.key===" "){if(!state.dialogOpen)interact();else closeDialog()}else if(k==="j"){journalDialog()}else if(k==="m"){mapDialog()}else keys.add(k)});
window.addEventListener("keyup",e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener("blur",()=>keys.clear());
document.querySelectorAll("[data-move]").forEach(b=>{const dir=b.dataset.move;let interval;const press=e=>{e.preventDefault();const k={up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"}[dir];keys.add(k)};const release=()=>{["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].forEach(k=>keys.delete(k))};b.addEventListener("pointerdown",press);["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,release))});
canvas.addEventListener("pointerdown",e=>{if(state.dialogOpen)return;const rect=canvas.getBoundingClientRect(),tx=(e.clientX-rect.left)/rect.width*canvas.width+state.cam.x,ty=(e.clientY-rect.top)/rect.height*canvas.height+state.cam.y;const dx=tx-state.player.x,dy=ty-state.player.y;if(Math.hypot(dx,dy)<85){interact();return}const len=Math.hypot(dx,dy)||1;move(dx/len*32,dy/len*32)});
$("interactBtn").onclick=interact;$("journalBtn").onclick=journalDialog;$("mapBtn").onclick=mapDialog;$("closeDialog").onclick=closeDialog;$("dialogShade").addEventListener("click",e=>{if(e.target===$("dialogShade"))closeDialog()});
window.addEventListener("beforeunload",save);
load();if(!state.weather)randWeather();updateWeatherUI();updateUI();save();requestAnimationFrame(loop);
})();