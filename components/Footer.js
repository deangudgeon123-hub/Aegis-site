import React from 'https://esm.sh/react@18.2.0';

export function Footer({ page }) {
    const footerCopy = page === 'home' ? '© 2025 Aegis - Trust the Shield.' : '© 2025 AEGIS — Trust the Shield.';

    return (
        <footer className="site-footer glass-soft">
            <div className="footer-inner">
                <p>{footerCopy}</p>
                <div className="footer-links">
                    <a href="#" aria-label="Privacy Policy">
                        Privacy
                    </a>
                    <span aria-hidden="true">•</span>
                    <a href="#" aria-label="Terms of Service">
                        Terms
                    </a>
                    <span aria-hidden="true">•</span>
                    <a href="#" aria-label="Security">
                        Security
                    </a>
                </div>
            </div>
        </footer>
    );
}
