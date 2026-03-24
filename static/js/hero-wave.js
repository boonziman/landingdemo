/* ============================================================
   Synapse AI — Hero Flowing Ribbon Animation
   Canvas-based animated metallic/holographic wave effect.
   Multiple layered ribbons with shifting gradients,
   specular highlights, and organic sine-based movement.
   ============================================================ */
(function () {
  'use strict';

  class HeroWave {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.time = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = 0;
      this.height = 0;
      this.animId = null;
      this.isVisible = true;

      this._onResize = () => this.resize();
      this._onVisChange = () => {
        this.isVisible = !document.hidden;
        if (this.isVisible && !this.animId) this.loop();
      };

      window.addEventListener('resize', this._onResize);
      document.addEventListener('visibilitychange', this._onVisChange);

      this.resize();
      this.loop();
    }

    /* ── Canvas sizing ─────────────────────────────────────── */
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
    }

    /* ── Multi-frequency wave for organic movement ─────────── */
    wave(x, freq, speed, phase) {
      const t = this.time;
      return (
        Math.sin(x * freq + t * speed + phase) +
        Math.sin(x * freq * 1.8 + t * speed * 0.6 + phase + 1.3) * 0.45 +
        Math.sin(x * freq * 0.5 + t * speed * 1.15 + phase + 2.7) * 0.35 +
        Math.cos(x * freq * 2.4 + t * speed * 0.35 + phase + 0.8) * 0.15
      );
    }

    /* ── Draw a single ribbon layer ────────────────────────── */
    drawRibbon(cfg) {
      const ctx = this.ctx;
      const w = this.width;
      const step = 3;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      /* — Glow behind ribbon — */
      if (cfg.glowColor) {
        ctx.save();
        ctx.filter = 'blur(' + cfg.glowSize + 'px)';
        ctx.globalAlpha = cfg.opacity * 0.3;
        ctx.beginPath();
        for (var x = 0; x <= w; x += step * 2) {
          var gy = cfg.baseY + this.wave(x, cfg.freq, cfg.speed, cfg.phase) * cfg.amplitude;
          x === 0 ? ctx.moveTo(x, gy) : ctx.lineTo(x, gy);
        }
        ctx.strokeStyle = cfg.glowColor;
        ctx.lineWidth = cfg.thickness * 1.2;
        ctx.stroke();
        ctx.restore();
      }

      /* — Build top + bottom paths — */
      var top = [];
      var bot = [];
      for (var x = -10; x <= w + 10; x += step) {
        var wv = this.wave(x, cfg.freq, cfg.speed, cfg.phase);
        var y = cfg.baseY + wv * cfg.amplitude;
        top.push({ x: x, y: y });

        // Dynamic thickness simulates 3-D twist
        var twist = Math.sin(
          x * cfg.freq * 1.1 + this.time * cfg.speed * 0.4 + cfg.phase * 1.5
        );
        var fold = 0.25 + (twist * 0.5 + 0.5) * 0.75;
        var thick = cfg.thickness * fold;

        var bwv = this.wave(
          x, cfg.freq * 1.03, cfg.speed * 0.97, cfg.phase + 0.4
        );
        bot.push({ x: x, y: cfg.baseY + bwv * cfg.amplitude + thick });
      }

      /* — Fill ribbon shape — */
      ctx.globalAlpha = cfg.opacity;
      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      for (var i = 1; i < top.length; i++) ctx.lineTo(top[i].x, top[i].y);
      for (var i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i].x, bot[i].y);
      ctx.closePath();

      // Shifting gradient → iridescent / holographic look
      var shift = Math.sin(this.time * 0.15) * w * 0.12;
      var grad = ctx.createLinearGradient(shift, 0, w + shift, 0);
      cfg.colors.forEach(function (c, i) {
        grad.addColorStop(i / (cfg.colors.length - 1), c);
      });
      ctx.fillStyle = grad;
      ctx.fill();

      /* — Specular highlight along top edge — */
      if (cfg.highlight) {
        ctx.beginPath();
        ctx.moveTo(top[0].x, top[0].y);
        for (var i = 1; i < top.length; i++) ctx.lineTo(top[i].x, top[i].y);
        var hl = ctx.createLinearGradient(shift, 0, w + shift, 0);
        hl.addColorStop(0,    'rgba(255,255,255,0)');
        hl.addColorStop(0.12, 'rgba(255,255,255,0.08)');
        hl.addColorStop(0.28, 'rgba(255,255,255,0.35)');
        hl.addColorStop(0.45, 'rgba(255,255,255,0.04)');
        hl.addColorStop(0.6,  'rgba(255,255,255,0.3)');
        hl.addColorStop(0.78, 'rgba(255,255,255,0.06)');
        hl.addColorStop(1,    'rgba(255,255,255,0)');
        ctx.strokeStyle = hl;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }

    /* ── Compose all layers ────────────────────────────────── */
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var h = this.height;
      var cy = h * 0.48; // vertical center of the wave cluster

      /* Layer 1 — deep background ribbon (large, blurry, subtle) */
      this.drawRibbon({
        baseY: cy + 30,  amplitude: 65,  freq: 0.002,  speed: 0.22,
        phase: 0,  thickness: 110,
        colors: [
          'rgba(112,0,255,0.05)', 'rgba(152,58,214,0.1)',
          'rgba(0,229,255,0.07)', 'rgba(112,0,255,0.05)'
        ],
        opacity: 0.45,  glowColor: '#7000FF',  glowSize: 60,  highlight: false
      });

      /* Layer 2 — secondary depth ribbon */
      this.drawRibbon({
        baseY: cy + 45,  amplitude: 38,  freq: 0.006,  speed: 0.5,
        phase: 5.2,  thickness: 50,
        colors: [
          'rgba(0,229,255,0.06)', 'rgba(112,0,255,0.18)',
          'rgba(152,58,214,0.22)', 'rgba(0,229,255,0.12)',
          'rgba(0,229,255,0.06)'
        ],
        opacity: 0.45,  glowColor: '#00E5FF',  glowSize: 32,  highlight: true
      });

      /* Layer 3 — mid ribbon */
      this.drawRibbon({
        baseY: cy + 8,  amplitude: 50,  freq: 0.0035,  speed: 0.38,
        phase: 1.8,  thickness: 75,
        colors: [
          'rgba(170,140,220,0.12)', 'rgba(201,103,232,0.3)',
          'rgba(152,58,214,0.28)', 'rgba(0,229,255,0.18)',
          'rgba(170,140,220,0.12)'
        ],
        opacity: 0.6,  glowColor: '#C967E8',  glowSize: 42,  highlight: true
      });

      /* Layer 4 — main ribbon (most visible, metallic feel) */
      this.drawRibbon({
        baseY: cy - 8,  amplitude: 42,  freq: 0.005,  speed: 0.48,
        phase: 3.5,  thickness: 58,
        colors: [
          'rgba(210,190,245,0.2)', 'rgba(250,147,250,0.38)',
          'rgba(201,103,232,0.48)', 'rgba(152,58,214,0.38)',
          'rgba(0,229,255,0.28)', 'rgba(210,190,245,0.2)'
        ],
        opacity: 0.7,  glowColor: '#FA93FA',  glowSize: 28,  highlight: true
      });

      /* Layer 5 — thin bright specular ribbon */
      this.drawRibbon({
        baseY: cy - 16,  amplitude: 44,  freq: 0.0046,  speed: 0.45,
        phase: 3.0,  thickness: 14,
        colors: [
          'rgba(255,255,255,0.01)', 'rgba(255,255,255,0.08)',
          'rgba(200,180,255,0.14)', 'rgba(255,255,255,0.05)',
          'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.01)'
        ],
        opacity: 0.55,  glowColor: null,  glowSize: 0,  highlight: false
      });

      /* Layer 6 — front accent ribbon (small, bright) */
      this.drawRibbon({
        baseY: cy + 20,  amplitude: 32,  freq: 0.007,  speed: 0.58,
        phase: 4.5,  thickness: 35,
        colors: [
          'rgba(250,147,250,0.08)', 'rgba(201,103,232,0.2)',
          'rgba(0,229,255,0.25)', 'rgba(112,0,255,0.18)',
          'rgba(250,147,250,0.08)'
        ],
        opacity: 0.5,  glowColor: '#00E5FF',  glowSize: 20,  highlight: true
      });
    }

    /* ── Animation loop ────────────────────────────────────── */
    loop() {
      if (!this.isVisible) { this.animId = null; return; }
      this.draw();
      this.time += 0.006;
      this.animId = requestAnimationFrame(this.loop.bind(this));
    }
  }

  /* ── Initialize ──────────────────────────────────────────── */
  function init() { new HeroWave('hero-wave-canvas'); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
