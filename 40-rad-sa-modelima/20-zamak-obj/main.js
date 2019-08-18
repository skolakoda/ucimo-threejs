let misX = 0
let misY = 0
const polaEkranaX = window.innerWidth / 2
const polaEkranaY = window.innerHeight / 2

/** INIT **/

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
camera.position.z = 250

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

const onDocumentMouseMove = event => {
  misX = (event.clientX - polaEkranaX) / 2
  misY = (event.clientY - polaEkranaY) / 2
}

const render = () => {
  camera.position.x += (misX - camera.position.x) * 0.05
  camera.position.y += (-misY - camera.position.y) * 0.05
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}

const update = () => {
  requestAnimationFrame(update)
  render()
}

/** LOGIKA **/

update()

document.addEventListener('mousemove', onDocumentMouseMove)
