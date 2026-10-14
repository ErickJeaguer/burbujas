/**
 * BURBUJAS SONORAS: CONCIENCIA FONOLÓGICA
 * Módulo Spawner: Algoritmo "Fair Spawner" (Bolsa Justa), Carriles Verticales y Control de Lotes
 */

window.Game = window.Game || {};

(function () {
  'use strict';

  class FairSpawner {
    constructor() {
      this.currentMission = null;
      this.worldConfig = null;
      this.laneCount = 4;
      this.lanes = []; // Registra el tiempo o estado del último spawn en cada carril
      this.currentBatch = []; // Lote justo de 3 burbujas
      this.spawnCooldown = 0;
      this.minSpawnInterval = 1600; // ms entre apariciones
      this.isCelebrationMode = false;
      this.celebrationTimer = 0;
    }

    /**
     * Reinicia el spawner con una nueva misión y configuración de mundo.
     */
    initMission(mission, worldConfig, canvasWidth) {
      this.currentMission = mission;
      this.worldConfig = worldConfig;
      this.isCelebrationMode = false;
      this.spawnCooldown = 600; // Primer spawn rápido tras briefing
      this.recalculateLanes(canvasWidth);
      this.generateNewBatch();
    }

    setCelebrationMode(enabled) {
      this.isCelebrationMode = enabled;
      this.spawnCooldown = 200;
    }

    /**
     * Calcula los carriles verticales invisibles según ancho de pantalla.
     * Móvil: 4 carriles | PC/Tablets: 6 carriles.
     */
    recalculateLanes(canvasWidth) {
      const isMobile = canvasWidth < 768;
      this.laneCount = isMobile
        ? (this.worldConfig ? this.worldConfig.maxBubblesMobile : 4)
        : (this.worldConfig ? this.worldConfig.maxBubblesDesktop : 6);

      this.lanes = [];
      const laneWidth = canvasWidth / this.laneCount;
      for (let i = 0; i < this.laneCount; i++) {
        this.lanes.push({
          index: i,
          centerX: (i + 0.5) * laneWidth,
          width: laneWidth,
          lastSpawnTime: 0
        });
      }
    }

    /**
     * Algoritmo de Bolsa Justa (3 burbujas por lote: garantiza 1 o 2 respuestas correctas)
     */
    generateNewBatch() {
      if (!this.currentMission) return;

      const validList = [...this.currentMission.validItems];
      const distractorList = [...this.currentMission.distractors];

      // Determinar si este lote tendrá 1 o 2 correctas (50% de probabilidad equilibrada)
      const correctCount = Math.random() > 0.5 ? 2 : 1;
      const distractorCount = 3 - correctCount;

      const batch = [];

      // Insertar correctas
      for (let i = 0; i < correctCount; i++) {
        const item = validList[Math.floor(Math.random() * validList.length)];
        batch.push({
          itemId: item,
          isValid: true,
          label: this.currentMission.hudLabel || ''
        });
      }

      // Insertar distractores
      for (let i = 0; i < distractorCount; i++) {
        const item = distractorList[Math.floor(Math.random() * distractorList.length)];
        batch.push({
          itemId: item,
          isValid: false,
          label: ''
        });
      }

      // Barajar el lote aleatoriamente
      for (let i = batch.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [batch[i], batch[j]] = [batch[j], batch[i]];
      }

      this.currentBatch = batch;
    }

    /**
     * Intenta generar una burbuja si las condiciones lo permiten.
     * @returns {Object|null} Configuración para instanciar una burbuja o null.
     */
    update(dt, canvasWidth, canvasHeight, activeBubblesCount) {
      this.spawnCooldown -= dt;

      // En modo celebración, lluvia festiva de burbujas arcoíris
      if (this.isCelebrationMode) {
        if (this.spawnCooldown <= 0 && activeBubblesCount < 8) {
          this.spawnCooldown = 400 + Math.random() * 250;
          return this.createCelebrationBubble(canvasWidth, canvasHeight);
        }
        return null;
      }

      // Límite máximo de burbujas en pantalla para evitar saturación sensorial
      const maxAllowed = canvasWidth < 768
        ? (this.worldConfig ? this.worldConfig.maxBubblesMobile : 4)
        : (this.worldConfig ? this.worldConfig.maxBubblesDesktop : 6);

      if (activeBubblesCount >= maxAllowed) {
        return null;
      }

      if (this.spawnCooldown <= 0) {
        // Si se vació el lote actual de 3, generar nuevo lote justo
        if (this.currentBatch.length === 0) {
          this.generateNewBatch();
        }

        const nextItem = this.currentBatch.shift();
        if (!nextItem) return null;

        // Asignar carril disponible con menor ocupación
        const lane = this.selectBestLane();

        // Fórmula de radio proporcional del GDD:
        // radioBurbuja = max(48, min(ancho, alto) * 0.11)
        const baseRadius = Math.max(48, Math.min(canvasWidth, canvasHeight) * 0.11);
        const finalRadius = Math.round(baseRadius * (this.worldConfig ? this.worldConfig.bubbleScale : 1.0));

        // Jitter horizontal dentro del carril
        const maxJitter = (lane.width - finalRadius * 2) * 0.35;
        const jitter = (Math.random() - 0.5) * Math.max(0, maxJitter);
        const xBase = Math.max(finalRadius + 10, Math.min(canvasWidth - finalRadius - 10, lane.centerX + jitter));

        // Velocidad calibrada por mundo
        const speed = (1.1 + Math.random() * 0.35) * (this.worldConfig ? this.worldConfig.bubbleSpeed : 1.0);

        // Tiempo entre apariciones con ligera variación humana
        const baseInterval = canvasWidth < 768 ? 1900 : 1600;
        this.spawnCooldown = baseInterval / (this.worldConfig ? this.worldConfig.bubbleSpeed : 1.0);

        return {
          xBase: xBase,
          y: canvasHeight + finalRadius + 15,
          radius: finalRadius,
          itemId: nextItem.itemId,
          label: nextItem.isValid ? nextItem.label : '',
          isValid: nextItem.isValid,
          speed: speed,
          worldNumber: this.worldConfig ? this.worldConfig.number : 1,
          isRainbow: false
        };
      }

      return null;
    }

    /**
     * Elige el carril que lleve más tiempo sin usarse para evitar superposiciones.
     */
    selectBestLane() {
      let oldestLane = this.lanes[0];
      const now = performance.now();

      for (const lane of this.lanes) {
        if (now - lane.lastSpawnTime > now - oldestLane.lastSpawnTime) {
          oldestLane = lane;
        }
      }

      oldestLane.lastSpawnTime = now;
      return oldestLane;
    }

    /**
     * Burbuja decorativa arcoíris para la fiesta de nivel.
     */
    createCelebrationBubble(canvasWidth, canvasHeight) {
      const radius = Math.max(44, Math.min(canvasWidth, canvasHeight) * 0.1);
      const xBase = radius + Math.random() * (canvasWidth - radius * 2);
      const items = ['estrella', 'mariposa', 'sol', 'pelota', 'unicornio'];
      const randomItem = items[Math.floor(Math.random() * items.length)];

      return {
        xBase: xBase,
        y: canvasHeight + radius + 15,
        radius: radius,
        itemId: randomItem,
        label: '★',
        isValid: true,
        speed: 1.6 + Math.random() * 0.6,
        worldNumber: this.worldConfig ? this.worldConfig.number : 1,
        isRainbow: true
      };
    }
  }

  // Exponer al objeto global Game
  window.Game.Spawner = {
    FairSpawner
  };
})();
