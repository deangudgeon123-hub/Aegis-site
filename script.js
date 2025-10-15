document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay');
    const scrollElements = document.querySelectorAll('[data-animate]');

    // Initial fade-in for hero elements
    window.setTimeout(() => {
        fadeElements.forEach((el) => el.classList.add('visible'));
    }, 150);

    // Hamburger menu toggle
    const updateMenuState = (shouldShow) => {
        if (!hamburger || !navMenu) return;
        hamburger.classList.toggle('active', shouldShow);
        hamburger.setAttribute('aria-expanded', String(shouldShow));
        navMenu.classList.toggle('show', shouldShow);
        navMenu.setAttribute('aria-hidden', String(!shouldShow));
    };

    const handleViewportChange = () => {
        if (!navMenu) return;
        if (window.innerWidth >= 768) {
            navMenu.setAttribute('aria-hidden', 'false');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            navMenu.classList.remove('show');
        } else {
            const isOpen = navMenu.classList.contains('show');
            navMenu.setAttribute('aria-hidden', String(!isOpen));
            if (hamburger && !isOpen) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            updateMenuState(!isExpanded);
        });
    }

    // Close menu when clicking link on mobile
    navMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && navMenu.classList.contains('show')) {
                updateMenuState(false);
            }
        });
    });

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    scrollElements.forEach((el) => observer.observe(el));
});
