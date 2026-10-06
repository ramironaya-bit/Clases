/* ============================================================
   Panel del Arturia BeatStep Pro, dibujado con la misma
   disposición que el aparato (manual oficial v2.0, fig. 1.2).
   Lo usan la guía y las clases.
   BSPPanel.render(el) / BSPPanel.marcar(lista) / texto / info
   ============================================================ */
(function(){
  var CSS = `
  .bsp{ container-type:inline-size; }
  .bsp-p{
    --body:#e6e5e1; --btn:#d6d5d0; --btnl:#aeaca6; --txt:#2a2927; --soft:#77746e;
    --g:#1ea585; --y:#efbd2c; --v:#9c62b0; --scr:#151515;
    font-size: clamp(4px, 1.02cqw, 10px);
    background:var(--body); border:1px solid #c9c7c1; border-radius:1.3em; padding:1.6em;
    display:grid; grid-template-columns: 30fr 18fr 52fr; gap:1.4em; align-items:stretch;
    font-family:"IBM Plex Mono", ui-monospace, monospace; color:var(--txt);
  }
  .bsp-p button{ font:inherit; }
  .bsp-z{ display:flex; flex-direction:column; gap:1em; min-width:0; }
  .bsp-row{ display:flex; align-items:center; gap:.8em; }
  .bsp-k{
    position:relative; color:var(--txt); background:var(--btn); border:1px solid var(--btnl); border-bottom-width:.25em;
    border-radius:.45em; min-height:3.3em; padding:.3em .4em; cursor:pointer;
    display:flex; align-items:center; justify-content:center; text-align:center;
    font-size:1em; font-weight:600; letter-spacing:.04em; text-transform:uppercase; line-height:1.05;
    transition:border-color .12s, background .12s, box-shadow .12s;
  }
  .bsp-k:hover{ border-color:#8a6c2f; }
  .bsp-k.knob{ border-radius:50%; aspect-ratio:1; min-height:0; padding:0; background:#3b4048; border:.25em solid #2b2f35; }
  .bsp-k.knob:hover{ border-color:#8a6c2f; }
  .bsp-k.shift{ background:#151515; color:#f2f2f2; border-color:#000; }
  .bsp-k.round{ border-radius:50%; aspect-ratio:1; min-height:0; width:2.6em; padding:0; }
  .bsp-k.tr{ font-size:1.6em; min-height:2.2em; flex:1; }
  .bsp-led{ display:inline-flex; flex-direction:column; align-items:center; gap:.2em; font-size:.8em; color:var(--soft); }
  .bsp-led i{ width:1.6em; height:.75em; border-radius:.2em; background:#5b5a57; display:block; }
  .bsp-led i.w{ background:#fbfbf7; box-shadow:0 0 .5em #fff; }
  .bsp-led i.r{ background:#e2473b; box-shadow:0 0 .5em #e2473b; }
  .bsp-lab{ font-size:.82em; color:var(--soft); text-transform:uppercase; letter-spacing:.06em; text-align:center; white-space:nowrap; }
  .bsp-dark{ background:var(--scr); border-radius:.6em; padding:1em; display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:.8em; align-items:center; }
  .bsp-dark .bsp-lab{ color:#dcdcdc; }
  .bsp-scr{ font-family:"IBM Plex Mono", monospace; color:#ff3b2f; font-size:2.8em; font-weight:600; letter-spacing:.05em; text-align:center; cursor:pointer; text-shadow:0 0 .3em rgba(255,59,47,.6); line-height:1.2; }
  .bsp-cell{ display:flex; flex-direction:column; align-items:center; gap:.35em; min-width:0; }
  .bsp-cell .bsp-k.knob{ width:76%; }
  .bsp-tap{ width:70%; aspect-ratio:1; min-height:0; }
  .bsp-swg{ display:grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap:.5em; align-items:center; }
  .bsp-swg .ctc{ display:flex; flex-direction:column; align-items:center; gap:.25em; }
  .bsp-swg .ctc span{ font-size:.7em; color:var(--soft); text-align:center; line-height:1.1; }
  .bsp-strip{ cursor:pointer; background:#f4f3ef; border:1px solid var(--btnl); border-radius:.5em; padding:.5em; position:relative; }
  .bsp-strip .c{ display:grid; grid-template-columns:repeat(4,1fr); background:#fff; border-radius:.3em; min-height:3.6em; align-items:center; }
  .bsp-strip .c span{ text-align:center; color:#a6a39d; font-size:1.1em; border-right:1px solid #ddd; }
  .bsp-strip .c span:last-child{ border:0; }
  .bsp-strip .l{ display:flex; justify-content:space-between; font-size:.8em; color:var(--soft); text-transform:uppercase; margin-top:.3em; }
  .bsp-len{ display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:.6em .6em; align-items:center; background:#d9d8d3; border-radius:.6em; padding:.7em; }
  .bsp-len .leds{ grid-column:2/4; display:flex; justify-content:space-around; }
  .bsp-tr{ display:flex; gap:.7em; }
  /* zona central */
  .bsp-blk{ border-radius:.4em; padding:.9em; display:grid; grid-template-columns: 1.55fr 1fr; gap:.7em; align-items:center; }
  .bsp-blk.c0{ background:#cfcec9; } .bsp-blk.c1{ background:var(--g); } .bsp-blk.c2{ background:var(--y); } .bsp-blk.c3{ background:var(--v); }
  .bsp-blk .scr{ background:var(--scr); color:#f4f4f4; border-radius:.3em; font-size:2.2em; font-weight:600; text-align:center; padding:.15em 0; cursor:pointer; letter-spacing:.06em; }
  .bsp-blk .leds{ display:flex; flex-direction:column; gap:.3em; }
  .bsp-blk .leds .bsp-led{ flex-direction:row; gap:.5em; color:#1f1f1f; font-weight:600; }
  .bsp-blk.c0 .leds .bsp-led{ color:var(--soft); }
  .bsp-blk .ar{ display:grid; grid-template-columns:1fr 1fr; gap:.5em; }
  .bsp-blk .ar .bsp-k{ min-height:2.5em; }
  /* zona derecha */
  .bsp-enc{ background:#d4d3ce; border-radius:.6em; padding:1em .8em; display:grid; grid-template-columns:repeat(8,1fr); gap:1em .7em; }
  .bsp-enc .bsp-cell .bsp-k.knob{ width:80%; }
  .bsp-steps{ display:grid; grid-template-columns:repeat(16,1fr); gap:.45em; }
  .bsp-steps .bsp-k{ min-height:3.6em; font-size:.95em; padding:.2em 0; }
  .bsp-pads{ display:grid; grid-template-columns:repeat(8,1fr); gap:.4em 1em; }
  .bsp-pad{ display:flex; flex-direction:column; gap:.2em; min-width:0; }
  .bsp-pad .bsp-k{ aspect-ratio:1; min-height:0; background:#cbcac5; border-radius:.5em; border-bottom-width:1px; }
  .bsp-pad .pl{ display:flex; justify-content:space-between; font-size:.78em; line-height:1.15; gap:.2em; white-space:nowrap; overflow:hidden; }
  .bsp-pad .pl b{ color:var(--txt); font-weight:700; }
  .bsp-pad .pl span{ color:#97948e; overflow:hidden; text-overflow:ellipsis; }
  /* marcado de pasos */
  .bsp-k.on, .bsp-strip.on, .bsp-scr.on, .scr.on{ outline:.3em solid #e8b04a; outline-offset:.1em; box-shadow:0 0 1.6em .3em rgba(232,176,74,.9); animation:bsppulse 1.3s ease-in-out infinite; z-index:1; }
  .bsp-k.on:not(.knob):not(.shift){ background:#f6dfae; }
  @keyframes bsppulse{ 50%{ box-shadow:0 0 2.4em .6em rgba(232,176,74,.55); } }
  @media (prefers-reduced-motion: reduce){ .bsp-k.on, .bsp-strip.on{ animation:none; } }
  .bsp-b{ position:absolute; top:-1.1em; right:-.9em; z-index:3; background:#e8b04a; color:#1a1408; border-radius:1em; padding:.1em .5em; font-size:1em; font-weight:700; letter-spacing:0; text-transform:none; white-space:nowrap; line-height:1.3; pointer-events:none; }
  .bsp-b.h{ background:#e0653a; color:#fff; }
  @container (max-width: 560px){ .bsp-pad .pl span{ display:none; } }
  `;

  var PAD_NOTA = ["C","D","E","F","G","A","B","C","C#","D#","","F#","G#","A#","OCT−","OCT+"];
  var PAD_SEC  = ["Forward","Reverse","Alternate","Triplet","1/4","1/8","1/16","1/32","Chromatic","Major","Minor","Dorian","Mixolydian","Harm Minor","Blues","User"];

  var NOMBRES = {
    sync:"SYNC", tempo:"el display de tempo", rate:"RATE/FINE", tap:"TAP/METRO",
    swing:"SWING", ct1:"CURRENT TRACK (de swing)", rand:"RANDOMNESS", ct2:"CURRENT TRACK (de random)", prob:"PROBABILITY",
    strip:"la tira ROLLER/LOOPER", trns:"TRNS LNK", prst:"PRST LNK", chan:"CHAN", lst:"LST STEP", gl:"«", gr:"»",
    shift:"SHIFT", rec:"REC (●)", stop:"STOP (■)", play:"PLAY (❚❚/▶)",
    pdisp:"el display de proyecto", project:"PROJECT", kctl:"KNOBS (de Control)", ctrl:"CONTROL MODE", save:"SAVE",
    s1d:"el display de SEQ1", s1l:"‹ de SEQ1", s1r:"› de SEQ1", s1k:"KNOBS de SEQ1", seq1:"SEQUENCER 1", s1m:"MUTE de SEQ1",
    s2d:"el display de SEQ2", s2l:"‹ de SEQ2", s2r:"› de SEQ2", s2k:"KNOBS de SEQ2", seq2:"SEQUENCER 2", s2m:"MUTE de SEQ2",
    dd:"el display de DRUM", dl:"‹ de DRUM", dr:"› de DRUM", dk:"KNOBS de DRUM", drum:"DRUM", dm:"MUTE de DRUM"
  };
  for(var i=1;i<=16;i++){
    NOMBRES["e"+i] = "perilla "+i;
    NOMBRES["st"+i] = "paso "+i;
    NOMBRES["p"+i] = "pad "+i + (PAD_NOTA[i-1] ? " ("+PAD_NOTA[i-1]+")" : "");
  }

  var INFO = {
    sync:["Sync","Elige de dónde viene el reloj: INT (el BeatStep manda), USB (lo manda la compu, ej. Ableton), MIDI o CLK. Se cambia tocándolo varias veces, y solo con todo parado.",null],
    tempo:["Display de tempo","Muestra el BPM. Cuando tocás o girás una perilla, muestra su valor por un momento.",null],
    rate:["Rate / Fine","Girar: cambia el tempo (30–300 BPM).","Con SHIFT: ajuste fino, en centésimas (ej. 124.50)."],
    tap:["Tap / Metro","Tocalo varias veces al ritmo y el tempo se acomoda a tus toques.","Con SHIFT: prende o apaga el metrónomo (manda notas MIDI por el canal 10; no hace ruido solo)."],
    swing:["Swing","De 50 % (derecho) a 75 % (muy shuffle). Sin CURRENT TRACK afecta a los tres secuenciadores.",null],
    ct1:["Current Track (swing)","Prendido: el swing que muevas afecta solo al secuenciador elegido. Hay que guardar el patrón para que quede.",null],
    rand:["Randomness","Cuánto desorden: orden de los pasos, ritmo, velocity y largo. No cambia las notas: el tema sigue en su tonalidad.",null],
    ct2:["Current Track (random)","Prendido: Randomness y Probability afectan solo al secuenciador elegido.",null],
    prob:["Probability","Cada cuánto aparece ese desorden. En 0 no pasa nada aunque Randomness esté alto.",null],
    strip:["Roller / Looper","ROLLER (de fábrica): en DRUM repite el pad que mantenés; en SEQ1/SEQ2 arpegia los pads que mantenés. LOOPER: repite un pedacito de todo lo que suena. Más a la izquierda, más lento (1/4); a la derecha, más rápido (1/32).","Cambiar entre Roller y Looper: en CONTROL MODE, SHIFT + paso 9 (prendido = Roller)."],
    trns:["Trns Lnk","Une la transposición: si transponés SEQ1, SEQ2 lo sigue (y al revés). La batería no se transpone.",null],
    prst:["Prst Lnk","Une los patrones: al cambiar de patrón en uno, cambian los tres (al terminar el patrón de batería).",null],
    chan:["Chan","Mantené CHAN y tocá un paso 1–16: canal MIDI de SALIDA del secuenciador elegido. Las luces muestran el canal de cada uno con su color (rojo Control, verde SEQ1, amarillo SEQ2, violeta DRUM).","SHIFT + CHAN + paso: canal de ENTRADA (para grabar o transponer desde un teclado)."],
    lst:["Lst Step","Mantené LST STEP y tocá un paso: ese es el último paso del patrón (largo de 1 a 16). Con » antes, llegás a 32, 48 o 64.","Con la polirritmia prendida, el largo es por instrumento de batería."],
    gl:["« (grupo anterior)","Ver los pasos 1–16, 17–32, etc. Las luces de arriba: roja = lo que ves; blanca = dónde está el último paso. « y » juntos: modo seguir (la vista acompaña la reproducción).",null],
    gr:["» (grupo siguiente)","Ver el siguiente grupo de 16 pasos. Con LST STEP mantenido, alarga el patrón.","Con SHIFT: copia los primeros 16 pasos al final (duplica el patrón)."],
    shift:["Shift","La tecla negra. Se mantiene apretada para la segunda función de otra tecla o pad (lo escrito en gris debajo de los pads).","SHIFT + paso 1: borra el patrón entero. SHIFT + paso 2: borra solo las notas."],
    rec:["Record (●)","Prende la grabación. Con REC + PLAY, lo que tocás en los pads queda grabado, cuantizado a la grilla. Para prender y apagar pasos con las teclas NO hace falta grabar.",null],
    stop:["Stop (■)","Frena. Tres veces seguidas rápido: manda 'All Notes Off' (corta notas colgadas).",null],
    play:["Play / Pause","Arranca. Si está sonando: pausa, y otra vez sigue desde ahí.","Con SHIFT: reinicia los tres secuenciadores desde el principio."],
    pdisp:["Display de proyecto","Muestra el número de proyecto (1–16).",null],
    project:["Project","Mantené PROJECT y tocá un paso 1–16 para CARGAR ese proyecto (reemplaza todo lo que tenés sin guardar). Al mantenerlo, la tecla roja es el proyecto actual.","Guardar proyecto: mantené SAVE, después PROJECT, y tocá el paso del lugar."],
    kctl:["Knobs (Control)","Solo en Control Mode: las 16 perillas mandan CC o controlan la mezcla de la compu (MCU/HUI).",null],
    ctrl:["Control Mode","Convierte la mitad derecha en un controlador MIDI: perillas, pads y teclas mandan lo que configures en MIDI Control Center. Los secuenciadores siguen sonando.",null],
    save:["Save","Mantené SAVE y tocá un paso: guarda el PATRÓN del secuenciador elegido en ese lugar (si es otro número, es una copia). Con PROJECT en el medio, guarda el proyecto.","Ojo: si cambiás de patrón sin guardar, perdés lo que editaste. Un punto al lado del número = cambios sin guardar."],
    knobsSeq:["Knobs (SEQ)","Elige qué cambian las 16 perillas en este secuenciador. Tocalo varias veces: PITCH (nota), VELO (fuerza), GATE (largo). Mirá cuál luz está prendida antes de girar.",null],
    knobsDrum:["Knobs (DRUM)","Elige qué cambian las 16 perillas en la batería: SHIFT (correr el golpe antes o después), VELO (fuerza), GATE (largo). Mirá la luz antes de girar.",null],
    seq:["Sequencer 1 / 2","Toque corto: elige ese secuenciador (las teclas de paso toman su color: verde o amarillo). Mantenido + paso 1–16: elige patrón. Mantenido + pad: transpone la secuencia.","SHIFT + SEQUENCER + pasos en orden: arma una cadena de patrones."],
    drumb:["Drum","Toque corto: elige la batería (pasos violetas). Mantenido + paso: elige patrón. Mantenido + pad: elige ese instrumento sin que suene.","SHIFT + DRUM + pasos: cadena de patrones. DRUM + MUTE + pad: silencia un solo instrumento."],
    mute:["Mute","Silencia ese secuenciador al instante. No se guarda con el proyecto.",null],
    arrows:["‹ ›","Patrón anterior / siguiente de ese secuenciador (16 por secuenciador).",null],
    disp:["Display del secuenciador","Número de patrón (1–16). Con un punto: tiene cambios sin guardar.",null],
    enc:["Perillas 1–16","Una por paso: la perilla 5 edita el paso 5. Qué cambian depende de la luz de KNOBS del secuenciador elegido (nota, velocity, largo o corrimiento). Son sensibles al tacto: tocás sin girar y el display muestra el valor.","SHIFT + perilla 1: suma o resta a todos los pasos. SHIFT + perilla 2: todos los pasos al mismo valor."],
    step:["Teclas de paso 1–16","Prender y apagar pasos del secuenciador elegido. Mantenido + pad: carga esa nota (o fuerza) en el paso. Mantenido + otro paso: liga las notas del medio. El color dice qué secuenciador estás tocando: verde SEQ1, amarillo SEQ2, violeta DRUM.","Con SHIFT: 1 borra el patrón, 2 borra solo notas, 16 polirritmia (en DRUM)."]
  };

  var root = null;
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function btn(id, html, cls){
    var b = el("button","bsp-k "+(cls||""), html);
    b.type="button"; b.dataset.k=id; b.setAttribute("aria-label", NOMBRES[id]||id);
    return b;
  }
  function led(lab, c){ return '<span class="bsp-led"><i class="'+(c||"")+'"></i>'+lab+'</span>'; }
  function cell(b, lab){ var c = el("div","bsp-cell"); c.appendChild(b); if(lab) c.appendChild(el("span","bsp-lab",lab)); return c; }

  function render(cont){
    if(!document.getElementById("bsp-css")){ var st=el("style"); st.id="bsp-css"; st.textContent=CSS; document.head.appendChild(st); }
    cont.classList.add("bsp");
    var p = el("div","bsp-p"); p.setAttribute("role","group"); p.setAttribute("aria-label","Panel del BeatStep Pro");

    /* ---- izquierda ---- */
    var z1 = el("div","bsp-z");
    var r1 = el("div","bsp-row"); r1.appendChild(btn("sync","Sync"));
    r1.appendChild(el("div","bsp-row",led("INT","w")+led("USB")+led("MIDI")+led("CLK")));
    z1.appendChild(r1);
    var dk = el("div","bsp-dark");
    var t = el("div","bsp-cell"); var scr = el("div","bsp-scr","120"); scr.dataset.k="tempo"; scr.tabIndex=0; scr.setAttribute("role","button"); t.appendChild(scr); t.appendChild(el("span","bsp-lab","Tempo/Value")); dk.appendChild(t);
    dk.appendChild(cell(btn("rate","","knob"),"Rate/Fine"));
    dk.appendChild(cell(btn("tap","","bsp-tap"),"Tap/Metro"));
    z1.appendChild(dk);
    var sw = el("div","bsp-swg");
    sw.appendChild(cell(btn("swing","","knob"),"Swing"));
    var c1 = el("div","ctc"); c1.appendChild(el("span","","Current<br>track")); c1.appendChild(btn("ct1","","round")); sw.appendChild(c1);
    sw.appendChild(cell(btn("rand","","knob"),"Random"));
    var c2 = el("div","ctc"); c2.appendChild(el("span","","Current<br>track")); c2.appendChild(btn("ct2","","round")); sw.appendChild(c2);
    sw.appendChild(cell(btn("prob","","knob"),"Probab."));
    z1.appendChild(sw);
    var strip = el("div","bsp-strip",'<div class="c"><span>1/4</span><span>1/8</span><span>1/16</span><span>1/32</span></div><div class="l"><span>Slower</span><span>Roller / Looper</span><span>Faster</span></div>');
    strip.dataset.k="strip"; strip.tabIndex=0; strip.setAttribute("role","button"); strip.setAttribute("aria-label","Tira Roller/Looper");
    z1.appendChild(strip);
    var len = el("div","bsp-len");
    len.appendChild(btn("trns","Trns lnk"));
    len.appendChild(el("div","leds",led("16","r")+led("32")+led("48")+led("64")));
    len.appendChild(btn("chan","Chan"));
    len.appendChild(btn("prst","Prst lnk"));
    len.appendChild(btn("gl","«"));
    len.appendChild(btn("gr","»"));
    len.appendChild(btn("lst","Lst step"));
    z1.appendChild(len);
    var tr = el("div","bsp-tr");
    tr.appendChild(btn("shift","Shift","shift tr"));
    tr.appendChild(btn("rec","●","tr"));
    tr.appendChild(btn("stop","■","tr"));
    tr.appendChild(btn("play","❚❚/▶","tr"));
    tr.lastChild.style.fontSize="1.25em";
    tr.firstChild.style.fontSize="1.05em";
    z1.appendChild(tr);
    p.appendChild(z1);

    /* ---- centro ---- */
    var z2 = el("div","bsp-z"); z2.style.gap=".5em";
    var b0 = el("div","bsp-blk c0");
    var pd = el("div","scr","01"); pd.dataset.k="pdisp"; b0.appendChild(pd);
    b0.appendChild(el("div","leds",led("CC")+led("MCU/HUI")));
    b0.appendChild(btn("project","Project")); b0.appendChild(btn("kctl","Knobs"));
    b0.appendChild(btn("ctrl","Control mode")); b0.appendChild(btn("save","Save"));
    z2.appendChild(b0);
    [["s1","seq1","Sequencer 1","c1",["Pitch","Velo","Gate"]],["s2","seq2","Sequencer 2","c2",["Pitch","Velo","Gate"]],["d","drum","Drum","c3",["Shift","Velo","Gate"]]].forEach(function(s){
      var b = el("div","bsp-blk "+s[3]);
      var d = el("div","scr","01"); d.dataset.k = s[0]+"d"; b.appendChild(d);
      b.appendChild(el("div","leds",led(s[4][0],"w")+led(s[4][1])+led(s[4][2])));
      var ar = el("div","ar"); ar.appendChild(btn(s[0]+"l","‹")); ar.appendChild(btn(s[0]+"r","›")); b.appendChild(ar);
      b.appendChild(btn(s[0]+"k","Knobs"));
      b.appendChild(btn(s[1],s[2])); b.appendChild(btn(s[0]+"m","Mute"));
      z2.appendChild(b);
    });
    p.appendChild(z2);

    /* ---- derecha ---- */
    var z3 = el("div","bsp-z"); z3.style.justifyContent="space-between";
    var enc = el("div","bsp-enc");
    for(var n=1;n<=16;n++) enc.appendChild(cell(btn("e"+n,"","knob"), String(n)));
    z3.appendChild(enc);
    var steps = el("div","bsp-steps");
    for(n=1;n<=16;n++) steps.appendChild(btn("st"+n, String(n)));
    z3.appendChild(steps);
    var pads = el("div","bsp-pads");
    [9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8].forEach(function(n){
      var c = el("div","bsp-pad");
      c.appendChild(btn("p"+n,""));
      c.appendChild(el("div","pl","<b>"+PAD_NOTA[n-1]+"</b><span>"+PAD_SEC[n-1]+"</span>"));
      pads.appendChild(c);
    });
    z3.appendChild(pads);
    p.appendChild(z3);

    cont.innerHTML=""; cont.appendChild(p);
    root = p;
    return p;
  }

  // lista: [ "save", ["shift","h"], ... ]  "h" = mantener
  function marcar(lista){
    if(!root) return;
    root.querySelectorAll(".on").forEach(function(b){ b.classList.remove("on"); });
    root.querySelectorAll(".bsp-b").forEach(function(b){ b.remove(); });
    if(!lista || !lista.length) return;
    var n = 0, varios = lista.length > 1;
    lista.forEach(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      var b = root.querySelector('[data-k="'+id+'"]'); if(!b) return;
      n++;
      b.classList.add("on");
      if((varios || h) && !b.querySelector(".bsp-b")){
        b.style.position = b.style.position || "relative";
        b.appendChild(el("span","bsp-b"+(h?" h":""), (varios? n : "") + (h? (varios?" · ":"")+"mantené" : "")));
      }
    });
  }

  var GIRAR = /^(e\d+|rate|swing|rand|prob)$/;
  function texto(lista){
    return lista.map(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      var v = h ? "mantené " : GIRAR.test(id) ? "girá " : id === "strip" ? "apoyá el dedo en " : "tocá ";
      return v + (NOMBRES[id]||id);
    }).join(" → ");
  }

  function info(id){
    if(/^e\d+$/.test(id)) return INFO.enc;
    if(/^st\d+$/.test(id)) return INFO.step;
    if(/^p\d+$/.test(id)){
      var n = +id.slice(1), nota = PAD_NOTA[n-1], sec = PAD_SEC[n-1];
      var extra = n === 15 || n === 16 ? " En SEQ1/SEQ2 baja o sube una octava el teclado de pads (los dos juntos: vuelve al centro)." : "";
      return ["Pad "+n+(nota && n<15 ? " · "+nota : ""),
        "En SEQ1/SEQ2 es una tecla de piano"+(nota && n<15 ? " ("+nota+")" : "")+"; mantené SEQUENCER y tocalo para transponer. En DRUM dispara un instrumento y lo elige para editar sus pasos."+extra,
        "Con SHIFT: "+sec+(n<=3?" (dirección de reproducción)":n===4?" (tresillos)":n<=8?" (velocidad de los pasos)":" (escala de la secuencia)")+"."];
    }
    if(/^(s1k|s2k)$/.test(id)) return INFO.knobsSeq;
    if(id === "dk") return INFO.knobsDrum;
    if(/^(seq1|seq2)$/.test(id)) return INFO.seq;
    if(id === "drum") return INFO.drumb;
    if(/^(s1m|s2m|dm)$/.test(id)) return INFO.mute;
    if(/^(s1l|s1r|s2l|s2r|dl|dr)$/.test(id)) return INFO.arrows;
    if(/^(s1d|s2d|dd)$/.test(id)) return INFO.disp;
    return INFO[id];
  }

  window.BSPPanel = { render:render, marcar:marcar, texto:texto, info:info, nombres:NOMBRES };
})();
