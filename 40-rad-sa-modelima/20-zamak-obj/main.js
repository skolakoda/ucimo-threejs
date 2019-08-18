const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
camera.position.z = 250

const controls = new THREE.OrbitControls(camera)

const ambijent = new THREE.AmbientLight(0x101030)
scene.add(ambijent)

const light = new THREE.DirectionalLight(0xffeedd)
light.position.set(0, 0, 1)
scene.add(light)

const loader = new THREE.OBJLoader()
loader.load('modeli/zamak.obj', model => {
  model.position.y = -95
  scene.add(model)
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** FUNKCIJE **/

const update = () => {
  requestAnimationFrame(update)
  controls.update()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}

update()
