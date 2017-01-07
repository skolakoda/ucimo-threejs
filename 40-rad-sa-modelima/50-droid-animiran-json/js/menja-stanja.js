/* global svaStanja */

/** KONFIG **/

const igrac = {
  mesh: null,
  kretnja: 'stand',
  stanje: 'stand',
  promeniStanje: function (kretnja) {
    igrac.kretnja = kretnja
    igrac.stanje = svaStanja[kretnja][3].stanje
    const animMin = svaStanja[kretnja][0]
    const animMax = svaStanja[kretnja][1]
    const animFps = svaStanja[kretnja][2]
    igrac.mesh.time = 0
    igrac.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    igrac.mesh.setFrameRange(animMin, animMax)
  }
}

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

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
  igrac.mesh.rotation.y = -Math.PI / 2
  igrac.mesh.castShadow = true
  igrac.mesh.receiveShadow = false
  igrac.promeniStanje('stand')
  scena.add(igrac.mesh)
})

let theta = 0
const clock = new THREE.Clock()

function update () {
  const delta = clock.getDelta()
  if (igrac.mesh && igrac.kretnja) {
    const isEndFleame = (svaStanja[igrac.kretnja][1] === igrac.mesh.currentKeyframe)
    const isAction = svaStanja[igrac.kretnja][3].action

    if (!isAction || (isAction && !isEndFleame)) {
      igrac.mesh.updateAnimation(1000 * delta)
    } else if (/freeze/.test(svaStanja[igrac.kretnja][3].stanje)) {
              // dead...
    } else {
      igrac.promeniStanje(igrac.stanje)
    }
  }
  kamera.position.x = 150 * Math.sin(theta / 2 * Math.PI / 360)
  kamera.position.y = 150 * Math.sin(theta / 2 * Math.PI / 360)
  kamera.position.z = 150 * Math.cos(theta / 2 * Math.PI / 360)
  kamera.lookAt(scena.position)
  theta++

  renderer.render(scena, kamera)
  requestAnimationFrame(update)
}

update()
