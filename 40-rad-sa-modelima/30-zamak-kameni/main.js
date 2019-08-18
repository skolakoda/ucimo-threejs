const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003)

const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight

const VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 2000
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(camera)
camera.position.set(0, 100, 300)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer({ antialias:true })
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
renderer.setClearColor(scene.fog.color)
renderer.shadowMapEnabled = true
renderer.shadowMapSoft = true

const container = document.createElement('div')
document.body.appendChild(container)
container.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)
controls.maxDistance = 2000

const clock = new THREE.Clock()

const dLight = new THREE.DirectionalLight(0xffffff, 1.5)
dLight.castShadow = true
dLight.position.set(500, 1000, 500)
scene.add(dLight)

loadModel()

function loadModel() {
  const oLoader = new THREE.OBJMTLLoader()
  oLoader.load('models/castle.obj', 'models/castle.mtl', object => {
    object.position.x = -200
    object.position.y = 0
    object.position.z = 100
    object.scale.set(0.1, 0.1, 0.1)
    scene.add(object)
  })
}

function animate() {
  requestAnimationFrame(animate)
  render()
  update()
}

function update() {
  controls.update(clock.getDelta())
}

function render() {
  if (renderer)
    renderer.render(scene, camera)
}

window.onload = animate
