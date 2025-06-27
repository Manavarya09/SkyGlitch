/**
 * Physics and game mechanics for SkyGlitch
 */

/**
 * Update flight physics
 */
function updatePhysics(deltaTime) {
    if (!aircraft) return;
    
    // Apply gravity
    flightState.velocity.y += CONFIG.physics.gravity * deltaTime;
    
    // Calculate lift based on speed and angle of attack
    const speed = flightState.velocity.length();
    const angleOfAttack = aircraft.rotation.x;
    const lift = CONFIG.physics.liftCoefficient * speed * Math.sin(angleOfAttack) * CONFIG.physics.airDensity;
    
    // Apply lift
    flightState.velocity.y += lift * deltaTime;
    
    // Calculate drag
    const drag = CONFIG.physics.dragCoefficient * speed * speed * CONFIG.physics.airDensity;
    const dragVector = flightState.velocity.clone().normalize().multiplyScalar(-drag * deltaTime);
    flightState.velocity.add(dragVector);
    
    // Apply thrust based on throttle
    const thrustPower = (flightState.throttle / 100) * 50;
    const thrustDirection = new THREE.Vector3(1, 0, 0);
    thrustDirection.applyEuler(aircraft.rotation);
    thrustDirection.multiplyScalar(thrustPower * deltaTime);
    flightState.velocity.add(thrustDirection);
    
    // Update position
    const deltaPosition = flightState.velocity.clone().multiplyScalar(deltaTime);
    flightState.position.add(deltaPosition);
    aircraft.position.copy(flightState.position);
    
    // Update flight state values
    flightState.speed = speed * 3.6; // Convert to km/h
    flightState.altitude = flightState.position.y;
    flightState.heading = (aircraft.rotation.y * 180 / Math.PI + 360) % 360;
    
    // Consume fuel
    if (flightState.throttle > 0) {
        flightState.fuel -= CONFIG.physics.fuelConsumption * (flightState.throttle / 100) * deltaTime;
        flightState.fuel = Math.max(0, flightState.fuel);
    }
    
    // Check for ground collision
    if (flightState.position.y < 0) {
        flightState.position.y = 0;
        flightState.velocity.y = 0;
        
        // Apply damage
        const impactSpeed = Math.abs(flightState.velocity.length());
        if (impactSpeed > 10) {
            const damage = Math.min(50, impactSpeed * 2);
            flightState.hull -= damage;
            logMessage(`GROUND IMPACT - HULL DAMAGE: ${Math.round(damage)}%`);
            
            if (audioSystem.alert) {
                audioSystem.alert.play();
            }
        }
    }
    
    // Check for fuel depletion
    if (flightState.fuel <= 0) {
        flightState.engine = Math.max(0, flightState.engine - 10 * deltaTime);
        if (flightState.engine <= 0) {
            flightState.throttle = 0;
            logMessage("ENGINE FAILURE - NO FUEL");
        }
    }
    
    // Check for critical hull damage
    if (flightState.hull <= 0) {
        // Game over logic
        logMessage("CRITICAL HULL FAILURE - MISSION TERMINATED");
        gameState.isPaused = true;
    }
}

/**
 * Update input handling
 */
function updateInput(deltaTime) {
    if (!aircraft) return;
    
    const rotationSpeed = 1.5;
    const throttleSpeed = 50;
    
    // Pitch (W/S)
    if (inputState.keys['KeyW']) {
        aircraft.rotation.x -= rotationSpeed * deltaTime;
    }
    if (inputState.keys['KeyS']) {
        aircraft.rotation.x += rotationSpeed * deltaTime;
    }
    
    // Roll (A/D)
    if (inputState.keys['KeyA']) {
        aircraft.rotation.z += rotationSpeed * deltaTime;
    }
    if (inputState.keys['KeyD']) {
        aircraft.rotation.z -= rotationSpeed * deltaTime;
    }
    
    // Yaw (Q/E)
    if (inputState.keys['KeyQ']) {
        aircraft.rotation.y -= rotationSpeed * deltaTime;
    }
    if (inputState.keys['KeyE']) {
        aircraft.rotation.y += rotationSpeed * deltaTime;
    }
    
    // Throttle (Shift/Ctrl)
    if (inputState.keys['ShiftLeft'] || inputState.keys['ShiftRight']) {
        flightState.throttle = Math.min(100, flightState.throttle + throttleSpeed * deltaTime);
    }
    if (inputState.keys['ControlLeft'] || inputState.keys['ControlRight']) {
        flightState.throttle = Math.max(0, flightState.throttle - throttleSpeed * deltaTime);
    }
    
    // Brake (Space)
    if (inputState.keys['Space']) {
        flightState.velocity.multiplyScalar(0.95);
        flightState.throttle = Math.max(0, flightState.throttle - throttleSpeed * 2 * deltaTime);
    }
    
    // Limit rotation angles
    aircraft.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, aircraft.rotation.x));
    aircraft.rotation.z = Math.max(-Math.PI/2, Math.min(Math.PI/2, aircraft.rotation.z));
    
    // Auto-level assistance (slight)
    if (!inputState.keys['KeyA'] && !inputState.keys['KeyD']) {
        aircraft.rotation.z *= 0.98;
    }
    if (!inputState.keys['KeyW'] && !inputState.keys['KeyS']) {
        aircraft.rotation.x *= 0.99;
    }
}

/**
 * Update world objects
 */
function updateWorldObjects(deltaTime) {
    // Update checkpoints
    world.checkpoints.forEach(checkpoint => {
        if (!checkpoint.userData.collected) {
            checkpoint.rotation.y += deltaTime;
            checkpoint.children[1].rotation.x += deltaTime * 0.5;
        }
    });
    
    // Update turbulence zones
    world.turbulenceZones.forEach(zone => {
        zone.rotation.y += deltaTime * 0.3;
        
        // Apply turbulence effect if aircraft is nearby
        const distance = aircraft.position.distanceTo(zone.position);
        if (distance < 100) {
            const intensity = zone.userData.intensity * (1 - distance / 100);
            
            // Add random forces
            const turbulence = new THREE.Vector3(
                (Math.random() - 0.5) * intensity * 20,
                (Math.random() - 0.5) * intensity * 10,
                (Math.random() - 0.5) * intensity * 20
            );
            
            flightState.velocity.add(turbulence.multiplyScalar(deltaTime));
            
            // Add visual shake
            aircraft.rotation.x += (Math.random() - 0.5) * intensity * 0.1;
            aircraft.rotation.z += (Math.random() - 0.5) * intensity * 0.1;
            
            if (Math.random() < 0.01) {
                logMessage("TURBULENCE DETECTED");
            }
        }
    });
    
    // Update anomalies
    world.anomalies.forEach(anomaly => {
        const material = anomaly.children[0].material;
        if (material.uniforms) {
            material.uniforms.time.value = gameState.gameTime;
        }
        
        // Apply glitch effects if aircraft is nearby
        const distance = aircraft.position.distanceTo(anomaly.position);
        if (distance < 150) {
            const glitchPower = anomaly.userData.glitchPower * (1 - distance / 150);
            
            // Trigger glitch overlay
            if (Math.random() < glitchPower * 0.1) {
                triggerGlitchEffect();
            }
            
            // System interference
            if (Math.random() < glitchPower * 0.05) {
                flightState.engine -= glitchPower * 5;
                flightState.engine = Math.max(0, flightState.engine);
                logMessage("SYSTEM INTERFERENCE DETECTED");
            }
        }
    });
    
    // Update particles
    world.particles.forEach(particleSystem => {
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * deltaTime * 100;
            positions[i + 1] += velocities[i + 1] * deltaTime * 100;
            positions[i + 2] += velocities[i + 2] * deltaTime * 100;
            
            // Reset particles that fall too low
            if (positions[i + 1] < -100) {
                positions[i + 1] = 3000;
                positions[i] = (Math.random() - 0.5) * CONFIG.world.size;
                positions[i + 2] = (Math.random() - 0.5) * CONFIG.world.size;
            }
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    });
    
    // Update sky shader
    if (world.sky && world.sky.material.uniforms) {
        world.sky.material.uniforms.time.value = gameState.gameTime;
    }
    
    // Update radar periodically
    if (Math.floor(gameState.gameTime * 10) % 5 === 0) {
        updateRadar();
    }
}

/**
 * Update camera position and rotation
 */
function updateCamera(deltaTime) {
    if (!aircraft) return;
    
    // Third-person camera following aircraft
    const cameraOffset = new THREE.Vector3(0, 5, 15);
    cameraOffset.applyEuler(aircraft.rotation);
    
    const targetPosition = aircraft.position.clone().add(cameraOffset);
    
    // Smooth camera movement
    camera.position.lerp(targetPosition, deltaTime * 2);
    
    // Look at aircraft with slight offset
    const lookAtTarget = aircraft.position.clone();
    lookAtTarget.y += 2;
    camera.lookAt(lookAtTarget);
}

/**
 * Update audio based on game state
 */
function updateAudio(deltaTime) {
    if (!audioSystem.engine) return;
    
    // Engine sound based on throttle
    const engineVolume = (flightState.throttle / 100) * 0.6 * audioSystem.masterVolume;
    audioSystem.engine.volume = engineVolume;
    
    if (flightState.throttle > 0 && audioSystem.engine.paused) {
        audioSystem.engine.play();
    } else if (flightState.throttle === 0 && !audioSystem.engine.paused) {
        audioSystem.engine.pause();
    }
    
    // Wind sound based on speed
    if (audioSystem.wind) {
        const windVolume = Math.min(0.4, flightState.speed / 200) * audioSystem.masterVolume;
        audioSystem.wind.volume = windVolume;
        
        if (flightState.speed > 10 && audioSystem.wind.paused) {
            audioSystem.wind.play();
        } else if (flightState.speed <= 10 && !audioSystem.wind.paused) {
            audioSystem.wind.pause();
        }
    }
}

/**
 * Check for collisions with world objects
 */
function checkCollisions() {
    if (!aircraft) return;
    
    // Check checkpoint collisions
    world.checkpoints.forEach(checkpoint => {
        if (!checkpoint.userData.collected) {
            const distance = aircraft.position.distanceTo(checkpoint.position);
            if (distance < 25) {
                checkpoint.userData.collected = true;
                checkpoint.visible = false;
                gameState.checkpointsCollected++;
                gameState.score += 100;
                
                logMessage(`CHECKPOINT ${checkpoint.userData.id + 1} COLLECTED`);
                
                // Play success sound
                if (audioSystem.alert) {
                    audioSystem.alert.play();
                }
                
                // Check if all checkpoints collected
                if (gameState.checkpointsCollected >= CONFIG.world.checkpoints) {
                    logMessage("MISSION COMPLETE - ALL CHECKPOINTS COLLECTED");
                    gameState.isPaused = true;
                }
            }
        }
    });
}

/**
 * Update visual effects
 */
function updateEffects(deltaTime) {
    // Engine glow effects
    if (aircraft && aircraft.children.length > 3) {
        const leftEngine = aircraft.children[3];
        const rightEngine = aircraft.children[4];
        
        const glowIntensity = flightState.throttle / 100;
        leftEngine.material.opacity = 0.3 + glowIntensity * 0.5;
        rightEngine.material.opacity = 0.3 + glowIntensity * 0.5;
        
        // Scale based on throttle
        const scale = 0.5 + glowIntensity * 0.5;
        leftEngine.scale.setScalar(scale);
        rightEngine.scale.setScalar(scale);
    }
    
    // Damage effects
    if (flightState.hull < 50) {
        // Add smoke particles or sparks
        if (Math.random() < 0.1) {
            triggerGlitchEffect();
        }
    }
}

/**
 * Trigger glitch visual effect
 */
function triggerGlitchEffect() {
    const glitchOverlay = document.getElementById('glitchOverlay');
    if (glitchOverlay) {
        glitchOverlay.style.opacity = '0.3';
        setTimeout(() => {
            glitchOverlay.style.opacity = '0';
        }, 100);
    }
    
    // Play glitch sound
    if (audioSystem.glitch && Math.random() < 0.3) {
        audioSystem.glitch.currentTime = 0;
        audioSystem.glitch.play();
    }
}
