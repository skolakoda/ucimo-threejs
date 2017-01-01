let mouseX = 0
let mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

/** INIT **/

const container = document.createElement('div')
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
camera.position.z = 250

const scene = new THREE.Scene()

// light

const ambient = new THREE.AmbientLight(0x101030)
scene.add(ambient)

const directionalLight = new THREE.DirectionalLight(0xffeedd)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

// model

const loader = new THREE.OBJLoader()
loader.load('modeli/castle.obj', function (object) {
  object.position.y = -95
  scene.add(object)
})

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

/** FUNCTIONS **/

function onWindowResize () {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove (event) {
  mouseX = (event.clientX - windowHalfX) / 2
  mouseY = (event.clientY - windowHalfY) / 2
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05

  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}

/** EVENTS **/

document.addEventListener('mousemove', onDocumentMouseMove, false)
window.addEventListener('resize', onWindowResize, false)

animate()
