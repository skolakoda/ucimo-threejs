const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45,
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
  NEAR = 0.1,
  FAR = 20000

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)
scene.add(camera)

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
light.position.set(0, 250, 0)
scene.add(light)
// FLOOR
const floorTexture = new THREE.ImageUtils.loadTexture('../../assets/textures/rock-512.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

// //////////
// CUSTOM //
// //////////

// axes
const axes = new THREE.AxisHelper(100)
scene.add(axes)

const imagePrefix = 'images/dawnmountain-'
const directions = [
  'xpos',
  'xneg',
  'ypos',
  'yneg',
  'zpos',
  'zneg'
]
const imageSuffix = '.png'
const skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000)

const materialArray = []
for (let i = 0; i < 6; i++) {
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
    side: THREE.BackSide
  }))
}
const skyMaterial = new THREE.MeshFaceMaterial(materialArray)
const skyBox = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(skyBox)

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
