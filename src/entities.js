/**
 * BURBUJAS SONORAS: CONCIENCIA FONOLÓGICA
 * Módulo de Entidades: Físicas de Gelatina (Squash & Stretch), Estrellas Bézier,
 * Escenarios Vivos para los 3 Mundos, Partículas y Mascota Reactiva.
 */

window.Game = window.Game || {};

(function () {
  'use strict';

  // --- 1. CLASE BURBUJA (FÍSICA DE GELATINA, OSCILACIÓN Y HITBOX MAGNÉTICO) ---
  class Bubble {
    constructor(config) {
      this.id = config.id || Math.random().toString(36).substring(2, 9);
      this.xBase = config.xBase || 100;
      this.x = this.xBase;
      this.y = config.y || 800;
      this.radius = config.radius || 50;
      this.itemId = config.itemId;
      this.label = config.label || '';
      this.isValid = !!config.isValid;
      this.speed = config.speed || 1.2;
      this.worldNumber = config.worldNumber || 1;

      // Parámetros de oscilación sinusoidal horizontal
      this.freq = 0.002 + Math.random() * 0.0015;
      this.phase = Math.random() * Math.PI * 2;
      this.amplitude = 18 + Math.random() * 14;

      // Gelatina (Squash & Stretch)
      this.breathPhase = Math.random() * Math.PI * 2;
      this.breathFreq = 0.0035;

      // Estado de Boing (Rebote de hule ante toque de distractor)
      this.isBoing = false;
      this.boingTimer = 0;
      this.boingIntensity = 0;

      // Halo dorado de inactividad
      this.hasGoldenHalo = false;
      this.haloPulse = 0;

      // Modo arcoíris de celebración
      this.isRainbow = !!config.isRainbow;
      this.hue = Math.random() * 360;

      // Estado de vida
      this.isPopped = false;
      this.popAnimation = 0;
    }

    update(dt, time, canvasHeight) {
      if (this.isPopped) return;

      // 1. Desaceleración suave en el tercio superior de la pantalla
      let currentSpeed = this.speed;
      const topThird = canvasHeight * 0.33;
      if (this.y < topThird) {
        const factor = Math.max(0.45, this.y / topThird);
        currentSpeed *= factor;
      }

      // 2. Ascenso vertical
      this.y -= currentSpeed * (dt / 16.66);

      // 3. Oscilación horizontal: X = Xbase + sin(tiempo * frec + fase) * amp
      this.x = this.xBase + Math.sin(time * this.freq + this.phase) * this.amplitude;

      // 4. Temporizador de Boing
      if (this.isBoing) {
        this.boingTimer += dt;
        this.boingIntensity = Math.sin(this.boingTimer * 0.035) * Math.exp(-this.boingTimer * 0.006);
        if (this.boingTimer > 600) {
          this.isBoing = false;
          this.boingTimer = 0;
          this.boingIntensity = 0;
        }
      }

      // 5. Animación de halo dorado
      if (this.hasGoldenHalo) {
        this.haloPulse += dt * 0.005;
      }

      // 6. Ciclo de color en modo arcoíris
      if (this.isRainbow) {
        this.hue = (this.hue + dt * 0.2) % 360;
      }
    }

    // Hitbox Magnético: +25% de tolerancia para dedos preescolares
    containsPoint(px, py) {
      const magneticRadius = this.radius * 1.25;
      const dx = px - this.x;
      const dy = py - this.y;
      return dx * dx + dy * dy <= magneticRadius * magneticRadius;
    }

    triggerBoing() {
      this.isBoing = true;
      this.boingTimer = 0;
      this.boingIntensity = 1.0;
    }

    draw(ctx, time) {
      if (this.isPopped) return;

      ctx.save();
      ctx.translate(this.x, this.y);

      // Cálculo de Squash & Stretch (respiración gelatinosa)
      let scaleX = 1 + Math.sin(time * this.breathFreq + this.breathPhase) * 0.06;
      let scaleY = 1 - Math.sin(time * this.breathFreq + this.breathPhase) * 0.06;

      // Deformación elástica de Boing
      if (this.isBoing) {
        scaleX += this.boingIntensity * 0.25;
        scaleY -= this.boingIntensity * 0.25;
      }

      ctx.scale(scaleX, scaleY);

      const r = this.radius;

      // Halo Dorado de Inactividad (Pista Visual)
      if (this.hasGoldenHalo) {
        ctx.save();
        const pulse = Math.sin(this.haloPulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, r * (1.35 + pulse * 0.15), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${pulse * 0.8})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * (1.5 + pulse * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(253, 224, 71, ${pulse * 0.4})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // Dibujo del cuerpo de la burbuja (Esfera acuosa traslúcida)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);

      // Gradiente interno de la burbuja
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
      if (this.isRainbow) {
        grad.addColorStop(0, `hsla(${this.hue}, 90%, 80%, 0.85)`);
        grad.addColorStop(0.6, `hsla(${this.hue}, 80%, 65%, 0.45)`);
        grad.addColorStop(1, `hsla(${this.hue + 40}, 95%, 55%, 0.7)`);
      } else if (this.isBoing) {
        // Tinte ámbar de rebote amistoso
        grad.addColorStop(0, 'rgba(254, 215, 170, 0.8)');
        grad.addColorStop(0.6, 'rgba(251, 146, 60, 0.45)');
        grad.addColorStop(1, 'rgba(234, 88, 12, 0.65)');
      } else {
        // Burbuja marina azulina/cristalina
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.5, 'rgba(186, 230, 253, 0.35)');
        grad.addColorStop(0.85, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, 'rgba(14, 165, 233, 0.65)');
      }

      ctx.fillStyle = grad;
      ctx.fill();

      // Borde exterior suave con brillo
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = this.isRainbow
        ? `hsla(${this.hue}, 100%, 75%, 0.8)`
        : 'rgba(255, 255, 255, 0.75)';
      ctx.stroke();

      // Reflejo especular superior izquierdo (Brillo de cristal curvado)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-r * 0.38, -r * 0.38, r * 0.3, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();

      // Pequeño reflejo secundario inferior
      ctx.beginPath();
      ctx.arc(r * 0.42, r * 0.42, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      ctx.restore();

      // Renderizado de la Ilustración Vectorial SVG en memoria
      const img = window.Game.Data.imageCache[this.itemId];
      if (img && img.complete) {
        const itemSize = r * 1.25;
        ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize);
      }

      // Etiqueta opcional bajo el ícono (ej. sílaba o vocal para apoyo fonológico)
      if (this.label) {
        ctx.save();
        ctx.font = `bold ${Math.round(r * 0.34)}px "Quicksand", "Comic Sans MS", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sombra de texto
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillText(this.label, 1, r * 0.58 + 1);

        // Texto principal brillante
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.label, 0, r * 0.58);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // --- 2. CLASE ESTRELLA BÉZIER (SINCRONIZACIÓN MILIMÉTRICA CANVAS-DOM) ---
  class BezierStar {
    /**
     * @param {Object} start - Coordenadas en canvas {x, y}
     * @param {Object} end - Coordenadas en canvas {x, y} calculadas con getBoundingClientRect()
     * @param {Function} onArrival - Callback al llegar a la barra de estrellas
     */
    constructor(start, end, onArrival) {
      this.p0 = { x: start.x, y: start.y };
      this.p2 = { x: end.x, y: end.y };

      // Punto de control P1 para la curva de Bézier (arco suave hacia arriba)
      const midX = (start.x + end.x) / 2;
      const arcHeight = Math.abs(start.x - end.x) * 0.4 + 100;
      this.p1 = {
        x: midX + (Math.random() - 0.5) * 80,
        y: Math.min(start.y, end.y) - arcHeight
      };

      this.current = { x: start.x, y: start.y };
      this.progress = 0;
      this.duration = 850; // milisegundos de vuelo majestuoso
      this.elapsed = 0;
      this.rotation = 0;
      this.scale = 0.4;
      this.isFinished = false;
      this.onArrival = onArrival;

      // Partículas de estela dorada
      this.trail = [];
    }

    update(dt) {
      if (this.isFinished) return;

      this.elapsed += dt;
      this.progress = Math.min(1, this.elapsed / this.duration);

      // Curva de Bézier cuadrática: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const t = this.progress;
      const invT = 1 - t;
      this.current.x = invT * invT * this.p0.x + 2 * invT * t * this.p1.x + t * t * this.p2.x;
      this.current.y = invT * invT * this.p0.y + 2 * invT * t * this.p1.y + t * t * this.p2.y;

      // Efecto de escala elástica (crece hasta 1.4 y se asienta en 1.0)
      if (t < 0.4) {
        this.scale = 0.4 + (t / 0.4) * 1.0;
      } else {
        this.scale = 1.4 - ((t - 0.4) / 0.6) * 0.4;
      }

      this.rotation += dt * 0.008;

      // Añadir chispa a la estela dorada
      if (Math.random() < 0.8) {
        this.trail.push({
          x: this.current.x + (Math.random() - 0.5) * 12,
          y: this.current.y + (Math.random() - 0.5) * 12,
          size: 4 + Math.random() * 5,
          alpha: 1.0,
          color: Math.random() > 0.4 ? '#facc15' : '#ffffff'
        });
      }

      // Actualizar estela
      for (let i = this.trail.length - 1; i >= 0; i--) {
        const p = this.trail[i];
        p.alpha -= dt * 0.0035;
        p.size *= 0.96;
        if (p.alpha <= 0) {
          this.trail.splice(i, 1);
        }
      }

      // Llegada exacta al slot de la estrella
      if (this.progress >= 1) {
        this.isFinished = true;
        if (typeof this.onArrival === 'function') {
          this.onArrival();
        }
      }
    }

    draw(ctx) {
      if (this.isFinished && this.trail.length === 0) return;

      // Dibujar estela dorada
      ctx.save();
      for (const p of this.trail) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
      }
      ctx.restore();

      if (this.isFinished) return;

      // Dibujar estrella brillante en vuelo
      ctx.save();
      ctx.translate(this.current.x, this.current.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);

      // Resplandor áurico
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.fill();

      // Forma de estrella dorada
      ctx.beginPath();
      const spikes = 5;
      const outerR = 24;
      const innerR = 11;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerR);
      for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerR;
        let y = Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerR;
        y = Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerR);
      ctx.closePath();

      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Brillo central blanco
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }
  }

  // --- 3. SISTEMA DE PARTÍCULAS: GOTAS DE AGUA Y CONFETI MULTICOLOR ---
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }

    // Explosión de burbuja (gotas de agua cristalina y chispas)
    spawnBubblePop(x, y, radius) {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 5.5;
        this.particles.push({
          x: x + Math.cos(angle) * (radius * 0.6),
          y: y + Math.sin(angle) * (radius * 0.6),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          gravity: 0.14,
          radius: 3 + Math.random() * 4,
          alpha: 1.0,
          color: Math.random() > 0.3 ? '#7dd3fc' : '#ffffff',
          type: 'water',
          life: 0,
          maxLife: 450 + Math.random() * 200
        });
      }
    }

    // Confeti de fiesta para aciertos y celebración
    spawnConfetti(x, y, count = 30) {
      const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#4ade80', '#c084fc', '#fb923c'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          gravity: 0.18,
          w: 8 + Math.random() * 6,
          h: 5 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: 'confetti',
          life: 0,
          maxLife: 800 + Math.random() * 400
        });
      }
    }

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += dt;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.type === 'confetti') {
          p.rotation += p.rotSpeed;
          p.vx *= 0.98; // Resistencia de aire
        }

        if (p.life >= p.maxLife || p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw(ctx) {
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === 'water') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === 'confetti') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }
    }
  }

  // --- 4. ONDAS DE AGUA Y MICRO-INTERACCIONES (FONDO VIVO) ---
  class WaterRipple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 8;
      this.maxRadius = 75 + Math.random() * 35;
      this.alpha = 0.85;
      this.isDone = false;

      // 2 pequeñas microburbujas que nacen del toque
      this.bubbles = [
        { x: x + (Math.random() - 0.5) * 20, y: y, r: 4 + Math.random() * 3, vy: -1.2 - Math.random() * 1.5, alpha: 0.9 },
        { x: x + (Math.random() - 0.5) * 20, y: y, r: 3 + Math.random() * 2, vy: -1.5 - Math.random() * 1.5, alpha: 0.9 }
      ];
    }

    update(dt) {
      this.radius += dt * 0.12;
      this.alpha = Math.max(0, 1 - this.radius / this.maxRadius);

      for (const b of this.bubbles) {
        b.y += b.vy * (dt / 16.66);
        b.alpha -= dt * 0.0018;
      }

      if (this.radius >= this.maxRadius || this.alpha <= 0) {
        this.isDone = true;
      }
    }

    draw(ctx) {
      ctx.save();
      // Ondas concéntricas suaves
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.7})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(1, this.radius * 0.6), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${this.alpha * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Microburbujas decorativas
      for (const b of this.bubbles) {
        if (b.alpha > 0) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`;
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // --- 5. ESCENARIOS VIVOS PARA LOS 3 MUNDOS (REGLA 4) ---
  class WorldScenery {
    constructor() {
      this.worldNumber = 1;
      this.time = 0;

      // Elementos decorativos para Mundo 1 (Rayos de luz y algas mecidas)
      this.algae = [];
      for (let i = 0; i < 9; i++) {
        this.algae.push({
          xPct: (i + 0.5) / 9,
          height: 120 + Math.random() * 90,
          color: i % 2 === 0 ? '#0d9488' : '#059669',
          phase: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.0015
        });
      }

      // Elementos para Mundo 2 (Nenúfares y flores de loto flotantes)
      this.lilies = [];
      for (let i = 0; i < 6; i++) {
        this.lilies.push({
          xPct: 0.1 + (i / 5) * 0.8,
          yPct: 0.72 + (Math.random() - 0.5) * 0.16,
          radius: 36 + Math.random() * 18,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0018 + Math.random() * 0.001,
          hasFlower: i % 2 === 0
        });
      }

      // Elementos para Mundo 3 (Luciérnagas mágicas y siluetas del bosque)
      this.fireflies = [];
      for (let i = 0; i < 18; i++) {
        this.fireflies.push({
          xPct: Math.random(),
          yPct: Math.random() * 0.85,
          radius: 3 + Math.random() * 3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.002,
          pulseSpeed: 0.004 + Math.random() * 0.003
        });
      }
    }

    setWorld(number) {
      this.worldNumber = number;
    }

    update(dt) {
      this.time += dt;
    }

    draw(ctx, width, height) {
      ctx.save();

      if (this.worldNumber === 1) {
        // --- MUNDO 1: EL ARRECIFE DE LOS SONIDOS (Submarino Turquesa) ---
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#38bdf8');   // Superficie celeste luminosa
        grad.addColorStop(0.35, '#0284c7'); // Turquesa medio
        grad.addColorStop(1, '#0369a1');   // Profundidad marina
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Rayos de sol subacuáticos ("God Rays")
        ctx.save();
        for (let i = 0; i < 5; i++) {
          const rayX = width * (0.15 + i * 0.18) + Math.sin(this.time * 0.001 + i) * 30;
          const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 60, height * 0.8);
          rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
          rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(rayX - 20, 0);
          ctx.lineTo(rayX + 30, 0);
          ctx.lineTo(rayX + 110, height);
          ctx.lineTo(rayX - 20, height);
          ctx.closePath();
          ctx.fillStyle = rayGrad;
          ctx.fill();
        }
        ctx.restore();

        // Algas y corales que se mecen suavemente en el lecho marino
        for (const alg of this.algae) {
          const baseX = alg.xPct * width;
          const sway = Math.sin(this.time * alg.speed + alg.phase) * 28;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(baseX - 12, height);
          ctx.quadraticCurveTo(baseX + sway * 0.5, height - alg.height * 0.5, baseX + sway, height - alg.height);
          ctx.quadraticCurveTo(baseX + sway * 0.5 + 14, height - alg.height * 0.5, baseX + 12, height);
          ctx.fillStyle = alg.color;
          ctx.globalAlpha = 0.65;
          ctx.fill();
          ctx.restore();
        }

      } else if (this.worldNumber === 2) {
        // --- MUNDO 2: LA LAGUNA DE LAS VOCALES (Agua Aguamarina y Nenúfares) ---
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#5eead4');
        grad.addColorStop(0.4, '#14b8a6');
        grad.addColorStop(1, '#0f766e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ondas suaves de superficie
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 3;
        for (let j = 1; j <= 4; j++) {
          const yWave = height * (j * 0.22);
          ctx.beginPath();
          ctx.moveTo(0, yWave);
          for (let x = 0; x <= width; x += 30) {
            const dy = Math.sin(x * 0.015 + this.time * 0.002 + j) * 8;
            ctx.lineTo(x, yWave + dy);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Nenúfares flotantes con flores de loto
        for (const lily of this.lilies) {
          const lx = lily.xPct * width + Math.sin(this.time * lily.speed + lily.phase) * 12;
          const ly = lily.yPct * height + Math.cos(this.time * lily.speed + lily.phase) * 8;

          ctx.save();
          ctx.translate(lx, ly);

          // Hoja de nenúfar redonda con corte en 'V'
          ctx.beginPath();
          ctx.arc(0, 0, lily.radius, 0.35, Math.PI * 1.85);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fillStyle = '#15803d';
          ctx.globalAlpha = 0.65;
          ctx.fill();
          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Flor de loto tierna si corresponde
          if (lily.hasFlower) {
            ctx.beginPath();
            ctx.arc(0, -6, 12, 0, Math.PI * 2);
            ctx.fillStyle = '#fbcfe8';
            ctx.globalAlpha = 0.9;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, -6, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fde047';
            ctx.fill();
          }

          ctx.restore();
        }

      } else {
        // --- MUNDO 3: EL BOSQUE MÁGICO (Atardecer Mágico e Índigo con Luciérnagas) ---
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#1e1b4b');   // Noche índigo arriba
        grad.addColorStop(0.5, '#4338ca'); // Violeta mágico
        grad.addColorStop(1, '#831843');   // Cálido atardecer en la base
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Siluetas de árboles y ramas suaves al fondo
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.globalAlpha = 0.35;
        // Colina suave
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.quadraticCurveTo(width * 0.5, height - 160, width, height);
        ctx.fill();

        // Troncos y copas
        [0.08, 0.28, 0.72, 0.92].forEach((xRatio) => {
          const tx = xRatio * width;
          ctx.fillRect(tx - 12, height - 220, 24, 220);
          ctx.beginPath();
          ctx.arc(tx, height - 230, 60, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Luciérnagas mágicas flotando y pulsando
        for (const fly of this.fireflies) {
          const fx = (fly.xPct * width + Math.sin(this.time * fly.speed + fly.phase) * 25) % width;
          const fy = fly.yPct * height + Math.cos(this.time * fly.speed + fly.phase) * 15;
          const pulse = Math.sin(this.time * fly.pulseSpeed + fly.phase) * 0.4 + 0.6;

          ctx.save();
          // Halo de luz
          ctx.beginPath();
          ctx.arc(fx, fy, fly.radius * (3 + pulse * 2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${pulse * 0.35})`;
          ctx.fill();

          // Núcleo brillante de la luciérnaga
          ctx.beginPath();
          ctx.arc(fx, fy, fly.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
    }
  }

  // --- 6. MASCOTA REACTIVA EN PANTALLA (PULPITO CORAL / BÚHO LUMI) ---
  class Mascot {
    constructor() {
      this.x = 80;
      this.y = 80;
      this.size = 70;
      this.mood = 'idle'; // 'idle', 'celebrate', 'encourage', 'wave'
      this.moodTimer = 0;
      this.lookAtX = 200;
      this.lookAtY = 200;
      this.breathTime = 0;
    }

    setMood(mood, duration = 1500) {
      this.mood = mood;
      this.moodTimer = duration;
    }

    update(dt, targetBubble) {
      this.breathTime += dt * 0.004;

      if (this.moodTimer > 0) {
        this.moodTimer -= dt;
        if (this.moodTimer <= 0) {
          this.mood = 'idle';
        }
      }

      // Seguimiento de la mirada a la burbuja más cercana
      if (targetBubble) {
        this.lookAtX = targetBubble.x;
        this.lookAtY = targetBubble.y;
      }
    }

    setPosition(x, y, size) {
      this.x = x;
      this.y = y;
      if (size) this.size = size;
    }

    draw(ctx, worldNumber) {
      ctx.save();
      ctx.translate(this.x, this.y);

      const s = this.size;
      const breathe = Math.sin(this.breathTime) * 3;

      if (worldNumber === 3) {
        // --- BÚHO LUMI (Para el Bosque Mágico) ---
        ctx.save();
        ctx.translate(0, breathe);

        // Cuerpo búho
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.44, s * 0.52, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.fill();
        ctx.strokeStyle = '#4338ca';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pecho crema
        ctx.beginPath();
        ctx.ellipse(0, s * 0.15, s * 0.28, s * 0.32, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#e0e7ff';
        ctx.fill();

        // Cuencas oculares grandes
        [-s * 0.18, s * 0.18].forEach((eyeX) => {
          ctx.beginPath();
          ctx.arc(eyeX, -s * 0.12, s * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#4338ca';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Pupilas que siguen la burbuja
          const dx = this.lookAtX - (this.x + eyeX);
          const dy = this.lookAtY - (this.y - s * 0.12);
          const angle = Math.atan2(dy, dx);
          const dist = Math.min(s * 0.08, Math.hypot(dx, dy) * 0.05);

          const px = eyeX + Math.cos(angle) * dist;
          const py = -s * 0.12 + Math.sin(angle) * dist;

          ctx.beginPath();
          ctx.arc(px, py, s * 0.09, 0, Math.PI * 2);
          ctx.fillStyle = '#1e1b4b';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px + 2, py - 2, s * 0.035, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        // Pico amarillo
        ctx.beginPath();
        ctx.polygon = [[0, -s * 0.04], [-s * 0.08, 0], [s * 0.08, 0]];
        ctx.moveTo(0, s * 0.06);
        ctx.lineTo(-s * 0.07, -s * 0.04);
        ctx.lineTo(s * 0.07, -s * 0.04);
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        ctx.restore();

      } else {
        // --- PULPITO CORAL (Para Arrecife y Laguna) ---
        ctx.save();
        ctx.translate(0, breathe);

        // Cabeza redonda rosada
        ctx.beginPath();
        ctx.arc(0, -s * 0.08, s * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6';
        ctx.fill();
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Tentáculos animados
        for (let i = -3; i <= 3; i++) {
          const tX = i * (s * 0.11);
          const tWobble = Math.sin(this.breathTime * 1.5 + i) * 6;
          ctx.beginPath();
          ctx.moveTo(tX - 4, s * 0.15);
          ctx.quadraticCurveTo(tX + tWobble, s * 0.42, tX, s * 0.48);
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Mejillas rosadas
        ctx.beginPath();
        ctx.arc(-s * 0.22, s * 0.04, s * 0.08, 0, Math.PI * 2);
        ctx.arc(s * 0.22, s * 0.04, s * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.fill();

        // Ojos tiernos
        [-s * 0.15, s * 0.15].forEach((eyeX) => {
          ctx.beginPath();
          ctx.arc(eyeX, -s * 0.08, s * 0.14, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#db2777';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Pupila reactiva
          const dx = this.lookAtX - (this.x + eyeX);
          const dy = this.lookAtY - (this.y - s * 0.08);
          const angle = Math.atan2(dy, dx);
          const dist = Math.min(s * 0.06, Math.hypot(dx, dy) * 0.04);

          const px = eyeX + Math.cos(angle) * dist;
          const py = -s * 0.08 + Math.sin(angle) * dist;

          ctx.beginPath();
          ctx.arc(px, py, s * 0.075, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px + 2, py - 2, s * 0.03, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        // Sonrisa alegre o expresión según el estado
        ctx.beginPath();
        if (this.mood === 'celebrate') {
          // Gran boca abierta feliz
          ctx.arc(0, 0.05 * s, 0.1 * s, 0, Math.PI);
          ctx.fillStyle = '#e11d48';
          ctx.fill();
        } else if (this.mood === 'encourage') {
          // Boquita curiosa "O" tierna
          ctx.arc(0, 0.06 * s, 0.05 * s, 0, Math.PI * 2);
          ctx.fillStyle = '#e11d48';
          ctx.fill();
        } else {
          // Sonrisa suave
          ctx.arc(0, 0.02 * s, 0.09 * s, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.strokeStyle = '#831843';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    }
  }

  // Exponer al objeto global Game
  window.Game.Entities = {
    Bubble,
    BezierStar,
    ParticleSystem,
    WaterRipple,
    WorldScenery,
    Mascot
  };
})();
