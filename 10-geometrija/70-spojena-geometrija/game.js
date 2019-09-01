/* mnogo sporije renderuje kada ima mnogo objekata koji nisu spojeni */
const cubesNum = 2000
const rotationSpeed = 0.002
const shouldMerge = true

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 50
camera.position.y = 50
camera.position.z = 50
camera.lookAt(scene.position)

if (shouldMerge) scene.add(createMergedCubes())
else for (let i = 0; i < cubesNum; i++) scene.add(createCube())

/* FUNCTIONS */

function createMergedCubes() {
  const parent = new THREE.Geometry()
  for (let i = 0; i < cubesNum; i++)
    parent.merge(createCubeGeometry())
  const material = new THREE.MeshNormalMaterial()
  return new THREE.Mesh(parent, material)
}

function createCubeGeometry() {
  const geometry = new THREE.BoxGeometry(4 * Math.random(), 4 * Math.random(), 4 * Math.random())
  const translation = new THREE.Matrix4().makeTranslation(100 * Math.random() - 50, 0, 100 * Math.random() - 50)
  geometry.applyMatrix(translation)
  return geometry
}

function createCube() {
  const geometry = new THREE.BoxGeometry(4 * Math.random(), 4 * Math.random(), 4 * Math.random())
  const material = new THREE.MeshNormalMaterial()
  material.transparent = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(100 * Math.random() - 50, 0, 100 * Math.random() - 50)
  return mesh
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)

  const {x, z} = camera.position
  camera.position.x = x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed)
  camera.position.z = z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed)

  camera.lookAt(scene.position)
  requestAnimationFrame(render)
}()
