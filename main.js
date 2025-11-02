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
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        )
        .fromTo(
          '.hero [data-animate]',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1
          },
          '-=0.9'
        );

      document.querySelectorAll('[data-section]').forEach((section) => {
        const animateTargets = section.querySelectorAll('.fade-in-up');
        if (!animateTargets.length) return;

        gsap.fromTo(
          animateTargets,
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
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
    const elements = document.querySelectorAll('.fade-in-up');
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
      rows: []
    };
    const flows = [];

    const gridBuffer = document.createElement('canvas');
    const gridBufferContext = gridBuffer.getContext('2d');

    function resize() {
      width = Math.round(canvas.clientWidth);
      height = Math.round(canvas.clientHeight);
      const ratio = devicePixelRatio;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      updateGrid();
      renderGrid();
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

    function renderGrid() {
      const ratio = devicePixelRatio;
      gridBuffer.width = Math.max(1, Math.round(width * ratio));
      gridBuffer.height = Math.max(1, Math.round(height * ratio));
      gridBufferContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      gridBufferContext.clearRect(0, 0, width, height);
      gridBufferContext.save();
      gridBufferContext.strokeStyle = 'rgba(0, 224, 255, 0.08)';
      gridBufferContext.lineWidth = 1;
      gridBufferContext.beginPath();
      gridState.columns.forEach((column) => {
        gridBufferContext.moveTo(column, -gridState.cellSize * 4);
        gridBufferContext.lineTo(column, height + gridState.cellSize * 4);
      });
      gridState.rows.forEach((row) => {
        gridBufferContext.moveTo(-gridState.cellSize * 4, row);
        gridBufferContext.lineTo(width + gridState.cellSize * 4, row);
      });
      gridBufferContext.stroke();
      gridBufferContext.restore();
    }

    function rebuildFlows() {
      flows.length = 0;
      const targetCount = width < 768 ? 7 : 12;
      for (let i = 0; i < targetCount; i += 1) {
        flows.push(createFlow(true));
      }
    }

    function randomRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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

      context.clearRect(0, 0, width, height);

      context.drawImage(gridBuffer, 0, 0, width, height);
      drawFlows(delta);

      animationFrame = window.requestAnimationFrame(update);
    }

    function drawFlows(delta) {
      if (!flows.length) return;

      context.save();
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';
      context.lineJoin = 'round';

      flows.forEach((flow) => {
        flow.elapsed += delta;

        if (flow.elapsed < 0) {
          return;
        }

        const normalized = Math.min(flow.elapsed / flow.duration, 1);
        const eased = easeInOutQuad(normalized);
        const travel = flow.totalLength + flow.length;
        const centerDistance = eased * travel - flow.length * 0.5;
        const startDistance = centerDistance - flow.length * 0.5;
        const endDistance = centerDistance + flow.length * 0.5;

        const sectionPoints = getSectionPoints(flow, startDistance, endDistance);
        if (!sectionPoints.length) {
          if (normalized >= 1) {
            resetFlow(flow);
          }
          return;
        }

        const startPoint = sectionPoints[0];
        const endPoint = sectionPoints[sectionPoints.length - 1];

        const gradient = context.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        gradient.addColorStop(0, 'rgba(0, 224, 255, 0)');
        gradient.addColorStop(0.5, `rgba(0, 224, 255, ${flow.intensity * flow.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 224, 255, 0)');

        context.lineWidth = flow.thickness;
        context.strokeStyle = gradient;
        context.shadowColor = 'rgba(0, 224, 255, 0.45)';
        context.shadowBlur = 14;
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        for (let i = 1; i < sectionPoints.length; i += 1) {
          context.lineTo(sectionPoints[i].x, sectionPoints[i].y);
        }
        context.stroke();

        highlightIntersections(flow, startDistance, endDistance, centerDistance);

        if (normalized >= 1) {
          resetFlow(flow);
        }
      });

      context.restore();
    }

    function createFlow(initial) {
      const flow = {
        elapsed: 0,
        duration: 0,
        length: 0,
        thickness: 0,
        intensity: 0,
        opacity: 1,
        points: [],
        segments: [],
        totalLength: 0
      };
      resetFlow(flow, initial);
      return flow;
    }

    function resetFlow(flow, initial = false) {
      if (!gridState.columns.length) {
        return;
      }

      const columnCount = gridState.columns.length;
      const startIndex = Math.max(1, Math.min(columnCount - 2, Math.floor(randomRange(0, columnCount))));
      const points = buildFlowPath(startIndex);
      const { segments, totalLength } = buildSegments(points);

      if (!segments.length || totalLength <= 0) {
        flow.elapsed = -randomRange(0.4, 1.4);
        return;
      }

      flow.points = points;
      flow.segments = segments;
      flow.totalLength = totalLength;
      flow.length = gridState.cellSize * randomRange(2.1, 3.1);
      flow.thickness = randomRange(1.4, 2.4);
      flow.intensity = randomRange(0.18, 0.32);
      flow.opacity = randomRange(0.6, 1);
      flow.duration = randomRange(5.6, 8.2);
      const delay = randomRange(0.4, 1.6);
      flow.elapsed = initial ? randomRange(-flow.duration * 0.8, flow.duration * 0.15) : -delay;
    }

    function buildFlowPath(startIndex) {
      const points = [];
      let currentIndex = startIndex;
      let currentY = -gridState.cellSize * 3.5;
      points.push({ x: gridState.columns[currentIndex], y: currentY });
      const maxY = height + gridState.cellSize * 4;

      while (currentY < maxY) {
        const segmentLength = gridState.cellSize * randomRange(1.1, 1.8);
        const nextY = currentY + segmentLength;
        const shouldShift = Math.random() < 0.35;

        if (shouldShift) {
          const direction = Math.random() > 0.5 ? 1 : -1;
          const magnitude = Math.random() > 0.55 ? 2 : 1;
          let targetIndex = currentIndex + direction * magnitude;
          targetIndex = Math.max(1, Math.min(gridState.columns.length - 2, targetIndex));

          if (targetIndex !== currentIndex) {
            const diagonalStart = currentY + segmentLength * randomRange(0.25, 0.4);
            const diagonalSpan = segmentLength * randomRange(0.35, 0.55);
            const diagonalEnd = Math.min(nextY - gridState.cellSize * 0.2, diagonalStart + diagonalSpan);

            if (diagonalEnd - diagonalStart > gridState.cellSize * 0.12) {
              if (diagonalStart > points[points.length - 1].y) {
                points.push({ x: gridState.columns[currentIndex], y: diagonalStart });
              }

              points.push({ x: gridState.columns[targetIndex], y: diagonalEnd });
              currentIndex = targetIndex;
            }
          }
        }

        points.push({ x: gridState.columns[currentIndex], y: nextY });
        currentY = nextY;
      }

      return points;
    }

    function buildSegments(points) {
      const segments = [];
      let cumulative = 0;

      for (let i = 0; i < points.length - 1; i += 1) {
        const start = points[i];
        const end = points[i + 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length <= 0.01) {
          continue;
        }
        segments.push({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          dx,
          dy,
          length,
          cumulative
        });
        cumulative += length;
      }

      return { segments, totalLength: cumulative };
    }

    function interpolateSegment(segment, distance) {
      const t = Math.min(Math.max(distance / segment.length, 0), 1);
      return {
        x: segment.x1 + segment.dx * t,
        y: segment.y1 + segment.dy * t
      };
    }

    function getSectionPoints(flow, startDistance, endDistance) {
      const points = [];
      const clampedStart = Math.max(startDistance, 0);
      const clampedEnd = Math.min(endDistance, flow.totalLength);
      if (clampedEnd <= clampedStart) {
        return points;
      }

      for (let i = 0; i < flow.segments.length; i += 1) {
        const segment = flow.segments[i];
        const segStart = segment.cumulative;
        const segEnd = segStart + segment.length;

        if (segEnd <= clampedStart) {
          continue;
        }
        if (segStart >= clampedEnd) {
          break;
        }

        const fromDist = Math.max(clampedStart, segStart);
        const toDist = Math.min(clampedEnd, segEnd);

        const fromPoint = interpolateSegment(segment, fromDist - segStart);
        if (!points.length || Math.hypot(points[points.length - 1].x - fromPoint.x, points[points.length - 1].y - fromPoint.y) > 0.1) {
          points.push(fromPoint);
        }

        if (toDist >= segEnd - 0.001) {
          points.push({ x: segment.x2, y: segment.y2 });
        } else {
          points.push(interpolateSegment(segment, toDist - segStart));
        }
      }

      return points;
    }

    function highlightIntersections(flow, startDistance, endDistance, centerDistance) {
      const clampedStart = Math.max(startDistance, 0);
      const clampedEnd = Math.min(endDistance, flow.totalLength);
      if (clampedEnd <= clampedStart) {
        return;
      }

      const visited = new Set();
      const radius = gridState.cellSize * 0.4;
      const threshold = Math.max(4, flow.thickness * 2.2);

      for (let i = 0; i < flow.segments.length; i += 1) {
        const segment = flow.segments[i];
        const segStart = segment.cumulative;
        const segEnd = segStart + segment.length;

        if (segEnd <= clampedStart || segStart >= clampedEnd) {
          continue;
        }

        const minY = Math.min(segment.y1, segment.y2) - gridState.cellSize * 0.2;
        const maxY = Math.max(segment.y1, segment.y2) + gridState.cellSize * 0.2;

        gridState.rows.forEach((row) => {
          if (row < minY || row > maxY) {
            return;
          }
          const dy = segment.y2 - segment.y1;
          if (Math.abs(dy) < 0.001) {
            return;
          }
          const tRow = (row - segment.y1) / dy;
          if (tRow < 0 || tRow > 1) {
            return;
          }
          const distanceAlong = segStart + segment.length * tRow;
          if (distanceAlong < clampedStart || distanceAlong > clampedEnd) {
            return;
          }
          const xAtRow = segment.x1 + (segment.x2 - segment.x1) * tRow;

          let closestColumn = null;
          let smallestDiff = Infinity;
          for (let c = 0; c < gridState.columns.length; c += 1) {
            const diff = Math.abs(gridState.columns[c] - xAtRow);
            if (diff < smallestDiff) {
              smallestDiff = diff;
              closestColumn = gridState.columns[c];
            }
          }

          if (closestColumn === null || smallestDiff > threshold) {
            return;
          }

          const key = `${closestColumn}|${row}`;
          if (visited.has(key)) {
            return;
          }
          visited.add(key);

          const proximity = 1 - Math.min(1, Math.abs(distanceAlong - centerDistance) / (flow.length * 0.75));
          if (proximity <= 0) {
            return;
          }

          const alpha = flow.intensity * flow.opacity * 0.45 * proximity;
          if (alpha <= 0.001) {
            return;
          }

          const glow = context.createRadialGradient(closestColumn, row, 0, closestColumn, row, radius);
          glow.addColorStop(0, `rgba(0, 224, 255, ${alpha})`);
          glow.addColorStop(1, 'rgba(0, 224, 255, 0)');
          context.fillStyle = glow;
          context.beginPath();
          context.arc(closestColumn, row, radius, 0, Math.PI * 2);
          context.fill();
        });
      }
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

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrame = window.requestAnimationFrame(update);
  }
})();
