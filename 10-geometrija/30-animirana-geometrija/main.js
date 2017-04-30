const scena = new THREE.Scene()
const casovnik = new THREE.Clock()
const materijal = new THREE.MeshNormalMaterial()

const kamera = new THREE.PerspectiveCamera(
  70, window.innerWidth / window.innerHeight, 1, 10000
)
kamera.position.z = 500
scena.add(kamera)

const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const lopta = new THREE.Mesh(
  new THREE.SphereGeometry(150, 20, 20), materijal
)
scena.add(lopta)
lopta.position.set(-250, 250, -250)

const kocka = new THREE.Mesh(
  new THREE.CubeGeometry(100, 100, 100), materijal
)
scena.add(kocka)
kocka.position.set(250, 250, -250)

const valjak = new THREE.Mesh(
  new THREE.CylinderGeometry(40, 40, 160), materijal)
valjak.position.set(250, 0, 0)
scena.add(valjak)

const piramida = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 100, 150, 4), materijal)
scena.add(piramida)

const ravan = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
)
ravan.position.set(-250, -250, -250)
scena.add(ravan)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(100, 25, 15, 30),
  materijal
)
torus.position.set(100, -200, 0)
scena.add(torus)

void function animiraj() {
  window.requestAnimationFrame(animiraj)
  const vreme = casovnik.getElapsedTime()
  lopta.rotation.set(vreme, 2 * vreme, 0)
  kocka.rotation.set(vreme, 2 * vreme, 0)
  valjak.rotation.set(vreme, 2 * vreme, 0)
  piramida.rotation.set(vreme, 2 * vreme, 0)
  ravan.rotation.set(vreme, 2 * vreme, 0)
  torus.rotation.set(vreme, 2 * vreme, 0)
  renderer.render(scena, kamera)
}()
