import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';

export default function HomePage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-card', {
                y: 60,
                autoAlpha: 0,
                duration: 1.4,
                ease: 'power4.out',
                delay: 0.1,
            });

            gsap.utils.toArray('.pillar-card').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                    },
                    y: 40,
                    autoAlpha: 0,
                    duration: 1,
                    delay: index * 0.05,
                });
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return (
        <div className="page home-page" ref={scope}>
            <section className="hero-section" id="hero">
                <div className="hero-orbit" data-parallax-depth="0.45">
                    <span className="hero-glow" />
                </div>
                <div className="hero-card glass-elevated" data-parallax-depth="0.25">
                    <p className="hero-kicker">NEXT-GEN AI SECURITY</p>
                    <h1 className="hero-title">
                        AI and finance are already here — the question is, who do you trust?
                    </h1>
                    <p className="hero-subtitle">
                        Aegis is your AI shield for modern finance — built to protect, guide, and optimize your digital assets.
                    </p>
                    <div className="hero-actions">
                        <a className="btn primary" href="access-demo.html">
                            Access Demo
                        </a>
                        <a className="btn secondary" href="contact.html">
                            Join Waitlist
                        </a>
                    </div>
                    <div className="scroll-cue" data-scroll-hint>
                        <span />
                        <span />
                    </div>
                </div>
            </section>

            <section className="who-we-are" aria-labelledby="core-pillars-heading">
                <div className="section-header">
                    <h2 id="core-pillars-heading">Who We Are</h2>
                    <p>
                        Aegis builds financial trust in an age of autonomous AI. We engineer intelligent systems that safeguard
                        transactions, data, and users — giving institutions a layer of defense they can depend on.
                    </p>
                </div>
                <div className="pillar-grid">
                    <article className="pillar-card glass-soft">
                        <div className="pillar-icon" aria-hidden="true">
                            <span className="icon-crest">🛡️</span>
                        </div>
                        <h3>Our Mission</h3>
                        <p>
                            To fuse AI precision with financial resilience. Aegis develops intelligent systems that detect risk
                            before it strikes, reinforce trust between users and institutions, and turn real-time insight into
                            lasting security.
                        </p>
                    </article>
                    <article className="pillar-card glass-soft">
                        <div className="pillar-icon" aria-hidden="true">
                            <span className="icon-crest">🤖</span>
                        </div>
                        <h3>Our Vision</h3>
                        <p>
                            A world where AI and finance evolve safely — together. Aegis exists to embed resilience into every
                            transaction and accountability into every algorithm — protecting investors, institutions, and
                            innovation itself.
                        </p>
                    </article>
                    <article className="pillar-card glass-soft">
                        <div className="pillar-icon" aria-hidden="true">
                            <span className="icon-crest">👁️</span>
                        </div>
                        <h3>The Founder</h3>
                        <p>
                            Dean Gudgeon — Founder &amp; Architect. Dean is a systems architect dedicated to disciplined, transparent
                            AI for regulated environments. He created Aegis to prove that automation and accountability can coexist
                            — building a safer future for users, investors, and the institutions that serve them.
                        </p>
                    </article>
                    <article className="pillar-card glass-soft">
                        <div className="pillar-icon" aria-hidden="true">
                            <span className="icon-crest">⚡</span>
                        </div>
                        <h3>Our Values</h3>
                        <p>
                            Integrity — Every model, metric, and partnership is built on uncompromising trust. Precision — Constant
                            refinement keeps our systems sharp, our signals clear, and our defenses ahead. Protection — We design for
                            resilience, ensuring our clients stay guarded against evolving threats without sacrificing performance.
                        </p>
                    </article>
                </div>
            </section>
        </div>
    );
}
