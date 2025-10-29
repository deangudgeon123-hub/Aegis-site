import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';
import { html } from '../utils/html.js';

export default function DemoPage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.demo-card', {
                y: 50,
                autoAlpha: 0,
                duration: 1.2,
                ease: 'power4.out',
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    return html`
        <div className="page demo-page" ref=${scope}>
            <section className="demo-section">
                <div className="demo-card glass-elevated" data-parallax-depth="0.18">
                    <h1>Access Demo</h1>
                    <p>Demo currently in progress for the upcoming cohort.</p>
                    <p>Wider access will open at a later stage.</p>
                </div>
            </section>
        </div>
    `;
}
