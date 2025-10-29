import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';

const capabilities = [
    {
        title: 'AI Risk Engine',
        description:
            'Adaptive models scan transactional behavior in real time, elevating anomalies before they escalate into capital loss.',
    },
    {
        title: 'Safe Layer Integration',
        description:
            'Interoperable APIs weave directly into banking and trading stacks, wrapping existing workflows in Aegis-grade safeguards.',
    },
    {
        title: 'Autonomous Compliance',
        description:
            'Embedded policy logic reconciles regulatory expectations continuously, enabling confident automation across jurisdictions.',
    },
];

export default function TechPage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-hero h1', {
                y: 40,
                autoAlpha: 0,
                duration: 1.1,
            });

            gsap.utils.toArray('.capability-card').forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                    },
                    y: 36,
                    autoAlpha: 0,
                    duration: 1,
                });
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return (
        <div className="page tech-page" ref={scope}>
            <section className="page-hero glass-elevated" data-parallax-depth="0.25">
                <h1>Technology Blueprint</h1>
                <p>
                    Each layer is designed to monitor, mitigate, and execute with the discipline of a mission-critical system.
                </p>
            </section>
            <section className="capability-section">
                <div className="capability-grid">
                    {capabilities.map(({ title, description }) => (
                        <article key={title} className="capability-card glass-soft">
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
