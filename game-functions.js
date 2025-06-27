/**
 * Additional game functions for SkyGlitch
 */

/**
 * Create checkpoints throughout the world
 */
function createCheckpoints() {
    for (let i = 0; i < CONFIG.world.checkpoints; i++) {
        const checkpoint = new THREE.Group();
        
        // Outer ring
        const ringGeometry = new THREE.TorusGeometry(20, 2, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        checkpoint.add(ring);
        
        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(15, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        checkpoint.add(glow);
        
        // Position randomly
        checkpoint.position.set(
            (Math.random() - 0.5) * CONFIG.world.size * 0.8,
            Math.random() * 2000 + 500,
            (Math.random() - 0.5) * CONFIG.world.size * 0.8
        );
        
        checkpoint.userData = { 
            type: 'checkpoint', 
            collected: false,
            id: i
        };
        
        world.checkpoints.push(checkpoint);
        scene.add(checkpoint);
    }
}

/**
 * Create turbulence zones
 */
function createTurbulenceZones() {
    for (let i = 0; i < CONFIG.world.turbulenceZones; i++) {
        const zone = new THREE.Group();
        
        // Create swirling particles
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let j = 0; j < particleCount; j++) {
            positions[j * 3] = (Math.random() - 0.5) * 100;
            positions[j * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[j * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff8800,
            size: 2,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        zone.add(particleSystem);
        
        // Position zone
        zone.position.set(
            (Math.random() - 0.5) * CONFIG.world.size * 0.6,
            Math.random() * 1500 + 200,
            (Math.random() - 0.5) * CONFIG.world.size * 0.6
        );
        
        zone.userData = { 
            type: 'turbulence',
            intensity: Math.random() * 0.5 + 0.3
        };
        
        world.turbulenceZones.push(zone);
        scene.add(zone);
    }
}

/**
 * Create anomalies (glitch zones)
 */
function createAnomalies() {
    for (let i = 0; i < CONFIG.world.anomalies; i++) {
        const anomaly = new THREE.Group();
        
        // Create glitchy geometry
        const anomalyGeometry = new THREE.IcosahedronGeometry(30, 2);
        const anomalyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                glitchIntensity: { value: Math.random() * 0.5 + 0.5 }
            },
            vertexShader: `
                uniform float time;
                uniform float glitchIntensity;
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    
                    // Add glitch displacement
                    pos += sin(pos * 0.1 + time) * glitchIntensity * 5.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                void main() {
                    vec3 color = vec3(1.0, 0.0, 0.5);
                    
                    // Add glitch effect
                    float glitch = sin(vPosition.x * 0.1 + time * 10.0) * 
                                  cos(vPosition.y * 0.1 + time * 15.0);
                    
                    if (glitch > 0.5) {
                        color = vec3(0.0, 1.0, 1.0);
                    }
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true
        });
        
        const anomalyMesh = new THREE.Mesh(anomalyGeometry, anomalyMaterial);
        anomaly.add(anomalyMesh);
        
        // Position anomaly
        anomaly.position.set(
            (Math.random() - 0.5) * CONFIG.world.size * 0.7,
            Math.random() * 2500 + 300,
            (Math.random() - 0.5) * CONFIG.world.size * 0.7
        );
        
        anomaly.userData = { 
            type: 'anomaly',
            glitchPower: Math.random() * 0.8 + 0.2
        };
        
        world.anomalies.push(anomaly);
        scene.add(anomaly);
    }
}

/**
 * Create particle systems
 */
function createParticles() {
    // Create atmospheric particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * CONFIG.world.size;
        positions[i * 3 + 1] = Math.random() * 3000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.world.size;
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.1;
        velocities[i * 3 + 1] = -Math.random() * 0.05;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 1,
        transparent: true,
        opacity: 0.3
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    world.particles.push(particleSystem);
    scene.add(particleSystem);
}

/**
 * Setup input handlers
 */
function setupInputHandlers() {
    // Keyboard events
    document.addEventListener('keydown', (event) => {
        inputState.keys[event.code] = true;
        
        // Handle special keys
        switch (event.code) {
            case 'KeyC':
                toggleCamera();
                break;
            case 'KeyP':
                togglePause();
                break;
            case 'KeyM':
                toggleAudio();
                break;
        }
    });
    
    document.addEventListener('keyup', (event) => {
        inputState.keys[event.code] = false;
    });
    
    // Mouse events
    document.addEventListener('mousemove', (event) => {
        inputState.mouse.deltaX = event.movementX || 0;
        inputState.mouse.deltaY = event.movementY || 0;
        inputState.mouse.x = event.clientX;
        inputState.mouse.y = event.clientY;
    });
    
    // Touch events for mobile
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Gamepad support
    window.addEventListener('gamepadconnected', (event) => {
        inputState.gamepad = event.gamepad;
        logMessage("GAMEPAD CONNECTED");
    });
}

/**
 * Handle touch events for mobile
 */
function handleTouchStart(event) {
    event.preventDefault();
    // Implement touch controls
}

function handleTouchMove(event) {
    event.preventDefault();
    // Implement touch controls
}

function handleTouchEnd(event) {
    event.preventDefault();
    // Implement touch controls
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Toggle camera view
 */
function toggleCamera() {
    // Implement camera switching logic
    logMessage("CAMERA VIEW SWITCHED");
}

/**
 * Toggle pause
 */
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    logMessage(gameState.isPaused ? "GAME PAUSED" : "GAME RESUMED");
}

/**
 * Toggle audio
 */
function toggleAudio() {
    audioSystem.masterVolume = audioSystem.masterVolume > 0 ? 0 : 0.7;
    logMessage(audioSystem.masterVolume > 0 ? "AUDIO ON" : "AUDIO OFF");
}
