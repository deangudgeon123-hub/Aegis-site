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
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(!isExpanded));
            navMenu.classList.toggle('show');
        });
    }

    // Close menu when clicking link on mobile
    navMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                hamburger?.classList.remove('active');
                hamburger?.setAttribute('aria-expanded', 'false');
            }
        });
    });

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
