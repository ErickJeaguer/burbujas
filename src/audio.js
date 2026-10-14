/**
 * BURBUJAS SONORAS: CONCIENCIA FONOLÓGICA
 * Módulo de Audio Procedural (Web Audio API) y Motor de Voz ElevenLabs (Voz 1 y Voz 2)
 */

window.Game = window.Game || {};

(function () {
  'use strict';

  // Contexto de Web Audio nativo
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // --- SÍNTESIS ACÚSTICA PROCEDURAL ---

  function playPop() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1250, now + 0.075);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {
      console.warn('Error al reproducir Pop:', e);
    }
  }

  function playBoing() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
      osc.frequency.linearRampToValueAtTime(160, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.37);
    } catch (e) {
      console.warn('Error al reproducir Boing:', e);
    }
  }

  function playSplash() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [480, 720].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1 + idx * 0.02);

        gain.gain.setValueAtTime(0.18, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.02);
        osc.stop(now + 0.13 + idx * 0.02);
      });
    } catch (e) {
      console.warn('Error al reproducir Splash:', e);
    }
  }

  const SCALE_NOTES = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25
  ];

  function playScaleNote(comboIndex) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freq = SCALE_NOTES[Math.min(comboIndex, SCALE_NOTES.length - 1)];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Error al reproducir nota musical:', e);
    }
  }

  function playFanfare() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { f: 392.00, t: 0.00, d: 0.12 },
      { f: 523.25, t: 0.14, d: 0.12 },
      { f: 659.25, t: 0.28, d: 0.14 },
      { f: 783.99, t: 0.44, d: 0.40 }
    ];

    try {
      const now = ctx.currentTime;
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0.35, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + note.d + 0.02);
      });
    } catch (e) {
      console.warn('Error en fanfarria:', e);
    }
  }

  // --- MOTOR DE VOZ ELEVENLABS: VOZ 1 (BELLA) Y VOZ 2 (JESSICA) ---
  const ELEVENLABS_VOICES = {
    '1': { id: 'hpp4J3VqNfWAUOO0d1Us', name: 'Voz 1 (Dulce Bella)' },
    '2': { id: 'cgSgspJ2msm6clMCkdW9', name: 'Voz 2 (Alegre Jessica)' }
  };

  const DEFAULT_KEY = '';

  const elevenLabsConfig = {
    apiKey: DEFAULT_KEY,
    voiceChoice: localStorage.getItem('game_voice_choice') || '2',
    modelId: 'eleven_multilingual_v2',
    languageCode: 'es'
  };

  // Cache de Blobs de audio en memoria para evitar llamadas redundantes
  const audioBlobCache = new Map();
  let currentAudioInstance = null;
  let speechToken = 0; // Token secuencial para evitar que suenen dos voces a la vez

  function textToFilename(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 45);
  }

  /**
   * Genera o recupera audio en vivo de ElevenLabs forzando idioma español
   */
  async function fetchElevenLabsAudio(text, voiceId) {
    if (!elevenLabsConfig.apiKey || !elevenLabsConfig.apiKey.startsWith('sk_')) {
      return null;
    }

    const vId = voiceId || ELEVENLABS_VOICES[elevenLabsConfig.voiceChoice].id;
    const cacheKey = `${vId}_${text}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey);
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsConfig.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: elevenLabsConfig.modelId,
          language_code: 'es',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.15,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        console.warn(`ElevenLabs error (${response.status}):`, await response.text());
        return null;
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioBlobCache.set(cacheKey, audioUrl);
      return audioUrl;
    } catch (err) {
      console.warn('Error al conectar con ElevenLabs:', err);
      return null;
    }
  }

  let lastSpokenText = '';

  /**
   * Reproduce una locución garantizando CERO solapamientos de audio.
   * Utiliza speechToken para anular cualquier reproducción anterior.
   */
  async function speak(text, options = {}) {
    if (!text) return;

    const interrupt = options.interrupt !== false;
    const onEnd = options.onEnd || null;

    lastSpokenText = text;

    // Incrementar token: cualquier operación asíncrona anterior queda invalidada
    speechToken++;
    const currentToken = speechToken;

    if (interrupt) {
      stopAllSpeechInternal();
    }

    const isVoice1 = elevenLabsConfig.voiceChoice === '1';

    // Nivel 1: Para Voz 1, verificar primero si existe archivo local MP3 pre-grabado
    if (isVoice1) {
      const slug = textToFilename(text);
      const localAudioPath = `assets/audio/${slug}.mp3`;

      const localAudio = new Audio(localAudioPath);
      currentAudioInstance = localAudio;

      let fallbackStarted = false;
      const onLocalFailed = async () => {
        if (fallbackStarted) return;
        fallbackStarted = true;

        // Si ya empezó otra locución mientras fallaba, cancelar
        if (speechToken !== currentToken) return;

        // Intentar ElevenLabs en vivo con Bella
        try {
          const audioUrl = await fetchElevenLabsAudio(text, ELEVENLABS_VOICES['1'].id);
          if (speechToken !== currentToken) return;

          if (audioUrl) {
            const liveAudio = new Audio(audioUrl);
            currentAudioInstance = liveAudio;
            liveAudio.onended = () => {
              if (speechToken === currentToken) {
                currentAudioInstance = null;
                if (onEnd) onEnd();
              }
            };
            liveAudio.onerror = () => {
              if (speechToken === currentToken) currentAudioInstance = null;
            };
            await liveAudio.play();
          }
        } catch (e) {
          console.warn('No se pudo reproducir audio:', e);
        }
      };

      localAudio.onended = () => {
        if (speechToken === currentToken) {
          currentAudioInstance = null;
          if (onEnd) onEnd();
        }
      };

      localAudio.onerror = onLocalFailed;

      localAudio.play().catch(() => {
        onLocalFailed();
      });
      return;
    }

    // Nivel 2: Para Voz 2 (Jessica)
    const slug = textToFilename(text);
    const v2Path = `assets/audio/voz2/${slug}.mp3`;
    const v2LocalAudio = new Audio(v2Path);
    currentAudioInstance = v2LocalAudio;

    let v2FallbackStarted = false;
    const onV2Failed = async () => {
      if (v2FallbackStarted) return;
      v2FallbackStarted = true;

      if (speechToken !== currentToken) return;

      // Intentar ElevenLabs en vivo con Jessica (Voz 2)
      try {
        const audioUrl = await fetchElevenLabsAudio(text, ELEVENLABS_VOICES['2'].id);
        if (speechToken !== currentToken) return;

        if (audioUrl) {
          const liveAudio = new Audio(audioUrl);
          currentAudioInstance = liveAudio;
          liveAudio.onended = () => {
            if (speechToken === currentToken) {
              currentAudioInstance = null;
              if (onEnd) onEnd();
            }
          };
          liveAudio.onerror = () => {
            if (speechToken === currentToken) currentAudioInstance = null;
          };
          await liveAudio.play();
          return;
        }
      } catch (e) {
        console.warn('Error al reproducir Voz 2 en vivo:', e);
      }

      // Si falla en vivo (ej. modo offline o CORS), usar fallback al audio general
      if (speechToken !== currentToken) return;
      const fallbackAudio = new Audio(`assets/audio/${slug}.mp3`);
      currentAudioInstance = fallbackAudio;
      fallbackAudio.onended = () => {
        if (speechToken === currentToken) {
          currentAudioInstance = null;
          if (onEnd) onEnd();
        }
      };
      fallbackAudio.play().catch(() => {});
    };

    v2LocalAudio.onended = () => {
      if (speechToken === currentToken) {
        currentAudioInstance = null;
        if (onEnd) onEnd();
      }
    };
    v2LocalAudio.onerror = onV2Failed;
    v2LocalAudio.play().catch(() => {
      onV2Failed();
    });
  }

  function stopAllSpeechInternal() {
    if (currentAudioInstance) {
      try {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
        currentAudioInstance.src = '';
      } catch (e) {}
      currentAudioInstance = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function stopAllSpeech() {
    speechToken++; // Invalida todas las promesas activas
    stopAllSpeechInternal();
  }

  function repeatLastInstruction(fallbackText) {
    const textToSpeak = fallbackText || lastSpokenText;
    if (textToSpeak) {
      speak(textToSpeak, { interrupt: true });
    }
  }

  /**
   * Cambia entre Voz 1 (Bella) y Voz 2 (Jessica)
   * Reproduce una muestra de 1 segundo de la voz seleccionada.
   */
  function setVoiceChoice(choice) {
    const validChoice = choice === '2' ? '2' : '1';
    elevenLabsConfig.voiceChoice = validChoice;
    localStorage.setItem('game_voice_choice', validChoice);

    stopAllSpeech();

    // Reproducir muestra pre-grabada de la voz
    const previewAudio = new Audio(`assets/audio/preview_voz${validChoice}.mp3`);
    currentAudioInstance = previewAudio;
    previewAudio.play().catch(() => {});
  }

  function loadVoices() {
    return Promise.resolve();
  }

  // Exponer API de Audio limpia
  window.Game.Audio = {
    getAudioContext,
    loadVoices,
    playPop,
    playBoing,
    playSplash,
    playScaleNote,
    playFanfare,
    speak,
    repeatLastInstruction,
    stopAllSpeech,
    setVoiceChoice,
    elevenLabsConfig,
    ELEVENLABS_VOICES
  };
})();
