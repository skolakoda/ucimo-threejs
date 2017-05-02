const scene = new THREE.Scene()
const loader = new THREE.TextureLoader()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
  35, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.z = 170
scene.add(camera)

/* CUBE */

const materials = []
for (let i = 1; i < 7; i++) materials.push(
  new THREE.MeshBasicMaterial({
    map: loader.load(`img/Dice-Blue-${i}.png`)
  })
)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(40, 40, 40),
  new THREE.MeshFaceMaterial(materials)
)
scene.add(cube)

/* UPDATE */

void function update() {
  window.requestAnimationFrame(update)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}()
