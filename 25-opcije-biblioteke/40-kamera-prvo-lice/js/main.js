// MAIN

// standard global variables
var container,
  scene,
  camera,
  renderer
var keyboard = new THREEx.KeyboardState()
var clock = new THREE.Clock()

init()
animate()

// FUNCTIONS
function init () {
  // SCENE
  scene = new THREE.Scene()
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  scene.add(camera)
  camera.position.set(0, 150, 400)
  camera.lookAt(scene.position)
  // RENDERER
  if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({antialias: true})
  } else {
    renderer = new THREE.CanvasRenderer()
  }
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  container = document.getElementById('ThreeJS')
  container.appendChild(renderer.domElement)

  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(10, 10)
  var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
  var floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = -0.5
  floor.rotation.x = Math.PI / 2
  scene.add(floor)

  MovingCube = new THREE.Mesh()
  MovingCube.position.set(0, 25.1, 0)
  scene.add(MovingCube)
}

var MovingCube

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  var delta = clock.getDelta() // seconds.
  var moveDistance = 200 * delta // 200 pixels per second
  var rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  // move forwards/backwards/left/right
  if (keyboard.pressed('W')) {
    MovingCube.translateZ(-moveDistance)
  }
  if (keyboard.pressed('S')) {
    MovingCube.translateZ(moveDistance)
  }
  if (keyboard.pressed('Q')) { MovingCube.translateX(-moveDistance) }
  if (keyboard.pressed('E')) {
    MovingCube.translateX(moveDistance)
  }

  // rotate left/right/up/down
  if (keyboard.pressed('A')) {
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  }
  if (keyboard.pressed('D')) {
    MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  }
  if (keyboard.pressed('R')) {
    MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  }
  if (keyboard.pressed('F')) { MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle) }

  if (keyboard.pressed('Z')) {
    MovingCube.position.set(0, 25.1, 0)
    MovingCube.rotation.set(0, 0, 0)
  }

  var relativeCameraOffset = new THREE.Vector3(0, 50, 200)

  var cameraOffset = relativeCameraOffset.applyMatrix4(MovingCube.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(MovingCube.position)
}

function render () {
  renderer.render(scene, camera)
}
