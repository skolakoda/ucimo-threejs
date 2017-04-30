/* global ThreeBSP */

const scene = new THREE.Scene()

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight

const VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 20000

const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(camera)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(WIDTH, HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 250, 0)
scene.add(light)

const floorMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide
})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000)
const skyBoxMaterial = new THREE.MeshBasicMaterial({
  color: 0x9999ff,
  side: THREE.BackSide
})
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
scene.add(skyBox)

const materialNormal = new THREE.MeshNormalMaterial()

const cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry)
const cubeBSP = new ThreeBSP(cubeMesh)

const sphereGeometry = new THREE.SphereGeometry(60, 32, 32)
const sphereMesh = new THREE.Mesh(sphereGeometry)
const sphereBSP = new ThreeBSP(sphereMesh)

// Example #1 - Cube subtract Sphere
let newBSP = cubeBSP.subtract(sphereBSP)
let newMesh = newBSP.toMesh(materialNormal)
newMesh.position.set(-180, 60, 0)
scene.add(newMesh)

// Example #2 - Sphere subtract Cube
newBSP = sphereBSP.subtract(cubeBSP)
newMesh = newBSP.toMesh(materialNormal)
newMesh.position.set(180, 60, 0)
scene.add(newMesh)

// Example #3 - Cube union Sphere
newBSP = sphereBSP.union(cubeBSP)
newMesh = newBSP.toMesh(materialNormal)
newMesh.position.set(70, 60, -120)
scene.add(newMesh)

// Example #4 - Cube intersect Sphere
newBSP = sphereBSP.intersect(cubeBSP)
newMesh = newBSP.toMesh(materialNormal)
newMesh.position.set(-70, 60, -120)
scene.add(newMesh)

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}()
