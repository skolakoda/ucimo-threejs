/* global stanja */

/** KONFIG **/

const igrac = {
  mesh: null,
  kretnja: 'stand',
  stanje: 'stand',
  promeniStanje: function (kretnja) {
    igrac.kretnja = kretnja
    igrac.stanje = stanja[kretnja][3].stanje
    const animMin = stanja[kretnja][0]
    const animMax = stanja[kretnja][1]
    const animFps = stanja[kretnja][2]
    igrac.mesh.time = 0
    igrac.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    igrac.mesh.setFrameRange(animMin, animMax)
  }
}

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

let theta = 0

/** INIT **/

const scena = new THREE.Scene()

const kamera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scena.add(kamera)

const svetlo = new THREE.DirectionalLight(0xffffff, 0.8)
svetlo.position.set(1, 1, 1).normalize()
scena.add(svetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
document.body.appendChild(renderer.domElement)

const materijal = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  morphTargets: true
})

const ucitavac = new THREE.JSONLoader()
ucitavac.load('model/droid.json', function (oblik) {
  igrac.mesh = new THREE.MorphAnimMesh(oblik, materijal)
  igrac.promeniStanje('stand')
  scena.add(igrac.mesh)
})

const clock = new THREE.Clock()

/** FUNCTIONS **/

function azurirajIgraca (deltaVreme) {
  if (!igrac.mesh) return
  const isEndFrame = (stanja[igrac.kretnja][1] === igrac.mesh.currentKeyframe)
  const isAction = stanja[igrac.kretnja][3].action
  if (!isAction || (isAction && !isEndFrame)) {
    igrac.mesh.updateAnimation(1000 * deltaVreme)
  } else if (stanja[igrac.kretnja][3].stanje !== 'freeze') {
    igrac.promeniStanje(igrac.stanje)
  }
}

function update () {
  azurirajIgraca(clock.getDelta())
  kamera.position.x = 150 * Math.sin(theta / 2 * Math.PI / 360)
  kamera.position.y = 150 * Math.sin(theta / 2 * Math.PI / 360)
  kamera.position.z = 150 * Math.cos(theta / 2 * Math.PI / 360)
  kamera.lookAt(scena.position)
  theta++
  renderer.render(scena, kamera)
  requestAnimationFrame(update)
}

update()
