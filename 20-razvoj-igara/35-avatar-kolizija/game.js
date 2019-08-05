/* global TWEEN */

let hoda_levo,
  hoda_desno,
  hoda_napred,
  hoda_nazad
let vrtenje = false
let salto = false
const tacka_gledanja = 75 // blizina gledanja
const casovnik = new THREE.Clock(true)
const zabranjeni_prilazi = []

const scena = new THREE.Scene()

const okvir = new THREE.Object3D()
scena.add(okvir)

const kamera = new THREE.PerspectiveCamera(tacka_gledanja, window.innerWidth / window.innerHeight, 1, 10000)
kamera.position.z = 500
okvir.add(kamera)

const renderer = new THREE.CanvasRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const tekstura = new THREE.MeshNormalMaterial()
const telo = new THREE.SphereGeometry(100)
const avatar = new THREE.Mesh(telo, tekstura)
okvir.add(avatar)

const ud = new THREE.SphereGeometry(50)
const desna_ruka = new THREE.Mesh(ud, tekstura)
desna_ruka.position.set(-150, 0, 0)
avatar.add(desna_ruka)

const leva_ruka = new THREE.Mesh(ud, tekstura)
leva_ruka.position.set(150, 0, 0)
avatar.add(leva_ruka)

const desna_noga = new THREE.Mesh(ud, tekstura)
desna_noga.position.set(70, -120, 0)
avatar.add(desna_noga)

const leva_noga = new THREE.Mesh(ud, tekstura)
leva_noga.position.set(-70, -120, 0)
avatar.add(leva_noga)

/* FUNKCIJE */

function praviDrvo(x, z) {
  const stablo = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 200), new THREE.MeshBasicMaterial({color: 0xA0522D}))

  const krosnja = new THREE.Mesh(new THREE.SphereGeometry(150), new THREE.MeshBasicMaterial({color: 0x228b22}))
  krosnja.position.y = 175
  stablo.add(krosnja)

  // pravi granicu drveta za koliziju
  const granica = new THREE.Mesh(new THREE.CircleGeometry(200), new THREE.MeshNormalMaterial())
  granica.position.y = -100
  granica.rotation.x = -Math.PI / 2
  stablo.add(granica)
  zabranjeni_prilazi.push(granica)

  stablo.position.set(x, -75, z)
  scena.add(stablo)
}

function sadaHoda() {
  if (hoda_desno) return true
  if (hoda_levo) return true
  if (hoda_nazad) return true
  if (hoda_napred) return true
  return false
}

function hodaj() {
  if (!sadaHoda()) return
  const polozaj = Math.sin(casovnik.getElapsedTime() * 5) * 100
  leva_ruka.position.z = -polozaj
  desna_ruka.position.z = polozaj
  leva_noga.position.z = -polozaj
  desna_noga.position.z = polozaj
}

function glatkoOkreni(direction) {
  new TWEEN.Tween({ y: avatar.rotation.y }).to({
    y: direction
  }, 100).onUpdate(function () {
    avatar.rotation.y = this.y
  }).start()
}

function gledajPravcem() {
  let pravac = 0
  if (hoda_napred) 
    pravac = Math.PI
  if (hoda_nazad) 
    pravac = 0
  if (hoda_desno) 
    pravac = Math.PI / 2
  if (hoda_levo) 
    pravac = -Math.PI / 2
  
  // avatar.rotation.y = pravac;
  glatkoOkreni(pravac)
}

function praviAkrobacije() {
  if (vrtenje) avatar.rotation.z += 0.05
  if (salto) avatar.rotation.x += 0.05
}

function detektujSudare() {
  const vektor = new THREE.Vector3(0, -1, 0)
  const zrak = new THREE.Raycaster(okvir.position, vektor)
  const ukrstanja = zrak.intersectObjects(zabranjeni_prilazi)
  if (ukrstanja.length > 0) return true
  return false
}

function animiraj() {
  requestAnimationFrame(animiraj)
  TWEEN.update()
  hodaj()
  gledajPravcem()
  praviAkrobacije()
  renderer.render(scena, kamera)
}

/* POZIVANJE FUNKCIJA */

praviDrvo(500, 0)
praviDrvo(-500, 0)
praviDrvo(300, -200)
praviDrvo(-200, -800)
praviDrvo(-750, -1000)
praviDrvo(500, -1000)

animiraj()

/* SLUSACI */

document.addEventListener('keydown', event => {
  if (event.keyCode == 37) {
    okvir.position.x -= 10
    hoda_levo = true
  }
  if (event.keyCode == 39) {
    okvir.position.x += 10
    hoda_desno = true
  }
  if (event.keyCode == 38) {
    okvir.position.z -= 10
    hoda_napred = true
  }
  if (event.keyCode == 40) {
    okvir.position.z += 10
    hoda_nazad = true
  }

  // ako je sudar vraca mu korak
  if (detektujSudare()) {
    if (hoda_levo) okvir.position.x += 10
    if (hoda_desno) okvir.position.x -= 10
    if (hoda_napred) okvir.position.z += 10
    if (hoda_nazad) okvir.position.z -= 10
  }
  
  if (event.keyCode == 67) vrtenje = true
  if (event.keyCode == 70) salto = true
  
  if (event.keyCode == 65) kamera.position.x += 10
  if (event.keyCode == 68) kamera.position.x -= 10
}
)

document.addEventListener('keyup', event => {
  const tipka = event.keyCode
  if (tipka == 37) hoda_levo = false
  if (tipka == 39) hoda_desno = false
  if (tipka == 38) hoda_napred = false
  if (tipka == 40) hoda_nazad = false
  
  if (tipka == 67) vrtenje = false
  if (tipka == 70) salto = false
})
