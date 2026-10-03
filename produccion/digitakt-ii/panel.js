/* ============================================================
   Panel del Digitakt II, dibujado con la misma disposición que
   el aparato real (foto de referencia de NAYA). Lo usan la guía
   y las clases. DT2Panel.render(el) / DT2Panel.marcar(lista).
   ============================================================ */
(function(){
  var CSS = `
  .dt2{ container-type:inline-size; }
  .dt2-p{
    --k:#2a2826; --kl:#3a3633; --kt:#e4ded5; --sec:#d0913c;
    font-size: clamp(5.4px, 1.62cqw, 11px);
    background:#1b1a19; border:1px solid #33302d; border-radius:1.4em; padding:1.6em;
    display:grid; gap:1.1em .9em;
    grid-template-columns: 1.15fr repeat(8, 1fr);
    font-family:"IBM Plex Mono", ui-monospace, monospace;
  }
  .dt2-p button{ font:inherit; }
  .dt2-k{
    position:relative; color:var(--kt); background:var(--k); border:1px solid var(--kl); border-radius:.5em;
    min-height:4.2em; padding:.35em .2em; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.15em;
    font-size:1em; font-weight:600; letter-spacing:.04em; text-transform:uppercase; line-height:1.1; text-align:center;
    transition:border-color .12s, background .12s, box-shadow .12s;
  }
  .dt2-k .g{ font-size:1.5em; line-height:1; font-weight:500; }
  .dt2-k .s{ position:absolute; left:0; right:0; top:100%; margin-top:.15em; font-size:.82em; font-weight:500; color:var(--sec); text-transform:none; letter-spacing:0; white-space:nowrap; pointer-events:none; }
  .dt2-k:hover{ border-color:#8a6c2f; }
  .dt2-k.sel{ border-color:#e8b04a; background:#2c2416; color:#e8b04a; }
  .dt2-k.knob{ border-radius:50%; aspect-ratio:1; min-height:0; width:78%; justify-self:center; align-self:center; background:#121110; border-color:#2d2a27; }
  .dt2-k.big{ width:88%; }
  .dt2-k.func{ background:#d9a03a; color:#1a1408; border-color:#d9a03a; }
  .dt2-k.trig{ min-height:5.2em; font-size:1.25em; }
  .dt2-scr{ grid-column:2/6; grid-row:1/3; background:#0d100e; border:1px solid #2b302c; border-radius:.5em; color:#8fae96; display:flex; align-items:center; justify-content:center; text-align:center; letter-spacing:.12em; cursor:pointer; padding:.5em; font-size:1.05em; }
  .dt2-par{ grid-column:6/10; grid-row:3; display:grid; grid-template-columns:repeat(6,1fr); gap:.5em; align-self:start; }
  .dt2-par .dt2-k{ min-height:3.6em; font-size:.92em; }
  .dt2-leds{ grid-column:9; grid-row:4; display:grid; grid-template-columns:repeat(4,1fr); gap:.35em; align-content:center; padding:0 .6em; }
  .dt2-leds i{ aspect-ratio:1; border-radius:50%; background:#5a3a14; }
  .dt2-leds i:first-child{ background:#f29b2b; box-shadow:0 0 .5em #f29b2b; }
  .dt2-lab{ font-size:.85em; color:#cfc8bd; text-align:center; text-transform:uppercase; letter-spacing:.08em; margin-top:-.4em; }
  /* marcado de pasos */
  .dt2-k.on{ border-color:#e8b04a; color:#e8b04a; background:#33270f; box-shadow:0 0 0 .25em rgba(232,176,74,.35), 0 0 1.6em rgba(232,176,74,.55); animation:dt2pulse 1.3s ease-in-out infinite; }
  .dt2-k.func.on{ background:#f0bb55; color:#1a1408; }
  .dt2-k.knob.on{ background:#33270f; }
  @keyframes dt2pulse{ 50%{ box-shadow:0 0 0 .5em rgba(232,176,74,.12), 0 0 2.2em rgba(232,176,74,.7); } }
  @media (prefers-reduced-motion: reduce){ .dt2-k.on{ animation:none; } }
  .dt2-b{ position:absolute; top:-.9em; right:-.7em; z-index:2; background:#e8b04a; color:#1a1408; border-radius:1em; padding:.1em .45em; font-size:.95em; font-weight:700; letter-spacing:0; text-transform:none; white-space:nowrap; line-height:1.3; }
  .dt2-b.h{ background:#e0653a; color:#fff; }
  `;

  // id, etiqueta, glifo, secundaria (naranja), columna, fila, clases
  var LAYOUT = [
    ["vol","Main vol","","",1,1,"knob big"],
    ["level","Level/Data","","Preset Pool",1,2,"knob big"],
    ["func","Func","","",1,3,"func"],
    ["kb","","♪","KB Setup",1,4,""],
    ["trk","Trk","","Mute Mode",1,5,""],
    ["ptn","Ptn","","Bank",1,6,""],
    ["song","Song","","Song Edit",1,7,""],
    ["preset","","☰","Perform",2,3,""],
    ["settings","","⚙","Save Proj",3,3,""],
    ["sampling","","▥","Samples",4,3,""],
    ["tempo","","◭","Tap Tempo",5,3,""],
    ["rec","","○","Copy",2,4,""],
    ["play","","▷","Clear",3,4,""],
    ["stop","","□","Paste",4,4,""],
    ["yes","Yes","","Save",5,4,""],
    ["no","No","","Reload",5,5,""],
    ["up","","∧","Trig Mode",7,4,""],
    ["left","","<","µTime−",6,5,""],
    ["down","","∨","Trig Mode",7,5,""],
    ["right","",">","µTime+",8,5,""],
    ["page","Page","","Fill/Setup",9,5,""]
  ];
  var PARAMS = [["trigp","Trig","Quantize"],["src","Src","Machine"],["fltr","Fltr","Setup"],["amp","Amp","Sequencer"],["fx","Fx","Send FX"],["mod","Mod","Mixer"]];

  var NOMBRES = {
    vol:"MAIN VOLUME", level:"LEVEL/DATA", func:"FUNC", kb:"KEYBOARD (♪)", trk:"TRK", ptn:"PTN", song:"SONG",
    preset:"PRESET/KIT (☰)", settings:"SETTINGS (⚙)", sampling:"SAMPLING (▥)", tempo:"TEMPO (◭)",
    rec:"REC (○)", play:"PLAY (▷)", stop:"STOP (□)", yes:"YES", no:"NO",
    up:"▲", down:"▼", left:"◀", right:"▶", page:"PAGE",
    trigp:"TRIG", src:"SRC", fltr:"FLTR", amp:"AMP", fx:"FX", mod:"MOD", screen:"la pantalla"
  };
  "ABCDEFGH".split("").forEach(function(l){ NOMBRES["knob"+l] = "perilla "+l; });
  for(var i=1;i<=16;i++) NOMBRES["t"+i] = "tecla "+i;

  var INFO = {
    vol:["Main volume","Volumen general de la salida y de los auriculares.",null],
    level:["Level / Data","Volumen de la pista activa. En menús, recorre listas rápido. Manteniendo un paso, elige un preset lock.","Girar con FUNC: abre los presets (Preset Pool)."],
    func:["Func","La tecla amarilla. Se mantiene apretada y se toca otra tecla para usar su segunda función (lo escrito en naranja abajo de cada tecla).","FUNC + paso en grabación: lock trig. FUNC + teclas 1–16: mute rápido."],
    kb:["Keyboard (♪)","Las 16 teclas pasan a ser un teclado para la pista activa. Con ▲▼ cambiás de octava (KB Octave).","KB SETUP: escala, tónica y KB FOLD."],
    trk:["Trk","Mantené TRK y tocá 1–16 para elegir la pista activa. Mantené TRK y girá una perilla: Control All (todas las pistas a la vez).","MUTE MODE: modo mute global. Doble toque: mute del patrón."],
    ptn:["Ptn","Tocá PTN y después una tecla 1–16 para elegir patrón. Con ◀▶ cambiás de banco (A–H).","BANK: elegir banco con las teclas 9–16."],
    song:["Song","SONG + tecla 1–16 elige canción y entra a song mode.","SONG EDIT: editar las filas de la canción."],
    preset:["Preset / Kit (☰)","Menú para cargar, guardar y administrar presets (sonidos) y kits.","PERFORM: cambiás de patrón sin que se recargue el kit."],
    settings:["Settings (⚙)","Proyectos, canción, patrón, MIDI, audio, USB y sistema.","SAVE PROJ: guarda el proyecto. Usalo seguido."],
    sampling:["Sampling (▥)","El sampler: de dónde grabar, umbral, largo, armar.","SAMPLES: el explorador del +Drive y de la RAM del proyecto."],
    tempo:["Tempo (◭)","Abre el menú de tempo: perilla A = BPM, D = swing. TEMPO + YES: metrónomo.","TAP TEMPO: mantené FUNC y tocá TEMPO al ritmo."],
    rec:["Record (○)","Grabación en grilla (se prende roja). REC + PLAY: grabación en vivo. REC + STOP: paso a paso.","COPY: copiar (patrón, pista, paso… según dónde estés)."],
    play:["Play (▷)","Arranca. Otra vez: pausa.","CLEAR: borrar."],
    stop:["Stop (□)","Frena. Dos veces seguido: corta también las colas de los efectos.","PASTE: pegar."],
    yes:["Yes","Entrar, elegir, confirmar.","SAVE: guardado temporal del patrón (un punto de retorno)."],
    no:["No","Salir, volver atrás, cancelar. Si te perdiste en un menú, tocalo hasta volver a la pantalla principal.","RELOAD: vuelve al último guardado temporal del patrón."],
    up:["Flecha arriba","Navegar menús. En modo teclado: subir octava (KB Octave).","TRIG MODE: cambia qué hacen las teclas 1–16 (pistas, velocities, retrigs, slices, pool)."],
    down:["Flecha abajo","Navegar menús. En modo teclado: bajar octava.","TRIG MODE (igual que arriba)."],
    left:["Flecha izquierda","Navegar. Con el patrón sonando, mantenida empuja el tempo para abajo. Paso + ◀: micro timing.","FUNC + ◀ en grabación: corre la pista un paso atrás."],
    right:["Flecha derecha","Navegar. Con el patrón sonando, mantenida empuja el tempo para arriba. Paso + ▶: micro timing.","FUNC + ▶ en grabación: corre la pista un paso adelante."],
    page:["Page","Cambia la página del patrón (hasta 8 de 16 pasos). Mantenida con el patrón sonando: FILL.","SETUP: largo y velocidad del patrón o de cada pista."],
    trigp:["Trig","Página de nota, velocity, largo, probabilidad y condiciones. Dos veces: retrigs.","QUANTIZE: cuantizar lo grabado en vivo."],
    src:["Src","La máquina de fuente: afinación (TUNE, perilla A), modo, sample, inicio, largo, loop.","MACHINE: cambiar la máquina de la pista."],
    fltr:["Fltr","El filtro y su envolvente. FREQ (el corte) está en la perilla E.","SETUP: kit (compresor, control all, swap), legato, portamento."],
    amp:["Amp","Envolvente de volumen, paneo y volumen de la pista.","SEQUENCER: secuenciador euclídeo."],
    fx:["Fx","Bit reduction, overdrive, sample rate y envíos a delay, reverb, chorus.","SEND FX: delay, reverb y chorus del patrón."],
    mod:["Mod","Los tres LFO de la pista.","MIXER: compresor master con sidechain y niveles."],
    screen:["Pantalla","Abajo se ven 8 parámetros en dos filas de 4. Cada uno se mueve con la perilla que está en el mismo lugar: fila de arriba A B C D, fila de abajo E F G H. Lo que hace cada perilla depende de qué página o menú tengas abierto.",null],
    knob:["Perillas A–H","Mueven los 8 parámetros que muestra la pantalla, en el mismo orden. Por eso la A a veces es TUNE, a veces NOTE y a veces BPM: depende de lo que tengas abierto. Apretar y girar = saltos grandes.","Con un paso apretado: parameter lock en ese paso."],
    trig:["Teclas 1–16","Disparar pistas, poner y sacar pasos (con REC prendido), elegir pista (con TRK), patrón (con PTN) y canción (con SONG). Rojo = paso con nota; amarillo = lock trig.","FUNC + tecla: mute rápido de esa pista."]
  };

  var root = null;
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function boton(id, lab, gl, sec, cls){
    var b = el("button","dt2-k "+(cls||""));
    b.type="button"; b.dataset.k=id; b.setAttribute("aria-label", NOMBRES[id]||lab);
    b.innerHTML = (gl?'<span class="g">'+gl+'</span>':'') + (lab?'<span>'+lab+'</span>':'') + (sec?'<span class="s">'+sec+'</span>':'');
    return b;
  }
  function pos(b,c,r,span){ b.style.gridColumn = c + (span?" / span "+span:""); b.style.gridRow = r; return b; }

  function render(cont){
    if(!document.getElementById("dt2-css")){ var st=el("style"); st.id="dt2-css"; st.textContent=CSS; document.head.appendChild(st); }
    cont.classList.add("dt2");
    var p = el("div","dt2-p"); p.setAttribute("role","group"); p.setAttribute("aria-label","Panel del Digitakt II");
    LAYOUT.forEach(function(d){ p.appendChild(pos(boton(d[0],d[1],d[2],d[3],d[6]), d[4], d[5])); });
    var s = el("div","dt2-scr","PANTALLA"); s.dataset.k="screen"; s.tabIndex=0; s.setAttribute("role","button"); p.appendChild(s);
    "ABCDEFGH".split("").forEach(function(l,i){
      p.appendChild(pos(boton("knob"+l,l,"","","knob"), 6+(i%4), 1+(i>3?1:0)));
    });
    var par = el("div","dt2-par");
    PARAMS.forEach(function(d){ par.appendChild(boton(d[0],d[1],"",d[2],"")); });
    p.appendChild(par);
    var leds = el("div","dt2-leds"); for(var i=0;i<8;i++) leds.appendChild(el("i")); p.appendChild(leds);
    for(var n=1;n<=16;n++){
      var b = boton("t"+n, String(n), "", "", "trig");
      p.appendChild(pos(b, 2+((n-1)%8), n<=8?6:7));
    }
    cont.innerHTML=""; cont.appendChild(p);
    root = p;
    return p;
  }

  // lista: [ "settings", ["func","h"], ... ]  "h" = mantener
  function marcar(lista){
    if(!root) return;
    root.querySelectorAll(".dt2-k.on").forEach(function(b){ b.classList.remove("on"); });
    root.querySelectorAll(".dt2-b").forEach(function(b){ b.remove(); });
    if(!lista || !lista.length) return;
    var n = 0, varios = lista.length > 1;
    lista.forEach(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      var b = root.querySelector('[data-k="'+id+'"]'); if(!b) return;
      n++;
      b.classList.add("on");
      if(varios || h){
        var badge = el("span","dt2-b"+(h?" h":""), (varios? n : "") + (h? (varios?" · ":"")+"mantené" : ""));
        if(!b.querySelector(".dt2-b")) b.appendChild(badge);
      }
    });
  }

  function texto(lista){
    return lista.map(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      return (h ? "mantené " : (/^knob/.test(id) ? "girá " : "tocá ")) + (NOMBRES[id]||id);
    }).join(" → ");
  }

  function info(id){
    if(/^knob/.test(id)) return INFO.knob;
    if(/^t\d+$/.test(id)) return INFO.trig;
    return INFO[id];
  }

  window.DT2Panel = { render:render, marcar:marcar, texto:texto, info:info, nombres:NOMBRES };
})();
