const scale = 0.1

/** INIT **/

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(-6, 6, 9)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera)

const loader = new THREE.ColladaLoader()
loader.load('modeli/tvrdjava.dae', data => {
  const model = data.scene
  model.scale.set(scale, scale, scale)
  scene.add(model)
})

/** FUNCTIONS **/

void function update() {
  requestAnimationFrame(update)
  controls.update()
  renderer.render(scene, camera)
}()