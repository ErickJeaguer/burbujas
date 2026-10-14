/**
 * GENERADOR DE VOCES DULCES EN ESPAÑOL CON ELEVENLABS
 * Uso: node generate_voices.js [sk_api_key]
 *
 * Descarga las locuciones del juego en archivos MP3 dentro de assets/audio/
 * usando la voz dulce femenina "Bella" (hpp4J3VqNfWAUOO0d1Us), forzando language_code: 'es'
 * y con textos en minúsculas naturales y pausas fonéticas para niños de 3 a 5 años.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.argv[2] || process.env.ELEVENLABS_API_KEY || '';

if (!API_KEY || !API_KEY.startsWith('sk_')) {
  console.error('\n[ERROR] Por favor proporciona una API Key válida de ElevenLabs (debe empezar con "sk_").\n');
  process.exit(1);
}

// Voz dulce femenina: Bella (hpp4J3VqNfWAUOO0d1Us - disponible en Free Tier)
const VOICE_ID = 'hpp4J3VqNfWAUOO0d1Us';
const MODEL_ID = 'eleven_multilingual_v2';

const OUTPUT_DIR = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function textToFilename(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 45);
}

const PHRASES = [
  // --- MUNDO 1: ARRECIFE (3 AÑOS - ONOMATOPEYAS) ---
  '¡Busca al animal que hace mu, mu!',
  '¡Mu, mu! ¡Es la vaca!',
  'Escucha bien: ¡Mu, mu! Buscamos a la vaquita.',

  '¡Explota al perrito que hace guau, guau!',
  '¡Guau, guau! ¡Buen trabajo con el perrito!',
  '¡Guau, guau! ¿Dónde está el perrito?',

  '¡Toca al gatito que dice miau, miau!',
  '¡Miau, miau! ¡Excelente gatito!',
  '¡Miau, miau! Busquemos al lindo gatito.',

  '¡Encuentra al patito que hace cuac, cuac!',
  '¡Cuac, cuac! ¡El patito nada feliz!',
  '¡Cuac, cuac! ¿Dónde nada el patito?',

  '¡Busca a la ranita que salta y hace croac, croac!',
  '¡Croac, croac! ¡Saltó la ranita verde!',
  '¡Croac, croac! Encuentra a la ranita saltarina.',

  // --- MUNDO 2: VOCALES (4 AÑOS - A, E, I, O, U) ---
  '¡Explota todo lo que empiece con la vocal A!',
  '¡Muy bien! ¡A, de abeja y avión!',
  'Buscamos cosas que empiezan con la vocal A.',
  '¡A, de abeja!',
  '¡A, de avión!',
  '¡A, de árbol!',

  '¡Toca lo que empiece con la vocal E!',
  '¡Excelente! ¡E, de elefante y estrella!',
  'Buscamos palabras que empiezan con la vocal E.',
  '¡E, de elefante!',
  '¡E, de estrella!',
  '¡E, de erizo!',

  '¡Busca todo lo que empiece con la vocal I!',
  '¡Genial! ¡I, de isla e iguana!',
  'Buscamos palabras que empiezan con la vocal I.',
  '¡I, de isla!',
  '¡I, de iguana!',
  '¡I, de imán!',

  '¡Explota las burbujas que empiezan con la vocal O!',
  '¡Eso es! ¡O, de oso y ojo!',
  'Buscamos palabras que empiezan con la vocal O.',
  '¡O, de oso!',
  '¡O, de ojo!',
  '¡O, de oveja!',

  '¡Toca lo que empiece con la vocal U!',
  '¡Súper! ¡U, de uvas y unicornio!',
  'Buscamos palabras que empiezan con la vocal U.',
  '¡U, de uva!',
  '¡U, de unicornio!',
  '¡U, de uno!',

  // --- MUNDO 3: SÍLABAS (5 AÑOS - MA, PA, SO, CA) ---
  '¡Explota lo que empiece con ma, como mano!',
  '¡Muy bien! ¡Ma, de manzana y mariposa!',
  'Buscamos palabras que empiezan con ma, como mano.',
  '¡Ma, de manzana!',
  '¡Ma, de mariposa!',
  '¡Ma, de mano!',

  '¡Busca lo que empiece con pa, como pato!',
  '¡Excelente! ¡Pa, de payaso y pato!',
  'Buscamos palabras que empiezan con pa, como pato.',
  '¡Pa, de pato!',
  '¡Pa, de payaso!',
  '¡Pa, de pan!',

  '¡Toca lo que empiece con so, como sopa!',
  '¡Genial! ¡So, de sol y sopa!',
  'Buscamos palabras que empiezan con so, como sol.',
  '¡So, de sol!',
  '¡So, de sopa!',
  '¡So, de sombrero!',

  '¡Encuentra lo que empiece con ca, como casa!',
  '¡Eso es! ¡Ca, de casa y caracol!',
  'Buscamos cosas que empiezan con ca, como caballo.',
  '¡Ca, de casa!',
  '¡Ca, de caracol!',
  '¡Ca, de caballo!',

  // --- CELEBRACIÓN ---
  '¡Excelente trabajo! ¡Completaste las cinco estrellas!'
];

function downloadVoice(text) {
  return new Promise((resolve, reject) => {
    const filename = `${textToFilename(text)}.mp3`;
    const destPath = path.join(OUTPUT_DIR, filename);

    const postData = JSON.stringify({
      text: text,
      model_id: MODEL_ID,
      language_code: 'es', // Forzar español en ElevenLabs
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.15,
        use_speaker_boost: true
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', (c) => errData += c);
        res.on('end', () => {
          reject(new Error(`ElevenLabs HTTP ${res.statusCode}: ${errData}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[DESCARGADO 100% ESPAÑOL] -> ${filename} ("${text}")`);
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log(`\nIniciando descarga de ${PHRASES.length} locuciones con ElevenLabs...`);
  console.log(`Voz: Bella (${VOICE_ID}) | Modelo: ${MODEL_ID} | Idioma: Español forzado ('es')\n`);

  let successCount = 0;
  for (let i = 0; i < PHRASES.length; i++) {
    const phrase = PHRASES[i];
    try {
      await downloadVoice(phrase);
      successCount++;
      // Pequeña pausa entre peticiones
      await new Promise((r) => setTimeout(r, 450));
    } catch (err) {
      console.error(`[ERROR] al generar "${phrase}":`, err.message);
    }
  }

  console.log(`\n¡Completado! Se generaron ${successCount} archivos en assets/audio/\n`);
}

run();
