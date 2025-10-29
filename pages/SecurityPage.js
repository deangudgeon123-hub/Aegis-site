import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';
import { html } from '../utils/html.js';

const safeguards = [
    {
        title: 'Encryption Layers',
        description:
            'Multi-tier encryption envelopes every signal, from ingest to action, reinforcing confidentiality across distributed nodes.',
    },
    {
        title: 'Data Governance',
        description:
            'Granular policy controls and immutable audit trails keep oversight clear, enabling confident reporting and audit readiness.',
    },
    {
        title: 'User Protection',
        description:
            'Risk-aware permissions adapt to user context, guarding accounts with adaptive authentication and session intelligence.',
    },
];

export default function SecurityPage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.security-title', {
                letterSpacing: '1em',
                autoAlpha: 0,
                duration: 1.4,
                ease: 'expo.out',
            });

            gsap.utils.toArray('.safeguard-card').forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                    },
                    scale: 0.96,
                    autoAlpha: 0,
                    duration: 1.1,
                });
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return html`
        <div className="page security-page" ref=${scope}>
            <section className="security-hero glass-elevated" data-parallax-depth="0.2">
                <h1 className="security-title">SECURITY DOCTRINE</h1>
            </section>
            <section className="safeguard-section">
                <div className="safeguard-grid">
                    ${safeguards.map(
                        ({ title, description }) => html`
                            <article key=${title} className="safeguard-card glass-soft">
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
