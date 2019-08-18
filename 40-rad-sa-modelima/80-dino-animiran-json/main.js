const scene = new THREE.Scene()
const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xffffff, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

const spotLight = new THREE.DirectionalLight(0xffffff)
spotLight.position.set(20, 20, 20)
spotLight.castShadow = false
scene.add(spotLight)

const ambiLight = new THREE.AmbientLight(0x666666)
scene.add(ambiLight)

camera.position.x = 6
camera.position.y = 3
camera.position.z = 6
camera.lookAt(scene.position)

loadModel()

document.body.appendChild(renderer.domElement)

/** FUNCTIONS **/

function loadModel() {
  const loader = new THREE.JSONLoader()
  loader.load('modeli/dino.json', (model, loadedMat) => {
    loadedMat[0].skinning = true
    THREE.AnimationHandler.add(model.animations[0])
    const animmesh = new THREE.SkinnedMesh(model, loadedMat[0])
    animmesh.translateY(-2)
    const animation = new THREE.Animation(animmesh, 'ArmatureAction')
    animation.play()
    scene.add(animmesh)
  }, 'teksture/')
}

void function render() {
  const rotSpeed = 0.005
  camera.position.x = camera.position.x * Math.cos(rotSpeed) + camera.position.z * Math.sin(rotSpeed)
  camera.position.z = camera.position.z * Math.cos(rotSpeed) - camera.position.x * Math.sin(rotSpeed)
  camera.lookAt(scene.position)

  const delta = clock.getDelta()
  THREE.AnimationHandler.update(delta)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
