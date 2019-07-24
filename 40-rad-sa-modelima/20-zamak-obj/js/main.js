let misX = 0
let misY = 0
let polaEkranaX = window.innerWidth / 2
let polaEkranaY = window.innerHeight / 2

/** INIT **/

const scena = new THREE.Scene()

const kamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
kamera.position.z = 250

const ambijent = new THREE.AmbientLight(0x101030)
scena.add(ambijent)

const usmerenoSvetlo = new THREE.DirectionalLight(0xffeedd)
usmerenoSvetlo.position.set(0, 0, 1)
scena.add(usmerenoSvetlo)

const ucitavac = new THREE.OBJLoader()
ucitavac.load('modeli/zamak.obj', model => {
  model.position.y = -95
  scena.add(model)
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
  kamera.position.x += (misX - kamera.position.x) * 0.05
  kamera.position.y += (-misY - kamera.position.y) * 0.05
  kamera.lookAt(scena.position)
  renderer.render(scena, kamera)
}

const update = () => {
  requestAnimationFrame(update)
  render()
}

/** LOGIKA **/

update()

document.addEventListener('mousemove', onDocumentMouseMove)
