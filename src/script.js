import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import pointsVertexShader from './shaders/points/vertex.glsl';
import pointsFragmentShader from './shaders/points/fragment.glsl';
import gsap from 'gsap';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const bufferScene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});
const material1 = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null },
    },
    vertexShader: pointsVertexShader,
    fragmentShader: pointsFragmentShader,
    side: THREE.DoubleSide
});

let num = 100;
let pgeo = new THREE.BufferGeometry();

let positions = new Float32Array(num * 3);
let size = new Float32Array(num);

for (let i = 0; i < num; i++) {
    positions.set([3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), 0], i * 3);
    size.set([Math.random()], i);

}

pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pgeo.setAttribute('size', new THREE.BufferAttribute(size, 1));
const pointsMesh = new THREE.Points(pgeo, material1);
const pointsMesh1 = new THREE.Points(pgeo, material1);
scene.add(pointsMesh);
bufferScene.add(pointsMesh1);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let bufferTexture = new THREE.WebGLRenderTarget(sizes.width, sizes.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
    });
let bufferTexture1 = new THREE.WebGLRenderTarget(sizes.width, sizes.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
    });

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

const boxGeo = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, material);
const boxMesh1 = new THREE.Mesh(boxGeo, material1);
scene.add(boxMesh);
bufferScene.add(boxMesh1);

boxMesh.position.z = 0.05;
boxMesh1.position.z = -0.05;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();
    let playHead = elapsedTime % 2;
    playHead = playHead < 0.5 ? 0 : 1;
    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;

    material.uniforms.uTexture.value = bufferTexture.texture;
    // Render
    renderer.setRenderTarget(bufferTexture1);
    renderer.render(bufferScene, camera);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);

    boxMesh.position.z = (2 * playHead) - 0.1;
    pointsMesh.position.z = (2 * playHead);

    let temp = bufferTexture;
    bufferTexture = bufferTexture1;
    bufferTexture1 = temp;

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();