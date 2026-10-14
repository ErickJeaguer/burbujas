/**
 * BURBUJAS SONORAS: CONCIENCIA FONOLÓGICA
 * Módulo de Datos, Misiones, SVGs Vectoriales y Pre-carga de Imágenes
 */

window.Game = window.Game || {};

(function () {
  'use strict';

  // SVG Helper: Genera SVG limpio con viewBox 0 0 100 100
  const wrapSvg = (content) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${content}</svg>`;

  // Banco de SVGs Vectoriales Ilustrados de Alta Calidad (Cero Emojis)
  const ITEM_SVGS = {
    // --- MUNDO 1: ANIMALES Y ONOMATOPEYAS ---
    vaca: wrapSvg(`
      <ellipse cx="50" cy="55" rx="36" ry="30" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
      <path d="M28 35 Q35 48 24 58 Q18 45 28 35 Z" fill="#1e293b"/>
      <path d="M66 38 Q78 45 74 62 Q60 55 66 38 Z" fill="#1e293b"/>
      <ellipse cx="50" cy="65" rx="24" ry="16" fill="#fbcfe8" stroke="#f472b6" stroke-width="2"/>
      <ellipse cx="42" cy="65" rx="3.5" ry="5" fill="#475569"/>
      <ellipse cx="58" cy="65" rx="3.5" ry="5" fill="#475569"/>
      <!-- Ojos -->
      <circle cx="37" cy="45" r="5" fill="#0f172a"/>
      <circle cx="63" cy="45" r="5" fill="#0f172a"/>
      <circle cx="39" cy="43" r="2" fill="#ffffff"/>
      <circle cx="65" cy="43" r="2" fill="#ffffff"/>
      <!-- Cuernitos -->
      <path d="M28 30 Q22 18 18 20 Q22 28 30 32 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <path d="M72 30 Q78 18 82 20 Q78 28 70 32 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <!-- Orejas -->
      <ellipse cx="18" cy="40" rx="9" ry="5" fill="#f8fafc" stroke="#334155" stroke-width="2" transform="rotate(-25 18 40)"/>
      <ellipse cx="82" cy="40" rx="9" ry="5" fill="#f8fafc" stroke="#334155" stroke-width="2" transform="rotate(25 82 40)"/>
    `),

    perro: wrapSvg(`
      <ellipse cx="50" cy="52" rx="34" ry="32" fill="#d97706" stroke="#92400e" stroke-width="3"/>
      <!-- Orejas caídas -->
      <path d="M18 30 C8 45 12 70 24 68 C30 65 28 45 24 32 Z" fill="#92400e"/>
      <path d="M82 30 C92 45 88 70 76 68 C70 65 72 45 76 32 Z" fill="#92400e"/>
      <!-- Hocico -->
      <ellipse cx="50" cy="62" rx="20" ry="15" fill="#fef3c7"/>
      <path d="M44 55 Q50 51 56 55 Q50 63 44 55 Z" fill="#1e293b"/>
      <path d="M50 60 L50 67 Q44 71 40 67 M50 67 Q56 71 60 67" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Lengüita -->
      <path d="M47 67 Q50 78 54 67 Z" fill="#f43f5e"/>
      <!-- Ojos -->
      <circle cx="36" cy="44" r="5.5" fill="#1e293b"/>
      <circle cx="64" cy="44" r="5.5" fill="#1e293b"/>
      <circle cx="38" cy="42" r="2.2" fill="#ffffff"/>
      <circle cx="66" cy="42" r="2.2" fill="#ffffff"/>
      <circle cx="28" cy="50" r="4" fill="#fbbf24" opacity="0.6"/>
      <circle cx="72" cy="50" r="4" fill="#fbbf24" opacity="0.6"/>
    `),

    gato: wrapSvg(`
      <!-- Orejas -->
      <polygon points="20,40 32,15 45,35" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/>
      <polygon points="24,37 32,22 41,35" fill="#fecdd3"/>
      <polygon points="80,40 68,15 55,35" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/>
      <polygon points="76,37 68,22 59,35" fill="#fecdd3"/>
      <!-- Cara -->
      <circle cx="50" cy="54" r="32" fill="#fb923c" stroke="#c2410c" stroke-width="3"/>
      <!-- Ojos verdes alegres -->
      <ellipse cx="36" cy="48" rx="6" ry="8" fill="#22c55e"/>
      <ellipse cx="64" cy="48" rx="6" ry="8" fill="#22c55e"/>
      <ellipse cx="36" cy="48" rx="2.5" ry="6" fill="#0f172a"/>
      <ellipse cx="64" cy="48" rx="2.5" ry="6" fill="#0f172a"/>
      <circle cx="38" cy="45" r="1.8" fill="#ffffff"/>
      <circle cx="66" cy="45" r="1.8" fill="#ffffff"/>
      <!-- Nariz y boca -->
      <polygon points="46,58 54,58 50,63" fill="#f43f5e"/>
      <path d="M50 63 Q44 68 40 65 M50 63 Q56 68 60 65" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Bigotes -->
      <line x1="22" y1="58" x2="36" y2="60" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="65" x2="36" y2="64" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
      <line x1="78" y1="58" x2="64" y2="60" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
      <line x1="80" y1="65" x2="64" y2="64" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
    `),

    pato: wrapSvg(`
      <!-- Cuerpo -->
      <ellipse cx="50" cy="58" rx="32" ry="26" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="50" cy="38" r="22" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
      <!-- Mechón -->
      <path d="M48 16 Q54 10 52 18 Q58 12 55 20" stroke="#ca8a04" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Ojos -->
      <circle cx="42" cy="34" r="5" fill="#1e293b"/>
      <circle cx="44" cy="32" r="2" fill="#ffffff"/>
      <circle cx="58" cy="34" r="5" fill="#1e293b"/>
      <circle cx="60" cy="32" r="2" fill="#ffffff"/>
      <!-- Pico simpático -->
      <ellipse cx="50" cy="46" rx="14" ry="7" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
      <circle cx="46" cy="45" r="1.5" fill="#7c2d12"/>
      <circle cx="54" cy="45" r="1.5" fill="#7c2d12"/>
      <!-- Cachetes -->
      <circle cx="34" cy="42" r="4" fill="#f87171" opacity="0.5"/>
      <circle cx="66" cy="42" r="4" fill="#f87171" opacity="0.5"/>
    `),

    rana: wrapSvg(`
      <!-- Cabeza y ojos saltones -->
      <circle cx="32" cy="32" r="14" fill="#4ade80" stroke="#16a34a" stroke-width="3"/>
      <circle cx="68" cy="32" r="14" fill="#4ade80" stroke="#16a34a" stroke-width="3"/>
      <ellipse cx="50" cy="54" rx="38" ry="28" fill="#4ade80" stroke="#16a34a" stroke-width="3"/>
      <ellipse cx="50" cy="62" rx="24" ry="16" fill="#bbf7d0"/>
      <!-- Pupilas -->
      <circle cx="34" cy="30" r="7" fill="#0f172a"/>
      <circle cx="36" cy="27" r="2.8" fill="#ffffff"/>
      <circle cx="66" cy="30" r="7" fill="#0f172a"/>
      <circle cx="68" cy="27" r="2.8" fill="#ffffff"/>
      <!-- Sonrisa enorme -->
      <path d="M26 54 Q50 74 74 54" stroke="#166534" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Chapitas -->
      <circle cx="24" cy="54" r="5" fill="#fb7185" opacity="0.6"/>
      <circle cx="76" cy="54" r="5" fill="#fb7185" opacity="0.6"/>
    `),

    oveja: wrapSvg(`
      <!-- Lana esponjosa -->
      <circle cx="32" cy="40" r="16" fill="#f8fafc"/>
      <circle cx="68" cy="40" r="16" fill="#f8fafc"/>
      <circle cx="50" cy="32" r="17" fill="#f8fafc"/>
      <circle cx="28" cy="60" r="16" fill="#f8fafc"/>
      <circle cx="72" cy="60" r="16" fill="#f8fafc"/>
      <circle cx="50" cy="68" r="17" fill="#f8fafc"/>
      <circle cx="50" cy="50" r="24" fill="#f8fafc"/>
      <!-- Orejitas -->
      <ellipse cx="20" cy="46" rx="9" ry="5" fill="#fed7aa" stroke="#78350f" stroke-width="2" transform="rotate(-20 20 46)"/>
      <ellipse cx="80" cy="46" rx="9" ry="5" fill="#fed7aa" stroke="#78350f" stroke-width="2" transform="rotate(20 80 46)"/>
      <!-- Carita -->
      <ellipse cx="50" cy="52" rx="19" ry="17" fill="#ffedd5" stroke="#9a3412" stroke-width="2"/>
      <circle cx="43" cy="49" r="3.5" fill="#0f172a"/>
      <circle cx="57" cy="49" r="3.5" fill="#0f172a"/>
      <circle cx="44" cy="47" r="1.3" fill="#ffffff"/>
      <circle cx="58" cy="47" r="1.3" fill="#ffffff"/>
      <path d="M47 57 Q50 61 53 57" stroke="#9a3412" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `),

    // --- MUNDO 2: VOCALES (A, E, I, O, U) ---
    abeja: wrapSvg(`
      <!-- Alas celestes -->
      <ellipse cx="38" cy="28" rx="14" ry="19" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" opacity="0.85" transform="rotate(-25 38 28)"/>
      <ellipse cx="62" cy="28" rx="14" ry="19" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" opacity="0.85" transform="rotate(25 62 28)"/>
      <!-- Cuerpo con rayas -->
      <ellipse cx="50" cy="58" rx="26" ry="22" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
      <!-- Rayas negras -->
      <path d="M42 37 Q46 58 42 79 M56 37 Q60 58 56 79" stroke="#1e293b" stroke-width="6" fill="none"/>
      <!-- Aguijón -->
      <polygon points="76,58 84,55 84,61" fill="#1e293b"/>
      <!-- Cara y ojos -->
      <circle cx="34" cy="54" r="4.5" fill="#1e293b"/>
      <circle cx="36" cy="52" r="1.8" fill="#ffffff"/>
      <path d="M28 62 Q32 67 36 62" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="58" r="3" fill="#fb7185" opacity="0.7"/>
      <!-- Antenas -->
      <path d="M30 40 Q24 28 20 30 M38 38 Q36 26 32 25" stroke="#1e293b" stroke-width="2.5" fill="none"/>
      <circle cx="20" cy="30" r="3" fill="#f43f5e"/>
      <circle cx="32" cy="25" r="3" fill="#f43f5e"/>
    `),

    avion: wrapSvg(`
      <!-- Cuerpo avión -->
      <ellipse cx="50" cy="50" rx="38" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
      <ellipse cx="78" cy="50" rx="10" ry="13" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
      <!-- Alas -->
      <polygon points="44,50 32,20 54,50" fill="#f43f5e" stroke="#be123c" stroke-width="2.5"/>
      <polygon points="44,50 32,80 54,50" fill="#f43f5e" stroke="#be123c" stroke-width="2.5"/>
      <!-- Cola -->
      <polygon points="16,50 10,32 26,50" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <!-- Ventanas -->
      <circle cx="48" cy="50" r="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8"/>
      <circle cx="62" cy="50" r="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8"/>
    `),

    arbol: wrapSvg(`
      <!-- Tronco -->
      <path d="M44 55 L42 85 Q50 88 58 85 L56 55 Z" fill="#92400e" stroke="#713f12" stroke-width="3"/>
      <!-- Copa frondosa -->
      <circle cx="35" cy="46" r="22" fill="#22c55e"/>
      <circle cx="65" cy="46" r="22" fill="#22c55e"/>
      <circle cx="50" cy="30" r="24" fill="#4ade80"/>
      <!-- Manzanas rojas -->
      <circle cx="38" cy="34" r="5" fill="#ef4444"/>
      <circle cx="60" cy="36" r="5" fill="#ef4444"/>
      <circle cx="48" cy="48" r="5" fill="#ef4444"/>
    `),

    elefante: wrapSvg(`
      <!-- Oreja grande -->
      <ellipse cx="32" cy="45" rx="18" ry="24" fill="#93c5fd" stroke="#1d4ed8" stroke-width="3"/>
      <!-- Cabeza y cuerpo -->
      <circle cx="56" cy="50" r="28" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3"/>
      <!-- Trompa hacia arriba -->
      <path d="M68 56 Q85 62 82 42 Q80 34 86 32" stroke="#60a5fa" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M68 56 Q85 62 82 42 Q80 34 86 32" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Ojo feliz -->
      <circle cx="60" cy="42" r="4.5" fill="#0f172a"/>
      <circle cx="62" cy="40" r="1.8" fill="#ffffff"/>
      <!-- Colmillo simpático -->
      <path d="M68 58 Q72 63 76 56" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="56" r="4" fill="#fb7185" opacity="0.6"/>
    `),

    estrella: wrapSvg(`
      <polygon points="50,12 61,36 88,38 67,56 73,82 50,68 27,82 33,56 12,38 39,36"
               fill="#fbbf24" stroke="#d97706" stroke-width="3" stroke-linejoin="round"/>
      <!-- Brillo central -->
      <polygon points="50,22 57,39 76,40 61,53 65,72 50,61 35,72 39,53 24,40 43,39"
               fill="#fef08a" opacity="0.7"/>
      <!-- Carita tierna -->
      <circle cx="43" cy="48" r="3.5" fill="#78350f"/>
      <circle cx="57" cy="48" r="3.5" fill="#78350f"/>
      <path d="M46 56 Q50 60 54 56" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `),

    erizo: wrapSvg(`
      <!-- Espinas -->
      <path d="M22 62 Q15 45 30 35 Q30 20 48 22 Q60 16 72 28 Q86 32 82 50 Q86 64 74 68 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
      <!-- Cuerpo / Cara -->
      <ellipse cx="44" cy="56" rx="22" ry="18" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>
      <circle cx="24" cy="58" r="4" fill="#1e293b"/>
      <!-- Ojo y mejilla -->
      <circle cx="36" cy="52" r="3.5" fill="#1e293b"/>
      <circle cx="37" cy="50" r="1.3" fill="#ffffff"/>
      <circle cx="42" cy="58" r="3" fill="#f43f5e" opacity="0.6"/>
      <path d="M28 62 Q34 66 38 62" stroke="#c2410c" stroke-width="2" fill="none"/>
    `),

    isla: wrapSvg(`
      <!-- Agua base -->
      <ellipse cx="50" cy="76" rx="42" ry="12" fill="#38bdf8" opacity="0.6"/>
      <!-- Arena -->
      <ellipse cx="50" cy="72" rx="36" ry="13" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
      <!-- Palmera tronco -->
      <path d="M52 70 Q62 48 52 28" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Hojas palmera -->
      <path d="M52 28 Q32 20 22 34 M52 28 Q44 14 36 12 M52 28 Q68 14 78 22 M52 28 Q74 30 76 42 M52 28 Q56 10 52 8" stroke="#16a34a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <!-- Coco -->
      <circle cx="50" cy="31" r="3.5" fill="#713f12"/>
      <circle cx="55" cy="32" r="3.5" fill="#713f12"/>
    `),

    iguana: wrapSvg(`
      <!-- Cuerpo iguana -->
      <ellipse cx="52" cy="52" rx="32" ry="20" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
      <path d="M78 52 Q88 44 86 36 Q74 36 68 44" fill="#16a34a"/>
      <!-- Cresta -->
      <path d="M30 40 L34 32 L38 40 L44 30 L48 40 L54 32 L58 40" stroke="#facc15" stroke-width="3" fill="none" stroke-linejoin="round"/>
      <!-- Ojo saliente -->
      <circle cx="34" cy="46" r="6" fill="#fef08a" stroke="#15803d" stroke-width="2"/>
      <circle cx="34" cy="46" r="3" fill="#0f172a"/>
      <path d="M24 56 Q32 60 40 56" stroke="#15803d" stroke-width="2.5" fill="none"/>
    `),

    iman: wrapSvg(`
      <!-- Herradura U -->
      <path d="M26 30 L26 56 C26 74 74 74 74 56 L74 30" stroke="#ef4444" stroke-width="14" fill="none" stroke-linecap="square"/>
      <!-- Polos plateados -->
      <path d="M26 26 L26 36" stroke="#e2e8f0" stroke-width="14" fill="none"/>
      <path d="M74 26 L74 36" stroke="#e2e8f0" stroke-width="14" fill="none"/>
      <!-- Rayos magnéticos -->
      <path d="M20 18 Q26 12 32 18 M68 18 Q74 12 80 18" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    oso: wrapSvg(`
      <!-- Orejas -->
      <circle cx="28" cy="28" r="13" fill="#92400e" stroke="#713f12" stroke-width="3"/>
      <circle cx="28" cy="28" r="7" fill="#fde68a"/>
      <circle cx="72" cy="28" r="13" fill="#92400e" stroke="#713f12" stroke-width="3"/>
      <circle cx="72" cy="28" r="7" fill="#fde68a"/>
      <!-- Cara -->
      <circle cx="50" cy="54" r="33" fill="#b45309" stroke="#713f12" stroke-width="3"/>
      <!-- Hocico -->
      <ellipse cx="50" cy="62" rx="17" ry="13" fill="#fef3c7"/>
      <ellipse cx="50" cy="57" rx="7" ry="5" fill="#1e293b"/>
      <path d="M50 62 L50 68 Q46 72 42 68 M50 68 Q54 72 58 68" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Ojos -->
      <circle cx="38" cy="46" r="4.5" fill="#1e293b"/>
      <circle cx="62" cy="46" r="4.5" fill="#1e293b"/>
      <circle cx="39.5" cy="44.5" r="1.8" fill="#ffffff"/>
      <circle cx="63.5" cy="44.5" r="1.8" fill="#ffffff"/>
    `),

    ojo: wrapSvg(`
      <!-- Forma ojo -->
      <path d="M14 50 Q50 18 86 50 Q50 82 14 50 Z" fill="#ffffff" stroke="#38bdf8" stroke-width="4"/>
      <!-- Iris celeste -->
      <circle cx="50" cy="50" r="19" fill="#0284c7"/>
      <!-- Pupila -->
      <circle cx="50" cy="50" r="11" fill="#0f172a"/>
      <!-- Brillos -->
      <circle cx="55" cy="45" r="4.5" fill="#ffffff"/>
      <circle cx="44" cy="55" r="2.2" fill="#ffffff"/>
    `),

    uva: wrapSvg(`
      <!-- Tallo y hoja -->
      <path d="M50 14 Q54 26 48 34" stroke="#713f12" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M50 20 Q66 12 70 24 Q56 28 50 20 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <!-- Racimo de uvas moradas -->
      <circle cx="40" cy="38" r="10" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="60" cy="38" r="10" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="50" cy="46" r="10" fill="#c084fc" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="34" cy="54" r="10" fill="#9333ea" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="66" cy="54" r="10" fill="#9333ea" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="50" cy="62" r="10" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
      <circle cx="42" cy="74" r="9" fill="#7e22ce" stroke="#581c87" stroke-width="2"/>
      <circle cx="58" cy="74" r="9" fill="#7e22ce" stroke="#581c87" stroke-width="2"/>
      <circle cx="50" cy="85" r="8" fill="#6b21a8" stroke="#581c87" stroke-width="2"/>
    `),

    unicornio: wrapSvg(`
      <!-- Cuerno dorado espiral -->
      <polygon points="58,10 52,32 64,30" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <line x1="54" y1="24" x2="62" y2="20" stroke="#ca8a04" stroke-width="2"/>
      <line x1="53" y1="18" x2="59" y2="15" stroke="#ca8a04" stroke-width="2"/>
      <!-- Crin arcoíris -->
      <path d="M38 32 Q22 45 28 65 Q18 52 30 35" fill="#f43f5e"/>
      <path d="M30 45 Q16 58 22 75 Q14 62 24 48" fill="#38bdf8"/>
      <path d="M26 55 Q12 70 20 85 Q10 72 20 58" fill="#fbbf24"/>
      <!-- Cabeza blanca -->
      <path d="M42 32 C54 28 66 32 74 44 C82 56 74 72 62 74 C50 76 40 68 38 52 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Ojo soñador -->
      <path d="M56 48 Q62 54 68 48" stroke="#7c3aed" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="68" cy="60" r="4" fill="#f472b6" opacity="0.6"/>
    `),

    uno: wrapSvg(`
      <!-- Número 1 animado -->
      <path d="M36 40 L50 24 L50 82 M32 82 L68 82" stroke="#ec4899" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="48" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="48" cy="38" r="1.8" fill="#0f172a"/>
    `),

    // --- MUNDO 3: SÍLABAS (MA, PA, SO, CA) ---
    manzana: wrapSvg(`
      <!-- Tallo y hoja -->
      <path d="M50 20 Q55 10 52 6" stroke="#713f12" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M52 14 Q66 8 68 18 Q58 20 52 14 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <!-- Manzana roja jugosa -->
      <path d="M50 28 C34 16 16 28 18 52 C20 74 38 86 50 84 C62 86 80 74 82 52 C84 28 66 16 50 28 Z"
            fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
      <path d="M28 38 Q34 32 40 34" stroke="#fca5a5" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    mariposa: wrapSvg(`
      <!-- Alas superiores -->
      <path d="M50 48 Q20 15 15 38 Q10 58 50 56" fill="#a855f7" stroke="#6b21a8" stroke-width="2.5"/>
      <path d="M50 48 Q80 15 85 38 Q90 58 50 56" fill="#a855f7" stroke="#6b21a8" stroke-width="2.5"/>
      <!-- Alas inferiores -->
      <path d="M50 56 Q25 65 25 80 Q40 88 50 64" fill="#ec4899" stroke="#be185d" stroke-width="2.5"/>
      <path d="M50 56 Q75 65 75 80 Q60 88 50 64" fill="#ec4899" stroke="#be185d" stroke-width="2.5"/>
      <!-- Lunares en alas -->
      <circle cx="28" cy="40" r="5" fill="#fde047"/>
      <circle cx="72" cy="40" r="5" fill="#fde047"/>
      <!-- Cuerpo -->
      <ellipse cx="50" cy="54" rx="4" ry="20" fill="#1e293b"/>
      <!-- Antenas -->
      <path d="M48 35 Q40 22 36 24 M52 35 Q60 22 64 24" stroke="#1e293b" stroke-width="2" fill="none"/>
    `),

    mano: wrapSvg(`
      <!-- Mano abierta saludando -->
      <path d="M30 52 L30 40 C30 36 36 36 36 40 L36 48
               M36 44 L36 30 C36 26 42 26 42 30 L42 48
               M42 45 L42 26 C42 22 48 22 48 26 L48 48
               M48 46 L48 34 C48 30 54 30 54 34 L54 56
               C54 72 46 82 38 82 C30 82 22 72 22 62 L22 55
               C22 50 30 48 30 52 Z"
            fill="#fed7aa" stroke="#ea580c" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="34" cy="62" r="3" fill="#f43f5e" opacity="0.5"/>
    `),

    payaso: wrapSvg(`
      <!-- Sombrero con pompón -->
      <polygon points="50,10 32,32 68,32" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5"/>
      <circle cx="50" cy="8" r="5" fill="#facc15"/>
      <!-- Cabello rizado -->
      <circle cx="24" cy="48" r="10" fill="#f97316"/>
      <circle cx="76" cy="48" r="10" fill="#f97316"/>
      <!-- Cara -->
      <circle cx="50" cy="52" r="26" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Nariz roja grande -->
      <circle cx="50" cy="52" r="7.5" fill="#ef4444"/>
      <!-- Ojos pintados -->
      <path d="M38 40 L38 46 M62 40 L62 46" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      <!-- Gran sonrisa -->
      <path d="M34 60 Q50 76 66 60" stroke="#ef4444" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Cuello con volantes -->
      <path d="M30 76 Q40 86 50 76 Q60 86 70 76" stroke="#ec4899" stroke-width="5" fill="none"/>
    `),

    pan: wrapSvg(`
      <!-- Barra de pan crujiente -->
      <ellipse cx="50" cy="54" rx="38" ry="22" fill="#d97706" stroke="#78350f" stroke-width="3.5"/>
      <ellipse cx="50" cy="50" rx="34" ry="16" fill="#fde68a" opacity="0.6"/>
      <!-- Cortes del panadero -->
      <line x1="36" y1="44" x2="42" y2="58" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <line x1="48" y1="42" x2="54" y2="60" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="44" x2="66" y2="58" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    `),

    sol: wrapSvg(`
      <!-- Rayos del sol -->
      <g stroke="#f59e0b" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="12" x2="50" y2="20"/>
        <line x1="50" y1="80" x2="50" y2="88"/>
        <line x1="12" y1="50" x2="20" y2="50"/>
        <line x1="80" y1="50" x2="88" y2="50"/>
        <line x1="23" y1="23" x2="29" y2="29"/>
        <line x1="71" y1="71" x2="77" y2="77"/>
        <line x1="23" y1="77" x2="29" y2="71"/>
        <line x1="71" y1="29" x2="77" y2="23"/>
      </g>
      <!-- Disco solar -->
      <circle cx="50" cy="50" r="26" fill="#fde047" stroke="#f59e0b" stroke-width="3"/>
      <!-- Carita sonriente -->
      <circle cx="41" cy="46" r="3.5" fill="#78350f"/>
      <circle cx="59" cy="46" r="3.5" fill="#78350f"/>
      <circle cx="34" cy="52" r="3" fill="#f87171" opacity="0.6"/>
      <circle cx="66" cy="52" r="3" fill="#f87171" opacity="0.6"/>
      <path d="M43 54 Q50 62 57 54" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `),

    sopa: wrapSvg(`
      <!-- Tazón de sopa humeante -->
      <path d="M22 46 C22 72 78 72 78 46 Z" fill="#fb923c" stroke="#c2410c" stroke-width="3"/>
      <ellipse cx="50" cy="46" rx="28" ry="8" fill="#fef08a" stroke="#c2410c" stroke-width="2"/>
      <!-- Vapor -->
      <path d="M42 36 Q38 24 44 14 M50 34 Q54 22 48 12 M58 36 Q62 24 56 14"
            stroke="#94a3b8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.75"/>
    `),

    sombrero: wrapSvg(`
      <!-- Copa sombrero -->
      <path d="M36 46 L40 22 C40 16 60 16 60 22 L64 46 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      <!-- Banda decorativa -->
      <path d="M37 42 L63 42" stroke="#ef4444" stroke-width="4"/>
      <!-- Ala ancha ondulada -->
      <ellipse cx="50" cy="56" rx="42" ry="14" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
      <!-- Motivos zigzag -->
      <path d="M18 56 Q30 52 50 56 Q70 60 82 56" stroke="#0284c7" stroke-width="2.5" fill="none"/>
    `),

    casa: wrapSvg(`
      <!-- Techo triangular -->
      <polygon points="50,18 20,44 80,44" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
      <!-- Chimenea -->
      <rect x="62" y="22" width="8" height="14" fill="#92400e"/>
      <!-- Fachada -->
      <rect x="28" y="44" width="44" height="38" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
      <!-- Puerta -->
      <rect x="44" y="60" width="12" height="22" rx="4" fill="#92400e"/>
      <circle cx="53" cy="72" r="1.5" fill="#facc15"/>
      <!-- Ventana circular -->
      <circle cx="50" cy="34" r="5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>
    `),

    caracol: wrapSvg(`
      <!-- Caparazón espiral -->
      <circle cx="56" cy="46" r="22" fill="#fb923c" stroke="#c2410c" stroke-width="3"/>
      <path d="M56 46 m -14 0 a 14 14 0 1 0 28 0 a 8 8 0 1 0 -16 0 a 3 3 0 1 0 6 0" fill="none" stroke="#7c2d12" stroke-width="2.5"/>
      <!-- Cuerpo babosa -->
      <path d="M16 72 Q36 68 56 68 Q76 68 84 74 Q50 78 16 72 Z" fill="#a3e635" stroke="#65a30d" stroke-width="2.5"/>
      <path d="M24 70 Q20 54 26 44" stroke="#a3e635" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Antenas -->
      <path d="M24 44 L20 34 M28 44 L32 34" stroke="#65a30d" stroke-width="2.5"/>
      <circle cx="20" cy="34" r="2.5" fill="#0f172a"/>
      <circle cx="32" cy="34" r="2.5" fill="#0f172a"/>
    `),

    caballo: wrapSvg(`
      <!-- Cabeza caballo marrón -->
      <path d="M34 26 C44 20 62 24 66 40 C68 52 74 62 70 74 C58 78 48 70 44 58 C38 60 30 45 34 26 Z"
            fill="#b45309" stroke="#78350f" stroke-width="3"/>
      <!-- Crin -->
      <path d="M34 26 Q24 38 28 54 Q20 44 28 32" fill="#451a03"/>
      <!-- Oreja -->
      <polygon points="40,24 46,12 50,22" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <!-- Ojo y belfo -->
      <circle cx="54" cy="38" r="4" fill="#0f172a"/>
      <circle cx="55" cy="36" r="1.5" fill="#ffffff"/>
      <circle cx="64" cy="68" r="2" fill="#451a03"/>
    `),

    pelota: wrapSvg(`
      <!-- Pelota playera con gajos -->
      <circle cx="50" cy="50" r="34" fill="#ffffff" stroke="#334155" stroke-width="3"/>
      <path d="M50 16 C34 26 34 74 50 84 Z" fill="#ef4444"/>
      <path d="M50 16 C66 26 66 74 50 84 Z" fill="#3b82f6"/>
      <path d="M16 50 C26 34 74 34 84 50 Z" fill="#facc15"/>
      <circle cx="50" cy="50" r="8" fill="#ffffff" stroke="#334155" stroke-width="2"/>
    `),

    luna: wrapSvg(`
      <!-- Luna creciente sonriente -->
      <path d="M64 16 C40 22 28 46 36 72 C42 86 58 90 68 84 C46 80 40 54 52 36 C58 28 66 22 64 16 Z"
            fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="44" cy="48" r="3.5" fill="#78350f"/>
      <circle cx="45" cy="46" r="1.3" fill="#ffffff"/>
      <circle cx="48" cy="56" r="3" fill="#f87171" opacity="0.6"/>
      <path d="M42 58 Q46 64 50 60" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `),

    barco: wrapSvg(`
      <!-- Casco del barco -->
      <path d="M22 60 L78 60 L68 76 L32 76 Z" fill="#b45309" stroke="#78350f" stroke-width="3"/>
      <!-- Mástil -->
      <line x1="50" y1="20" x2="50" y2="60" stroke="#78350f" stroke-width="3.5"/>
      <!-- Velas -->
      <polygon points="50,22 26,54 50,54" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5"/>
      <polygon points="52,26 72,54 52,54" fill="#f87171" stroke="#dc2626" stroke-width="2.5"/>
      <!-- Olas debajo -->
      <path d="M16 80 Q28 74 40 80 Q52 86 64 80 Q76 74 88 80" stroke="#38bdf8" stroke-width="3" fill="none"/>
    `)
  };

  // Cache de imágenes en memoria para renderizado a 60 FPS sin parpadeos
  const imageCache = {};

  // Función de pre-carga híbrida y rápida en memoria a través de SVG Data URI
  function preloadImage(id, svgString) {
    return new Promise((resolve) => {
      const img = new Image();
      const svgBlobUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`No se pudo cargar el gráfico para '${id}'`);
        resolve(img);
      };
      img.src = svgBlobUrl;
    });
  }

  // Pre-cargar todos los gráficos
  async function preloadAllAssets() {
    const promises = [];
    for (const [id, svgStr] of Object.entries(ITEM_SVGS)) {
      const p = preloadImage(id, svgStr).then((img) => {
        imageCache[id] = img;
      });
      promises.push(p);
    }
    await Promise.all(promises);
    return imageCache;
  }

  // Definición de Mundos y Misiones Pedagógicas
  const WORLDS = [
    {
      id: 'reef',
      number: 1,
      title: 'El Arrecife de los Sonidos',
      age: '3 años',
      description: 'Discriminación auditiva y onomatopeyas animales',
      theme: 'reef',
      bgColor: '#0284c7',
      maxBubblesMobile: 3,
      maxBubblesDesktop: 4,
      bubbleSpeed: 0.75, // Muy lento para motricidad temprana
      bubbleScale: 1.15, // Burbujas extra grandes
      missions: [
        {
          id: 'reef_vaca',
          targetId: 'vaca',
          targetName: 'Vaca',
          voicePrompt: '¡Busca al animal que hace mu, mu!',
          hudLabel: 'MUU',
          targetPrompt: '¿Quién hace mu, mu?',
          validItems: ['vaca'],
          distractors: ['perro', 'gato', 'pato', 'rana', 'oveja'],
          spokenSuccess: '¡Mu, mu! ¡Es la vaca!',
          spokenClue: 'Escucha bien: ¡Mu, mu! Buscamos a la vaquita.'
        },
        {
          id: 'reef_perro',
          targetId: 'perro',
          targetName: 'Perro',
          voicePrompt: '¡Explota al perrito que hace guau, guau!',
          hudLabel: 'GUAU',
          targetPrompt: '¿Quién hace guau, guau?',
          validItems: ['perro'],
          distractors: ['vaca', 'gato', 'pato', 'rana', 'oveja'],
          spokenSuccess: '¡Guau, guau! ¡Buen trabajo con el perrito!',
          spokenClue: '¡Guau, guau! ¿Dónde está el perrito?'
        },
        {
          id: 'reef_gato',
          targetId: 'gato',
          targetName: 'Gato',
          voicePrompt: '¡Toca al gatito que dice miau, miau!',
          hudLabel: 'MIAU',
          targetPrompt: '¿Quién dice miau, miau?',
          validItems: ['gato'],
          distractors: ['vaca', 'perro', 'pato', 'rana', 'oveja'],
          spokenSuccess: '¡Miau, miau! ¡Excelente gatito!',
          spokenClue: '¡Miau, miau! Busquemos al lindo gatito.'
        },
        {
          id: 'reef_pato',
          targetId: 'pato',
          targetName: 'Pato',
          voicePrompt: '¡Encuentra al patito que hace cuac, cuac!',
          hudLabel: 'CUAC',
          targetPrompt: '¿Quién hace cuac, cuac?',
          validItems: ['pato'],
          distractors: ['vaca', 'perro', 'gato', 'rana', 'oveja'],
          spokenSuccess: '¡Cuac, cuac! ¡El patito nada feliz!',
          spokenClue: '¡Cuac, cuac! ¿Dónde nada el patito?'
        },
        {
          id: 'reef_rana',
          targetId: 'rana',
          targetName: 'Rana',
          voicePrompt: '¡Busca a la ranita que salta y hace croac, croac!',
          hudLabel: 'CROAC',
          targetPrompt: '¿Quién hace croac, croac?',
          validItems: ['rana'],
          distractors: ['vaca', 'perro', 'gato', 'pato', 'oveja'],
          spokenSuccess: '¡Croac, croac! ¡Saltó la ranita verde!',
          spokenClue: '¡Croac, croac! Encuentra a la ranita saltarina.'
        }
      ]
    },
    {
      id: 'lagoon',
      number: 2,
      title: 'La Laguna de las Vocales',
      age: '4 años',
      description: 'Asociación fonema-grafema inicial (A, E, I, O, U)',
      theme: 'lagoon',
      bgColor: '#0d9488',
      maxBubblesMobile: 4,
      maxBubblesDesktop: 5,
      bubbleSpeed: 1.0, // Velocidad media
      bubbleScale: 1.0,
      missions: [
        {
          id: 'vocal_a',
          vocal: 'A',
          targetId: 'abeja',
          targetName: 'Letra A',
          voicePrompt: '¡Explota todo lo que empiece con la vocal A!',
          hudLabel: 'A',
          targetPrompt: 'Busca la vocal A',
          validItems: ['abeja', 'avion', 'arbol'],
          distractors: ['elefante', 'isla', 'oso', 'uva', 'ojo'],
          spokenSuccess: '¡Muy bien! ¡A, de abeja y avión!',
          spokenClue: 'Buscamos cosas que empiezan con la vocal A.'
        },
        {
          id: 'vocal_e',
          vocal: 'E',
          targetId: 'elefante',
          targetName: 'Letra E',
          voicePrompt: '¡Toca lo que empiece con la vocal E!',
          hudLabel: 'E',
          targetPrompt: 'Busca la vocal E',
          validItems: ['elefante', 'estrella', 'erizo'],
          distractors: ['abeja', 'isla', 'oso', 'uva', 'avion'],
          spokenSuccess: '¡Excelente! ¡E, de elefante y estrella!',
          spokenClue: 'Buscamos palabras que empiezan con la vocal E.'
        },
        {
          id: 'vocal_i',
          vocal: 'I',
          targetId: 'isla',
          targetName: 'Letra I',
          voicePrompt: '¡Busca todo lo que empiece con la vocal I!',
          hudLabel: 'I',
          targetPrompt: 'Busca la vocal I',
          validItems: ['isla', 'iguana', 'iman'],
          distractors: ['arbol', 'estrella', 'oso', 'uva', 'erizo'],
          spokenSuccess: '¡Genial! ¡I, de isla e iguana!',
          spokenClue: 'Buscamos palabras que empiezan con la vocal I.'
        },
        {
          id: 'vocal_o',
          vocal: 'O',
          targetId: 'oso',
          targetName: 'Letra O',
          voicePrompt: '¡Explota las burbujas que empiezan con la vocal O!',
          hudLabel: 'O',
          targetPrompt: 'Busca la vocal O',
          validItems: ['oso', 'ojo', 'oveja'],
          distractors: ['abeja', 'elefante', 'isla', 'uva', 'estrella'],
          spokenSuccess: '¡Eso es! ¡O, de oso y ojo!',
          spokenClue: 'Buscamos palabras que empiezan con la vocal O.'
        },
        {
          id: 'vocal_u',
          vocal: 'U',
          targetId: 'uva',
          targetName: 'Letra U',
          voicePrompt: '¡Toca lo que empiece con la vocal U!',
          hudLabel: 'U',
          targetPrompt: 'Busca la vocal U',
          validItems: ['uva', 'unicornio', 'uno'],
          distractors: ['avion', 'elefante', 'isla', 'oso', 'ojo'],
          spokenSuccess: '¡Súper! ¡U, de uvas y unicornio!',
          spokenClue: 'Buscamos palabras que empiezan con la vocal U.'
        }
      ]
    },
    {
      id: 'forest',
      number: 3,
      title: 'El Bosque de las Sílabas',
      age: '5 años',
      description: 'Conciencia silábica, rimas y categorías',
      theme: 'forest',
      bgColor: '#4338ca',
      maxBubblesMobile: 4,
      maxBubblesDesktop: 6,
      bubbleSpeed: 1.25, // Velocidad ágil con variación
      bubbleScale: 0.95,
      missions: [
        {
          id: 'silaba_ma',
          syllable: 'MA',
          targetId: 'manzana',
          targetName: 'Sílaba MA',
          voicePrompt: '¡Explota lo que empiece con ma, como mano!',
          hudLabel: 'MA',
          targetPrompt: 'Empieza con ma...',
          validItems: ['manzana', 'mariposa', 'mano'],
          distractors: ['pato', 'sol', 'casa', 'pelota', 'luna'],
          spokenSuccess: '¡Muy bien! ¡Ma, de manzana y mariposa!',
          spokenClue: 'Buscamos palabras que empiezan con ma, como mano.'
        },
        {
          id: 'silaba_pa',
          syllable: 'PA',
          targetId: 'payaso',
          targetName: 'Sílaba PA',
          voicePrompt: '¡Busca lo que empiece con pa, como pato!',
          hudLabel: 'PA',
          targetPrompt: 'Empieza con pa...',
          validItems: ['pato', 'payaso', 'pan'],
          distractors: ['manzana', 'sol', 'sopa', 'casa', 'caracol'],
          spokenSuccess: '¡Excelente! ¡Pa, de payaso y pato!',
          spokenClue: 'Buscamos palabras que empiezan con pa, como pato.'
        },
        {
          id: 'silaba_so',
          syllable: 'SO',
          targetId: 'sol',
          targetName: 'Sílaba SO',
          voicePrompt: '¡Toca lo que empiece con so, como sopa!',
          hudLabel: 'SO',
          targetPrompt: 'Empieza con so...',
          validItems: ['sol', 'sopa', 'sombrero'],
          distractors: ['mariposa', 'payaso', 'casa', 'barco', 'caballo'],
          spokenSuccess: '¡Genial! ¡So, de sol y sopa!',
          spokenClue: 'Buscamos palabras que empiezan con so, como sol.'
        },
        {
          id: 'silaba_ca',
          syllable: 'CA',
          targetId: 'casa',
          targetName: 'Sílaba CA',
          voicePrompt: '¡Encuentra lo que empiece con ca, como casa!',
          hudLabel: 'CA',
          targetPrompt: 'Empieza con ca...',
          validItems: ['casa', 'caracol', 'caballo'],
          distractors: ['sol', 'mano', 'pan', 'luna', 'pelota'],
          spokenSuccess: '¡Eso es! ¡Ca, de casa y caracol!',
          spokenClue: 'Buscamos cosas que empiezan con ca, como caballo.'
        }
      ]
    }
  ];

  // Nombres y pronunciaciones de cada item para retroalimentación
  const ITEM_NAMES = {
    vaca: 'Vaca', perro: 'Perro', gato: 'Gato', pato: 'Pato', rana: 'Rana', oveja: 'Oveja',
    abeja: 'Abeja', avion: 'Avión', arbol: 'Árbol', elefante: 'Elefante', estrella: 'Estrella',
    erizo: 'Erizo', isla: 'Isla', iguana: 'Iguana', iman: 'Imán', oso: 'Oso', ojo: 'Ojo',
    uva: 'Uva', unicornio: 'Unicornio', uno: 'Uno',
    manzana: 'Manzana', mariposa: 'Mariposa', mano: 'Mano', payaso: 'Payaso', pan: 'Pan',
    sol: 'Sol', sopa: 'Sopa', sombrero: 'Sombrero', casa: 'Casa', caracol: 'Caracol',
    caballo: 'Caballo', pelota: 'Pelota', luna: 'Luna', barco: 'Barco'
  };

  // Exponer al objeto global Game
  window.Game.Data = {
    ITEM_SVGS,
    WORLDS,
    ITEM_NAMES,
    imageCache,
    preloadAllAssets
  };
})();
