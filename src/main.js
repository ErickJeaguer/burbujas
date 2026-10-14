/**
 * BURBUJAS SONORAS: CONCIENCIA FONOLÓGICA
 * Módulo Principal: Bucle a 60 FPS, Máquina de Estados, Sincronización HUD y Control Táctil Unificado
 */

window.Game = window.Game || {};

(function () {
  'use strict';

  // --- ESTADOS DEL JUEGO ---
  const STATES = {
    INTRO: 'INTRO_STATE',
    BRIEFING: 'BRIEFING_STATE',
    PLAYING: 'PLAYING_STATE',
    CELEBRATION: 'CELEBRATION_STATE'
  };

  class GameController {
    constructor() {
      this.state = STATES.INTRO;
      this.canvas = null;
      this.ctx = null;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = window.devicePixelRatio || 1;

      // Sistemas y Entidades
      this.spawner = new window.Game.Spawner.FairSpawner();
      this.scenery = new window.Game.Entities.WorldScenery();
      this.particles = new window.Game.Entities.ParticleSystem();
      this.mascot = new window.Game.Entities.Mascot();

      this.bubbles = [];
      this.flyingStars = [];
      this.ripples = [];

      // Progresión y Misiones
      this.currentWorldIndex = 0; // 0: Arrecife, 1: Laguna, 2: Bosque
      this.currentMissionIndex = 0;
      this.activeWorld = window.Game.Data.WORLDS[0];
      this.activeMission = this.activeWorld.missions[0];

      // Métricas de Partida
      this.starsCount = 0;
      this.maxStars = 5;
      this.comboCount = 0;

      // Temporizadores
      this.inactivityTimer = 0;
      this.inactivityThreshold = 6000; // 6 segundos sin interacción
      this.stateTimer = 0;
      this.lastTime = performance.now();

      // Elementos del DOM HUD
      this.hud = {
        starSlots: [],
        btnRepeat: null,
        btnWorld: null,
        targetCard: null,
        targetIcon: null,
        targetLabel: null,
        startScreen: null,
        briefingOverlay: null,
        celebrationOverlay: null,
        worldModal: null
      };
    }

    async init() {
      this.setupCanvas();
      this.setupDOMElements();
      this.setupEventListeners();

      // Pre-cargar SVGs en memoria a través del cargador híbrido
      await window.Game.Data.preloadAllAssets();

      // Configurar mundo inicial
      this.setWorld(0);

      // Iniciar bucle de juego a 60 FPS
      requestAnimationFrame(this.loop.bind(this));
    }

    setupCanvas() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = window.devicePixelRatio || 1;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.resetTransform();
      this.ctx.scale(this.dpr, this.dpr);

      // Reubicar mascota según orientación de pantalla
      const isLandscape = this.width > this.height;
      if (isLandscape) {
        // En PC/Landscape: Mascota en el lateral izquierdo
        this.mascot.setPosition(Math.min(130, this.width * 0.12), this.height * 0.52, 95);
      } else {
        // En Móvil/Portrait: Mascota abajo a la derecha
        this.mascot.setPosition(this.width - 65, this.height - 75, 70);
      }

      if (this.spawner) {
        this.spawner.recalculateLanes(this.width);
      }
    }

    setupDOMElements() {
      this.hud.starSlots = Array.from(document.querySelectorAll('.star-slot'));
      this.hud.btnRepeat = document.getElementById('btnRepeatVoice');
      this.hud.btnWorld = document.getElementById('btnWorldSelector');
      this.hud.targetCard = document.getElementById('hudTargetCard');
      this.hud.targetIcon = document.getElementById('hudTargetIcon');
      this.hud.targetLabel = document.getElementById('hudTargetLabel');
      this.hud.startScreen = document.getElementById('startScreen');
      this.hud.briefingOverlay = document.getElementById('briefingOverlay');
      this.hud.celebrationOverlay = document.getElementById('celebrationOverlay');
      this.hud.worldModal = document.getElementById('worldModal');
    }

    setupEventListeners() {
      // Unificación de entradas con pointerdown para latencia de 1 ms (GDD)
      this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this), { passive: false });

      // Botón Play de Inicio (desbloquea AudioContext de inmediato y arranca el juego)
      const btnPlay = document.getElementById('btnPlay');
      if (btnPlay) {
        const handleStartGame = (e) => {
          if (e) e.preventDefault();
          window.Game.Audio.getAudioContext();
          if (typeof window.Game.Audio.loadVoices === 'function') {
            window.Game.Audio.loadVoices();
          }
          this.hud.startScreen.classList.add('hidden');
          this.hud.startScreen.style.display = 'none';
          this.setWorld(this.currentWorldIndex);
          this.startMission();
        };

        btnPlay.addEventListener('click', handleStartGame);
        btnPlay.addEventListener('touchend', handleStartGame);
      }

      // Botón Repetir Voz en el HUD
      if (this.hud.btnRepeat) {
        this.hud.btnRepeat.addEventListener('click', (e) => {
          e.stopPropagation();
          window.Game.Audio.repeatLastInstruction(this.activeMission.voicePrompt);
          this.hud.btnRepeat.classList.add('btn-bounce');
          setTimeout(() => this.hud.btnRepeat.classList.remove('btn-bounce'), 400);
        });
      }

      // Botón Selector de Mundo en el HUD
      if (this.hud.btnWorld) {
        this.hud.btnWorld.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openWorldModal();
        });
      }

      // Opciones del Selector de Mundo (Pantalla de inicio y Modal)
      document.querySelectorAll('.world-select-btn').forEach((btn) => {
        const onSelectWorld = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const worldNum = parseInt(e.currentTarget.getAttribute('data-world'), 10) - 1;
          window.Game.Audio.playPop();
          this.setWorld(worldNum);
          this.closeWorldModal();
        };
        btn.addEventListener('click', onSelectWorld);
      });

      // Botón cerrar modal de mundos
      const btnCloseModal = document.getElementById('btnCloseWorldModal');
      if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => this.closeWorldModal());
      }

      // --- AJUSTES DE VOZ DEL NARRADOR (VOZ 1 O VOZ 2) ---
      const updateVoiceChoiceButtons = (choice) => {
        document.querySelectorAll('.btn-voice-choice').forEach((btn) => {
          if (btn.getAttribute('data-voice') === choice) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      };

      updateVoiceChoiceButtons(window.Game.Audio.elevenLabsConfig.voiceChoice);

      document.querySelectorAll('.btn-voice-choice').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const choice = e.currentTarget.getAttribute('data-voice') || '2';
          window.Game.Audio.setVoiceChoice(choice);
          updateVoiceChoiceButtons(choice);
        });
      });

      // Botón Ajustes en la pantalla inicial
      const btnSettings = document.getElementById('btnOpenSettings');
      const settingsModal = document.getElementById('settingsModal');
      const btnCloseSettings = document.getElementById('btnCloseSettings');

      if (btnSettings && settingsModal) {
        btnSettings.addEventListener('click', (e) => {
          e.stopPropagation();
          settingsModal.classList.remove('hidden');
        });
      }

      if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => {
          settingsModal.classList.add('hidden');
        });
      }

      // Actualizar estado visual de los botones de mundo
      this.updateWorldButtons();
    }

    updateWorldButtons() {
      const activeWorldNumber = String(this.currentWorldIndex + 1);
      document.querySelectorAll('.world-select-btn').forEach((btn) => {
        if (btn.getAttribute('data-world') === activeWorldNumber) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    setWorld(index) {
      this.currentWorldIndex = Math.max(0, Math.min(index, window.Game.Data.WORLDS.length - 1));
      this.activeWorld = window.Game.Data.WORLDS[this.currentWorldIndex];
      this.currentMissionIndex = 0;
      this.activeMission = this.activeWorld.missions[0];

      this.scenery.setWorld(this.activeWorld.number);
      this.updateWorldButtons();

      // Actualizar etiqueta del HUD
      const worldNameEl = document.getElementById('hudWorldName');
      if (worldNameEl) {
        worldNameEl.textContent = `M${this.activeWorld.number}: ${this.activeWorld.title}`;
      }

      // Si estábamos jugando, reiniciar con la nueva misión
      if (this.state === STATES.PLAYING || this.state === STATES.BRIEFING) {
        this.startMission();
      }
    }

    openWorldModal() {
      if (this.hud.worldModal) {
        this.hud.worldModal.classList.remove('hidden');
      }
    }

    closeWorldModal() {
      if (this.hud.worldModal) {
        this.hud.worldModal.classList.add('hidden');
      }
    }

    /**
     * Inicia una misión en el estado BRIEFING_STATE
     */
    startMission() {
      this.state = STATES.BRIEFING;
      this.stateTimer = 0;
      this.starsCount = 0;
      this.comboCount = 0;
      this.inactivityTimer = 0;
      this.bubbles = [];
      this.flyingStars = [];

      this.updateStarSlotsDisplay();

      // Configurar Spawner
      this.spawner.initMission(this.activeMission, this.activeWorld, this.width);

      // Configurar HUD Tarjeta Guía
      this.updateHUDTargetCard();

      // Configurar Pantalla de Presentación (Briefing) por 3 segundos
      this.showBriefingScreen();

      // Locución inicial de la misión
      setTimeout(() => {
        window.Game.Audio.speak(this.activeMission.voicePrompt, { interrupt: true });
      }, 250);
    }

    showBriefingScreen() {
      const overlay = this.hud.briefingOverlay;
      if (!overlay) return;

      const imgEl = document.getElementById('briefingImage');
      const textEl = document.getElementById('briefingText');
      const subTextEl = document.getElementById('briefingSubText');

      if (imgEl) {
        const svgStr = window.Game.Data.ITEM_SVGS[this.activeMission.targetId];
        imgEl.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
      }
      if (textEl) {
        textEl.textContent = this.activeMission.hudLabel;
      }
      if (subTextEl) {
        subTextEl.textContent = this.activeMission.targetPrompt;
      }

      overlay.classList.remove('hidden');
      overlay.classList.add('fade-in');

      // Mascota saluda alegremente
      this.mascot.setMood('wave', 2500);

      // Tras 3 segundos, ocultar y pasar a PLAYING_STATE
      setTimeout(() => {
        overlay.classList.remove('fade-in');
        overlay.classList.add('hidden');
        if (this.state === STATES.BRIEFING) {
          this.state = STATES.PLAYING;
          this.inactivityTimer = 0;
        }
      }, 3000);
    }

    updateHUDTargetCard() {
      if (!this.hud.targetCard) return;

      if (this.hud.targetIcon) {
        const svgStr = window.Game.Data.ITEM_SVGS[this.activeMission.targetId];
        this.hud.targetIcon.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
      }
      if (this.hud.targetLabel) {
        this.hud.targetLabel.textContent = this.activeMission.hudLabel;
      }
    }

    updateStarSlotsDisplay() {
      this.hud.starSlots.forEach((slot, idx) => {
        if (idx < this.starsCount) {
          slot.classList.add('filled');
        } else {
          slot.classList.remove('filled');
        }
        slot.classList.remove('pulse-hit');
      });
    }

    /**
     * Regla 3: Sincronización milimétrica Canvas-DOM para las estrellas Bézier.
     * Calcula las coordenadas del centro del hueco de la estrella destino en espacio Canvas.
     */
    getTargetStarCoordinate(index) {
      const slot = this.hud.starSlots[Math.min(index, this.hud.starSlots.length - 1)];
      if (!slot) {
        return { x: this.width * 0.5, y: 40 };
      }

      const rect = slot.getBoundingClientRect();
      // Centro del slot en coordenadas de pantalla
      const screenX = rect.left + rect.width / 2;
      const screenY = rect.top + rect.height / 2;

      return { x: screenX, y: screenY };
    }

    /**
     * Control de entrada táctil y clics inmediatos (pointerdown)
     */
    handlePointerDown(e) {
      e.preventDefault();

      // Desbloquear audio si estaba suspendido
      window.Game.Audio.getAudioContext();

      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.clientX - rect.left;
      const touchY = e.clientY - rect.top;

      // Reiniciar detector de inactividad
      this.inactivityTimer = 0;
      this.clearGoldenHalos();

      // En modo celebración: estallar cualquier burbuja en fiesta arcoíris
      if (this.state === STATES.CELEBRATION) {
        this.handleCelebrationTouch(touchX, touchY);
        return;
      }

      if (this.state !== STATES.PLAYING) return;

      // Buscar si tocó alguna burbuja (de la más reciente/superior a la inferior)
      let touchedBubble = null;
      let touchedIndex = -1;

      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        if (!b.isPopped && b.containsPoint(touchX, touchY)) {
          touchedBubble = b;
          touchedIndex = i;
          break;
        }
      }

      if (touchedBubble) {
        if (touchedBubble.isValid) {
          // --- ACIERTO FONOLÓGICO ---
          this.handleCorrectBubble(touchedBubble, touchedIndex);
        } else {
          // --- TOQUE DE DISTRACTOR (CERO CASTIGO) ---
          this.handleDistractorBubble(touchedBubble);
        }
      } else {
        // --- TOQUE EN EL AGUA / FONDO VACÍO (MICRO-INTERACCIÓN) ---
        this.handleEmptyWaterTouch(touchX, touchY);
      }
    }

    handleCorrectBubble(bubble, index) {
      bubble.isPopped = true;
      this.bubbles.splice(index, 1);

      // 1. Sonido orgánico de gota de agua
      window.Game.Audio.playPop();

      // 2. Escala musical ascendente (Do, Re, Mi, Fa, Sol) según combo
      window.Game.Audio.playScaleNote(this.comboCount);
      this.comboCount++;

      // 3. Efectos visuales de explosión y confeti
      this.particles.spawnBubblePop(bubble.x, bubble.y, bubble.radius);
      this.particles.spawnConfetti(bubble.x, bubble.y, 25);

      // 4. Mascota celebra el acierto
      this.mascot.setMood('celebrate', 1600);

      // 5. Locución de refuerzo fonológico inmediato
      const itemName = window.Game.Data.ITEM_NAMES[bubble.itemId] || bubble.itemId;
      let speechFeedback;
      if (this.activeWorld && this.activeWorld.number === 1 && this.activeMission.spokenSuccess) {
        speechFeedback = this.activeMission.spokenSuccess;
      } else {
        speechFeedback = `¡${this.activeMission.hudLabel}, de ${itemName.toLowerCase()}!`;
      }
      window.Game.Audio.speak(speechFeedback, { interrupt: true });

      // 6. Lanzamiento de Estrella Bézier milimétrica hacia el HUD
      const targetCoord = this.getTargetStarCoordinate(this.starsCount);
      const starIndexToFill = this.starsCount;

      const flyingStar = new window.Game.Entities.BezierStar(
        { x: bubble.x, y: bubble.y },
        targetCoord,
        () => {
          // Callback de llegada al slot de estrella en el DOM
          const slot = this.hud.starSlots[starIndexToFill];
          if (slot) {
            slot.classList.add('filled', 'pulse-hit');
          }
        }
      );
      this.flyingStars.push(flyingStar);

      // Incrementar contador de estrellas
      this.starsCount++;

      // 7. ¿Completó las 5 estrellas de la misión?
      if (this.starsCount >= this.maxStars) {
        setTimeout(() => {
          this.triggerCelebration();
        }, 850);
      }
    }

    handleDistractorBubble(bubble) {
      // 1. Sonido de hule Boing
      window.Game.Audio.playBoing();

      // 2. Física elástica de rebote
      bubble.triggerBoing();

      // 3. Mascota anima con ternura
      this.mascot.setMood('encourage', 1400);

      // 4. Reiniciar escala musical combo
      this.comboCount = 0;

      // 5. Locución amistosa orientativa usando la pista pre-grabada de la misión
      const clueText = this.activeMission.spokenClue || this.activeMission.voicePrompt;
      window.Game.Audio.speak(clueText, { interrupt: true });
    }

    handleEmptyWaterTouch(x, y) {
      // Chapoteo suave con microburbujas
      window.Game.Audio.playSplash();
      this.ripples.push(new window.Game.Entities.WaterRipple(x, y));
    }

    handleCelebrationTouch(x, y) {
      // En celebración arcoíris, cualquier toque explota burbujas con sonidos mágicos
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        if (!b.isPopped && b.containsPoint(x, y)) {
          b.isPopped = true;
          this.bubbles.splice(i, 1);
          window.Game.Audio.playPop();
          window.Game.Audio.playScaleNote(Math.floor(Math.random() * 6));
          this.particles.spawnBubblePop(b.x, b.y, b.radius);
          this.particles.spawnConfetti(b.x, b.y, 25);
          return;
        }
      }
      this.handleEmptyWaterTouch(x, y);
    }

    triggerCelebration() {
      this.state = STATES.CELEBRATION;
      this.stateTimer = 0;

      // Fanfarria triunfal y locución de victoria
      window.Game.Audio.playFanfare();
      setTimeout(() => {
        window.Game.Audio.speak('¡Excelente trabajo! ¡Completaste las cinco estrellas!', { interrupt: false });
      }, 400);

      // Activar lluvia de burbujas arcoíris
      this.spawner.setCelebrationMode(true);

      // Mostrar overlay festivo
      if (this.hud.celebrationOverlay) {
        this.hud.celebrationOverlay.classList.remove('hidden');
        this.hud.celebrationOverlay.classList.add('fade-in');
      }

      // Mascota baila y festeja
      this.mascot.setMood('celebrate', 5500);

      // Explosión de confeti desde el centro
      this.particles.spawnConfetti(this.width * 0.5, this.height * 0.4, 80);

      // 5 segundos de recompensa sensorial antes de pasar a la siguiente misión
      setTimeout(() => {
        if (this.hud.celebrationOverlay) {
          this.hud.celebrationOverlay.classList.remove('fade-in');
          this.hud.celebrationOverlay.classList.add('hidden');
        }
        this.advanceToNextMission();
      }, 5200);
    }

    advanceToNextMission() {
      this.currentMissionIndex = (this.currentMissionIndex + 1) % this.activeWorld.missions.length;
      this.activeMission = this.activeWorld.missions[this.currentMissionIndex];
      this.startMission();
    }

    clearGoldenHalos() {
      for (const b of this.bubbles) {
        b.hasGoldenHalo = false;
      }
    }

    // --- BUCLE PRINCIPAL DE JUEGO (60 FPS) ---
    loop(currentTime) {
      const dt = Math.min(100, currentTime - this.lastTime);
      this.lastTime = currentTime;

      this.update(dt, currentTime);
      this.draw(currentTime);

      requestAnimationFrame(this.loop.bind(this));
    }

    update(dt, time) {
      // 1. Actualizar escenario animado
      this.scenery.update(dt);

      // 2. Detector de Inactividad (6 segundos sin toques)
      if (this.state === STATES.PLAYING) {
        this.inactivityTimer += dt;
        if (this.inactivityTimer >= this.inactivityThreshold) {
          // Encender halo dorado en la primera burbuja válida en pantalla
          const validBubble = this.bubbles.find((b) => b.isValid && !b.isPopped);
          if (validBubble && !validBubble.hasGoldenHalo) {
            validBubble.hasGoldenHalo = true;
            window.Game.Audio.speak(this.activeMission.spokenClue || this.activeMission.voicePrompt, { interrupt: false });
          }
          this.inactivityTimer = 0; // Reiniciar para repetir tras otro intervalo si sigue inactivo
        }
      }

      // 3. Spawner de burbujas
      if (this.state === STATES.PLAYING || this.state === STATES.CELEBRATION) {
        const bubbleConfig = this.spawner.update(dt, this.width, this.height, this.bubbles.length);
        if (bubbleConfig) {
          this.bubbles.push(new window.Game.Entities.Bubble(bubbleConfig));
        }
      }

      // 4. Actualizar burbujas activas
      for (let i = this.bubbles.length - 1; i >= 0; i--) {
        const b = this.bubbles[i];
        b.update(dt, time, this.height);

        // Si la burbuja se sale por el borde superior, eliminarla
        if (b.y < -b.radius * 2) {
          this.bubbles.splice(i, 1);
        }
      }

      // 5. Actualizar estrellas Bézier
      for (let i = this.flyingStars.length - 1; i >= 0; i--) {
        const star = this.flyingStars[i];
        star.update(dt);
        if (star.isFinished && star.trail.length === 0) {
          this.flyingStars.splice(i, 1);
        }
      }

      // 6. Actualizar partículas y ondas
      this.particles.update(dt);

      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.update(dt);
        if (r.isDone) {
          this.ripples.splice(i, 1);
        }
      }

      // 7. Actualizar mascota (mira hacia la burbuja más cercana)
      const closestBubble = this.bubbles.find((b) => !b.isPopped);
      this.mascot.update(dt, closestBubble);
    }

    draw(time) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Dibujar escenario vivo del mundo activo
      this.scenery.draw(this.ctx, this.width, this.height);

      // 2. Dibujar ondas de agua en el fondo
      for (const ripple of this.ripples) {
        ripple.draw(this.ctx);
      }

      // 3. Dibujar burbujas de juego
      for (const bubble of this.bubbles) {
        bubble.draw(this.ctx, time);
      }

      // 4. Dibujar partículas (gotas de agua y confeti)
      this.particles.draw(this.ctx);

      // 5. Dibujar estrellas Bézier voladoras
      for (const star of this.flyingStars) {
        star.draw(this.ctx);
      }

      // 6. Dibujar mascota reactiva en pantalla
      this.mascot.draw(this.ctx, this.activeWorld.number);
    }
  }

  // Inicializar al cargar el documento
  window.addEventListener('DOMContentLoaded', () => {
    window.Game.controller = new GameController();
    window.Game.controller.init();
  });
})();
