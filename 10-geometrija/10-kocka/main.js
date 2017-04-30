const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
  35, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.z = 100
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshNormalMaterial()
)
scene.add(cube)

void function update() {
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
