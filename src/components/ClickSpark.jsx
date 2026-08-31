import { useEffect, useRef } from 'react';

/**
 * A burst of short lines thrown outward from wherever the page was pressed.
 *
 * The press states on the controls answer the finger on the control itself.
 * This answers it everywhere else, so a press that lands on the page rather
 * than on a button still produces something. It fires on pointerdown rather
 * than on click so it arrives with the press instead of waiting for the
 * release, which on a held button would be a visible delay.
 *
 * It draws on one full-viewport canvas rather than on inserted elements,
 * because a press can land on any node on the page and mutating that node's
 * subtree to decorate it would disturb layout, risk being clipped by an
 * overflow: hidden ancestor, and on a control disturb its own press animation.
 *
 * The canvas never takes the pointer and is hidden from assistive technology:
 * it carries no information, and a reader who cannot see it has missed nothing.
 */

// Spark geometry, in CSS pixels. The count reads as a compass rose rather than
// as a scatter, which suits a brand whose subject is measurement.
const SPARK_COUNT = 8;
const SPARK_RADIUS = 20;
const SPARK_LENGTH = 10;
const LINE_WIDTH = 2;
const DURATION = 420;

// The site's --ease-quart-out as a scalar, so the burst decelerates on the same
// curve as every other motion on the page.
const easeQuartOut = (t) => 1 - (1 - t) ** 4;

export default function ClickSpark() {
  const canvasRef = useRef(null);
  // Live sparks, and the animation frame that is draining them. Both are refs
  // because the draw loop runs outside React and must not re-render the tree on
  // every frame.
  const sparks = useRef([]);
  const frame = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // The accent is read back off the stylesheet rather than restated here, so
    // the three themes stay defined in exactly one place. It is re-read on every
    // theme change because each theme moves the accent to a step that holds up
    // on its own ground.
    let stroke = '';
    const readAccent = () => {
      stroke = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    };

    // A canvas backing store sized to the device pixel ratio keeps a 2px line
    // from landing blurry on a retina screen. Drawing stays in CSS pixels.
    const size = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const clear = () => context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const draw = (now) => {
      clear();
      context.strokeStyle = stroke;
      context.lineWidth = LINE_WIDTH;
      context.lineCap = 'round';
      // Each spark is a line whose near end travels out from the click point
      // while its length shrinks, so the burst reads as thrown rather than as
      // grown. A spark past its duration is dropped on the frame it expires.
      sparks.current = sparks.current.filter((spark) => {
        const elapsed = now - spark.start;
        if (elapsed >= DURATION) return false;
        const eased = easeQuartOut(elapsed / DURATION);
        const distance = eased * SPARK_RADIUS;
        const length = SPARK_LENGTH * (1 - eased);
        const cos = Math.cos(spark.angle);
        const sin = Math.sin(spark.angle);
        context.beginPath();
        context.moveTo(spark.x + distance * cos, spark.y + distance * sin);
        context.lineTo(spark.x + (distance + length) * cos, spark.y + (distance + length) * sin);
        context.stroke();
        return true;
      });

      if (sparks.current.length > 0) {
        frame.current = requestAnimationFrame(draw);
      } else {
        // The last frame leaves the canvas painted, so it is wiped once here
        // rather than by keeping an empty loop running to do it.
        clear();
        frame.current = null;
      }
    };

    const onPointerDown = (event) => {
      if (motionQuery.matches) return;
      // Left button only. A right-click is opening a context menu and does not
      // want a flourish underneath it, and a middle-click is opening a tab.
      if (event.button !== 0) return;
      const start = performance.now();
      for (let i = 0; i < SPARK_COUNT; i += 1) {
        sparks.current.push({
          x: event.clientX,
          y: event.clientY,
          angle: (2 * Math.PI * i) / SPARK_COUNT,
          start,
        });
      }
      if (frame.current === null) frame.current = requestAnimationFrame(draw);
    };

    // A visitor who turns motion off mid-visit should see the burst stop, not
    // finish its queue.
    const onMotionChange = () => {
      if (!motionQuery.matches) return;
      sparks.current = [];
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      clear();
    };

    // Resizing resets the backing store, which clears what was drawn, so the
    // queue is dropped with it rather than resuming against a blank canvas.
    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        size();
        sparks.current = [];
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
      }, 100);
    };

    // The accent follows the attribute when a theme is chosen, and the system
    // preference when none is.
    const observer = new MutationObserver(readAccent);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    readAccent();
    size();
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    schemeQuery.addEventListener('change', readAccent);
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
      schemeQuery.removeEventListener('change', readAccent);
      motionQuery.removeEventListener('change', onMotionChange);
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-toast"
    />
  );
}
