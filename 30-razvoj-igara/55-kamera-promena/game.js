const keyboard = new THREEx.KeyboardState()

let chaseCameraActive = false

const scene = new THREE.Scene()

const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45,
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
  NEAR = 0.1,
  FAR = 20000

// camera 1
const topCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(topCamera)
topCamera.position.set(0, 200, 550)
topCamera.lookAt(scene.position)
// camera 2
const chaseCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(chaseCamera)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 250, 0)
scene.add(light)

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// create an array with six textures for a cool cube
const geometry = new THREE.CubeGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 25.1, 0)
scene.add(cube)

const ambientlight = new THREE.AmbientLight(0x111111)
scene.add(ambientlight)

const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
  transparent: true
})

// torus knot
let colorMaterial = new THREE.MeshPhongMaterial({
  color: 0xff3333
})
let shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 2, 5), [colorMaterial, wireMaterial])
shape.position.set(-200, 50, -200)
scene.add(shape)
// torus knot
colorMaterial = new THREE.MeshPhongMaterial({
  color: 0x33ff33
})
shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 2), [colorMaterial, wireMaterial])
shape.position.set(200, 50, -200)
scene.add(shape)
// torus knot
colorMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff33
})
shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 4, 3), [colorMaterial, wireMaterial])
shape.position.set(200, 50, 200)
scene.add(shape)
// torus knot
colorMaterial = new THREE.MeshPhongMaterial({
  color: 0x3333ff
})
shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 4), [colorMaterial, wireMaterial])
shape.position.set(-200, 50, 200)
scene.add(shape)

/* FUNCTIONS */

function render() {
  if (chaseCameraActive) renderer.render(scene, chaseCamera)
  else renderer.render(scene, topCamera)
}

function update() {
  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)

  chaseCamera.position.x = cameraOffset.x
  chaseCamera.position.y = cameraOffset.y
  chaseCamera.position.z = cameraOffset.z

  if (keyboard.pressed('1')) chaseCameraActive = true
  if (keyboard.pressed('2')) chaseCameraActive = false
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  render()
  update()
}()
