/**
 * SkyGlitch - Cyberpunk Flight Simulator
 * A complete 3D flight simulator with realistic physics and cyberpunk aesthetics
 */

// Game Configuration
const CONFIG = {
    physics: {
        gravity: -9.81,
        airDensity: 1.225,
        dragCoefficient: 0.02,
        liftCoefficient: 0.8,
        maxThrottle: 100,
        fuelConsumption: 0.05
    },
    world: {
        size: 10000,
        checkpoints: 15,
        turbulenceZones: 8,
        anomalies: 5
    },
    graphics: {
        fogNear: 100,
        fogFar: 8000,
        renderDistance: 10000
    }
};

// Global Game State
let gameState = {
    isLoaded: false,
    isPaused: false,
    gameTime: 0,
    missionTime: 0,
    score: 0,
    checkpointsCollected: 0
};

// Three.js Core Objects
let scene, camera, renderer, aircraft;
let world = {
    terrain: null,
    sky: null,
    checkpoints: [],
    turbulenceZones: [],
    anomalies: [],
    particles: []
};

// Flight Physics State
let flightState = {
    position: new THREE.Vector3(0, 1000, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    throttle: 0,
    fuel: 100,
    hull: 100,
    engine: 100,
    speed: 0,
    altitude: 1000,
    heading: 0
};

// Input State
let inputState = {
    keys: {},
    mouse: { x: 0, y: 0, deltaX: 0, deltaY: 0 },
    gamepad: null
};

// Audio System
let audioSystem = {
    engine: null,
    wind: null,
    alert: null,
    glitch: null,
    context: null,
    masterVolume: 0.7
};

/**
 * Initialize the game
 */
async function initGame() {
    try {
        // Show loading screen
        showLoadingScreen();
        
        // Initialize Three.js
        await initThreeJS();
        
        // Initialize audio
        await initAudio();
        
        // Create aircraft
        await createAircraft();
        
        // Create world
        await createWorld();
        
        // Setup input handlers
        setupInputHandlers();
        
        // Setup HUD
        setupHUD();
        
        // Hide loading screen and start game
        hideLoadingScreen();
        startGameLoop();
        
        gameState.isLoaded = true;
        logMessage("FLIGHT SYSTEMS FULLY OPERATIONAL");
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        logMessage("CRITICAL ERROR: SYSTEM FAILURE");
    }
}

/**
 * Initialize Three.js scene, camera, and renderer
 */
async function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x001122, CONFIG.graphics.fogNear, CONFIG.graphics.fogFar);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        CONFIG.graphics.renderDistance
    );
    
    // Create renderer
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000511);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1000, 2000, 1000);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
}

/**
 * Initialize audio system
 */
async function initAudio() {
    try {
        // Create audio context
        audioSystem.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Get audio elements
        audioSystem.engine = document.getElementById('engineSound');
        audioSystem.wind = document.getElementById('windSound');
        audioSystem.alert = document.getElementById('alertSound');
        audioSystem.glitch = document.getElementById('glitchSound');
        
        // Set volumes
        if (audioSystem.engine) audioSystem.engine.volume = 0.6;
        if (audioSystem.wind) audioSystem.wind.volume = 0.4;
        if (audioSystem.alert) audioSystem.alert.volume = 0.8;
        if (audioSystem.glitch) audioSystem.glitch.volume = 0.5;
        
    } catch (error) {
        console.warn('Audio initialization failed:', error);
    }
}

/**
 * Create the aircraft model
 */
async function createAircraft() {
    // Create aircraft group
    aircraft = new THREE.Group();
    
    // Main fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const fuselageMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff88,
        emissive: 0x002200,
        shininess: 100
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    aircraft.add(fuselage);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(6, 0.1, 1.5);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ccff,
        emissive: 0x001122
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.z = -0.5;
    aircraft.add(wings);
    
    // Tail
    const tailGeometry = new THREE.BoxGeometry(0.1, 2, 1);
    const tailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff88,
        emissive: 0x002200
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.x = -1.8;
    tail.position.y = 0.5;
    aircraft.add(tail);
    
    // Engine glow effects
    const engineGlowGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const engineGlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });
    
    const leftEngine = new THREE.Mesh(engineGlowGeometry, engineGlowMaterial);
    leftEngine.position.set(-2, 0, 1);
    aircraft.add(leftEngine);
    
    const rightEngine = new THREE.Mesh(engineGlowGeometry, engineGlowMaterial);
    rightEngine.position.set(-2, 0, -1);
    aircraft.add(rightEngine);
    
    // Position aircraft
    aircraft.position.copy(flightState.position);
    aircraft.castShadow = true;
    aircraft.receiveShadow = true;
    
    scene.add(aircraft);
}

/**
 * Create the game world
 */
async function createWorld() {
    // Create terrain
    createTerrain();
    
    // Create sky
    createSky();
    
    // Create checkpoints
    createCheckpoints();
    
    // Create turbulence zones
    createTurbulenceZones();
    
    // Create anomalies
    createAnomalies();
    
    // Create particle systems
    createParticles();
}

/**
 * Create terrain
 */
function createTerrain() {
    const terrainSize = CONFIG.world.size;
    const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 100, 100);
    
    // Add height variation
    const vertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.sin(vertices[i] * 0.001) * Math.cos(vertices[i + 1] * 0.001) * 50;
    }
    terrainGeometry.attributes.position.needsUpdate = true;
    terrainGeometry.computeVertexNormals();
    
    const terrainMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x003300,
        wireframe: false,
        transparent: true,
        opacity: 0.8
    });
    
    world.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    world.terrain.rotation.x = -Math.PI / 2;
    world.terrain.position.y = -100;
    world.terrain.receiveShadow = true;
    
    scene.add(world.terrain);
}

/**
 * Create sky dome
 */
function createSky() {
    const skyGeometry = new THREE.SphereGeometry(CONFIG.graphics.renderDistance * 0.8, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec2 resolution;
            varying vec2 vUv;
            
            void main() {
                vec2 uv = vUv;
                vec3 color = vec3(0.0, 0.1, 0.3);
                
                // Add stars
                float stars = step(0.98, sin(uv.x * 100.0) * cos(uv.y * 100.0));
                color += stars * vec3(0.8, 0.9, 1.0);
                
                // Add nebula effect
                float nebula = sin(uv.x * 5.0 + time * 0.1) * cos(uv.y * 3.0 + time * 0.15);
                color += nebula * 0.1 * vec3(0.5, 0.0, 0.8);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.BackSide
    });
    
    world.sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(world.sky);
}

/**
 * Setup HUD elements
 */
function setupHUD() {
    // Initialize radar
    updateRadar();
    
    // Start HUD update loop
    setInterval(updateHUD, 100);
}

/**
 * Update HUD elements
 */
function updateHUD() {
    if (!gameState.isLoaded) return;
    
    // Update flight data
    document.getElementById('altitude').textContent = Math.round(flightState.altitude).toString().padStart(4, '0');
    document.getElementById('speed').textContent = Math.round(flightState.speed).toString().padStart(3, '0');
    document.getElementById('heading').textContent = Math.round(flightState.heading).toString().padStart(3, '0');
    document.getElementById('throttle').textContent = Math.round(flightState.throttle).toString().padStart(2, '0');
    
    // Update system bars
    updateSystemBar('fuelBar', 'fuel', flightState.fuel);
    updateSystemBar('hullBar', 'hull', flightState.hull);
    updateSystemBar('engineBar', 'engine', flightState.engine);
    
    // Update threat level
    const threatElement = document.getElementById('threatLevel');
    if (flightState.hull < 30) {
        threatElement.textContent = 'CRITICAL';
        threatElement.className = 'value glitch';
    } else if (flightState.hull < 60) {
        threatElement.textContent = 'HIGH';
        threatElement.className = 'value';
    } else {
        threatElement.textContent = 'LOW';
        threatElement.className = 'value';
    }
}

/**
 * Update system bar
 */
function updateSystemBar(barId, valueId, percentage) {
    const bar = document.getElementById(barId);
    const valueElement = document.getElementById(valueId);
    
    if (bar && valueElement) {
        bar.style.width = Math.max(0, percentage) + '%';
        valueElement.textContent = Math.round(percentage) + '%';
    }
}

/**
 * Update radar display
 */
function updateRadar() {
    const radarBlips = document.getElementById('radarBlips');
    if (!radarBlips) return;
    
    // Clear existing blips
    radarBlips.innerHTML = '';
    
    // Add checkpoint blips
    world.checkpoints.forEach(checkpoint => {
        if (!checkpoint.userData.collected) {
            const distance = aircraft.position.distanceTo(checkpoint.position);
            if (distance < 2000) {
                const blip = createRadarBlip(checkpoint.position, 'checkpoint');
                radarBlips.appendChild(blip);
            }
        }
    });
    
    // Add anomaly blips
    world.anomalies.forEach(anomaly => {
        const distance = aircraft.position.distanceTo(anomaly.position);
        if (distance < 1500) {
            const blip = createRadarBlip(anomaly.position, 'anomaly');
            radarBlips.appendChild(blip);
        }
    });
}

/**
 * Create radar blip element
 */
function createRadarBlip(worldPos, type) {
    const blip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    // Convert world position to radar coordinates
    const relativePos = worldPos.clone().sub(aircraft.position);
    const radarX = 100 + (relativePos.x / 50);
    const radarY = 100 + (relativePos.z / 50);
    
    blip.setAttribute('cx', Math.max(10, Math.min(190, radarX)));
    blip.setAttribute('cy', Math.max(10, Math.min(190, radarY)));
    blip.setAttribute('r', type === 'checkpoint' ? '3' : '2');
    blip.setAttribute('fill', type === 'checkpoint' ? '#00ff88' : '#ff0088');
    blip.setAttribute('opacity', '0.8');
    
    return blip;
}

/**
 * Log message to mission log
 */
function logMessage(message) {
    const logContent = document.getElementById('logContent');
    if (!logContent) return;
    
    const timestamp = formatTime(gameState.missionTime);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${timestamp}] ${message}`;
    
    logContent.appendChild(entry);
    
    // Remove old entries if too many
    while (logContent.children.length > 10) {
        logContent.removeChild(logContent.firstChild);
    }
    
    // Scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
}

/**
 * Format time for display
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }, 2000);
    }
}

/**
 * Start the main game loop
 */
function startGameLoop() {
    const clock = new THREE.Clock();
    
    function gameLoop() {
        if (!gameState.isLoaded) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        const deltaTime = clock.getDelta();
        gameState.gameTime += deltaTime;
        gameState.missionTime += deltaTime;
        
        if (!gameState.isPaused) {
            // Update physics
            updatePhysics(deltaTime);
            
            // Update input
            updateInput(deltaTime);
            
            // Update world objects
            updateWorldObjects(deltaTime);
            
            // Update camera
            updateCamera(deltaTime);
            
            // Update audio
            updateAudio(deltaTime);
            
            // Check collisions
            checkCollisions();
            
            // Update effects
            updateEffects(deltaTime);
        }
        
        // Render scene
        renderer.render(scene, camera);
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Initialize game when page loads
window.addEventListener('load', () => {
    initGame();
});
