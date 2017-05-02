const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight

/* INIT */

const scene = new THREE.Scene()

const loader = new THREE.TextureLoader()
const moonTexture = loader.load('img/moon.jpg')
const crateTexture = loader.load('../../assets/teksture/crate.gif')

const camera = new THREE.PerspectiveCamera(
  45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000
)
scene.add(camera)
camera.position.set(0, 150, 400)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight(0xffffff)
light.position.set(0, 150, 100)
scene.add(light)
const light2 = new THREE.AmbientLight(0x444444)
scene.add(light2)

/* GEOMETRIES */

const floorMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture
})
const floorGeometry = new THREE.CircleGeometry(500, 32)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const sphereGeom = new THREE.SphereGeometry(40, 32, 32)

const moon = new THREE.Mesh(
  sphereGeom,
  new THREE.MeshBasicMaterial({map: moonTexture})
)
moon.position.set(-100, 50, 0)
scene.add(moon)

const moon2 = new THREE.Mesh(
  sphereGeom,
  new THREE.MeshLambertMaterial({map: moonTexture})
)
moon2.position.set(0, 50, 0)
scene.add(moon2)

const moonMaterial3 = new THREE.MeshLambertMaterial({
  map: moonTexture,
  color: 0xff8800
})
const moon3 = new THREE.Mesh(sphereGeom, moonMaterial3)
moon3.position.set(100, 50, 0)
scene.add(moon3)

const crate = new THREE.Mesh(
  new THREE.CubeGeometry(85, 85, 85),
  new THREE.MeshBasicMaterial({map: crateTexture})
)
crate.position.set(-60, 50, -100)
scene.add(crate)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
  controls.update()
}()
