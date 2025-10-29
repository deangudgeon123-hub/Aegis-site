import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { gsap } from '../utils/gsap.js';

export default function ContactPage() {
    const scope = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-intro', {
                y: 40,
                autoAlpha: 0,
                duration: 1.1,
            });

            gsap.from('.contact-form', {
                y: 40,
                autoAlpha: 0,
                duration: 1.2,
                delay: 0.2,
            });
        }, scope);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="page contact-page" ref={scope}>
            <section className="contact-hero glass-elevated">
                <p className="contact-intro">
                    Questions, ideas, or collaboration requests — send us a message below and we’ll get back shortly.
                </p>
                <form className="contact-form" action="#" method="post" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="contact-name">
                        Name
                        <input id="contact-name" type="text" name="name" placeholder="Your name" />
                    </label>
                    <label htmlFor="contact-email">
                        Email
                        <input id="contact-email" type="email" name="email" placeholder="name@example.com" />
                    </label>
                    <label htmlFor="contact-message">
                        Message
                        <textarea id="contact-message" name="message" placeholder="Your enquiry" rows="4" />
                    </label>
                    <button type="submit" className="btn primary">
                        Submit
                    </button>
                    <small>We typically reply within one business day.</small>
                </form>
            </section>
        </div>
    );
}
