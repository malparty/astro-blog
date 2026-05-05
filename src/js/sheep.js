(function () {
  'use strict';

  function init() {
    var walker  = document.querySelector('.sheep-walker');
    var flipper = document.querySelector('.sheep-flipper');
    if (!walker || !flipper) return;

    var pos   = 8;      // % from left
    var dir   = 1;      // 1 = right, -1 = left
    var speed = 0.028;  // % per frame at 60 fps ≈ 1.7% per second

    var grazing = false;
    var grazeLeft = 0;

    function flip() {
      flipper.style.transform = dir > 0 ? '' : 'scaleX(-1)';
    }

    function step() {
      requestAnimationFrame(step);

      if (grazing) {
        if (--grazeLeft <= 0) {
          grazing = false;
          walker.classList.remove('is-grazing');
        }
        return;
      }

      if (Math.random() < 0.0004) {
        grazing = true;
        grazeLeft = 100 + Math.floor(Math.random() * 110); // ~1.7–3.5s at 60fps
        walker.classList.add('is-grazing');
        return;
      }

      pos += dir * speed;
      if (pos >= 80 && dir > 0) { dir = -1; flip(); }
      if (pos <= 4  && dir < 0) { dir =  1; flip(); }

      walker.style.left = pos.toFixed(2) + '%';
    }

    walker.style.left = pos + '%';
    flip();
    requestAnimationFrame(step);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
