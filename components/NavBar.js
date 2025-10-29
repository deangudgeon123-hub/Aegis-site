import React, { useEffect, useRef, useState } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';

const navLinks = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'tech.html', label: 'Tech', key: 'tech' },
    { href: 'security.html', label: 'Security', key: 'security' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
];

export function NavBar({ currentPage }) {
    const navRef = useRef(null);
    const menuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(navRef.current, {
                y: -80,
                autoAlpha: 0,
                duration: 1.4,
                ease: 'power4.out',
            });
        }, navRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!menuRef.current) return;
        const links = menuRef.current.querySelectorAll('.nav-link');
        gsap.set(links, { autoAlpha: 0, y: 12 });

        if (window.innerWidth > 960) {
            menuRef.current.style.pointerEvents = 'auto';
        } else {
            menuRef.current.style.pointerEvents = isOpen ? 'auto' : 'none';
        }

        gsap.to(menuRef.current, {
            clipPath: isOpen
                ? 'inset(0% 0% 0% 0% round 24px)'
                : 'inset(0% 0% 100% 0% round 24px)',
            duration: 0.6,
            ease: 'power3.out',
        });

        if (isOpen) {
            gsap.to(links, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.08,
                delay: 0.1,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 960) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const toggleMenu = () => {
        if (window.innerWidth <= 960) {
            setIsOpen((prev) => !prev);
        }
    };

    const handleNavInteraction = (event, href) => {
        if (href.startsWith('#')) {
            event.preventDefault();
            gsap.to(window, { duration: 1, scrollTo: href, ease: 'power2.out' });
        }

        if (window.innerWidth <= 960) {
            setIsOpen(false);
        }
    };

    return (
        <header className="top-nav" ref={navRef}>
            <div className="nav-inner glass-elevated">
                <a className="brand" href="index.html" aria-label="Aegis home">
                    <img src="IMG_2596.png" alt="AEGIS Logo" className="brand-mark" />
                    <span className="brand-type">AEGIS</span>
                </a>
                <button
                    className={`nav-toggle ${isOpen ? 'is-open' : ''}`}
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                    onClick={toggleMenu}
                >
                    <span />
                    <span />
                </button>
                <nav className="nav-menu" ref={menuRef} aria-label="Primary">
                    {navLinks.map(({ href, label, key }) => (
                        <a
                            key={key}
                            className={`nav-link ${currentPage === key ? 'is-active' : ''}`}
                            href={href}
                            data-nav={key}
                            onClick={(event) => handleNavInteraction(event, href)}
                        >
                            <span>{label}</span>
                            <span className="link-indicator" />
                        </a>
                    ))}
                    <a className="nav-cta" href="access-demo.html" onClick={(event) => handleNavInteraction(event, 'access-demo.html')}>
                        <span>Access Demo</span>
                    </a>
                </nav>
            </div>
        </header>
    );
}
