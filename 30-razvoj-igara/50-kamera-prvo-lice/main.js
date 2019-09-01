const keyboard = new THREEx.KeyboardState()
const clock = new THREE.Clock()

const scene = new THREE.Scene()

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

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

const floorTexture = new THREE.ImageUtils.loadTexture('../../assets/textures/sand-512.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

const MovingCube = new THREE.Mesh()
MovingCube.position.set(0, 25.1, 0)
scene.add(MovingCube)

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  // move forwards/backwards/left/right
  if (keyboard.pressed('W'))
    MovingCube.translateZ(-moveDistance)

  if (keyboard.pressed('S'))
    MovingCube.translateZ(moveDistance)

  if (keyboard.pressed('Q'))  MovingCube.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    MovingCube.translateX(moveDistance)

  // rotate left/right/up/down
  if (keyboard.pressed('A'))
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)

  if (keyboard.pressed('D'))
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)

  if (keyboard.pressed('R'))
    MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)

  if (keyboard.pressed('F'))  MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('Z')) {
    MovingCube.position.set(0, 25.1, 0)
    MovingCube.rotation.set(0, 0, 0)
  }

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)

  const cameraOffset = relativeCameraOffset.applyMatrix4(MovingCube.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(MovingCube.position)
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()
