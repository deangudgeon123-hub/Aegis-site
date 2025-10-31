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
    let lastTime = performance.now();

    let stripSettings = getStripSettings();
    const strips = [];

    function resize() {
      width = Math.round(canvas.clientWidth);
      height = Math.round(canvas.clientHeight);
      const ratio = devicePixelRatio;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createStrip() {
      return {
        x: Math.random() * width,
        y: Math.random() * (height + 400) - 200,
        length: Math.random() * 120 + 80,
        speed: Math.random() * (stripSettings.maxSpeed - stripSettings.minSpeed) + stripSettings.minSpeed,
        width: Math.random() * 2 + 2,
        opacity: Math.random() * (stripSettings.maxOpacity - stripSettings.minOpacity) + stripSettings.minOpacity
      };
    }

    function initStrips() {
      strips.length = 0;
      for (let i = 0; i < stripSettings.count; i += 1) {
        strips.push(createStrip());
      }
    }

    function update(timestamp) {
      const delta = Math.min((timestamp - lastTime) / 16.67, 2);
      lastTime = timestamp;
      context.clearRect(0, 0, width, height);

      const viewportBuffer = 200;
      const viewportTop = window.scrollY - viewportBuffer;
      const viewportBottom = window.scrollY + window.innerHeight + viewportBuffer;

      strips.forEach((strip) => {
        strip.y += strip.speed * delta;
        if (strip.y - strip.length > height + 200) {
          strip.y = -200;
          strip.x = Math.random() * width;
          strip.speed = Math.random() * (stripSettings.maxSpeed - stripSettings.minSpeed) + stripSettings.minSpeed;
          strip.opacity = Math.random() * (stripSettings.maxOpacity - stripSettings.minOpacity) + stripSettings.minOpacity;
        }

        const absoluteY = strip.y + window.scrollY;
        if (absoluteY + strip.length < viewportTop || absoluteY > viewportBottom) {
          return;
        }

        context.globalAlpha = strip.opacity;
        context.fillStyle = '#00E0FF';
        context.fillRect(Math.round(strip.x), Math.round(strip.y), Math.round(strip.width), Math.round(strip.length));
        context.globalAlpha = 1;
      });

      animationFrame = window.requestAnimationFrame(update);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        lastTime = performance.now();
        animationFrame = window.requestAnimationFrame(update);
      }
    }

    function getStripSettings() {
      const mobile = window.innerWidth < 768;
      return {
        count: mobile ? 10 : 18,
        minOpacity: mobile ? 0.1 : 0.15,
        maxOpacity: mobile ? 0.2 : 0.4,
        minSpeed: mobile ? 15 : 20,
        maxSpeed: mobile ? 30 : 50
      };
    }

    resize();
    initStrips();
    window.addEventListener('resize', () => {
      stripSettings = getStripSettings();
      resize();
      initStrips();
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrame = window.requestAnimationFrame(update);
  }
})();
