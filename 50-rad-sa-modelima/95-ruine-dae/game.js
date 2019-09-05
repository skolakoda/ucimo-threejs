const container = document.getElementById('container')
const {offsetWidth, offsetHeight} = container

const scene = new THREE.Scene()

addGround()
loadScene()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.shadowMapEnabled = true
renderer.setSize(offsetWidth, offsetHeight)
container.appendChild(renderer.domElement)

const headlight = new THREE.DirectionalLight
headlight.position.set(0, 0, 1)
scene.add(headlight)
const ambient = new THREE.AmbientLight(0x222222)
scene.add(ambient)

const camera = new THREE.PerspectiveCamera(45, offsetWidth / offsetHeight, 0.001, 10000)
camera.position.set(1, .2, 0)
scene.add(camera)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

function loadScene() {
  // http://www.turbosquid.com/Search/Artists/ERLHN
  const loader = new THREE.ColladaLoader()
  loader.load('ruins/Ruins_dae.dae', data => {
    scene.add(data.scene)
  })
}

function addGround() {
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0x555555,
  })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1024, 1024, 32, 32), material)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
}

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  controls.update()
  headlight.position.copy(camera.position)
  renderer.render(scene, camera)
}()
