const scene = new THREE.Scene()
const loader = new THREE.TextureLoader()
const map = loader.load('img/crate.gif')

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
  35, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.z = 170
scene.add(camera)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(40, 40, 40),
  new THREE.MeshBasicMaterial({map})
)
scene.add(cube)

function render() {
  window.requestAnimationFrame(render)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}

render()
