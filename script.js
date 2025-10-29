import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { NavBar } from './components/NavBar.js';
import { Footer } from './components/Footer.js';
import HomePage from './pages/HomePage.js';
import TechPage from './pages/TechPage.js';
import SecurityPage from './pages/SecurityPage.js';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/ContactPage.js';
import DemoPage from './pages/DemoPage.js';
import { createBackgroundScene } from './scenes/BackgroundScene.js';
import { initParallaxLayers, initScrollHints } from './utils/interactions.js';
import { ScrollTrigger } from './utils/gsap.js';
import { html, Fragment } from './utils/html.js';

const pageKey = document.body.dataset.page || 'home';

const pageRegistry = {
    home: HomePage,
    tech: TechPage,
    security: SecurityPage,
    about: AboutPage,
    contact: ContactPage,
    access_demo: DemoPage,
};

const PageComponent = pageRegistry[pageKey] ?? HomePage;

function App() {
    return html`
        <${Fragment}>
            <${NavBar} currentPage=${pageKey} />
            <main className="page-shell">
                <${PageComponent} />
            </main>
            <${Footer} page=${pageKey} />
        <//>
    `;
}

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);
root.render(html`<${App} />`);

let teardownParallax;

requestAnimationFrame(() => {
    initScrollHints();
    teardownParallax = initParallaxLayers();
    ScrollTrigger.refresh();
});

const teardownScene = createBackgroundScene(document.getElementById('background-canvas'));

window.addEventListener('beforeunload', () => {
    teardownScene?.();
    teardownParallax?.();
});
