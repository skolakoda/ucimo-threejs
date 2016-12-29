// pravi scenu
const scena = new THREE.Scene()
const casovnik = new THREE.Clock()

// kamera
const razmeraSlike = window.innerWidth / window.innerHeight
const kamera = new THREE.PerspectiveCamera(75, razmeraSlike, 1, 10000)
kamera.position.z = 500
scena.add(kamera)

// pravi kanvas za render
const renderer = new THREE.CanvasRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// pravi loptu
const kosturLopte = new THREE.SphereGeometry(150, 20, 15) //  (polu)precnik, detaljiX, detaljiY
const povrsLopte = new THREE.MeshNormalMaterial()
const lopta = new THREE.Mesh(kosturLopte, povrsLopte)
scena.add(lopta)
lopta.position.set(-250, 250, -250)

// pravi kocku
const kosturKocke = new THREE.CubeGeometry(100, 100, 100) // x, y, z stranice
const povrsKocke = new THREE.MeshNormalMaterial()
const kocka = new THREE.Mesh(kosturKocke, povrsKocke)
scena.add(kocka)
kocka.position.set(250, 250, -250)

// pravi valjak
const kosturValjka = new THREE.CylinderGeometry(40, 40, 160) // gornja povrs, donja povrs, visina
const povrsValjka = new THREE.MeshNormalMaterial()
const valjak = new THREE.Mesh(kosturValjka, povrsValjka)
valjak.position.set(250, 0, 0)
scena.add(valjak)

// pravi piramidu putem valjka
const kosturPiramide = new THREE.CylinderGeometry(1, 100, 150, 4) // poslednji argument je broj strana
const povrsPiramide = new THREE.MeshNormalMaterial()
const piramida = new THREE.Mesh(kosturPiramide, povrsPiramide)
scena.add(piramida)

// pravi ravan
const kosturRavni = new THREE.PlaneGeometry(200, 200)
const povrsRavni = new THREE.MeshNormalMaterial()
const ravan = new THREE.Mesh(kosturRavni, povrsRavni)
ravan.position.set(-250, -250, -250)
scena.add(ravan)

// pravi torus
const kosturTorusa = new THREE.TorusGeometry(100, 25, 15, 30)
const povrsTorusa = new THREE.MeshNormalMaterial()
const torus = new THREE.Mesh(kosturTorusa, povrsTorusa)
torus.position.set(100, -200, 0)
scena.add(torus)

// pokrece oblike
function animiraj () {
  window.requestAnimationFrame(animiraj)
  var vreme = casovnik.getElapsedTime()

  lopta.rotation.set(vreme, 2 * vreme, 0)
  kocka.rotation.set(vreme, 2 * vreme, 0)
  valjak.rotation.set(vreme, 2 * vreme, 0)
  piramida.rotation.set(vreme, 2 * vreme, 0)
  ravan.rotation.set(vreme, 2 * vreme, 0)
  torus.rotation.set(vreme, 2 * vreme, 0)

  renderer.render(scena, kamera)
}

animiraj()
