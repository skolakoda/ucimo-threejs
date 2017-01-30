/* global BlendCharacterGui */
var container

var blendMesh, helper, camera, scene, renderer, controls

var clock = new THREE.Clock()
var gui = null

var isFrameStepping = false
var timeToStep = 0

init()

function init () {
  container = document.getElementById('container')

  scene = new THREE.Scene()
  scene.add(new THREE.AmbientLight(0xffffff))

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  })
  renderer.setClearColor(0x777777)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.autoClear = true

  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  // listen for messages from the gui
  window.addEventListener('start-animation', onStartAnimation)
  window.addEventListener('stop-animation', onStopAnimation)
  window.addEventListener('pause-animation', onPauseAnimation)
  window.addEventListener('step-animation', onStepAnimation)
  window.addEventListener('weight-animation', onWeightAnimation)
  window.addEventListener('crossfade', onCrossfade)
  window.addEventListener('warp', onWarp)
  window.addEventListener('toggle-show-skeleton', onShowSkeleton)
  window.addEventListener('toggle-show-model', onShowModel)

  blendMesh = new THREE.BlendCharacter()
  blendMesh.load('modeli/vojnik/model.json', start)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onStartAnimation (event) {
  var data = event.detail

  blendMesh.stopAll()
  blendMesh.unPauseAll()

  // the blend mesh will combine 1 or more animations
  for (var i = 0; i < data.anims.length; ++i) {
    blendMesh.play(data.anims[i], data.weights[i])
  }

  isFrameStepping = false
}

function onStopAnimation (event) {
  blendMesh.stopAll()
  isFrameStepping = false
}

function onPauseAnimation (event) {
  (isFrameStepping) ? blendMesh.unPauseAll() : blendMesh.pauseAll()

  isFrameStepping = false
}

function onStepAnimation (event) {
  blendMesh.unPauseAll()
  isFrameStepping = true
  timeToStep = event.detail.stepSize
}

function onWeightAnimation (event) {
  var data = event.detail
  for (var i = 0; i < data.anims.length; ++i) {
    blendMesh.applyWeight(data.anims[i], data.weights[i])
  }
}

function onCrossfade (event) {
  var data = event.detail

  blendMesh.stopAll()
  blendMesh.crossfade(data.from, data.to, data.time)

  isFrameStepping = false
}

function onWarp (event) {
  var data = event.detail

  blendMesh.stopAll()
  blendMesh.warp(data.from, data.to, data.time)

  isFrameStepping = false
}

function onShowSkeleton (event) {
  var shouldShow = event.detail.shouldShow
  helper.visible = shouldShow
}

function onShowModel (event) {
  var shouldShow = event.detail.shouldShow
  blendMesh.showModel(shouldShow)
}

function start () {
  blendMesh.rotation.y = Math.PI * -135 / 180
  scene.add(blendMesh)

  var aspect = window.innerWidth / window.innerHeight
  var radius = blendMesh.geometry.boundingSphere.radius

  camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000)
  camera.position.set(0.0, radius, radius * 3.5)

  controls = new THREE.OrbitControls(camera)
  controls.target.set(0, radius, 0)
  controls.update()

  // Set default weights
  blendMesh.applyWeight('idle', 1 / 3)
  blendMesh.applyWeight('walk', 1 / 3)
  blendMesh.applyWeight('run', 1 / 3)

  gui = new BlendCharacterGui(blendMesh)

  // Create the debug visualization

  helper = new THREE.SkeletonHelper(blendMesh)
  helper.material.linewidth = 3
  scene.add(helper)

  helper.visible = false

  animate()
}

function animate () {
  requestAnimationFrame(animate, renderer.domElement)

  // step forward in time based on whether we're stepping and scale
  var scale = gui.getTimeScale()
  var delta = clock.getDelta()
  var stepSize = (!isFrameStepping) ? delta * scale : timeToStep

  // modify blend weights
  blendMesh.update(stepSize)
  helper.update()
  gui.update(blendMesh.mixer.time)

  renderer.render(scene, camera)
  // if we are stepping, consume time
  // ( will equal step size next time a single step is desired )

  timeToStep = 0
}