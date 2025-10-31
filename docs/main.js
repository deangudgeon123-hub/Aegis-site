(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowSpecDevice = typeof navigator !== 'undefined' && 'deviceMemory' in navigator && navigator.deviceMemory && navigator.deviceMemory < 4;

  document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion && !lowSpecDevice) {
      initEnergyRain();
    } else {
      const canvas = document.getElementById('energy-rain');
      if (canvas) {
        canvas.style.display = 'none';
      }
    }

    initMotion(prefersReducedMotion);
    initAnchors();
  });

  function initAnchors() {
    const waitlist = document.getElementById('hero-waitlist');
    if (!waitlist) return;

    waitlist.addEventListener('click', (event) => {
      const target = document.getElementById('contact');
      if (!target) return;
      event.preventDefault();

      if (window.ScrollSmoother && window.ScrollSmoother.get()) {
        window.ScrollSmoother.get().scrollTo(target, true, 'power2.out');
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function initMotion(isReduced) {
    if (isReduced) {
      revealFallback();
      return;
    }

    if (typeof gsap === 'undefined') {
      console.warn('GSAP failed to load. Using fallback animations.');
      revealFallback();
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: true
      });

      const heroTimeline = gsap.timeline({ delay: 0.4 });
      heroTimeline
        .fromTo(
          '.hero__logo',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
        )
        .fromTo(
          '.hero [data-animate]',
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.12
          },
          '-=0.9'
        );

      document.querySelectorAll('[data-section]').forEach((section) => {
        const animateTargets = section.querySelectorAll('[data-animate]');
        if (!animateTargets.length) return;

        gsap.fromTo(
          animateTargets,
          {
            opacity: 0,
            y: 60,
            x: (index) => (index % 2 === 0 ? -40 : 40)
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            ease: 'power2.out',
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'bottom 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom top',
          onEnter: () => gsap.to(section, { opacity: 1, duration: 0.6 }),
          onEnterBack: () => gsap.to(section, { opacity: 1, duration: 0.6 }),
          onLeave: () => gsap.to(section, { opacity: 0.3, duration: 0.6 }),
          onLeaveBack: () => gsap.to(section, { opacity: 0.3, duration: 0.6 })
        });
      });

      if (document.querySelector('.background-system')) {
        gsap.to('.background-system', {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#smooth-content',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
          }
        });
      }
    } catch (error) {
      console.warn('Motion initialization failed.', error);
      revealFallback();
    }
  }

  function revealFallback() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function initEnergyRain() {
    const canvas = document.getElementById('energy-rain');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let animationFrame;
    let lastTimestamp = performance.now();
    let lastFrameTime = 0;
    const frameInterval = 1000 / 60;

    const gridState = {
      cellSize: 100,
      columns: [],
      rows: [],
      driftX: 0,
      driftY: 0
    };
    const flows = [];

    let targetScrollY = window.scrollY || 0;
    let smoothedScrollY = targetScrollY;

    function resize() {
      width = Math.round(canvas.clientWidth);
      height = Math.round(canvas.clientHeight);
      const ratio = devicePixelRatio;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      updateGrid();
      rebuildFlows();
    }

    function updateGrid() {
      const idealSize = Math.min(Math.max(width / 5, 80), 100);
      gridState.cellSize = idealSize;
      gridState.columns = [];
      gridState.rows = [];
      const startX = -idealSize * 3;
      const endX = width + idealSize * 3;
      for (let x = startX; x <= endX; x += idealSize) {
        gridState.columns.push(x);
      }
      const startY = -idealSize * 3;
      const endY = height + idealSize * 3;
      for (let y = startY; y <= endY; y += idealSize) {
        gridState.rows.push(y);
      }
    }

    function rebuildFlows() {
      flows.length = 0;
      const columnCount = gridState.columns.length;
      for (let i = 0; i < columnCount; i += 1) {
        const baseFlowCount = width < 768 ? 1 : 2;
        const additional = Math.random() > 0.65 ? 1 : 0;
        const flowTotal = baseFlowCount + additional;
        for (let j = 0; j < flowTotal; j += 1) {
          flows.push({
            columnIndex: i,
            progress: Math.random(),
            duration: randomRange(4.6, 7.4),
            length: gridState.cellSize * randomRange(2, 2.8),
            thickness: randomRange(1.5, 2.8),
            intensity: randomRange(0.16, 0.32),
            phase: Math.random()
          });
        }
      }
    }

    function randomRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function update(timestamp) {
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval) {
        animationFrame = window.requestAnimationFrame(update);
        return;
      }

      lastFrameTime = timestamp;
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      smoothedScrollY += (targetScrollY - smoothedScrollY) * 0.08;

      gridState.driftX = (gridState.driftX + delta * 8) % gridState.cellSize;
      gridState.driftY = (gridState.driftY + delta * 12) % gridState.cellSize;

      context.clearRect(0, 0, width, height);

      const offsets = drawGrid(smoothedScrollY);
      drawFlows(delta, smoothedScrollY, offsets);

      animationFrame = window.requestAnimationFrame(update);
    }

    function drawGrid(scrollY) {
      const columnShift = (gridState.driftX + scrollY * 0.02) % gridState.cellSize;
      const rowShift = (gridState.driftY + scrollY * 0.04) % gridState.cellSize;

      context.save();
      context.strokeStyle = 'rgba(0, 224, 255, 0.08)';
      context.lineWidth = 1;
      context.beginPath();
      gridState.columns.forEach((column) => {
        const x = column + columnShift;
        context.moveTo(x, -gridState.cellSize * 4);
        context.lineTo(x, height + gridState.cellSize * 4);
      });
      gridState.rows.forEach((row) => {
        const y = row + rowShift;
        context.moveTo(-gridState.cellSize * 4, y);
        context.lineTo(width + gridState.cellSize * 4, y);
      });
      context.stroke();
      context.restore();

      return { columnShift, rowShift };
    }

    function drawFlows(delta, scrollY, offsets) {
      if (!flows.length) return;

      const { columnShift, rowShift } = offsets;
      const scrollParallax = scrollY * 0.12;
      const travelDistance = height + gridState.cellSize * 6;

      context.save();
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';
      context.lineJoin = 'round';

      flows.forEach((flow) => {
        flow.progress = (flow.progress + delta / flow.duration) % 1;
        const progress = (flow.progress + flow.phase) % 1;
        const eased = easeInOutCubic(progress);
        const fade = Math.sin(progress * Math.PI);
        if (fade <= 0) {
          return;
        }

        const column = gridState.columns[flow.columnIndex];
        if (typeof column === 'undefined') {
          return;
        }

        const x = column + columnShift;
        if (x < -gridState.cellSize || x > width + gridState.cellSize) {
          return;
        }

        const centerY = -gridState.cellSize * 3 + travelDistance * eased + rowShift + scrollParallax;
        const startY = centerY - flow.length / 2;
        const endY = centerY + flow.length / 2;
        const intensity = flow.intensity * fade;

        const gradient = context.createLinearGradient(x, startY, x, endY);
        gradient.addColorStop(0, 'rgba(0, 224, 255, 0)');
        gradient.addColorStop(0.5, `rgba(0, 224, 255, ${intensity})`);
        gradient.addColorStop(1, 'rgba(0, 224, 255, 0)');

        context.lineWidth = flow.thickness;
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(x, startY);
        context.lineTo(x, endY);
        context.stroke();

        gridState.rows.forEach((row) => {
          const intersectionY = row + rowShift;
          if (intersectionY < startY - gridState.cellSize || intersectionY > endY + gridState.cellSize) {
            return;
          }

          const influence = 1 - Math.min(1, Math.abs(intersectionY - centerY) / flow.length);
          if (influence <= 0) {
            return;
          }

          const glowAlpha = intensity * 0.45 * influence;
          if (glowAlpha <= 0.001) {
            return;
          }

          const glowRadius = gridState.cellSize * 0.45;
          const glow = context.createRadialGradient(x, intersectionY, 0, x, intersectionY, glowRadius);
          glow.addColorStop(0, `rgba(0, 224, 255, ${glowAlpha})`);
          glow.addColorStop(1, 'rgba(0, 224, 255, 0)');
          context.fillStyle = glow;
          context.beginPath();
          context.arc(x, intersectionY, glowRadius, 0, Math.PI * 2);
          context.fill();
        });
      });

      context.restore();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        lastTimestamp = performance.now();
        lastFrameTime = 0;
        animationFrame = window.requestAnimationFrame(update);
      }
    }

    function handleScroll() {
      targetScrollY = window.scrollY || 0;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrame = window.requestAnimationFrame(update);
  }
})();
