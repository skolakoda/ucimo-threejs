// standard global variables
let container, scene, camera, renderer, controls, stats
const keyboard = new THREEx.KeyboardState()
const clock = new THREE.Clock()
// custom global variables

let MovingCube

init()
animate()

// FUNCTIONS
function init() {
  // SCENE
  scene = new THREE.Scene()
  // CAMERA
  let SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight
  let VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  scene.add(camera)
  camera.position.set(0, 150, 400)
  camera.lookAt(scene.position)
  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  container = document.getElementById('ThreeJS')
  container.appendChild(renderer.domElement)
  // CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement)
  // STATS
  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.bottom = '0px'
  stats.domElement.style.zIndex = 100
  container.appendChild(stats.domElement)
  // LIGHT
  const light = new THREE.PointLight(0xffffff)
  light.position.set(0, 250, 0)
  scene.add(light)
  // FLOOR
  const floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(10, 10)
  const floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide
  })
  const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = -0.5
  floor.rotation.x = Math.PI / 2
  scene.add(floor)
  // SKYBOX/FOG
  const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000)
  const skyBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0x9999ff,
    side: THREE.BackSide
  })
  const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
  // scene.add(skyBox);
  scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)

  // //////////
  // CUSTOM //
  // //////////

  // create an array with six textures for a cool cube
  const materialArray = []
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/xpos.png')
  }))
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/xneg.png')
  }))
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/ypos.png')
  }))
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/yneg.png')
  }))
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/zpos.png')
  }))
  materialArray.push(new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('images/zneg.png')
  }))
  const MovingCubeMat = new THREE.MeshFaceMaterial(materialArray)
  const MovingCubeGeom = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1, materialArray)
  MovingCube = new THREE.Mesh(MovingCubeGeom, MovingCubeMat)
  MovingCube.position.set(0, 25.1, 0)
  scene.add(MovingCube)

}

function animate() {
  requestAnimationFrame(animate)
  render()
  update()
}

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  // local coordinates

  // local transformations

  // move forwards/backwards/left/right
  if (keyboard.pressed('W'))
    MovingCube.translateZ(-moveDistance)
  if (keyboard.pressed('S'))
    MovingCube.translateZ(moveDistance)
  if (keyboard.pressed('Q'))
    MovingCube.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    MovingCube.translateX(moveDistance)

  // rotate left/right/up/down
  const rotation_matrix = new THREE.Matrix4().identity()
  if (keyboard.pressed('A'))
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed('D'))
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed('R'))
    MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed('F'))
    MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('Z')) {
    MovingCube.position.set(0, 25.1, 0)
    MovingCube.rotation.set(0, 0, 0)
  }

  // global coordinates
  if (keyboard.pressed('left'))
    MovingCube.position.x -= moveDistance
  if (keyboard.pressed('right'))
    MovingCube.position.x += moveDistance
  if (keyboard.pressed('up'))
    MovingCube.position.z -= moveDistance
  if (keyboard.pressed('down'))
    MovingCube.position.z += moveDistance

  controls.update()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}
