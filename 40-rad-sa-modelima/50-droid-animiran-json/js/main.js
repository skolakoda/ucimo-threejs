/* global pokreti, Robot */

/** KONFIG **/

const igrac = new Robot()
const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

let ugaoKamere = 0

/** INIT **/

const scena = new THREE.Scene()

const kamera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scena.add(kamera)

const svetlo = new THREE.DirectionalLight(0xffffff, 0.8)
svetlo.position.set(1, 1, 1).normalize()
scena.add(svetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
renderer.setClearColorHex(0xffffff, 1 )
document.body.appendChild(renderer.domElement)

const materijal = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  morphTargets: true
})

const ucitavac = new THREE.JSONLoader()
ucitavac.load('model/droid.json', function (oblik) {
  igrac.mesh = new THREE.MorphAnimMesh(oblik, materijal)
  igrac.promeniPokret('stand')
  scena.add(igrac.mesh)
})

const clock = new THREE.Clock()

/** FUNCTIONS **/

function azurirajIgraca (deltaVreme) {
  if (!igrac.mesh) return
  const isEndFrame = (pokreti[igrac.pokret].animMax === igrac.mesh.currentKeyframe)
  const isAction = pokreti[igrac.pokret].action
  if (!isAction || (isAction && !isEndFrame)) {
    igrac.mesh.updateAnimation(1000 * deltaVreme)
  } else if (pokreti[igrac.pokret].stanje !== 'freeze') {
    igrac.promeniPokret(igrac.stanje)
  }
}

function update () {
  azurirajIgraca(clock.getDelta())
  kamera.position.x = 150 * Math.sin(ugaoKamere / 2 * Math.PI / 360)
  kamera.position.y = 150 * Math.sin(ugaoKamere / 2 * Math.PI / 360)
  kamera.position.z = 150 * Math.cos(ugaoKamere / 2 * Math.PI / 360)
  kamera.lookAt(scena.position)
  ugaoKamere++
  renderer.render(scena, kamera)
  requestAnimationFrame(update)
}

/** EXEC **/

update()

const buttons = [...document.querySelectorAll('.js-stanje')]
buttons.map(btn => btn.addEventListener('click', () => igrac.promeniPokret(btn.value)))
