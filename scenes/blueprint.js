import * as THREE from 'https://cdn.skypack.dev/three@0.162.0';

export function initBlueprintScene(canvas) {
    if (!canvas) {
        return { setActive: () => {}, destroy: () => {} };
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const group = new THREE.Group();
    scene.add(group);

    const planeGeometry = new THREE.BoxGeometry(5.2, 2.4, 0.08);
    const layerColors = [0x1a9bff, 0x1bd9ff, 0x53ffc9];
    const layers = layerColors.map((color, index) => {
        const material = new THREE.MeshStandardMaterial({
            color,
            emissive: new THREE.Color(color).multiplyScalar(0.1),
            metalness: 0.3,
            roughness: 0.35,
            transparent: true,
            opacity: 0.85,
        });
        const mesh = new THREE.Mesh(planeGeometry, material);
        mesh.position.y = index * 0.9 - 0.9;
        mesh.position.z = index * -0.5;
        mesh.userData.baseY = mesh.position.y;
        group.add(mesh);
        return mesh;
    });

    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x0efcd6, transparent: true, opacity: 0.4 });
    const edges = new THREE.EdgesGeometry(planeGeometry);
    layers.forEach((layer) => {
        const line = new THREE.LineSegments(edges, edgeMaterial.clone());
        line.position.copy(layer.position);
        line.userData.layer = layer;
        group.add(line);
        layer.userData.outline = line;
    });

    const ambient = new THREE.AmbientLight(0x101824, 0.9);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0x58f3ff, 1.4);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);
    scene.add(new THREE.PointLight(0x0efcd6, 0.8, 20, 2));

    let activeIndex = 0;
    let rotationTarget = -0.3;
    let tiltTarget = 0.18;

    function resize() {
        const bounds = canvas.getBoundingClientRect();
        const width = bounds.width || window.innerWidth;
        const height = bounds.height || window.innerHeight * 0.6;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function setActive(index) {
        activeIndex = index;
        rotationTarget = -0.35 + index * 0.25;
        tiltTarget = 0.12 + index * 0.04;
        layers.forEach((layer, layerIndex) => {
            const isActive = layerIndex === activeIndex;
            layer.material.emissiveIntensity = isActive ? 0.8 : 0.25;
            layer.material.opacity = isActive ? 1 : 0.55;
            layer.userData.outline.material.opacity = isActive ? 0.7 : 0.3;
        });
    }

    function animate() {
        group.rotation.y += (rotationTarget - group.rotation.y) * 0.05;
        group.rotation.x += (tiltTarget - group.rotation.x) * 0.04;
        layers.forEach((layer, index) => {
            const offset = index === activeIndex ? 0.25 : 0;
            layer.position.y += ((layer.userData.baseY + offset) - layer.position.y) * 0.08;
            layer.userData.outline.position.copy(layer.position);
        });
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
    }

    let frame = requestAnimationFrame(animate);
    setActive(0);
    resize();
    window.addEventListener('resize', resize);

    return {
        setActive,
        destroy() {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            planeGeometry.dispose();
            edges.dispose();
            layers.forEach((layer) => {
                layer.material.dispose();
                layer.userData.outline.material.dispose();
            });
            renderer.dispose();
        },
    };
}
