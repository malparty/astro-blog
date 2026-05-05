(function () {
  'use strict';

  function init() {
    var canvas = document.querySelector('.particles-canvas');
    if (!canvas) return;

    var ctx   = canvas.getContext('2d');
    var scene = canvas.closest('.meadow-scene') || canvas.parentElement;

    function resize() {
      canvas.width  = scene.offsetWidth  || window.innerWidth;
      canvas.height = scene.offsetHeight || 260;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function isDark() {
      var t = document.documentElement.getAttribute('data-theme');
      if (t === 'dark')  return true;
      if (t === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    var COUNT = window.innerWidth < 640 ? 9 : 20;

    function makeParticle() {
      return {
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height * 0.78,
        r:  Math.random() * 2 + 0.7,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(Math.random() * 0.22 + 0.07),
        a:  Math.random(),
        da: (Math.random() * 0.013 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
      };
    }

    var particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(makeParticle());

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dark = isDark();

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.da;
        if (p.a > 1) { p.a = 1; p.da = -Math.abs(p.da); }
        if (p.a < 0) { p.a = 0; p.da =  Math.abs(p.da); }

        if (p.y < -10 || p.x < -30 || p.x > canvas.width + 30) {
          var np = makeParticle();
          np.x = Math.random() * canvas.width;
          np.y = canvas.height * 0.55 + Math.random() * canvas.height * 0.3;
          particles[j] = np;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.a;

        if (dark) {
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0,   'rgba(150, 255, 90, 1)');
          g.addColorStop(0.4, 'rgba(100, 220, 50, 0.6)');
          g.addColorStop(1,   'rgba(60,  180, 20, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(215, 170, 40, 0.88)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(190, 145, 25, 0.5)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (Math.random() - 0.5) * 1.5, p.y + p.r * 3.5);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
