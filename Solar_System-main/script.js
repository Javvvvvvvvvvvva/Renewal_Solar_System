import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Loading Screen Management
 */
const loadingScreen = document.getElementById('loading-screen')
const progressFill = document.getElementById('progress-fill')
const progressText = document.getElementById('progress-text')

let loadedTextures = 0
let totalTextures = 0

const updateLoadingProgress = (textureName) => {
  loadedTextures++
  const progress = (loadedTextures / totalTextures) * 100
  progressFill.style.width = `${progress}%`
  progressText.textContent = `Loading ${textureName}... (${loadedTextures}/${totalTextures})`
  
  if (loadedTextures >= totalTextures) {
    setTimeout(() => {
      progressText.textContent = 'Initializing 3D scene...'
      setTimeout(() => {
        progressText.textContent = 'Ready!'
        setTimeout(() => {
          loadingScreen.classList.add('hidden')
          setTimeout(() => {
            initializeDefaultMiniView()
          }, 4000)
        }, 4000)
      }, 7000)
    }, 500)
  }
}

/**
 * Base setup
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // Update mini-map size if active
  if (miniMapController.isActive) {
    miniMapController.updateMiniMapSize()
  }
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 3000)
camera.position.set(0, 50, 200)

const originalCameraPosition = camera.position.clone()
const originalCameraTarget = new THREE.Vector3(0, 0, 0)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.zoomSpeed = 0.5
controls.panSpeed = 0.5
controls.maxDistance = 800
controls.minDistance = 50

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2

/**
 * Lighting
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
scene.add(ambientLight)

// Sun light
const sunLight = new THREE.PointLight(0xffffff, 3, 1000)
sunLight.position.set(0, 0, 0)
sunLight.castShadow = true
sunLight.shadow.mapSize.width = 2048
sunLight.shadow.mapSize.height = 2048
scene.add(sunLight)

// Additional directional light for better planet illumination
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.position.set(100, 100, 100)
scene.add(directionalLight)

/**
 * Enhanced Starfield Background
 */
const createStarfield = () => {
  const starCount = 15000
  const stars = new THREE.BufferGeometry()
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3
    
    // Create stars in a sphere around the scene
    const radius = Math.random() * 2500 + 2000
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    
    // Random star colors (whites, blues, yellows)
    const color = new THREE.Color()
    const starType = Math.random()
    if (starType < 0.7) {
      // White stars
      color.setHSL(0, 0, Math.random() * 0.3 + 0.7)
    } else if (starType < 0.85) {
      // Blue stars
      color.setHSL(0.6, 0.8, Math.random() * 0.3 + 0.7)
    } else {
      // Yellow/orange stars
      color.setHSL(0.1, 0.8, Math.random() * 0.3 + 0.7)
    }
    
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
    
    // Random star sizes
    sizes[i] = Math.random() * 3 + 1
  }

  stars.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  stars.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  stars.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  })

  const starSystem = new THREE.Points(stars, starMaterial)
  scene.add(starSystem)
  
  return starSystem
}

const starfield = createStarfield()

/**
 * Planet Data with Enhanced Animation Properties
 */
const planetData = {
  sun: {
    radius: 30,
    distance: 0,
    orbitalSpeed: 0,
    rotationSpeed: 0.01,
    axialTilt: 0,
    texture: 'sun.png',
    name: 'Sun',
    info: 'The star at the center of our Solar System. It provides light and heat to all the planets through nuclear fusion.',
    color: 0xffff00
  },
  mercury: {
    radius: 2,
    distance: 40,
    orbitalSpeed: 0.04,
    rotationSpeed: 0.01,
    axialTilt: 0.03,
    texture: 'Mercury.jpeg',
    name: 'Mercury',
    info: 'The smallest and innermost planet. It has extreme temperature variations and no atmosphere.',
    color: 0x8c7853
  },
  venus: {
    radius: 4,
    distance: 50,
    orbitalSpeed: 0.015,
    rotationSpeed: 0.004,
    axialTilt: 3.1,
    texture: 'vernus.jpeg',
    name: 'Venus',
    info: 'The second planet from the Sun. Known for its thick atmosphere and extreme greenhouse effect.',
    color: 0xffa500
  },
  earth: {
    radius: 8,
    distance: 70,
    orbitalSpeed: 0.01,
    rotationSpeed: 0.02,
    axialTilt: 0.4,
    texture: 'earth.jpeg',
    name: 'Earth',
    info: 'Our home planet. The only known planet with life, abundant water, and a protective atmosphere.',
    color: 0x0077be
  },
  mars: {
    radius: 5,
    distance: 100,
    orbitalSpeed: 0.008,
    rotationSpeed: 0.018,
    axialTilt: 0.4,
    texture: 'mars.jpeg',
    name: 'Mars',
    info: 'The Red Planet. Has the largest volcano and canyon in the solar system.',
    color: 0xff4500
  },
  jupiter: {
    radius: 15,
    distance: 180,
    orbitalSpeed: 0.002,
    rotationSpeed: 0.04,
    axialTilt: 0.05,
    texture: 'jupiter.jpeg',
    name: 'Jupiter',
    info: 'The largest planet. A gas giant with a Great Red Spot storm that has raged for centuries.',
    color: 0xd8ca9d
  },
  saturn: {
    radius: 13,
    distance: 230,
    orbitalSpeed: 0.0009,
    rotationSpeed: 0.038,
    axialTilt: 0.5,
    texture: 'saturn.jpeg',
    name: 'Saturn',
    info: 'Famous for its spectacular ring system. The second largest planet in our solar system.',
    color: 0xfad5a5
  },
  uranus: {
    radius: 7.5,
    distance: 300,
    orbitalSpeed: 0.0004,
    rotationSpeed: 0.03,
    axialTilt: 1.7,
    texture: 'uranaus.jpeg',
    name: 'Uranus',
    info: 'An ice giant with a tilted axis. It rotates on its side compared to other planets.',
    color: 0x4fd0e7
  },
  neptune: {
    radius: 7,
    distance: 400,
    orbitalSpeed: 0.0001,
    rotationSpeed: 0.032,
    axialTilt: 0.5,
    texture: 'neptune.jpeg',
    name: 'Neptune',
    info: 'The windiest planet with speeds up to 2,100 km/h. An ice giant with a deep blue color.',
    color: 0x4b70dd
  }
}

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()
const textures = {}

// Initialize total textures count
totalTextures = Object.keys(planetData).length + 1 // +1 for moon texture

// Load all textures
Object.keys(planetData).forEach(planet => {
  if (planetData[planet].texture) {
    try {
      textures[planet] = textureLoader.load(
        planetData[planet].texture,
        // Success callback
        function(texture) {
          console.log(`✅ Loaded texture: ${planetData[planet].texture}`)
          updateLoadingProgress(planetData[planet].texture)
        },
        // Progress callback
        function(progress) {
          console.log(`Loading ${planetData[planet].texture}: ${(progress.loaded / progress.total * 100)}%`)
        },
        // Error callback
        function(error) {
          console.error(`❌ Failed to load texture: ${planetData[planet].texture}`, error)
          // Set texture to null so we use fallback color
          textures[planet] = null
          updateLoadingProgress(planetData[planet].texture)
        }
      )
    } catch (error) {
      console.error(`❌ Error loading texture: ${planetData[planet].texture}`, error)
      textures[planet] = null
      updateLoadingProgress(planetData[planet].texture)
    }
  }
})

/**
 * Create Planets
 */
const planets = {}
const planetGroups = {}

Object.keys(planetData).forEach(planet => {
  const data = planetData[planet]
  
  // Create planet group for orbital motion
  const planetGroup = new THREE.Group()
  scene.add(planetGroup)
  planetGroups[planet] = planetGroup
  
  // Create planet mesh
  const geometry = new THREE.SphereGeometry(data.radius, 64, 32)
  const material = new THREE.MeshPhongMaterial({ 
    map: textures[planet] || null,
    color: textures[planet] ? 0xffffff : data.color,
    shininess: 30,
    transparent: false,
    opacity: 1.0
  })
  
  // Debug texture loading
  if (textures[planet]) {
    console.log(`✅ Using texture for ${planet}: ${planetData[planet].texture}`)
  } else {
    console.log(`⚠️ No texture for ${planet}, using color: ${data.color.toString(16)}`)
  }
  
  const planetMesh = new THREE.Mesh(geometry, material)
  planetMesh.castShadow = true
  planetMesh.receiveShadow = true
  
  // Set axial tilt in degrees and convert to radians
  planetMesh.rotation.x = data.axialTilt * (Math.PI / 180)
  
  // Add to group and position
  planetGroup.add(planetMesh)
  planetGroup.position.x = data.distance
  
  // Store planet data
  planetMesh.userData = {
    name: data.name,
    info: data.info,
    planet: planet,
    color: data.color
  }
  
  planets[planet] = {
    mesh: planetMesh,
    group: planetGroup,
    data: data
  }
  
  // Add orbit line
  if (data.distance > 0) {
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.5, data.distance + 0.5, 64)
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    })
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial)
    orbitRing.rotation.x = -Math.PI / 2
    scene.add(orbitRing)
  }
})

// Add Moon to Earth
const moonGeometry = new THREE.SphereGeometry(1, 32, 16)
const moonMaterial = new THREE.MeshPhongMaterial({ 
  map: textureLoader.load('moon.jpeg', 
    function(texture) { 
      console.log('✅ Loaded moon texture')
      updateLoadingProgress('moon.jpeg')
    },
    function(progress) { console.log(`Loading moon: ${(progress.loaded / progress.total * 100)}%`) },
    function(error) { 
      console.error('❌ Failed to load moon texture', error)
      updateLoadingProgress('moon.jpeg')
    }
  ),
  shininess: 10
})
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.castShadow = true
moon.position.set(15, 0, 0)
planets.earth.mesh.add(moon)

// Create realistic Saturn ring system
const createSaturnRings = () => {
  const ringSystem = new THREE.Group()
  
  // Create multiple rings with different properties (thinner)
  const ringConfigs = [
    { innerRadius: 18, outerRadius: 19.5, opacity: 0.8, color: 0xf4d03f },
    { innerRadius: 19.5, outerRadius: 21, opacity: 0.6, color: 0xf7dc6f },
    { innerRadius: 21, outerRadius: 22.5, opacity: 0.7, color: 0xf8d78a },
    { innerRadius: 22.5, outerRadius: 24, opacity: 0.5, color: 0xf9e79f },
    { innerRadius: 24, outerRadius: 25.5, opacity: 0.4, color: 0xfdf2e9 }
  ]
  
  ringConfigs.forEach((config, index) => {
    const ringGeometry = new THREE.RingGeometry(config.innerRadius, config.outerRadius, 128)
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: config.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: config.opacity,
      shininess: 100,
      specular: 0x444444
    })
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    
    // Add slight variation to each ring
    ring.rotation.z = (index * 0.1) * Math.PI / 180
    ring.userData = { index: index }
    
    ringSystem.add(ring)
  })
  
  // Add a subtle glow effect (thinner)
  const glowGeometry = new THREE.RingGeometry(17, 26, 64)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xf39c12,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.1
  })
  const glowRing = new THREE.Mesh(glowGeometry, glowMaterial)
  glowRing.rotation.x = Math.PI / 2
  ringSystem.add(glowRing)
  
  return ringSystem
}

const saturnRings = createSaturnRings()
planets.saturn.mesh.add(saturnRings)

/**
 * Mini-Map Planet View System
 */
class MiniMapController {
  constructor() {
    this.isActive = false
    this.currentPlanet = null
    this.miniCamera = null
    this.miniRenderer = null
    this.miniContainer = null
    this.miniScene = null
  }
  
  createMiniMap() {
    try {
      // Create container
      this.miniContainer = document.createElement('div')
      this.miniContainer.className = 'planet-mini-view'
      document.body.appendChild(this.miniContainer)
      
      // Create canvas
      const miniCanvas = document.createElement('canvas')
      miniCanvas.className = 'mini-canvas'
      this.miniContainer.appendChild(miniCanvas)
      
      // Create mini scene
      this.miniScene = new THREE.Scene()
      
          // Create mini camera
    this.miniCamera = new THREE.PerspectiveCamera(60, 350 / 350, 0.1, 1000)
    this.miniCamera.position.set(0, 0, 10)
      
      // Create mini renderer with error handling
      try {
        this.miniRenderer = new THREE.WebGLRenderer({
          canvas: miniCanvas,
          alpha: true,
          antialias: true
        })
        this.miniRenderer.setSize(350, 350)
        this.miniRenderer.setClearColor(0x000000, 0.8)
      } catch (error) {
        console.error('Failed to create mini renderer:', error)
        return false
      }
      
      // Add lighting to mini scene
      const miniAmbientLight = new THREE.AmbientLight(0x404040, 0.6)
      this.miniScene.add(miniAmbientLight)
      
      const miniDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      miniDirectionalLight.position.set(10, 10, 10)
      this.miniScene.add(miniDirectionalLight)
      
      console.log('Mini-map created successfully')
      return true
    } catch (error) {
      console.error('Failed to create mini-map:', error)
      return false
    }
  }
  
  showPlanet(planetName) {
    try {
      if (this.currentPlanet === planetName) {
        // Toggle off if same planet clicked
        this.hideMiniMap()
        return
      }
      
      const planet = planets[planetName]
      if (!planet) {
        console.error(`Planet ${planetName} not found`)
        return
      }
      
      // Create mini map if not exists
      if (!this.isReady()) {
        const success = this.createMiniMap()
        if (!success) {
          console.error('Failed to create mini-map')
          return
        }
      }
      
      this.currentPlanet = planetName
      this.isActive = true
      
      // Clear mini scene
      this.miniScene.clear()
      
      // Add lighting back
      const miniAmbientLight = new THREE.AmbientLight(0x404040, 0.6)
      this.miniScene.add(miniAmbientLight)
      
      const miniDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      miniDirectionalLight.position.set(10, 10, 10)
      this.miniScene.add(miniDirectionalLight)
      
          // Clone the planet for mini view
    const planetClone = planet.mesh.clone()
    planetClone.position.set(0, 0, 0)
    this.miniScene.add(planetClone)
    
    // Special handling for Saturn to ensure rings are properly cloned
    if (planetName === 'saturn') {
      // Remove any existing rings from the clone and add fresh ones
      planetClone.children.forEach(child => {
        if (child.type === 'Group') {
          planetClone.remove(child)
        }
      })
      
      // Add fresh ring system to the cloned planet
      const clonedRings = createSaturnRings()
      planetClone.add(clonedRings)
    }
      
          // Position camera based on planet size for better centering
    const data = planetData[planetName]
    const distance = data.radius * 2.2 // Optimal distance for centering
    this.miniCamera.position.set(0, 0, distance)
    this.miniCamera.lookAt(0, 0, 0)
    
    // Ensure the planet is perfectly centered
    planetClone.position.set(0, 0, 0)
    
    // Add a small offset for very large planets to ensure they fit
    if (data.radius > 2) {
      this.miniCamera.position.set(0, 0, distance * 1.2)
    }
      
      // Update renderer size based on container
      this.updateMiniMapSize()
      
      // Show container
      this.miniContainer.style.display = 'block'
      
      // Start mini render loop
      this.renderMiniMap()
      
      console.log(`Mini-map showing planet: ${planetName}`)
    } catch (error) {
      console.error('Error showing planet in mini-map:', error)
    }
  }
  
  hideMiniMap() {
    if (this.miniContainer) {
      this.miniContainer.style.display = 'none'
    }
    this.isActive = false
    this.currentPlanet = null
  }
  
  isReady() {
    return this.miniContainer && this.miniRenderer && this.miniScene && this.miniCamera
  }
  
  updateMiniMapSize() {
    if (!this.miniContainer || !this.miniRenderer || !this.miniCamera) return
    
    const container = this.miniContainer
    const width = container.clientWidth
    const height = container.clientHeight
    
    // Update renderer size
    this.miniRenderer.setSize(width, height)
    
    // Update camera aspect ratio
    this.miniCamera.aspect = width / height
    this.miniCamera.updateProjectionMatrix()
  }
  
  renderMiniMap() {
    try {
      if (!this.isActive || !this.miniRenderer || !this.miniScene || !this.miniCamera) {
        return
      }
      
      // Update planet rotation in mini view
      if (this.currentPlanet) {
        const planet = planets[this.currentPlanet]
        const data = planetData[this.currentPlanet]
        
        if (planet && data) {
          // Find the cloned planet in mini scene and update its rotation
          this.miniScene.children.forEach(child => {
            if (child.type === 'Mesh') {
              // Update rotation to match main planet but slower for mini-view
              child.rotation.y += (data.rotationSpeed * animationSpeed) * 0.3 // 30% of normal speed
            }
          })
        }
      }
      
      // Render mini scene
      this.miniRenderer.render(this.miniScene, this.miniCamera)
      
      // Continue rendering
      requestAnimationFrame(() => this.renderMiniMap())
    } catch (error) {
      console.error('Error in mini-map render loop:', error)
      // Stop the render loop on error
      this.isActive = false
    }
  }
}

const miniMapController = new MiniMapController()

// Initialize default mini-view after loading screen is hidden
document.addEventListener('DOMContentLoaded', () => {

})

/**
 * UI System
 */
class SolarSystemUI {
  constructor() {
    this.createUI()
    this.selectedPlanet = null
  }
  
  createUI() {
    // Create UI container
    this.uiContainer = document.createElement('div')
    this.uiContainer.className = 'solar-system-ui'
    document.body.appendChild(this.uiContainer)
    
    // Create planet selection buttons
    this.createPlanetButtons()
    
    // Create info panel
    this.createInfoPanel()
    
    // Create controls panel
    this.createControlsPanel()
    
    // Add back button
    this.createBackButton()
  }
  
  createPlanetButtons() {
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'planet-buttons'
    
    Object.keys(planets).forEach(planet => {
      const data = planetData[planet]
      const button = document.createElement('button')
      button.className = 'planet-button'
      button.textContent = data.name
      button.style.backgroundColor = `#${data.color.toString(16).padStart(6, '0')}`
      
      button.addEventListener('click', () => {
        this.selectPlanet(planet)
      })
      
      buttonContainer.appendChild(button)
    })
    
    this.uiContainer.appendChild(buttonContainer)
  }
  
  createInfoPanel() {
    this.infoPanel = document.createElement('div')
    this.infoPanel.className = 'info-panel'
    this.infoPanel.innerHTML = `
      <h2>Solar System Explorer</h2>
      <p>Click on a planet or use the buttons above to explore the solar system.</p>
      <div class="planet-info">
        <h3 id="planet-name"></h3>
        <p id="planet-description"></p>
        <div class="planet-stats">
          <div class="stat">
            <span class="label">Distance from Sun:</span>
            <span id="planet-distance"></span>
          </div>
          <div class="stat">
            <span class="label">Orbital Period:</span>
            <span id="planet-orbital-period"></span>
          </div>
          <div class="stat">
            <span class="label">Rotation Period:</span>
            <span id="planet-rotation-period"></span>
          </div>
          <div class="stat">
            <span class="label">Axial Tilt:</span>
            <span id="planet-axial-tilt"></span>
          </div>
        </div>
      </div>
    `
    this.uiContainer.appendChild(this.infoPanel)
  }
  
  createControlsPanel() {
    const controlsPanel = document.createElement('div')
    controlsPanel.className = 'controls-panel'
    
    // Animation toggle
    const animationToggle = document.createElement('button')
    animationToggle.textContent = 'Pause Animation'
    animationToggle.className = 'control-button'
    animationToggle.addEventListener('click', () => {
      this.toggleAnimation()
    })
    
    // Overview button
    const overviewButton = document.createElement('button')
    overviewButton.textContent = '🌌 Overview'
    overviewButton.className = 'control-button'
    overviewButton.title = 'Reset camera to full solar system view'
    overviewButton.addEventListener('click', () => {
      this.resetToOverview()
    })
    
    // Speed controls
    const speedSlider = document.createElement('input')
    speedSlider.type = 'range'
    speedSlider.min = '0.1'
    speedSlider.max = '5'
    speedSlider.step = '0.1'
    speedSlider.value = '1'
    speedSlider.className = 'speed-slider'
    speedSlider.addEventListener('input', (e) => {
      this.setAnimationSpeed(parseFloat(e.target.value))
    })
    
    controlsPanel.appendChild(animationToggle)
    controlsPanel.appendChild(overviewButton)
    controlsPanel.appendChild(speedSlider)
    this.uiContainer.appendChild(controlsPanel)
  }
  
  createBackButton() {
    this.backButton = document.createElement('button')
    this.backButton.textContent = '← Back to Overview'
    this.backButton.className = 'back-button'
    this.backButton.style.display = 'none'
    this.backButton.addEventListener('click', () => {
      this.returnToOverview()
    })
    this.uiContainer.appendChild(this.backButton)
  }
  
  selectPlanet(planetName) {
    const planet = planets[planetName]
    if (!planet) return
    
    this.selectedPlanet = planetName
    
    // Update info panel
    const data = planetData[planetName]
    document.getElementById('planet-name').textContent = data.name
    document.getElementById('planet-description').textContent = data.info
    document.getElementById('planet-distance').textContent = `${data.distance} AU`
    document.getElementById('planet-orbital-period').textContent = `${(2 * Math.PI / data.orbitalSpeed).toFixed(1)} days`
    document.getElementById('planet-rotation-period').textContent = `${(2 * Math.PI / data.rotationSpeed).toFixed(1)} hours`
    document.getElementById('planet-axial-tilt').textContent = `${data.axialTilt.toFixed(1)}°`
    
    // Show planet in mini-map view
    miniMapController.showPlanet(planetName)
    
    // Update UI to indicate mini-map mode
    this.updateMiniMapUI(true)
  }
  
  returnToOverview() {
    miniMapController.hideMiniMap()
    this.selectedPlanet = null
    
    // Update UI to indicate overview mode
    this.updateMiniMapUI(false)
    
    // Clear planet info
    document.getElementById('planet-name').textContent = ''
    document.getElementById('planet-description').textContent = ''
    document.getElementById('planet-distance').textContent = ''
    document.getElementById('planet-orbital-period').textContent = ''
    document.getElementById('planet-rotation-period').textContent = ''
    document.getElementById('planet-axial-tilt').textContent = ''
  }
  
  updateMiniMapUI(isMiniMapMode) {
    const infoPanel = document.querySelector('.info-panel')
    if (isMiniMapMode) {
      infoPanel.style.borderColor = '#667eea'
      infoPanel.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)'
      
      // Add mini-map mode indicator
      const miniMapIndicator = document.createElement('div')
      miniMapIndicator.className = 'mini-map-indicator'
      miniMapIndicator.textContent = '🔍 Mini View Active'
      miniMapIndicator.style.position = 'absolute'
      miniMapIndicator.style.top = '10px'
      miniMapIndicator.style.right = '10px'
      miniMapIndicator.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'
      miniMapIndicator.style.color = 'white'
      miniMapIndicator.style.padding = '5px 10px'
      miniMapIndicator.style.borderRadius = '15px'
      miniMapIndicator.style.fontSize = '12px'
      miniMapIndicator.style.fontWeight = 'bold'
      miniMapIndicator.style.zIndex = '1000'
      
      // Remove existing indicator if any
      const existingIndicator = document.querySelector('.mini-map-indicator')
      if (existingIndicator) {
        existingIndicator.remove()
      }
      
      document.body.appendChild(miniMapIndicator)
    } else {
      infoPanel.style.borderColor = 'rgba(255, 255, 255, 0.1)'
      infoPanel.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)'
      
      // Remove mini-map indicator
      const miniMapIndicator = document.querySelector('.mini-map-indicator')
      if (miniMapIndicator) {
        miniMapIndicator.remove()
      }
    }
  }
  
  toggleAnimation() {
    isAnimationPlaying = !isAnimationPlaying
    const button = document.querySelector('.control-button')
    button.textContent = isAnimationPlaying ? 'Pause Animation' : 'Resume Animation'
    
    // Update button state based on focus mode
    if (focusMode) {
      button.textContent = isAnimationPlaying ? 'Pause Rotation' : 'Resume Rotation'
    } else {
      button.textContent = isAnimationPlaying ? 'Pause Animation' : 'Resume Animation'
    }
  }
  
  setAnimationSpeed(speed) {
    animationSpeed = speed
  }
  
  resetToOverview() {
    // Disable the overview button during animation
    const overviewButton = document.querySelector('.control-button:nth-child(2)')
    if (overviewButton) {
      overviewButton.disabled = true
      overviewButton.style.opacity = '0.5'
      overviewButton.textContent = '🔄 Moving...'
    }
    
    // Disable OrbitControls during animation
    controls.enabled = false
    
    // Store current camera position for smooth transition
    const startPosition = camera.position.clone()
    const startLookAt = new THREE.Vector3(0, 0, 0)
    
    // Target overview position
    const targetPosition = new THREE.Vector3(0, 300, 500)
    const targetLookAt = new THREE.Vector3(0, 0, 0)
    
    // Animation duration and easing
    const duration = 2.5
    const startTime = Date.now()
    
    const animateCamera = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      // Interpolate camera position
      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      
      // Interpolate lookAt target
      const currentLookAt = new THREE.Vector3()
      currentLookAt.lerpVectors(startLookAt, targetLookAt, easeProgress)
      camera.lookAt(currentLookAt)
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      } else {
        // Animation complete - re-enable controls and button
        controls.enabled = true
        
        if (overviewButton) {
          overviewButton.disabled = false
          overviewButton.style.opacity = '1'
          overviewButton.textContent = '🌌 Overview'
        }
        
        // Add visual feedback for overview mode
        this.showOverviewModeIndicator()
      }
    }
    
    animateCamera()
  }
  
  showOverviewModeIndicator() {
    // Create or update overview mode indicator
    let indicator = document.querySelector('.overview-mode-indicator')
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.className = 'overview-mode-indicator'
      indicator.textContent = '🌌 Overview Mode Active'
      document.body.appendChild(indicator)
    }
    
    // Show indicator briefly
    indicator.style.display = 'block'
    indicator.style.opacity = '1'
    
    // Hide after 3 seconds
    setTimeout(() => {
      indicator.style.opacity = '0'
      setTimeout(() => {
        indicator.style.display = 'none'
      }, 500)
    }, 3000)
  }
}

// Initialize UI
const ui = new SolarSystemUI()

/**
 * Initialize default mini-view after everything is loaded
 */
const initializeDefaultMiniView = () => {
  // Wait a bit for all textures to load
  setTimeout(() => {
    try {
      console.log('Initializing default mini-view with Earth...')
      
      // Check if UI elements exist
      const planetNameElement = document.getElementById('planet-name')
      if (!planetNameElement) {
        console.error('UI elements not ready yet, retrying...')
        setTimeout(initializeDefaultMiniView, 1000)
        return
      }
      
      // Check if planets are loaded
      if (!planets.earth) {
        console.error('Planets not ready yet, retrying...')
        setTimeout(initializeDefaultMiniView, 1000)
        return
      }
      
      // Check if mini-map controller is ready
      if (!miniMapController.isReady()) {
        console.error('Mini-map controller not ready yet, retrying...')
        setTimeout(initializeDefaultMiniView, 1000)
        return
      }
      
      // Show Earth in mini-view
      miniMapController.showPlanet('earth')
      
      // Update info panel with Earth data
      const earthData = planetData.earth
      document.getElementById('planet-name').textContent = earthData.name
      document.getElementById('planet-description').textContent = earthData.info
      document.getElementById('planet-distance').textContent = `${earthData.distance} AU`
      document.getElementById('planet-orbital-period').textContent = `${(2 * Math.PI / earthData.orbitalSpeed).toFixed(1)} days`
      document.getElementById('planet-rotation-period').textContent = `${(2 * Math.PI / earthData.rotationSpeed).toFixed(1)} hours`
      document.getElementById('planet-axial-tilt').textContent = `${earthData.axialTilt.toFixed(1)}°`
      
      // Update UI to indicate mini-map mode
      ui.updateMiniMapUI(true)
      
      // Set selected planet state
      ui.selectedPlanet = 'earth'
      
      console.log('Default mini-view initialized successfully!')
    } catch (error) {
      console.error('Error initializing default mini-view:', error)
    }
  }, 3000) // Wait 3 seconds for textures to load
}

/**
 * Raycaster for planet selection
 */
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

canvas.addEventListener('click', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  
  const intersects = raycaster.intersectObjects(scene.children, true)
  
  for (const intersect of intersects) {
    if (intersect.object.userData.planet) {
      ui.selectPlanet(intersect.object.userData.planet)
      break
    }
  }
})

/**
 * Keyboard controls
 */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' || event.key === 'Backspace') {
    if (miniMapController.isActive) {
      ui.returnToOverview()
    }
  }
})

/**
 * Animation variables
 */
let isAnimationPlaying = true
let animationSpeed = 1
const clock = new THREE.Clock()

/**
 * Animation loop
 */
const animate = () => {
  const elapsedTime = clock.getElapsedTime() * animationSpeed
  
  if (isAnimationPlaying) {
    // Animate all planets normally (no focus mode restrictions)
    Object.keys(planets).forEach(planet => {
      const planetObj = planets[planet]
      const data = planetData[planet]
      
      // Orbital motion
      if (data.distance > 0) {
        const angle = elapsedTime * data.orbitalSpeed
        planetObj.group.position.x = Math.cos(angle) * data.distance
        planetObj.group.position.z = Math.sin(angle) * data.distance
      }
      
      // Rotation with axial tilt
      planetObj.mesh.rotation.y += data.rotationSpeed * animationSpeed
    })
    
    // Animate moon
    const moonAngle = elapsedTime * 0.05
    moon.position.x = Math.cos(moonAngle) * 15
    moon.position.z = Math.sin(moonAngle) * 15
    
    // Animate starfield
    starfield.rotation.y += 0.0001 * animationSpeed
  }
  
  // Update controls
  controls.update()
  
  // Render
  renderer.render(scene, camera)
  
  requestAnimationFrame(animate)
}

animate()

// Fallback initialization after animation starts
setTimeout(() => {
  if (!miniMapController.isActive) {
    console.log('Fallback: Initializing default mini-view...')
    initializeDefaultMiniView()
  }
}, 4000)
