/* KONFIG */

const visinaTla = -0.04
const brojResetki = 10 // mnozi se sa dva
const razmakResetki = 1
const skaliranje = 0.004

/* INIT */

const clock = new THREE.Clock()

const scena = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
kamera.position.set(2, 2, 3)

let ucitavac = new THREE.ColladaLoader()
ucitavac.options.convertUpAxis = true

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** FUNCTIONS **/

function pustiAnimaciju (model) {
  model.traverse(child => {
    if (!(child instanceof THREE.SkinnedMesh)) return
    const animation = new THREE.Animation(child, child.geometry.animation)
    animation.play()
  })
}

function crtajResetku () {
  const oblik = new THREE.Geometry()
  for (let i = -brojResetki; i <= brojResetki; i += razmakResetki) {
    oblik.vertices.push(new THREE.Vector3(-brojResetki, visinaTla, i))
    oblik.vertices.push(new THREE.Vector3(brojResetki, visinaTla, i))
    oblik.vertices.push(new THREE.Vector3(i, visinaTla, -brojResetki))
    oblik.vertices.push(new THREE.Vector3(i, visinaTla, brojResetki))
  }
  const materijal = new THREE.LineBasicMaterial({color: 0x303030})
  const resetka = new THREE.Line(oblik, materijal, THREE.LinePieces)
  scena.add(resetka)
}

function dodajSvetla () {
  const usmerenoSvetlo = new THREE.DirectionalLight(Math.random() * 0xffffff)
  usmerenoSvetlo.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  usmerenoSvetlo.position.normalize()
  scena.add(usmerenoSvetlo)
  scena.add(new THREE.AmbientLight(0xcccccc))
}

function animiraj () {
  requestAnimationFrame(animiraj)
  const brojac = Date.now() * 0.0005
  kamera.position.x = Math.cos(brojac) * 10
  kamera.position.y = 2
  kamera.position.z = Math.sin(brojac) * 10
  kamera.lookAt(scena.position)
  THREE.AnimationHandler.update(clock.getDelta())
  renderer.render(scena, kamera)
}

/** LOGIC **/

ucitavac.load('modeli/reptil.dae', data => {
  const model = data.scene
  pustiAnimaciju(model)
  model.scale.set(skaliranje, skaliranje, skaliranje)
  scena.add(model)
})

crtajResetku()
dodajSvetla()
animiraj()

/** EVENTS **/

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  kamera.aspect = window.innerWidth / window.innerHeight
  kamera.updateProjectionMatrix()
})
