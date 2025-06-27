
// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Plane
const geometry = new THREE.BoxGeometry(1, 0.5, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

// Game state
let speed = 0.1;
let altitude = 0;
let fuel = 100;
let damage = 0;

function updateHUD() {
  document.getElementById('altitude').textContent = Math.round(plane.position.y);
  document.getElementById('speed').textContent = Math.round(speed * 100);
  document.getElementById('fuel').textContent = Math.max(0, Math.round(fuel));
  document.getElementById('damage').textContent = Math.round(damage);
}

function animate() {
  requestAnimationFrame(animate);
  plane.rotation.y += 0.01;
  plane.position.z -= speed;
  altitude = plane.position.y;
  fuel -= 0.01;
  if (Math.random() < 0.01) damage += 0.5;
  updateHUD();
  renderer.render(scene, camera);
}

animate();
