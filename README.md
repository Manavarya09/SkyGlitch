# SkyGlitch - Cyberpunk Flight Simulator

🚁 **A complete 3D flight simulator browser game with cyberpunk aesthetics and realistic physics**

![SkyGlitch Banner](https://img.shields.io/badge/SkyGlitch-Flight%20Simulator-00ff88?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDBmZjg4Ii8+Cjwvc3ZnPgo=)

## 🎮 Game Features

### ✈️ **Realistic Flight Mechanics**
- **Physics-based flight**: Gravity, lift, drag, and thrust calculations
- **6-DOF movement**: Pitch, roll, yaw with realistic constraints
- **Throttle control**: Variable engine power with fuel consumption
- **Auto-leveling assistance**: Subtle flight aids for better control

### 🌍 **Open World Environment**
- **Massive flight area**: 10km x 10km procedural world
- **Dynamic terrain**: Height-mapped landscape with varied topology
- **Atmospheric particles**: 1000+ floating particles for immersion
- **Procedural sky**: Shader-based starfield with nebula effects

### 🎯 **Mission Objectives**
- **15 Checkpoints**: Floating ring targets to collect
- **8 Turbulence Zones**: Dynamic weather hazards
- **5 Anomalies**: Glitch zones with system interference
- **Score system**: Points for checkpoint collection and survival

### 🤖 **Cyberpunk Aesthetics**
- **Neon color palette**: Cyan, green, purple, and pink accents
- **Glitch effects**: Visual distortions and system interference
- **Animated UI**: Pulsing elements and smooth transitions
- **Retro-futuristic design**: Fighter jet cockpit inspired HUD

## 🎨 UI Design

### 📊 **Cockpit HUD**
- **Flight Data Panel**: Altitude, speed, heading, throttle
- **System Status**: Fuel, hull integrity, engine health
- **Threat Assessment**: Dynamic threat level indicator
- **Mission Status**: Real-time mission progress

### 🔘 **Radar System**
- **Animated SVG radar**: 360° tactical awareness
- **Real-time blips**: Checkpoints and anomalies tracking
- **Distance-based visibility**: Objects appear within range
- **Glowing sweep animation**: Continuous radar sweep effect

### 📝 **Mission Log**
- **Terminal-style interface**: Monospace font with timestamps
- **Real-time updates**: System messages and events
- **Auto-scrolling**: Latest messages always visible
- **Color-coded entries**: Different message types

### ⚡ **Glitch Effects**
- **Screen distortion**: Random visual glitches
- **Color shifting**: RGB channel separation
- **Flicker animations**: System malfunction simulation
- **Audio distortion**: Glitch sound effects

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W/S** | Pitch Up/Down |
| **A/D** | Roll Left/Right |
| **Q/E** | Yaw Left/Right |
| **Shift** | Throttle Up |
| **Ctrl** | Throttle Down |
| **Space** | Air Brake |
| **C** | Toggle Camera |
| **P** | Pause Game |
| **M** | Toggle Audio |

### 📱 **Mobile Support**
- Touch controls for mobile devices
- Responsive UI scaling
- Optimized performance for mobile browsers

## 🛠️ Technical Implementation

### 🎯 **Core Technologies**
- **Three.js**: 3D graphics and rendering
- **WebGL**: Hardware-accelerated graphics
- **Web Audio API**: Spatial audio and effects
- **CSS3**: Advanced animations and effects
- **HTML5 Canvas**: High-performance rendering

### ⚙️ **Physics Engine**
```javascript
// Realistic flight physics
const lift = liftCoefficient * speed * sin(angleOfAttack) * airDensity;
const drag = dragCoefficient * speed² * airDensity;
const thrust = (throttle / 100) * maxThrust;
```

### 🎨 **Shader Programming**
- **Custom vertex shaders**: Glitch displacement effects
- **Fragment shaders**: Procedural sky and anomaly effects
- **Uniform animations**: Time-based shader parameters

### 🔊 **Audio System**
- **Dynamic engine sounds**: Throttle-based volume
- **Wind effects**: Speed-based audio
- **3D spatial audio**: Positional sound effects
- **Glitch audio**: System malfunction sounds

## 📁 Project Structure

```
SkyGlitch/
├── index.html              # Main HTML file
├── style.css              # Cyberpunk UI styles
├── main.js                # Core game initialization
├── game-functions.js      # World generation and utilities
├── physics.js             # Flight physics and mechanics
├── assets/
│   ├── audio/
│   │   ├── engine.mp3     # Engine sound loop
│   │   ├── wind.mp3       # Wind sound effects
│   │   ├── alert.mp3      # Alert notifications
│   │   └── glitch.mp3     # Glitch sound effects
│   ├── svg/
│   │   ├── aircraft.svg   # Animated aircraft icon
│   │   └── checkpoint.svg # Checkpoint ring graphics
│   ├── images/            # Game textures and sprites
│   └── fonts/             # Custom cyberpunk fonts
└── README.md              # This documentation
```

## 🚀 Getting Started

### 📋 **Prerequisites**
- Modern web browser with WebGL support
- JavaScript enabled
- Audio support (optional but recommended)

### 💻 **Installation**
1. **Clone or download** the repository
2. **Open `index.html`** in your web browser
3. **Wait for loading** (3-5 seconds)
4. **Start flying!** Use WASD + Shift/Ctrl controls

### 🌐 **Web Server (Recommended)**
For best performance, serve from a local web server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 🎯 Gameplay Guide

### 🛫 **Taking Off**
1. **Increase throttle** with Shift key
2. **Pull up gently** with W key
3. **Maintain speed** above 50 km/h for lift
4. **Watch fuel consumption** in the HUD

### 🎯 **Mission Objectives**
- **Collect all 15 checkpoints** (green rings)
- **Avoid turbulence zones** (orange particle clouds)
- **Navigate around anomalies** (glitching pink objects)
- **Manage fuel and hull integrity**
- **Survive as long as possible**

### ⚠️ **Hazards**
- **Ground collision**: Causes hull damage
- **Fuel depletion**: Engine failure
- **Turbulence**: Uncontrollable forces
- **Anomalies**: System interference and glitches

### 🏆 **Scoring**
- **100 points** per checkpoint collected
- **Bonus points** for survival time
- **Penalty** for hull damage
- **Mission complete** when all checkpoints collected

## 🔧 Customization

### ⚙️ **Game Configuration**
Edit `CONFIG` object in `main.js`:

```javascript
const CONFIG = {
    physics: {
        gravity: -9.81,        // Gravity strength
        liftCoefficient: 0.8,  // Lift generation
        dragCoefficient: 0.02, // Air resistance
        fuelConsumption: 0.05  // Fuel usage rate
    },
    world: {
        size: 10000,          // World dimensions
        checkpoints: 15,      // Number of targets
        turbulenceZones: 8,   // Weather hazards
        anomalies: 5          // Glitch zones
    }
};
```

### 🎨 **Visual Customization**
Modify CSS variables in `style.css`:

```css
:root {
    --primary-cyan: #00ffff;    /* Main accent color */
    --primary-green: #00ff88;   /* Success color */
    --primary-purple: #8800ff;  /* System color */
    --primary-pink: #ff0088;    /* Warning color */
}
```

## 🐛 Troubleshooting

### ❌ **Common Issues**

**Game won't load:**
- Check browser WebGL support
- Disable ad blockers
- Try different browser

**Poor performance:**
- Reduce particle count in `createParticles()`
- Lower render distance in CONFIG
- Close other browser tabs

**No audio:**
- Check browser audio permissions
- Ensure audio files are accessible
- Try user interaction first (click/key press)

**Controls not working:**
- Check keyboard focus on game window
- Disable browser extensions
- Try refreshing the page

## 🤝 Contributing

### 🔧 **Development Setup**
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### 📝 **Code Style**
- Use JSDoc comments
- Follow existing naming conventions
- Maintain consistent indentation
- Add error handling

### 🎯 **Feature Ideas**
- Multiplayer support
- Weapon systems
- More aircraft models
- Weather effects
- Day/night cycle
- VR support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **WebGL** - Hardware acceleration
- **Google Fonts** - Orbitron and Share Tech Mono
- **Cyberpunk aesthetics** - Inspired by retro-futuristic design

---

**🚁 Ready to fly through the glitched sky? Launch SkyGlitch and experience the future of flight simulation!**

*Built with ❤️ and lots of ☕ by the SkyGlitch team*
