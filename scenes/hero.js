import * as THREE from 'https://cdn.skypack.dev/three@0.162.0';

export function initHeroScene(canvas) {
    if (!canvas) {
        return { destroy: () => {} };
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 6.5);

    const shieldGeometry = new THREE.IcosahedronGeometry(2.2, 4);

    const shieldMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uTime: { value: 0 },
            uGlow: { value: new THREE.Color(0x53f7ff) },
        },
        vertexShader: `
            uniform float uTime;
            varying float vHeight;
            vec3 distort(vec3 position) {
                float noise = 0.0;
                vec3 pos = normalize(position) * 2.5;
                noise += sin(pos.x * 1.2 + uTime * 0.6) * 0.08;
                noise += sin(pos.y * 1.4 - uTime * 0.5) * 0.06;
                noise += sin(pos.z * 1.6 + uTime * 0.7) * 0.04;
                return position + normal * noise;
            }
            void main() {
                vec3 transformed = distort(position);
                vHeight = length(transformed);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uGlow;
            varying float vHeight;
            void main() {
                float intensity = smoothstep(1.6, 2.5, vHeight);
                float alpha = smoothstep(2.6, 1.8, vHeight) * 0.9;
                gl_FragColor = vec4(mix(vec3(0.02, 0.1, 0.2), uGlow, intensity), alpha);
            }
        `,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    scene.add(shieldMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x18ffc6,
        transparent: true,
        opacity: 0.28,
        wireframe: true,
    });
    const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.35, 3), wireMaterial);
    scene.add(wireMesh);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2.6 + Math.random() * 1.4;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x54ffe7,
        size: 0.045,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const light = new THREE.PointLight(0x73e8ff, 1.4, 40);
    light.position.set(5, 5, 6);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0f1828, 0.8));

    const clock = new THREE.Clock();

    function resize() {
        if (!canvas) return;
        const bounds = canvas.getBoundingClientRect();
        const width = bounds.width || window.innerWidth;
        const height = bounds.height || window.innerHeight * 0.6;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function render() {
        const elapsed = clock.getElapsedTime();
        shieldMaterial.uniforms.uTime.value = elapsed;
        shieldMesh.rotation.y += 0.0018;
        shieldMesh.rotation.x += 0.0012;
        wireMesh.rotation.y -= 0.0016;
        particles.rotation.y += 0.0008;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
    }

    let frame = requestAnimationFrame(render);
    resize();
    window.addEventListener('resize', resize);

    return {
        destroy() {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            shieldGeometry.dispose();
            wireMaterial.dispose();
            shieldMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            renderer.dispose();
        },
    };
}
