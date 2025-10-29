import { gsap } from './gsap.js';

export function initParallaxLayers() {
    const layers = new Set();

    const update = (event) => {
        const { innerWidth, innerHeight } = window;
        const x = (event.clientX / innerWidth - 0.5) * 2;
        const y = (event.clientY / innerHeight - 0.5) * 2;

        layers.forEach((layer) => {
            const depth = parseFloat(layer.dataset.parallaxDepth || '0.3');
            gsap.to(layer, {
                x: x * depth * 35,
                y: y * depth * 25,
                duration: 1.2,
                overwrite: true,
            });
        });
    };

    const handleMove = (event) => {
        update(event);
    };

    window.addEventListener('pointermove', handleMove);

    const root = document.getElementById('app');
    const observer = new MutationObserver(() => {
        document.querySelectorAll('[data-parallax-depth]').forEach((node) => layers.add(node));
    });

    if (root) {
        observer.observe(root, { childList: true, subtree: true });
    }

    document.querySelectorAll('[data-parallax-depth]').forEach((node) => layers.add(node));

    return () => {
        window.removeEventListener('pointermove', handleMove);
        observer.disconnect();
        layers.clear();
    };
}

export function initScrollHints() {
    const hints = document.querySelectorAll('[data-scroll-hint]');
    hints.forEach((hint) => {
        gsap.fromTo(
            hint,
            { y: 0 },
            {
                y: 14,
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            }
        );
    });
}
