/** CONFIG **/

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
let currentId

/** INIT **/

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0xffffff, 1)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000)
camera.position.set(-6, 2, 9)
scene.add(camera)

const light = new THREE.PointLight(0xffffff)
light.position.set(-100, 200, 100)
scene.add(light)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

/** FUNCTIONS **/

const loadModel = function(src) {
  const loader = new THREE.ColladaLoader()
  loader.options.convertUpAxis = true
  loader.load(src, collada => {
    scene.remove(scene.getObjectById(currentId))
    const model = collada.scene
    scene.add(model)
    currentId = model.id
  })
}

/** EVENTS **/

document.querySelector('#izaberi-avion').addEventListener('change', e => {
  loadModel(e.target.value)
})

/** EXEC **/

loadModel(document.querySelector('#izaberi-avion').value)

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
  controls.update()
}()
