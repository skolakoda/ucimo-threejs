const scene = new THREE.Scene()
// CAMERA
const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45,
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
  NEAR = 0.1,
  FAR = 20000
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(camera)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)
// RENDERER
const renderer = window.WebGLRenderingContext
  ? new THREE.WebGLRenderer({antialias: true})
  : new THREE.CanvasRenderer()
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)
// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement)

// LIGHT
const light = new THREE.PointLight(0xffffff)
light.position.set(0, 150, 100)
scene.add(light)
// FLOOR
const floorTexture = new THREE.ImageUtils.loadTexture('../../assets/teksture/checkerboard.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)
scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)

// Spheres
//   Note: a standard flat rectangular image will look distorted,
//   a "spherical projection" image will look "normal".

// radius, segmentsWidth, segmentsHeight
const sphereGeom = new THREE.SphereGeometry(40, 32, 16)

const light2 = new THREE.AmbientLight(0x444444)
scene.add(light2)

// basic moon
const moonTexture = THREE.ImageUtils.loadTexture('images/moon.jpg')
const moonMaterial = new THREE.MeshBasicMaterial({map: moonTexture})
const moon = new THREE.Mesh(sphereGeom.clone(), moonMaterial)
moon.position.set(-100, 50, 0)
scene.add(moon)

// shaded moon -- side away from light picks up AmbientLight's color.
const moonTexture2 = THREE.ImageUtils.loadTexture('images/moon.jpg')
const moonMaterial2 = new THREE.MeshLambertMaterial({map: moonTexture2})
const moon2 = new THREE.Mesh(sphereGeom.clone(), moonMaterial2)
moon2.position.set(0, 50, 0)
scene.add(moon2)

// colored moon
const moonTexture3 = THREE.ImageUtils.loadTexture('images/moon.jpg')
const moonMaterial3 = new THREE.MeshLambertMaterial({map: moonTexture3, color: 0xff8800, ambient: 0x0000ff})
const moon3 = new THREE.Mesh(sphereGeom.clone(), moonMaterial3)
moon3.position.set(100, 50, 0)
scene.add(moon3)

// create a small sphere to show position of light
const lightbulb = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 8), new THREE.MeshBasicMaterial({color: 0xffaa00}))
scene.add(lightbulb)
lightbulb.position = light.position

// Cubes
//   Note: when using a single image, it will appear on each of the faces.
//   Six different images (one per face) may be used if desired.

const cubeGeometry = new THREE.CubeGeometry(85, 85, 85)

const crateTexture = new THREE.ImageUtils.loadTexture('../../assets/teksture/crate.gif')
const crateMaterial = new THREE.MeshBasicMaterial({map: crateTexture})
const crate = new THREE.Mesh(cubeGeometry.clone(), crateMaterial)
crate.position.set(-60, 50, -100)
scene.add(crate)

// create an array with six textures for a cube
const materialArray = [
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-1.png')}),
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-6.png')}),
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-2.png')}),
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-5.png')}),
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-3.png')}),
  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/Dice-Blue-4.png')})
]

const DiceBlueMaterial = new THREE.MeshFaceMaterial(materialArray)

const DiceBlueGeom = new THREE.CubeGeometry(85, 85, 85, 1, 1, 1)
const DiceBlue = new THREE.Mesh(DiceBlueGeom, DiceBlueMaterial)
DiceBlue.position.set(60, 50, -100)
scene.add(DiceBlue)

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  controls.update()
}

function render () {
  renderer.render(scene, camera)
}

animate()
