const duzinaZida = 7
const brojSpratova = 13
const razmak = 10.2

/** SCENA **/

const t  = THREE
const scena = new t.Scene()

const kamera = new t.PerspectiveCamera()
kamera.position.set(55, 50, 250)

const kontrole = new t.OrbitControls(kamera)

const renderer = new t.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** GEOMETRIJA **/

function praviCiglu(x, y, z) {
  const blok = new t.Mesh(new t.BoxGeometry(10, 10, 10), new t.MeshNormalMaterial())
  blok.position.set(x, y, z)
  scena.add(blok)
}

function praviSprat(y, i) {
  if (i > razmak * duzinaZida + 1) return
  praviCiglu(i, y, 0) // zadnji
  praviCiglu(i, y, razmak * duzinaZida) // prednji
  praviCiglu(0, y, i) // levi
  praviCiglu(razmak * duzinaZida, y, i) // desni
  praviSprat(y, i + razmak)
}

void function praviZgradu(y) {
  if (y > razmak * brojSpratova) return
  const start = Math.floor(y / razmak) % 2 == 0 ? 0 : razmak / 2
  praviSprat(y, start)
  praviZgradu(y + razmak)
}(0)

function praviKulu(x, z) {
  const precnik = 15
  const kula = new t.Mesh(new t.CylinderGeometry(precnik, precnik, 150, 100), new t.MeshNormalMaterial())
  kula.position.set(x, 70, z)
  scena.add(kula)
  const krov = new t.Mesh(new t.CylinderGeometry(0, precnik, 50, 100), new t.MeshNormalMaterial())
  krov.position.set(x, 170, z)
  scena.add(krov)
}

praviKulu(0, 0)
praviKulu(0, razmak * duzinaZida)
praviKulu(razmak * duzinaZida, 0)
praviKulu(razmak * duzinaZida, razmak * duzinaZida)

/** UPDATE **/

void function update() {
  window.requestAnimationFrame(update)
  kontrole.update()
  renderer.render(scena, kamera)
}()
