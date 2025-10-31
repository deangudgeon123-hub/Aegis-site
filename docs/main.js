const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowSpecDevice = typeof navigator !== 'undefined' && 'deviceMemory' in navigator && navigator.deviceMemory < 4;

class EnergyRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.strips = [];
    this.frame = null;
    this.lastTimestamp = 0;
    this.scrollY = window.scrollY || 0;
    this.tick = this.tick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.configure();
  }

  configure() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.frame = requestAnimationFrame(this.tick);
  }

  handleScroll() {
    this.scrollY = window.scrollY || 0;
  }

  handleResize() {
    const { innerWidth, innerHeight } = window;
    this.canvas.width = innerWidth * this.dpr;
    this.canvas.height = innerHeight * this.dpr;
    this.canvas.style.width = `${innerWidth}px`;
    this.canvas.style.height = `${innerHeight}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.createStrips();
  }

  createStrips() {
    const count = window.innerWidth < 768 ? 9 : 18;
    this.strips = new Array(count).fill(null).map(() => this.createStrip());
  }

  createStrip() {
    const width = Math.random() * 2 + 2;
    const height = Math.random() * 120 + 80;
    const speed = Math.random() * 30 + 20;
    const opacity = Math.random() * 0.25 + (window.innerWidth < 768 ? 0.1 : 0.15);
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width,
      height,
      speed,
      opacity,
    };
  }

  resetStrip(strip) {
    strip.x = Math.random() * window.innerWidth;
    strip.y = this.scrollY - 200 - strip.height;
    strip.height = Math.random() * 120 + 80;
    strip.width = Math.random() * 2 + 2;
    strip.speed = Math.random() * 30 + 20;
    strip.opacity = Math.random() * 0.25 + (window.innerWidth < 768 ? 0.1 : 0.15);
  }

  tick(timestamp) {
    this.frame = requestAnimationFrame(this.tick);
    if (timestamp - this.lastTimestamp < 1000 / 48) {
      return;
    }
    const delta = (timestamp - this.lastTimestamp) / 1000 || 0;
    this.lastTimestamp = timestamp;

    const { innerHeight } = window;
    const viewportStart = this.scrollY - 200;
    const viewportEnd = this.scrollY + innerHeight + 200;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const strip of this.strips) {
      const stripTop = strip.y;
      const stripBottom = strip.y + strip.height;
      if (stripBottom < viewportStart || stripTop > viewportEnd) {
        continue;
      }
      this.ctx.globalAlpha = strip.opacity;
      this.ctx.fillStyle = '#00e0ff';
      this.ctx.fillRect(Math.round(strip.x), Math.round(strip.y), Math.ceil(strip.width), Math.ceil(strip.height));
      strip.y += strip.speed * delta;
      if (strip.y - strip.height > viewportEnd) {
        this.resetStrip(strip);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function initSmoothScroll() {
  const anchors = [
    { trigger: document.getElementById('hero-demo'), target: '/demo.html' },
    { trigger: document.getElementById('hero-waitlist'), target: '#contact' },
  ];
  let smoother = null;

  if (!prefersReducedMotion && window.gsap && window.ScrollSmoother) {
    smoother = window.ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
    });
  }

  anchors.forEach(({ trigger, target }) => {
    if (!trigger) return;
    trigger.addEventListener('click', (event) => {
      if (target === '/demo.html') {
        return;
      }
      event.preventDefault();
      const section = document.querySelector(target);
      if (!section) return;
      if (smoother) {
        smoother.scrollTo(section, true, 'top top');
      } else {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  return smoother;
}

function initGsapAnimations(smoother) {
  const animated = Array.from(document.querySelectorAll('[data-animate]')).filter((el) => el.dataset.animate !== 'hero');

  animated.forEach((el, index) => {
    const from = index % 2 === 0 ? { x: -40, autoAlpha: 0 } : { x: 40, autoAlpha: 0 };
    const to = { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' };
    window.gsap.fromTo(
      el,
      { ...from },
      {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  const hero = document.querySelector('[data-animate="hero"]');
  if (hero) {
    window.gsap.set(hero, { opacity: 1, y: 0 });
    window.gsap.set(hero.children, { y: 40, opacity: 0 });
    window.gsap.to(hero.children, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: 0.4,
      ease: 'power2.out',
      stagger: 0.12,
    });
  }

  window.gsap.utils.toArray('.section').forEach((section, index, sections) => {
    if (index === sections.length - 1) return;
    window.ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onLeave: () => window.gsap.to(section, { autoAlpha: 0.3, duration: 0.6, ease: 'power2.out' }),
      onEnterBack: () => window.gsap.to(section, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }),
    });
  });

  const background = document.querySelector('.background');
  if (background) {
    window.gsap.to(background, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#smooth-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  if (smoother) {
    window.gsap.to('#energy-canvas', {
      opacity: 0.65,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#smooth-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }
}

function initIntersectionFallback() {
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
  document.querySelectorAll('[data-animate]').forEach((el, index) => {
    if (el.dataset.animate === 'hero') {
      el.classList.add('is-visible');
      observer.observe(el);
      return;
    }
    if (index % 2 === 0) {
      el.classList.add('from-left');
    } else {
      el.classList.add('from-right');
    }
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let smoother = null;
  const canvas = document.getElementById('energy-canvas');
  let rain = null;

  if (!prefersReducedMotion && !lowSpecDevice && canvas) {
    rain = new EnergyRain(canvas);
  } else if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  smoother = initSmoothScroll();

  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    try {
      window.ScrollTrigger.config({ ignoreMobileResize: true });
      initGsapAnimations(smoother);
    } catch (error) {
      console.warn('GSAP initialization failed, falling back to IntersectionObserver.', error);
      initIntersectionFallback();
    }
  } else {
    initIntersectionFallback();
  }

  window.addEventListener('beforeunload', () => {
    if (rain) {
      rain.destroy();
    }
  });
});
