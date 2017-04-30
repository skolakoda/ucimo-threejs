const distance = 11

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight
const VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 20000

/* SCENA */

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  VIEW_ANGLE, ASPECT, NEAR, FAR
)
camera.position.set(0, 15, 40)
camera.lookAt(scene.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const floorMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide
})
const floorGeometry = new THREE.PlaneGeometry(100, 100)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI / 2
floor.position.y = -5
scene.add(floor)

/* OBLICI */

const material = new THREE.MeshNormalMaterial({wireframe: true}) // bez wireframe ima boju

const tetrahedron = new THREE.Mesh(
  new THREE.TetrahedronGeometry(5),
  material
)
tetrahedron.position.x -= distance * 2
scene.add(tetrahedron)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5), material
)
cube.position.x -= distance
scene.add(cube)

const octahedron = new THREE.Mesh(
  new THREE.OctahedronGeometry(5), material
)
scene.add(octahedron)

const dodecahedron = new THREE.Mesh(
  new THREE.DodecahedronGeometry(5), material
)
dodecahedron.position.x += distance
scene.add(dodecahedron)

const icosahedron = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5), material
)
icosahedron.position.x += distance * 2
scene.add(icosahedron)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
  controls.update()
}()
