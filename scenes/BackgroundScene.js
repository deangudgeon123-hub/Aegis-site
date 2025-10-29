import * as THREE from 'https://esm.sh/three@0.161.0';
import { gsap } from '../utils/gsap.js';

export function createBackgroundScene(canvas) {
    if (!canvas) {
        return () => {};
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const ambient = new THREE.AmbientLight(0x4b6fff, 0.4);
    scene.add(ambient);

    const light = new THREE.PointLight(0x89a6ff, 1.4);
    light.position.set(-6, 4, 6);
    scene.add(light);

    const gradientMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#0f172a') },
            uColor2: { value: new THREE.Color('#020617') },
            uGlow: { value: new THREE.Color('#1d4ed8') },
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: /* glsl */ `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uGlow;
            varying vec2 vUv;

            void main() {
                float wave = sin((vUv.y + uTime * 0.05) * 3.1415 * 2.0) * 0.15;
                vec3 base = mix(uColor1, uColor2, vUv.y + wave);
                float glow = smoothstep(0.8, 1.0, vUv.y + wave);
                vec3 color = mix(base, uGlow, glow * 0.35);
                float alpha = mix(0.35, 0.65, glow);
                gl_FragColor = vec4(color, alpha);
            }
        `,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 9, 64, 64), gradientMaterial);
    plane.position.z = -6;
    scene.add(plane);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    const scales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        scales[i] = Math.random() * 0.9 + 0.2;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const starMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
            attribute float aScale;
            uniform float uTime;
            varying float vAlpha;
            void main() {
                vec3 transformed = position;
                transformed.x += sin((uTime * 0.4) + position.z) * 0.12;
                transformed.y += cos((uTime * 0.35) + position.x) * 0.12;
                vAlpha = aScale;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                gl_PointSize = 6.0 * aScale;
            }
        `,
        fragmentShader: /* glsl */ `
            varying float vAlpha;
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = smoothstep(0.5, 0.0, strength);
                gl_FragColor = vec4(0.7, 0.82, 1.0, strength * vAlpha);
            }
        `,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const targets = { x: 0, y: 0 };

    const handlePointer = (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(targets, {
            x,
            y,
            duration: 1.4,
            overwrite: true,
        });
    };

    window.addEventListener('pointermove', handlePointer);

    const clock = new THREE.Clock();

    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    resize();

    const animate = () => {
        const elapsed = clock.getElapsedTime();
        gradientMaterial.uniforms.uTime.value = elapsed;
        starMaterial.uniforms.uTime.value = elapsed;

        camera.position.x = targets.x * 1.2;
        camera.position.y = targets.y * 0.8;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);

    return () => {
        window.removeEventListener('pointermove', handlePointer);
        window.removeEventListener('resize', resize);
        gradientMaterial.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        renderer.dispose();
    };
}
