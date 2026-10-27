/* Datos del mundo: separar contenido narrativo de la lógica del motor. */
window.VP_DATA = {
  game:{title:"Luna en Villa Pelón",subtitle:"Los secretos del agua",version:"0.2.0"},
  map:{width:1600,height:1120,tile:32,orientation:"Esquema jugable original; distribución inspirada en la relación río-valle, trama urbana, rutas, chacras y bardas; no es un plano catastral."},
  zones:[
    {id:"home",name:"Casa de los abuelos",kind:"vivienda",x:230,y:270,w:250,h:190},
    {id:"town",name:"Pueblo",kind:"urbano",x:430,y:300,w:410,h:330},
    {id:"river",name:"Ribera del río",kind:"agua",x:0,y:0,w:420,h:1120},
    {id:"irrigation",name:"Canales y compuertas",kind:"riego",x:370,y:80,w:230,h:950},
    {id:"orchards",name:"Chacras",kind:"rural",x:610,y:90,w:990,h:830},
    {id:"bardas",name:"Bardas",kind:"relieve",x:0,y:0,w:1600,h:150},
    {id:"picada21",name:"Picada 21",kind:"camino",x:0,y:810,w:1600,h:72}
  ],
  npc:[
    {id:"abuelo",name:"Abuelo Mateo",x:310,y:350,color:"#bd815b",schedule:[{from:6,to:11,x:310,y:350,place:"Casa"},{from:11,to:16,x:520,y:490,place:"Pueblo"},{from:16,to:21,x:310,y:350,place:"Casa"},{from:21,to:24,x:310,y:350,place:"Casa"},{from:0,to:6,x:310,y:350,place:"Casa"}],role:"abuelo"},
    {id:"rosa",name:"Rosa, vecina y regante",x:530,y:410,color:"#b85d63",schedule:[{from:6,to:12,x:530,y:410,place:"Pueblo"},{from:12,to:18,x:730,y:300,place:"Chacra"},{from:18,to:22,x:530,y:410,place:"Pueblo"},{from:22,to:24,x:530,y:410,place:"Pueblo"},{from:0,to:6,x:530,y:410,place:"Pueblo"}],role:"irrigator"},
    {id:"tomas",name:"Tomás, trabajador de chacra",x:900,y:430,color:"#527f9a",schedule:[{from:5,to:12,x:900,y:430,place:"Chacra"},{from:12,to:17,x:1020,y:470,place:"Chacra"},{from:17,to:20,x:900,y:430,place:"Chacra"},{from:20,to:24,x:930,y:440,place:"Casa"},{from:0,to:5,x:930,y:440,place:"Casa"}],role:"farmer"}
  ],
  objects:[
    {id:"notebook",name:"Cuaderno viejo",x:330,y:390,type:"object",item:"cuaderno",once:true},
    {id:"gate",name:"Compuerta de riego",x:420,y:180,type:"water",item:"pista_compuerta",once:true},
    {id:"watermark",name:"Marca de nivel del agua",x:250,y:520,type:"water",item:"pista_rio",once:true},
    {id:"orchard",name:"Primera hilera de frutales",x:1050,y:430,type:"orchard",item:"pista_chacra",once:true},
    {id:"picada",name:"Cartel de la Picada 21",x:680,y:850,type:"sign",item:"pista_picada",once:true}
  ],
  quests:[
    {id:"water-trail",title:"Un rastro que seguir",chapter:"CAPÍTULO 1 · EL AGUA",description:"Luna llegó a casa de sus abuelos para pasar las vacaciones. Una pregunta le quedó dando vueltas: ¿cómo llegó el agua hasta las chacras?",objectives:[
      {id:"ask-mateo",text:"Preguntarle al abuelo qué recuerda del agua",target:"abuelo"},
      {id:"talk-rosa",text:"Conversar con Rosa sobre canales y compuertas",target:"rosa"},
      {id:"inspect-gate",text:"Investigar una compuerta de riego",target:"gate"},
      {id:"visit-orchard",text:"Llegar a la chacra y observar los cultivos",target:"orchard"}
    ],reward:{xp:30,item:"cuaderno de campo"},unlock:"memory"},
    {id:"life-in-valley",title:"Un día en el valle",chapter:"CAPÍTULO 2 · VIDA COTIDIANA",description:"Con el agua en movimiento, Luna empieza a descubrir las personas, los trabajos y los caminos que conectan Villa Pelón.",objectives:[
      {id:"meet-tomas",text:"Hablar con Tomás sobre el trabajo de chacra",target:"tomas"},
      {id:"find-picada",text:"Encontrar el cartel de la Picada 21",target:"picada"},
      {id:"find-river",text:"Visitar la ribera y registrar una observación",target:"watermark"}
    ],reward:{xp:45,item:"postal del valle"},unlock:"history"}
  ],
  dialogue:{
    abuelo:{title:"Abuelo Mateo",icon:"👴",kicker:"EN CASA",text:"¡Lunita! Qué lindo tenerte acá. ¿Sabés? A veces uno vive entre canales y chacras y se olvida de que todo eso tuvo que construirse. El agua tiene su propia historia.",choices:[{label:"¿Por dónde empezamos?",effect:"startQuest"},{label:"¿Puedo anotar lo que me cuentes?",effect:"notebook"}]},
    rosa:{title:"Rosa, vecina y regante",icon:"👩‍🌾",kicker:"HISTORIA DEL RIEGO",text:"El agua no aparece por arte de magia en la chacra. Hay que captarla, conducirla y organizar su distribución. Las compuertas y los canales forman parte de esa historia. ¿Qué querés investigar?",choices:[{label:"Buscar la compuerta",effect:"hintGate"},{label:"Anotar la pista",effect:"clueWater"}]},
    tomas:{title:"Tomás, trabajador de chacra",icon:"🧑‍🌾",kicker:"VIDA RURAL",text:"La chacra tiene su ritmo: revisar el agua, cuidar las plantas, mirar el tiempo y coordinar el trabajo. Cada estación trae tareas distintas. ¿Qué te gustaría observar?",choices:[{label:"Observar los frutales",effect:"visitOrchard"},{label:"Guardar esta historia",effect:"clueOrchard"}]}
  }
};