import { gsap } from 'https://esm.sh/gsap@3.12.5';
import ScrollTrigger from 'https://esm.sh/gsap@3.12.5/ScrollTrigger';
import ScrollToPlugin from 'https://esm.sh/gsap@3.12.5/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.defaults({ ease: 'power3.out' });

gsap.ticker.fps(90);

export { gsap, ScrollTrigger, ScrollToPlugin };
