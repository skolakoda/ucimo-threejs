/** KONFIG **/

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const tackeZvezde = [
  new THREE.Vector2(0, 50),
  new THREE.Vector2(10, 10),
  new THREE.Vector2(40, 10),
  new THREE.Vector2(20, -10),
  new THREE.Vector2(30, -50),
  new THREE.Vector2(0, -20),
  new THREE.Vector2(-30, -50),
  new THREE.Vector2(-20, -10),
  new THREE.Vector2(-40, 10),
  new THREE.Vector2(-10, 10)
]

const parametriEkstruzije = {
  bevelEnabled: false,
  extrudeMaterial: 1
}

const materijali = [
  new THREE.MeshBasicMaterial({color: 0xffff00}),
  new THREE.MeshBasicMaterial({color: 0xff8800})
]

/** INIT **/

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000
)
camera.position.set(0, 150, 400)
scene.add(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const oblik2D = new THREE.Shape(tackeZvezde)
const geometrija = new THREE.ExtrudeGeometry(oblik2D, parametriEkstruzije)
const zvezda3D = new THREE.Mesh(geometrija, materijali)
zvezda3D.position.set(0, 50, 0)
scene.add(zvezda3D)

/** UPDATE **/

function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
  controls.update()
}

/** LOGIC **/

update()
