import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';
import { html } from '../utils/html.js';

const values = [
    {
        title: 'Integrity',
        description: 'Integrity — Every model, metric, and partnership is built on uncompromising trust.',
    },
    {
        title: 'Precision',
        description: 'Precision — Constant refinement keeps our systems sharp, our signals clear, and our defenses ahead.',
    },
    {
        title: 'Protection',
        description:
            'Protection — We design for resilience, ensuring our clients stay guarded against evolving threats without sacrificing performance.',
    },
];

export default function AboutPage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.about-hero', {
                y: 50,
                autoAlpha: 0,
                duration: 1.2,
            });

            gsap.from('.mission-card', {
                scrollTrigger: {
                    trigger: '.mission-card',
                    start: 'top 80%',
                },
                y: 40,
                autoAlpha: 0,
                duration: 1,
            });

            gsap.utils.toArray('.value-card').forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                    },
                    y: 36,
                    autoAlpha: 0,
                    duration: 1,
                });
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return html`
        <div className="page about-page" ref=${scope}>
            <section className="about-hero glass-elevated" data-parallax-depth="0.2">
                <h1>Who We Are</h1>
                <p>
                    Aegis builds financial trust in an age of autonomous AI. We engineer intelligent systems that safeguard
                    transactions, data, and users — giving institutions a layer of defense they can depend on.
                </p>
            </section>

            <section className="mission-section glass-soft">
                <h2>Our Mission</h2>
                <p>
                    To fuse AI precision with financial resilience. Aegis develops intelligent systems that detect risk before it
                    strikes, reinforce trust between users and institutions, and turn real-time insight into lasting security.
                </p>
            </section>

            <section className="vision-section">
                <div className="mission-card glass-elevated">
                    <h2>Our Vision</h2>
                    <p>
                        A world where AI and finance evolve safely — together. Aegis exists to embed resilience into every
                        transaction and accountability into every algorithm — protecting investors, institutions, and innovation
                        itself.
                    </p>
                </div>
            </section>

            <section className="founder-section">
                <article className="founder-card glass-elevated" data-parallax-depth="0.15">
                    <h3>The Founder</h3>
                    <span className="founder-subtitle">Dean Gudgeon — Founder &amp; Architect</span>
                    <p>
                        Dean Gudgeon — Founder &amp; Architect. Dean is a systems architect dedicated to disciplined, transparent AI
                        for regulated environments. He created Aegis to prove that automation and accountability can coexist —
                        building a safer future for users, investors, and the institutions that serve them.
                    </p>
                </article>
            </section>

            <section className="values-section">
                <div className="values-header">
                    <h2>Our Values</h2>
                    <p>Three tenets guide how the Aegis shield is forged, deployed, and measured.</p>
                </div>
                <div className="values-grid">
                    ${values.map(
                        ({ title, description }) => html`
                            <article key=${title} className="value-card glass-soft">
                                <h3>${title}</h3>
                                <p>${description}</p>
                            </article>
                        `,
                    )}
                </div>
            </section>
        </div>
    `;
}
