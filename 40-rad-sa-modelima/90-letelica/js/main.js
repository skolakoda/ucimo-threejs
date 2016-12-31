/** CONFIG **/

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

/** INIT **/

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0x333F47, 1)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000)
camera.position.set(4, 0, 6)
scene.add(camera)

var light = new THREE.PointLight(0xffffff)
light.position.set(-100, 200, 100)
scene.add(light)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

let loader = new THREE.ColladaLoader()
loader.load('modeli/luftwaffe/FW190.dae', function (collada) {
  const model = collada.scene
  model.position.set(0, -2, 0)
  scene.add(model)
})

/** FUNCTIONS **/

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}

/** EVENTS **/

window.addEventListener('resize', function () {
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
})

/** LOGIC **/

animate()
