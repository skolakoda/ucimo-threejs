/* global pokreti, Robot */

/** MODEL **/

class Igrac extends Robot {
  constructor () {
    super()
    this.ugao = 0
    this.brzina = 0.1
    this.x = this.y = this.z = 0
    this.hoda = this.napred = this.nazad = this.levo = this.desno = false
    this.objekat = new THREE.Object3D()
  }
}

/** KONFIG **/

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight
const skaliranje = 0.02

const stanjeKamere = {
  brzina: 300,
  daljina: 5,
  x: 0,
  y: 0,
  z: 0
}

const kursor = {
  x: 0,
  y: 0,
  staroX: 0,
  staroY: 0
}

let interval = null
let ofsetGore = 0
let ofsetLevo = 0

/** INIT **/

const casovnik = new THREE.Clock()
const igrac = new Igrac()

const scena = new THREE.Scene()
scena.fog = new THREE.FogExp2(0x000000, 0.05)
scena.add(igrac.objekat)

const kamera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scena.add(kamera)

const svetlo = new THREE.DirectionalLight(0xffffff, 1.5)
svetlo.position.set(1, 1, 1)
scena.add(svetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
document.body.appendChild(renderer.domElement)

// pravi tlo
const tloOblik = new THREE.PlaneGeometry(1000, 1000)
const tloMaterijal = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/trava.jpg')
})
tloMaterijal.map.repeat.x = 300
tloMaterijal.map.repeat.y = 300
tloMaterijal.map.wrapS = THREE.RepeatWrapping
tloMaterijal.map.wrapT = THREE.RepeatWrapping
const tlo = new THREE.Mesh(tloOblik, tloMaterijal)
scena.add(tlo)

// pravi kocke
const kocke = []
const oblik = new THREE.CubeGeometry(1, 1, 1)
for (let i = 0; i < 100; i++) {
  kocke[i] = new THREE.Mesh(oblik, new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random()
  }))
  kocke[i].position.x = i % 2 * 5 - 2.5
  kocke[i].position.y = 0.5
  kocke[i].position.z = -1 * i * 4
  scena.add(kocke[i])
}

const teksturaRobota = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  morphTargets: true
})

const ucitavac = new THREE.JSONLoader()
ucitavac.load('model/droid.json', function (oblik) {
  igrac.mesh = new THREE.MorphAnimMesh(oblik, teksturaRobota)
  igrac.mesh.rotation.y = -Math.PI / 2
  igrac.mesh.scale.set(skaliranje, skaliranje, skaliranje)
  igrac.mesh.position.y = 0.5
  igrac.promeniPokret('stand')
  igrac.objekat.add(igrac.mesh)
})

/** FUNKCIJE **/

const getDomElementPosition = domElement => {
  let gore = 0
  let levo = 0
  do {
    gore += domElement.offsetTop || 0
    levo += domElement.offsetLeft || 0
    domElement = domElement.offsetParent
  }
  while (domElement)
  return {
    gore: gore,
    levo: levo
  }
}

function odrediUgao () {
  let ugao = 0
  if (igrac.napred) ugao = 0
  if (igrac.levo) ugao = Math.PI / 2
  if (igrac.nazad) ugao = Math.PI
  if (igrac.desno) ugao = 3 * Math.PI / 2
  if (igrac.napred && igrac.levo) ugao = Math.PI / 4
  if (igrac.levo && igrac.nazad) ugao = 3 * Math.PI / 4
  if (igrac.nazad && igrac.desno) ugao = 5 * Math.PI / 4
  if (igrac.napred && igrac.desno) ugao = 7 * Math.PI / 4
  return ugao
}

function hodaj () {
  if (igrac.pokret !== 'run' && igrac.stanje === 'stand') igrac.promeniPokret('run')
  if (igrac.pokret !== 'crwalk' && igrac.stanje === 'crstand') igrac.promeniPokret('crwalk')

  let modifikator = 1
  if (igrac.stanje === 'crstand') modifikator = 0.5
  if (igrac.stanje === 'freeze') modifikator = 0

  const ugao = odrediUgao()
  igrac.objekat.rotation.y = ugao
  const brzina = igrac.brzina
  igrac.x -= Math.sin(ugao) * brzina * modifikator
  igrac.z -= Math.cos(ugao) * brzina * modifikator
}

function rotateStart () {
  kursor.staroX = kursor.x
  kursor.staroY = kursor.y
  renderer.domElement.addEventListener('mousemove', rotate)
  renderer.domElement.addEventListener('mouseup', rotateStop)
}

function rotateStop () {
  renderer.domElement.removeEventListener('mousemove', rotate)
  renderer.domElement.removeEventListener('mouseup', rotateStop)
}

function rotate () {
  stanjeKamere.x += (kursor.staroX - kursor.x) * stanjeKamere.brzina
  stanjeKamere.y += (kursor.staroY - kursor.y) * stanjeKamere.brzina
  if (stanjeKamere.y > 150) stanjeKamere.y = 150
  if (stanjeKamere.y < -150) stanjeKamere.y = -150
  igrac.ugao = (stanjeKamere.x / 2) % 360
  kursor.staroX = kursor.x
  kursor.staroY = kursor.y
}

function azurirajStanjeKretanja (keyCode) {
  switch (keyCode) {
    case 87:
      igrac.napred = true
      igrac.nazad = false
      break
    case 83:
      igrac.nazad = true
      igrac.napred = false
      break
    case 65:
      igrac.levo = true
      igrac.desno = false
      break
    case 68:
      igrac.desno = true
      igrac.levo = false
  }
}

function azuriraPrestanakKretanja (keyCode) {
  switch (keyCode) {
    case 87:
      igrac.napred = false
      break
    case 83:
      igrac.nazad = false
      break
    case 65:
      igrac.levo = false
      break
    case 68:
      igrac.desno = false
  }
}

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
  requestAnimationFrame(update)
  igrac.objekat.position.set(igrac.x, igrac.y, igrac.z)
  kamera.position.x = igrac.x + stanjeKamere.daljina * Math.sin((stanjeKamere.x) * Math.PI / 360)
  kamera.position.z = igrac.z + stanjeKamere.daljina * Math.cos((stanjeKamere.x) * Math.PI / 360)
  kamera.position.y = igrac.y + stanjeKamere.daljina * Math.sin((stanjeKamere.y) * Math.PI / 360) + 1
  const vec3 = new THREE.Vector3(igrac.x, igrac.y, igrac.z)
  kamera.lookAt(vec3)
  azurirajIgraca(casovnik.getDelta())
  renderer.render(scena, kamera)
}

/** EVENTS **/

window.onload = function () {
  ofsetGore = getDomElementPosition(renderer.domElement).gore
  ofsetLevo = getDomElementPosition(renderer.domElement).levo
}

document.addEventListener('keydown', function (e) {
  if (e.keyCode !== 67) return  // c
  if (igrac.stanje === 'stand') {
    igrac.promeniPokret('crstand')
  } else if (igrac.stanje === 'crstand') {
    igrac.promeniPokret('stand')
  }
})

document.addEventListener('keydown', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) return
  azurirajStanjeKretanja(e.keyCode)
  if (!igrac.hoda) {
    if (igrac.stanje === 'stand') igrac.promeniPokret('run')
    if (igrac.stanje === 'crstand') igrac.promeniPokret('crwalk')
    igrac.hoda = true
    hodaj()
    interval = setInterval(() => hodaj(), 1000 / 60)
  }
})

document.addEventListener('keyup', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) return
  azuriraPrestanakKretanja(e.keyCode)
  if (!igrac.napred && !igrac.nazad && !igrac.levo && !igrac.desno) {
    igrac.promeniPokret(igrac.stanje)
    igrac.hoda = false
    clearInterval(interval)
  }
})

document.addEventListener('mousemove', function (e) {
  const mouseX = e.clientX - ofsetLevo
  const mouseY = e.clientY - ofsetGore
  kursor.x = (mouseX / renderer.domElement.width) * 2 - 1
  kursor.y = -(mouseY / renderer.domElement.height) * 2 + 1
})

document.addEventListener('mousedown', rotateStart, false)

/** LOGIKA **/

update()
