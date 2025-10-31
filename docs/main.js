import { gsap, ScrollTrigger, ScrollToPlugin } from './utils/gsap.js';
import { initHeroScene } from './scenes/hero.js';
import { initBlueprintScene } from './scenes/blueprint.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const heroCanvas = document.getElementById('hero-canvas');
const blueprintCanvas = document.getElementById('blueprint-canvas');

const heroControls = initHeroScene(heroCanvas);
const blueprintControls = initBlueprintScene(blueprintCanvas);

const body = document.body;
const cursor = document.querySelector('.cursor-light');
const progressThumb = document.querySelector('.progress-thumb');

function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    progressThumb.style.transform = `scaleY(${Math.max(0.02, pct)}) translateZ(0)`;
}

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

window.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    body.style.setProperty('--cursor-x', `${x}`);
    body.style.setProperty('--cursor-y', `${y}`);
    cursor.style.opacity = 1;
});

const rippleTargets = document.querySelectorAll('.btn, .orbit-link, .scroll-anchor');
rippleTargets.forEach((element) => {
    element.addEventListener('pointerdown', (event) => {
        if (element.matches('[disabled]')) return;

        const rect = element.getBoundingClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;
        const x = ((event.clientX - rect.left) / width) * 100;
        const y = ((event.clientY - rect.top) / height) * 100;

        element.style.setProperty('--ripple-x', `${x}%`);
        element.style.setProperty('--ripple-y', `${y}%`);

        element.classList.remove('is-rippling');
        void element.offsetWidth;
        element.classList.add('is-rippling');

        window.setTimeout(() => {
            element.classList.remove('is-rippling');
        }, 600);
    });
});

const scrollTriggers = document.querySelectorAll('[data-scroll-trigger]');
scrollTriggers.forEach((el) => {
    const target = el.getAttribute('data-target') || el.getAttribute('href');
    el.addEventListener('click', (event) => {
        if (!target || !target.startsWith('#')) return;
        event.preventDefault();
        gsap.to(window, { duration: 1.4, ease: 'power3.inOut', scrollTo: target });
    });
});

gsap.utils.toArray('.section').forEach((section) => {
    if (section.classList.contains('hero')) return;

    gsap.from(section, {
        autoAlpha: 0,
        y: 40,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
        },
    });
});

const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
heroTimeline
    .from('.brand-header', { y: -32, autoAlpha: 0, duration: 1.2 })
    .from('.hero-kicker', { autoAlpha: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-title', { autoAlpha: 0, y: 32, duration: 1 }, '-=0.4')
    .from('.hero-body', { autoAlpha: 0, y: 28, duration: 1 }, '-=0.6')
    .from('.hero-actions', { autoAlpha: 0, y: 24, duration: 0.9 }, '-=0.6')
    .from('.scroll-cta', { autoAlpha: 0, y: 18, duration: 0.7 }, '-=0.6');

gsap.from('.hero-glow', {
    autoAlpha: 0,
    scale: 0.8,
    duration: 1.4,
    ease: 'power3.out',
});

gsap.to('.hero-title', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
    letterSpacing: '0.08em',
    opacity: 0.75,
});

const sequence = document.querySelector('[data-sequence]');
if (sequence) {
    const track = sequence.querySelector('[data-sequence-track]');
    const panels = gsap.utils.toArray('.sequence-panel');

    gsap.set(track, { display: 'flex' });

    const totalWidth = panels.length * 100;
    gsap.set(track, { width: `${totalWidth}%` });
    panels.forEach((panel) => gsap.set(panel, { width: `${100 / panels.length}%` }));

    const sequenceTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: sequence,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
        },
    });

    sequenceTimeline.to(track, { xPercent: -100 * (panels.length - 1), ease: 'none' });

    panels[0]?.classList.add('is-active');

    panels.forEach((panel) => {
        ScrollTrigger.create({
            trigger: panel,
            start: () => `left center`,
            horizontal: true,
            containerAnimation: sequenceTimeline,
            onEnter: () => panel.classList.add('is-active'),
            onEnterBack: () => panel.classList.add('is-active'),
            onLeave: () => panel.classList.remove('is-active'),
            onLeaveBack: () => panel.classList.remove('is-active'),
        });
    });

    gsap.from('.founder-card', {
        scrollTrigger: {
            trigger: '.founder-card',
            start: 'top 80%',
        },
        autoAlpha: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
    });
}

const technologySection = document.querySelector('.technology');
if (technologySection) {
    const layers = technologySection.querySelectorAll('.layer-list li');

    layers.forEach((layer, index) => {
        gsap.from(layer, {
            scrollTrigger: {
                trigger: layer,
                start: 'top 85%',
            },
            autoAlpha: 0,
            y: 30,
            duration: 1,
            ease: 'power2.out',
        });

        ScrollTrigger.create({
            trigger: layer,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => blueprintControls?.setActive(index),
            onEnterBack: () => blueprintControls?.setActive(index),
        });
    });
}

gsap.from('.security-title', {
    scrollTrigger: {
        trigger: '.security',
        start: 'top 75%',
    },
    autoAlpha: 0,
    y: 60,
    duration: 1.3,
    ease: 'expo.out',
});

gsap.utils.toArray('.safeguards article').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
        },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        delay: index * 0.1,
    });
});

gsap.to('.security-waves', {
    scrollTrigger: {
        trigger: '.security',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
    },
    backgroundPosition: '200% 50%',
});

const contactBlock = document.querySelector('.contact-block');
if (contactBlock) {
    gsap.from(contactBlock, {
        scrollTrigger: {
            trigger: contactBlock,
            start: 'top 80%',
        },
        autoAlpha: 0,
        y: 60,
        duration: 1.1,
    });
}

gsap.from('.outro-core', {
    scrollTrigger: {
        trigger: '.outro-core',
        start: 'top 85%',
    },
    autoAlpha: 0,
    y: 50,
    duration: 1,
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => event.preventDefault());
}

const refreshHandler = () => updateProgress();
ScrollTrigger.addEventListener('refreshInit', refreshHandler);

window.addEventListener('beforeunload', () => {
    heroControls?.destroy?.();
    blueprintControls?.destroy?.();
    ScrollTrigger.removeEventListener('refreshInit', refreshHandler);
});
