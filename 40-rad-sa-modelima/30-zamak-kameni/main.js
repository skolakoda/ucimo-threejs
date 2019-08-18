const scene = new THREE.Scene()

const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight

const camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2000)
scene.add(camera)
camera.position.set(0, 100, 300)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer({ antialias:true })
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, 0, 0)

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
  controls.update(clock.getDelta())
  renderer.render(scene, camera)
}

window.onload = animate
