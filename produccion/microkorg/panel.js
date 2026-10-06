/* ============================================================
   Panel del Korg microKORG (el primero, 2002), dibujado con la
   misma disposición que el aparato (manual oficial, págs. 2-3).
   Lo usan la guía y las clases.
   MKPanel.render(el) / marcar(lista, pantalla) / texto / info
   Ítems de lista:
     "k2"              perilla 2 (performance edit)
     ["shift","h"]     mantener
     "bank:TRANCE"     girar PROGRAM SELECT a ese banco
     "es1:FILTER"      girar EDIT SELECT 1 a esa sección
     "g:FILTER:2"      perilla 2 dentro de esa sección (marca la grilla)
   ============================================================ */
(function(){
  var CSS = `
  .mk{ container-type:inline-size; }
  .mk-p{
    --body:#2a2c30; --strip:#121315; --lab:#e9e7e2; --soft:#9a9890; --key:#d9d8d3; --keyl:#9d9b95;
    --grid:#cfcdc6; --gridl:#a9a7a0; --gtxt:#1d1d1b;
    font-size: clamp(4px, 1.02cqw, 10px);
    background:var(--body); border:1px solid #000; border-radius:1.1em; padding:1.3em 1.5em 1.5em;
    font-family:"IBM Plex Mono", ui-monospace, monospace; color:var(--lab);
  }
  .mk-p button{ font:inherit; }
  .mk-top{ display:grid; grid-template-columns: minmax(0,10fr) minmax(0,28fr) minmax(0,11fr) minmax(0,51fr); gap:1.3em; align-items:start; }
  .mk-col{ display:flex; flex-direction:column; gap:.9em; min-width:0; }
  .mk-hd{ background:var(--strip); color:var(--lab); font-size:.85em; font-weight:600; letter-spacing:.12em; text-transform:uppercase; text-align:center; padding:.25em .3em; border-radius:.2em; white-space:nowrap; overflow:hidden; }
  .mk-k{
    position:relative; color:#1d1d1b; background:var(--key); border:1px solid var(--keyl); border-bottom-width:.3em;
    border-radius:.35em; min-height:3.6em; padding:.2em; cursor:pointer;
    display:flex; align-items:center; justify-content:center; text-align:center;
    font-size:1em; font-weight:600; letter-spacing:.04em; text-transform:uppercase; line-height:1.05;
    transition:border-color .12s, background .12s;
  }
  .mk-k:hover{ border-color:#e8b04a; }
  .mk-k.knob{ border-radius:50%; aspect-ratio:1; min-height:0; padding:0; background:radial-gradient(circle at 50% 40%, #6d7077, #2f3135 70%); border:.3em solid #17181a; }
  .mk-k.knob::after{ content:""; position:absolute; top:8%; left:calc(50% - .15em); width:.3em; height:32%; background:#f2f2f2; border-radius:.2em; transform-origin:50% 130%; }
  .mk-k.dial{ border-radius:50%; aspect-ratio:1; min-height:0; padding:0; background:radial-gradient(circle at 50% 45%, #f4f3ef, #b9b7b1 72%); border:.35em solid #17181a; }
  .mk-k.dial::after{ content:""; position:absolute; top:6%; left:calc(50% - .18em); width:.36em; height:30%; background:#1d1d1b; border-radius:.2em; }
  .mk-led{ display:inline-flex; align-items:center; gap:.35em; font-size:.82em; color:var(--soft); text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
  .mk-led i{ width:.85em; height:.85em; border-radius:50%; background:#4a4b4e; display:inline-block; flex:0 0 auto; }
  .mk-led i.r{ background:#ff3b2f; box-shadow:0 0 .5em #ff3b2f; }
  .mk-lab{ font-size:.82em; color:var(--soft); text-transform:uppercase; letter-spacing:.06em; text-align:center; white-space:nowrap; }
  .mk-pair{ display:grid; grid-template-columns:1fr 1fr; gap:.6em; }
  .mk-cen{ display:flex; flex-direction:column; align-items:center; gap:.4em; min-width:0; }
  .mk-cen > .mk-k:not(.knob):not(.dial){ width:100%; }
  /* program select */
  .mk-ps{ display:grid; grid-template-columns: 1fr 8.5em 1fr; gap:.6em; align-items:center; }
  .mk-bl{ display:flex; flex-direction:column; gap:.75em; font-size:.74em; font-weight:600; text-transform:uppercase; letter-spacing:.03em; }
  .mk-bl span{ cursor:pointer; padding:.1em .3em; border-radius:.2em; white-space:nowrap; color:#cfcdc6; }
  .mk-bl.r{ text-align:right; }
  .mk-bl span.voc{ color:#7fd08a; }
  .mk-bl span.sel{ background:#e8b04a; color:#1a1408; }
  .mk-side{ display:flex; flex-direction:column; align-items:center; gap:.4em; }
  .mk-scr{ background:#0b0b0c; border-radius:.35em; padding:.35em .2em; text-align:center; font-family:"IBM Plex Mono", monospace; color:#ff3b2f; font-size:2.9em; font-weight:600; letter-spacing:.08em; text-shadow:0 0 .3em rgba(255,59,47,.6); cursor:pointer; line-height:1.15; min-height:1.45em; }
  .mk-nums{ display:grid; grid-template-columns:repeat(8,1fr); gap:.6em; margin-top:.2em; }
  .mk-nums .mk-k{ min-height:3.9em; font-size:1.1em; }
  /* edit select */
  .mk-es{ display:flex; flex-direction:column; align-items:center; gap:.3em; }
  .mk-es .mk-k.dial{ width:72%; }
  .mk-es .cur{ font-size:.85em; font-weight:600; color:#1a1408; background:#e8b04a; border-radius:.2em; padding:0 .4em; min-height:1.3em; white-space:nowrap; }
  .mk-es .cur:empty{ background:transparent; }
  .mk-ts{ display:grid; grid-template-columns:1.1fr 1fr; gap:.5em; align-items:center; }
  /* perillas + grilla */
  .mk-kn{ display:grid; grid-template-columns:5.8em repeat(5,minmax(0,1fr)); gap:.6em; align-items:end; }
  .mk-kn .mk-hd{ font-size:.66em; letter-spacing:.02em; padding:.25em .1em; }
  .mk-kn .mk-k.knob{ width:66%; margin:0 auto; }
  .mk-grid{ display:grid; grid-template-columns:5.8em repeat(5,minmax(0,1fr)); background:var(--grid); color:var(--gtxt); border-radius:.3em; overflow:hidden; font-size:.72em; line-height:1.25; margin-top:.6em; }
  .mk-grid > *{ border-bottom:1px solid var(--gridl); padding:.12em .3em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-height:1.45em; }
  .mk-grid .hd{ grid-column:1/-1; background:#1d1d1b; color:#e9e7e2; font-weight:600; letter-spacing:.1em; display:flex; gap:.8em; align-items:center; }
  .mk-grid .hd i{ width:.8em; height:.8em; border-radius:50%; background:#4a4b4e; display:inline-block; }
  .mk-grid .hd i.r{ background:#ff3b2f; box-shadow:0 0 .5em #ff3b2f; }
  .mk-grid .sec{ font-weight:700; cursor:pointer; background:#bcbab3; }
  .mk-grid .c{ cursor:pointer; }
  .mk-grid .c:hover, .mk-grid .sec:hover{ background:#f0dfb6; }
  .mk-grid .row-on{ background:#f3e3bd; }
  .mk-grid .c.on{ background:#e8b04a; outline:none; box-shadow:none; animation:none; font-weight:700; }
  /* abajo: ruedas + teclado */
  .mk-bot{ display:grid; grid-template-columns: 10fr 90fr; gap:1.3em; margin-top:1.3em; align-items:stretch; }
  .mk-wh{ display:grid; grid-template-columns:1fr 1fr; gap:.9em; }
  .mk-wh .mk-k{ min-height:9em; background:linear-gradient(#55585e,#2b2d31 50%,#55585e); border-color:#111; color:#e9e7e2; align-items:flex-end; padding-bottom:.4em; font-size:.85em; }
  .mk-kb{ position:relative; height:10em; display:flex; cursor:pointer; border-radius:.3em; overflow:hidden; border:1px solid #000; }
  .mk-kb .w{ flex:1; background:#f4f3ef; border-right:1px solid #9d9b95; }
  .mk-kb .b{ position:absolute; top:0; height:60%; background:#161616; border-radius:0 0 .2em .2em; }
  .mk-kb.on{ box-shadow:0 0 1.6em .3em rgba(232,176,74,.9); outline:.3em solid #e8b04a; }
  /* marcado */
  .mk-k.on, .mk-scr.on{ outline:.3em solid #e8b04a; outline-offset:.12em; box-shadow:0 0 1.6em .3em rgba(232,176,74,.9); animation:mkpulse 1.3s ease-in-out infinite; z-index:1; }
  .mk-k.on:not(.knob):not(.dial){ background:#f6dfae; }
  @keyframes mkpulse{ 50%{ box-shadow:0 0 2.4em .6em rgba(232,176,74,.55); } }
  @media (prefers-reduced-motion: reduce){ .mk-k.on{ animation:none; } }
  .mk-b{ position:absolute; top:-1.2em; right:-1em; z-index:3; background:#e8b04a; color:#1a1408; border-radius:1em; padding:.1em .5em; font-size:1em; font-weight:700; letter-spacing:0; text-transform:none; white-space:nowrap; line-height:1.3; pointer-events:none; }
  .mk-b.h{ background:#e0653a; color:#fff; }
  `;

  var BANCOS = ["TRANCE","TECHNO/HOUSE","ELECTRONICA","D'n'B/BREAKS","HIPHOP/VINTAGE","RETRO","S.E./HIT","VOCODER"];

  /* La grilla, tal como está impresa en el panel (parámetros de SYNTH) */
  var GRID1 = [
    ["VOICE",["SYNTH/VOCODER","SINGLE/LAYER","VOICE ASSIGN","TRIGGER MODE","UNISON DETUNE"]],
    ["PITCH",["TRANSPOSE","TUNE","PORTAMENTO","BEND RANGE","VIBRATO INT"]],
    ["OSC1",["WAVE","CONTROL 1","CONTROL 2","",""]],
    ["OSC2",["WAVE","OSC MOD","SEMITONE","TUNE",""]],
    ["MIXER",["OSC1 LEVEL","OSC2 LEVEL","NOISE LEVEL","",""]],
    ["FILTER",["TYPE","CUTOFF","RESONANCE","FILTER EG INT","FILTER KEY TRACK"]],
    ["FILTER EG",["ATTACK","DECAY","SUSTAIN","RELEASE","EG RESET"]],
    ["AMP",["LEVEL","PANPOT","DISTORTION","KBD TRACK",""]],
    ["AMP EG",["ATTACK","DECAY","SUSTAIN","RELEASE","EG RESET"]],
    ["LFO 1",["WAVE","KEY SYNC","TEMPO SYNC","FREQUENCY/SYNC NOTE",""]],
    ["LFO 2",["WAVE","KEY SYNC","TEMPO SYNC","FREQUENCY/SYNC NOTE",""]]
  ];
  var GRID2 = [
    ["PATCH 1",["SOURCE","DEST","MOD INT","",""]],
    ["PATCH 2",["SOURCE","DEST","MOD INT","",""]],
    ["PATCH 3",["SOURCE","DEST","MOD INT","",""]],
    ["PATCH 4",["SOURCE","DEST","MOD INT","",""]],
    ["MOD FX",["TYPE","LFO SPEED","EFFECT DEPTH","",""]],
    ["DELAY",["TYPE","TEMPO SYNC","DELAY TIME/SYNC NOTE","DELAY DEPTH",""]],
    ["EQ",["LOW EQ FREQ","LOW EQ GAIN","HI EQ FREQ","HI EQ GAIN",""]],
    ["ARPEG.A",["TEMPO","RESOLUTION","GATE","TYPE","RANGE"]],
    ["ARPEG.B",["LATCH","SWING","KEY SYNC","LAST STEP","TARGET TIMBRE"]],
    ["GLOBAL",["MASTER TUNE","MASTER TRANSPOSE","VELOCITY CURVE","POSITION","AUDIO IN THRU"]],
    ["MIDI",["MIDI CH","LOCAL","CLOCK","",""]]
  ];
  var DE = {}; GRID1.forEach(function(r){ DE[r[0]] = 1; }); GRID2.forEach(function(r){ DE[r[0]] = 2; });
  function params(sec){ var r = (DE[sec]===1?GRID1:GRID2).filter(function(x){ return x[0]===sec; })[0]; return r ? r[1] : []; }

  var PERF = ["CUTOFF","RESONANCE","EG ATTACK","EG RELEASE","TEMPO"];

  var NOMBRES = {
    vol:"VOLUME", arp:"ARPEGGIATOR ON/OFF", octd:"OCTAVE SHIFT DOWN", octu:"OCTAVE SHIFT UP",
    bank:"PROGRAM SELECT (la rueda de bancos)", side:"BANK SIDE (A/B)", disp:"el display", write:"WRITE", shift:"SHIFT",
    tsel:"TIMBRE SELECT / FORMANT HOLD", es1:"EDIT SELECT 1", es2:"EDIT SELECT 2", ov:"la luz ORIGINAL VALUE",
    pitch:"la rueda PITCH", mod:"la rueda MOD", kb:"el teclado"
  };
  for(var i=1;i<=8;i++) NOMBRES["n"+i] = "el "+i+" (PROGRAM NUMBER)";
  for(i=1;i<=5;i++) NOMBRES["k"+i] = "la perilla "+i+" ("+PERF[i-1]+")";

  /* qué hace cada parámetro: [rango, explicación] */
  var P = {
    "VOICE:1":["Synth · Vocoder","Si el programa es un sinte o un vocoder (voz por micrófono)."],
    "VOICE:2":["Single · Layer","Single: un timbre. Layer: dos timbres sonando juntos (se reparten las 4 voces)."],
    "VOICE:3":["Mono · Poly · Unison","Mono: una nota por vez (bajos, leads). Poly: acordes de hasta 4 notas. Unison: las 4 voces en la misma nota, gordo."],
    "VOICE:4":["Single · Multi","Solo en Mono o Unison. Multi: cada nota vuelve a disparar las envolventes. Single: si ligás notas, no se redisparan."],
    "VOICE:5":["0…99","Cuánto se desafinan entre sí las voces en Unison. Más = más ancho."],
    "PITCH:1":["−24…24","Transpone el timbre en semitonos (12 = una octava)."],
    "PITCH:2":["−50…50","Afinación fina, en cents."],
    "PITCH:3":["0…127","Portamento: la nota se desliza a la siguiente. 0 = apagado."],
    "PITCH:4":["−12…12","Cuántos semitonos dobla la rueda PITCH."],
    "PITCH:5":["−63…63","Cuánto vibrato agrega la rueda MOD (lo hace el LFO 2)."],
    "OSC1:1":["Saw · Square · Triangle · Sine · Vox · DWGS · Noise · Audio In","La forma de onda del oscilador 1: la materia prima del sonido."],
    "OSC1:2":["0…127","Depende de la onda. En Square: el ancho del pulso. En Saw: le suma otra sierra más aguda."],
    "OSC1:3":["0…127 · 1…64","Depende de la onda: cuánto mueve el LFO 1 al CONTROL 1 (PWM, desafinado). En DWGS elige una de 64 ondas digitales."],
    "OSC2:1":["Saw · Square · Triangle","La onda del oscilador 2."],
    "OSC2:2":["OFF · Ring · Sync · RingSync","Cómo se mezcla con el oscilador 1. Ring: metálico. Sync: agresivo, se mueve con TUNE o SEMITONE."],
    "OSC2:3":["−24…24","Distancia en semitonos con el oscilador 1. −12 = una octava abajo; 7 = una quinta."],
    "OSC2:4":["−63…63","Desafinación respecto del oscilador 1. Un poquito (3–8) engorda el sonido."],
    "MIXER:1":["0…127","Volumen del oscilador 1."],
    "MIXER:2":["0…127","Volumen del oscilador 2. En 0 no suena aunque esté configurado."],
    "MIXER:3":["0…127","Volumen del ruido (para soplos, hats, ataques)."],
    "FILTER:1":["24L · 12L · bPF · HPF","Tipo de filtro. 24L: pasa bajos fuerte, el clásico. 12L: más suave. bPF: solo el medio. HPF: saca los graves."],
    "FILTER:2":["0…127","CUTOFF: dónde corta el filtro. Abajo = oscuro; arriba = brillante."],
    "FILTER:3":["0…127","RESONANCE: realza la zona del corte. Alta = el sonido 'canta' o silba."],
    "FILTER:4":["−63…63","Cuánto abre el filtro su envolvente (FILTER EG). Positivo: el filtro se abre al tocar y se cierra. 0: no se mueve."],
    "FILTER:5":["−63…63","Que el filtro se abra más en las notas agudas. +48: sigue exacto al teclado."],
    "FILTER EG:1":["0…127","Envolvente del filtro: cuánto tarda en abrirse."],
    "FILTER EG:2":["0…127","Cuánto tarda en bajar hasta el SUSTAIN. Corto = golpe de filtro (bajos, plucks)."],
    "FILTER EG:3":["0…127","Dónde se queda mientras mantenés la tecla."],
    "FILTER EG:4":["0…127","Cuánto tarda en cerrarse al soltar."],
    "FILTER EG:5":["OFF · ON","ON: cada nota arranca la envolvente desde cero."],
    "AMP:1":["0…127","Volumen del timbre. En Layer, el balance entre los dos timbres."],
    "AMP:2":["L63 · CNT · R63","Paneo: izquierda, centro o derecha."],
    "AMP:3":["OFF · ON","Distorsión. Cuánto distorsiona depende de los niveles del MIXER."],
    "AMP:4":["−63…63","Que las notas agudas suenen más (o menos) fuerte."],
    "AMP EG:1":["0…127","Envolvente de volumen: cuánto tarda en sonar. 0 = golpe inmediato; alto = entra de a poco (pads)."],
    "AMP EG:2":["0…127","Cuánto tarda en bajar hasta el SUSTAIN."],
    "AMP EG:3":["0…127","El volumen mientras mantenés la tecla. 0 = la nota se apaga sola (plucks)."],
    "AMP EG:4":["0…127","Cola al soltar la tecla. Corto = seco; largo = queda flotando."],
    "AMP EG:5":["OFF · ON","ON: cada nota arranca desde cero."],
    "LFO 1:1":["Saw · Square1 · Triangle · S/H","La forma del movimiento. S/H: valores al azar, escalonados."],
    "LFO 1:2":["OFF · Timbre · Voice","Si el LFO vuelve a empezar al tocar una nota."],
    "LFO 1:3":["OFF · ON","ON: el LFO va a tempo (el TEMPO del arpegiador o el reloj MIDI)."],
    "LFO 1:4":["0…127 · 1/1…1/32","Velocidad. Con TEMPO SYNC en ON, en figuras: 1/4 = un ciclo por negra."],
    "LFO 2:1":["Saw · Square2 · Sine · S/H","La forma del movimiento del LFO 2 (es el que hace el vibrato)."],
    "LFO 2:2":["OFF · Timbre · Voice","Si el LFO vuelve a empezar al tocar una nota."],
    "LFO 2:3":["OFF · ON","ON: el LFO va a tempo."],
    "LFO 2:4":["0…127 · 1/1…1/32","Velocidad, o figura si TEMPO SYNC está en ON."],
    "PATCH:1":["Filter EG · Amp EG · LFO1 · LFO2 · Velocity · KBD Track · Pitch Bend · MOD Wheel","Qué mueve (la fuente). Como enchufar un cable en un modular."],
    "PATCH:2":["Pitch · OSC2 Tune · OSC1 Ctrl1 · Noise · Cutoff · Amp · Pan · LFO2 Freq","Qué se mueve (el destino)."],
    "PATCH:3":["−63…63","Cuánto. 0 = el cable está pero no hace nada."],
    "MOD FX:1":["Flanger/Chorus · Ensemble · Phaser","Efecto de modulación. Ensemble: ancho, para pads."],
    "MOD FX:2":["0…127","Velocidad del efecto."],
    "MOD FX:3":["0…127","Profundidad. 0 = efecto apagado."],
    "DELAY:1":["Stereo · Cross · L/R","Tipo de eco. L/R: rebota de un lado al otro."],
    "DELAY:2":["OFF · ON","ON: el eco va a tempo."],
    "DELAY:3":["0…127 · 1/32…1/1","Tiempo del eco, o figura si TEMPO SYNC está en ON (1/8 = corchea)."],
    "DELAY:4":["0…127","Cuánto eco y cuántas repeticiones. 0 = sin delay."],
    "EQ:1":["40 Hz…1 kHz","Frecuencia del ecualizador de graves."],
    "EQ:2":["−12…12","Sube o baja los graves."],
    "EQ:3":["1…18 kHz","Frecuencia del ecualizador de agudos."],
    "EQ:4":["−12…12","Sube o baja los agudos."],
    "ARPEG.A:1":["20…300","Tempo del arpegiador (lo mismo que la perilla 5 en performance)."],
    "ARPEG.A:2":["1/24…1/4","Cada cuánto suena una nota: 1/16 = semicorcheas."],
    "ARPEG.A:3":["0…100","Largo de cada nota. 100 = ligadas."],
    "ARPEG.A:4":["Up · Down · Alt1 · Alt2 · Random · Trigger","El dibujo: subir, bajar, ida y vuelta, azar, o todas juntas."],
    "ARPEG.A:5":["1…4","Cuántas octavas recorre."],
    "ARPEG.B:1":["OFF · ON","LATCH: ON = sigue sonando al soltar las teclas."],
    "ARPEG.B:2":["−100…100","Swing: corre las notas pares."],
    "ARPEG.B:3":["OFF · ON","ON: el arpegio arranca desde el principio cada vez que tocás."],
    "ARPEG.B:4":["1…8","Cuántos pasos tiene el arpegio (los enciende y apaga el 1–8)."],
    "ARPEG.B:5":["Both · Timbre 1 · Timbre 2","En Layer: qué timbre arpegia."],
    "GLOBAL:1":["430.0…450.0","Afinación general (A4 = 440 Hz)."],
    "GLOBAL:2":["−12…12","Transpone todo el aparato."],
    "GLOBAL:3":["Curve · 1…127","Cómo responde a la fuerza. Un número = velocity fija."],
    "GLOBAL:4":["Post KBD · Pre TG","Cómo sale el MIDI (importa solo si grabás en la compu)."],
    "GLOBAL:5":["OFF · ON","Que lo que entra por AUDIO IN salga directo."],
    "MIDI:1":["1…16","Canal MIDI. Para que lo toque el BeatStep o la compu, el mismo canal de los dos lados."],
    "MIDI:2":["OFF · ON","LOCAL OFF: el teclado no toca el sonido interno (solo manda MIDI). Para tocarlo solo: ON."],
    "MIDI:3":["Int · Ext · Auto","De dónde sale el tempo. Auto: si llega reloj MIDI, lo sigue."]
  };

  var INFO = {
    vol:["Volume","Volumen general de las salidas y de los auriculares. Arrancá abajo y subilo de a poco.",null],
    arp:["Arpeggiator On/Off","Prende el arpegiador: mantené un acorde y lo toca nota por nota. Se guarda con el programa.","Con SHIFT: las canciones demo (elegís con el 1–8; SHIFT para salir)."],
    tempo:["Tempo","La luz titila al tempo del arpegiador.",null],
    octd:["Octave Shift Down","Baja el teclado una octava (hasta −3). La luz cambia de color según cuánto corriste.","SHIFT + DOWN: baja de a un paso el valor que estás editando (ajuste fino)."],
    octu:["Octave Shift Up","Sube el teclado una octava (hasta +3).","SHIFT + UP: sube de a un paso el valor. SHIFT + UP y DOWN juntos: COMPARE (escuchar el original)."],
    bank:["Program Select","La rueda grande elige el banco: 8 bancos, uno por estilo. Con el BANK SIDE y el 1–8 completás el programa.",null],
    side:["Bank Side (A/B)","Cada banco tiene dos lados de 8 programas. La luz apagada = lado A; prendida = lado B.","Con SHIFT: salta entre EDIT SELECT 1 y EDIT SELECT 2."],
    audio:["Audio In 1/2","Se prenden cuando entra sonido por las entradas de atrás (micrófono o línea). Rojo = saturado: bajá el VOLUME 1 o 2 de atrás.",null],
    disp:["Display","Muestra el programa (A.11 = lado A, banco 1, número 1) y, mientras editás, el valor. Si el valor titila, la perilla todavía no 'enganchó'.",null],
    write:["Write","Guarda. Primera vez: titila. Elegís dónde (lado, banco, número). Segunda vez: guarda ahí.","Si no guarda, está la protección prendida: SHIFT + 8, perilla 1 en oFF."],
    shift:["Shift","Mantenido + otra tecla: funciones extra. Cuando está prendido, sirve de EXIT (salir sin hacer nada).","SHIFT + 3 inicializa el programa · SHIFT + 7 vuelve a fábrica · SHIFT + 8 protección."],
    tsel:["Timbre Select / Formant Hold","En un sinte Layer: elige qué timbre (1 o 2) editás. Mantenido 2 segundos: los dos a la vez. En el vocoder: congela la vocal que estás cantando.","Con SHIFT: solo (escuchar un timbre)."],
    ov:["Original Value","Se prende cuando la perilla está justo en el valor guardado. Sirve para volver atrás un parámetro.",null],
    es1:["Edit Select 1","Elige la sección de arriba de la grilla: VOICE, PITCH, OSC1, OSC2, MIXER, FILTER, FILTER EG, AMP, AMP EG, LFO 1, LFO 2. Las perillas 1–5 pasan a editar esa fila.","Para volver a performance edit: tocá el número de programa que está prendido."],
    es2:["Edit Select 2","Elige la sección de abajo: PATCH 1–4, MOD FX, DELAY, EQ, ARPEG.A, ARPEG.B, GLOBAL, MIDI.","Con ARPEG.A o ARPEG.B elegido, los botones 1–8 prenden y apagan pasos del arpegio."],
    perf:["Perillas 1–5","Sin editar (las dos luces 1 y 2 de la grilla prendidas): 1 CUTOFF, 2 RESONANCE, 3 ATTACK y 4 RELEASE (de las dos envolventes), 5 TEMPO. Editando: el parámetro de la fila elegida, en la columna de esa perilla.","Si el display titila, girá hasta pasar por el valor actual: ahí engancha."],
    num:["Program Number 1–8","Eligen el programa dentro del banco. Con ARPEG.A o B elegido: prenden y apagan pasos del arpegio.","SHIFT + 1 copiar timbre · 2 intercambiar timbres · 3 inicializar · 4 filtro MIDI · 5 asignar CC · 6 volcado MIDI · 7 fábrica · 8 protección."],
    pitch:["Pitch","Dobla la afinación. Vuelve sola al centro. Cuánto dobla: PITCH, perilla 4 (BEND RANGE).",null],
    mod:["Mod","Hacia adelante: modulación (vibrato, filtro… según el programa).",null],
    kb:["Teclado","37 teclas chicas, sensibles a la fuerza. Polifonía: 4 notas a la vez.",null]
  };

  var root = null;
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function btn(id, html, cls){
    var b = el("button","mk-k "+(cls||""), html);
    b.type="button"; b.dataset.k=id; b.setAttribute("aria-label", NOMBRES[id]||id);
    return b;
  }
  function led(lab, c){ return '<span class="mk-led"><i class="'+(c||"")+'"></i>'+lab+'</span>'; }

  function render(cont){
    if(!document.getElementById("mk-css")){ var st=el("style"); st.id="mk-css"; st.textContent=CSS; document.head.appendChild(st); }
    cont.classList.add("mk");
    var p = el("div","mk-p"); p.setAttribute("role","group"); p.setAttribute("aria-label","Panel del microKORG");
    var top = el("div","mk-top");

    /* ---- izquierda: volume, arpeggiator, octave ---- */
    var a = el("div","mk-col");
    a.appendChild(el("div","mk-hd","Volume"));
    var v = el("div","mk-cen"); var vk = btn("vol","","knob"); vk.style.width="62%"; v.appendChild(vk); a.appendChild(v);
    a.appendChild(el("div","mk-hd","Arpeggiator"));
    var ar = el("div","mk-pair"); var tl = el("div","mk-cen",led("Tempo","r")); tl.dataset.k="tempo"; tl.style.cursor="pointer"; ar.appendChild(tl);
    var ab = el("div","mk-cen"); ab.appendChild(el("span","mk-lab","On/Off")); ab.appendChild(btn("arp","")); ar.appendChild(ab);
    a.appendChild(ar);
    a.appendChild(el("div","mk-hd","Octave shift"));
    var oc = el("div","mk-pair");
    var od = el("div","mk-cen"); od.appendChild(el("span","mk-lab","Down")); od.appendChild(btn("octd","")); od.lastChild.style.width="100%";
    var ou = el("div","mk-cen"); ou.appendChild(el("span","mk-lab","Up")); ou.appendChild(btn("octu","")); ou.lastChild.style.width="100%";
    oc.appendChild(od); oc.appendChild(ou); a.appendChild(oc);
    top.appendChild(a);

    /* ---- program select ---- */
    var b = el("div","mk-col");
    b.appendChild(el("div","mk-hd","Program select"));
    var ps = el("div","mk-ps");
    var bl = el("div","mk-bl");
    [3,2,1,0].forEach(function(n){ var s = el("span","",BANCOS[n]); s.dataset.k="bank:"+BANCOS[n]; bl.appendChild(s); });
    ps.appendChild(bl);
    ps.appendChild(btn("bank","","dial"));
    var br = el("div","mk-bl r");
    [4,5,6,7].forEach(function(n){ var s = el("span", n===7?"voc":"", BANCOS[n]); s.dataset.k="bank:"+BANCOS[n]; br.appendChild(s); });
    ps.appendChild(br);
    b.appendChild(ps);
    var sd = el("div","mk-pair"); sd.style.alignItems="end";
    var au = el("div","mk-cen",'<span class="mk-lab" style="color:#7fd08a">Audio in</span>'+led("1")+led("2")); au.dataset.k="audio"; au.style.cursor="pointer";
    var si = el("div","mk-side"); si.appendChild(el("span","mk-lab",'A&nbsp;&nbsp;Side&nbsp;&nbsp;B <span class="mk-led" id="mk-sideled"><i></i></span>')); si.appendChild(btn("side","")); si.lastChild.style.width="55%";
    sd.appendChild(au); sd.appendChild(si);
    b.appendChild(sd);
    top.appendChild(b);

    /* ---- display, write, shift ---- */
    var c = el("div","mk-col");
    var scr = el("div","mk-scr","A.11"); scr.dataset.k="disp"; scr.tabIndex=0; scr.setAttribute("role","button"); scr.id="mk-scr";
    c.appendChild(scr);
    var ws = el("div","mk-pair");
    var w1 = el("div","mk-cen"); w1.appendChild(el("span","mk-lab","Write")); w1.appendChild(btn("write","")); w1.lastChild.style.width="100%";
    var w2 = el("div","mk-cen"); w2.appendChild(el("span","mk-lab","Shift")); w2.appendChild(btn("shift","")); w2.lastChild.style.width="100%";
    ws.appendChild(w1); ws.appendChild(w2); c.appendChild(ws);
    top.appendChild(c);

    /* ---- edit select + perillas + grilla ---- */
    var d = el("div","mk-col");
    var ed = el("div",""); ed.style.display="grid"; ed.style.gridTemplateColumns="minmax(0,11fr) minmax(0,40fr)"; ed.style.gap="1em";
    var esc = el("div","mk-col"); esc.style.gap=".7em";
    esc.appendChild(el("div","mk-hd","Edit select"));
    var ts = el("div","mk-ts");
    ts.appendChild(btn("tsel",'<span style="font-size:.7em;line-height:1.1">Formant hold<br>Timbre sel.</span>'));
    var tsl = el("div","mk-cen",led("1","r")+led("2")); ts.appendChild(tsl);
    esc.appendChild(ts);
    var ovw = el("div","mk-cen",led("Original value")); ovw.dataset.k="ov"; ovw.style.cursor="pointer"; ovw.id="mk-ov"; esc.appendChild(ovw);
    [1,2].forEach(function(n){
      var e = el("div","mk-es"); e.appendChild(el("span","mk-lab","Edit select "+n));
      e.appendChild(btn("es"+n,"","dial")); var cur = el("span","cur",""); cur.id="mk-cur"+n; e.appendChild(cur);
      esc.appendChild(e);
    });
    ed.appendChild(esc);

    var kg = el("div","");
    var kn = el("div","mk-kn"); kn.appendChild(el("span",""));
    for(var n=1;n<=5;n++){
      var cc = el("div","mk-cen"); cc.appendChild(el("div","mk-hd",n+"/"+PERF[n-1])); cc.lastChild.style.width="100%";
      cc.appendChild(btn("k"+n,"","knob")); kn.appendChild(cc);
    }
    kg.appendChild(kn);
    var g = el("div","mk-grid");
    function mitad(num, rows){
      g.appendChild(el("div","hd",'<i id="mk-l'+num+'"></i>'+num+' · Synth'));
      rows.forEach(function(r){
        var s = el("div","sec",r[0]); s.dataset.k="es"+num+":"+r[0]; s.dataset.row=r[0]; g.appendChild(s);
        r[1].forEach(function(t, j){
          var x = el("div","c",t); x.dataset.row=r[0];
          if(t){ x.dataset.k="g:"+r[0]+":"+(j+1); x.title=t; }
          g.appendChild(x);
        });
      });
    }
    mitad(1, GRID1); mitad(2, GRID2);
    kg.appendChild(g);
    ed.appendChild(kg);
    d.appendChild(ed);
    top.appendChild(d);
    p.appendChild(top);

    /* ---- ruedas + teclado ---- */
    var bot = el("div","mk-bot");
    var wh = el("div","mk-wh"); wh.appendChild(btn("pitch","Pitch")); wh.appendChild(btn("mod","Mod")); bot.appendChild(wh);
    var kb = el("div","mk-kb"); kb.dataset.k="kb"; kb.setAttribute("role","button"); kb.setAttribute("aria-label","Teclado"); kb.tabIndex=0;
    var WH = 22; for(n=0;n<WH;n++) kb.appendChild(el("div","w"));
    var NEG = [0,1,3,4,5];
    for(n=0;n<WH-1;n++){
      if(NEG.indexOf(n%7) > -1){
        var bk = el("div","b"); bk.style.left = ((n+1)/WH*100 - 1.3)+"%"; bk.style.width = "2.6%"; kb.appendChild(bk);
      }
    }
    bot.appendChild(kb);
    p.appendChild(bot);

    cont.innerHTML=""; cont.appendChild(p);
    root = p;
    luces(0);
    return p;
  }

  /* las luces 1 y 2 de la grilla: 0 = las dos (performance edit) */
  function luces(n){
    if(!root) return;
    var l1 = root.querySelector("#mk-l1"), l2 = root.querySelector("#mk-l2");
    l1.className = (n===0||n===1) ? "r" : ""; l2.className = (n===0||n===2) ? "r" : "";
  }

  function pantalla(t){
    var s = root && root.querySelector("#mk-scr"); if(!s) return;
    s.textContent = t;
    if(/^[Ab]\.\d\d$/.test(t)) root.querySelector("#mk-sideled i").className = t.charAt(0) === "b" ? "r" : "";
  }

  function limpiar(){
    root.querySelectorAll(".on").forEach(function(b){ b.classList.remove("on"); });
    root.querySelectorAll(".row-on").forEach(function(b){ b.classList.remove("row-on"); });
    root.querySelectorAll(".mk-bl .sel").forEach(function(b){ b.classList.remove("sel"); });
    root.querySelectorAll(".mk-b").forEach(function(b){ b.remove(); });
    root.querySelector("#mk-cur1").textContent = ""; root.querySelector("#mk-cur2").textContent = "";
    luces(0);
  }
  function fila(sec){
    root.querySelectorAll('.mk-grid [data-row="'+sec+'"]').forEach(function(x){ x.classList.add("row-on"); });
    var n = DE[sec]; root.querySelector("#mk-cur"+n).textContent = sec; luces(n);
  }
  function badge(b, n, h){
    var ya = b.querySelector(".mk-b");
    var nums = ya ? ya.dataset.n.split(",").filter(Boolean) : [];
    if(n) nums.push(n);
    h = h || (ya && ya.dataset.h === "1");
    var t = nums.join(" · ") + (h ? (nums.length ? " · " : "") + "mantené" : "");
    if(!ya){ b.style.position = b.style.position || "relative"; ya = el("span","mk-b"); b.appendChild(ya); }
    ya.className = "mk-b" + (h ? " h" : ""); ya.dataset.n = nums.join(","); ya.dataset.h = h ? "1" : ""; ya.textContent = t;
  }

  // lista: ver arriba. pant: texto opcional para el display
  function marcar(lista, pant){
    if(!root) return;
    limpiar();
    if(pant) pantalla(pant);
    if(!lista || !lista.length) return;
    var n = 0, varios = lista.length > 1;
    lista.forEach(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      var b = null;
      if(id.indexOf("bank:") === 0){
        b = root.querySelector('[data-k="bank"]');
        var s = root.querySelector('[data-k="'+id+'"]'); if(s) s.classList.add("sel");
      } else if(/^es[12]:/.test(id)){
        b = root.querySelector('[data-k="'+id.slice(0,3)+'"]'); fila(id.slice(4));
      } else if(id.indexOf("g:") === 0){
        var pz = id.split(":"); fila(pz[1]);
        var cel = root.querySelector('[data-k="'+id+'"]'); if(cel) cel.classList.add("on");
        b = root.querySelector('[data-k="k'+pz[2]+'"]');
      } else {
        b = root.querySelector('[data-k="'+id+'"]');
      }
      if(!b) return;
      n++;
      b.classList.add("on");
      if(varios || h) badge(b, varios ? String(n) : "", h);
    });
  }

  function texto(lista){
    return lista.map(function(it){
      var id = Array.isArray(it) ? it[0] : it, h = Array.isArray(it) && it[1] === "h";
      if(id.indexOf("bank:") === 0) return "girá PROGRAM SELECT a "+id.slice(5);
      if(/^es[12]:/.test(id)) return "girá EDIT SELECT "+id.charAt(2)+" a "+id.slice(4);
      if(id.indexOf("g:") === 0){ var pz = id.split(":"); return "girá la perilla "+pz[2]+" ("+params(pz[1])[pz[2]-1]+")"; }
      var verbo = h ? "mantené " : /^(k\d|vol)$/.test(id) ? "girá " : /^(pitch|mod)$/.test(id) ? "mové " : id === "kb" ? "tocá " : "tocá ";
      return verbo + (NOMBRES[id]||id);
    }).join(" → ");
  }

  function info(id){
    if(/^k\d$/.test(id)) return INFO.perf;
    if(/^n\d$/.test(id)) return INFO.num;
    if(id.indexOf("bank:") === 0){
      var bn = id.slice(5), i = BANCOS.indexOf(bn);
      return [bn, "Banco "+(i+1)+": programas A."+(i+1)+"1 a A."+(i+1)+"8 y b."+(i+1)+"1 a b."+(i+1)+"8."+(bn==="VOCODER"?" Son los programas de vocoder: necesitan el micrófono.":""), null];
    }
    if(/^es[12]:/.test(id)){
      var sec = id.slice(4), ps = params(sec);
      return [sec, "Con EDIT SELECT "+id.charAt(2)+" en "+sec+", las perillas editan: "+ps.map(function(t,j){ return t ? (j+1)+" "+t : null; }).filter(Boolean).join(" · ")+".", null];
    }
    if(id.indexOf("g:") === 0){
      var pz = id.split(":"), key = /^PATCH/.test(pz[1]) ? "PATCH:"+pz[2] : pz[1]+":"+pz[2], d = P[key];
      var nom = params(pz[1])[pz[2]-1];
      return [pz[1]+" · "+nom, (d ? d[1] : ""), "EDIT SELECT "+DE[pz[1]]+" en "+pz[1]+", perilla "+pz[2]+(d ? ". Valores: "+d[0] : "")];
    }
    return INFO[id];
  }

  window.MKPanel = { render:render, marcar:marcar, texto:texto, info:info, pantalla:pantalla, nombres:NOMBRES, GRID1:GRID1, GRID2:GRID2, P:P, BANCOS:BANCOS };
})();
