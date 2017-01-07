/* global svaStanja */

/** MODEL **/

const igrac = {
  mesh: null,
  kretnja: 'stand',
  stanje: 'stand',
  stanjeKretanja: {
    ide: false,
    napred: false,
    nazad: false,
    levo: false,
    desno: false,
    brzina: 0.1,
    ugao: 0
  },
  objekat: new THREE.Object3D(),
  position: {
    x: 0,
    y: 0,
    z: 0,
    ugao: 0
  },
  kamera: {
    brzina: 300,
    daljina: 5,
    x: 0,
    y: 0,
    z: 0
  },
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

/** KONFIG **/

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight
const skaliranje = 0.02

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
  igrac.promeniStanje('stand')
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
  if (igrac.stanjeKretanja.napred) ugao = 0
  if (igrac.stanjeKretanja.levo) ugao = Math.PI / 2
  if (igrac.stanjeKretanja.nazad) ugao = Math.PI
  if (igrac.stanjeKretanja.desno) ugao = 3 * Math.PI / 2
  if (igrac.stanjeKretanja.napred && igrac.stanjeKretanja.levo) ugao = Math.PI / 4
  if (igrac.stanjeKretanja.levo && igrac.stanjeKretanja.nazad) ugao = 3 * Math.PI / 4
  if (igrac.stanjeKretanja.nazad && igrac.stanjeKretanja.desno) ugao = 5 * Math.PI / 4
  if (igrac.stanjeKretanja.napred && igrac.stanjeKretanja.desno) ugao = 7 * Math.PI / 4
  return ugao
}

function hodaj () {
  if (igrac.kretnja !== 'run' && igrac.stanje === 'stand') igrac.promeniStanje('run')
  if (igrac.kretnja !== 'crwalk' && igrac.stanje === 'crstand') igrac.promeniStanje('crwalk')

  let modifikator = 1
  if (igrac.stanje === 'crstand') modifikator = 0.5
  if (igrac.stanje === 'freeze') modifikator = 0

  const ugao = odrediUgao()
  igrac.objekat.rotation.y = ugao
  const brzina = igrac.stanjeKretanja.brzina
  igrac.position.x -= Math.sin(ugao) * brzina * modifikator
  igrac.position.z -= Math.cos(ugao) * brzina * modifikator
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
  igrac.kamera.x += (kursor.staroX - kursor.x) * igrac.kamera.brzina
  igrac.kamera.y += (kursor.staroY - kursor.y) * igrac.kamera.brzina
  if (igrac.kamera.y > 150) igrac.kamera.y = 150
  if (igrac.kamera.y < -150) igrac.kamera.y = -150
  igrac.stanjeKretanja.ugao = (igrac.kamera.x / 2) % 360
  kursor.staroX = kursor.x
  kursor.staroY = kursor.y
}

function update () {
  requestAnimationFrame(update)

  igrac.objekat.position.x = igrac.position.x
  igrac.objekat.position.y = igrac.position.y
  igrac.objekat.position.z = igrac.position.z

  kamera.position.x = igrac.position.x + igrac.kamera.daljina * Math.sin((igrac.kamera.x) * Math.PI / 360)
  kamera.position.z = igrac.position.z + igrac.kamera.daljina * Math.cos((igrac.kamera.x) * Math.PI / 360)
  kamera.position.y = igrac.position.y + igrac.kamera.daljina * Math.sin((igrac.kamera.y) * Math.PI / 360)
  kamera.position.y += 1

  const vec3 = new THREE.Vector3(igrac.position.x, igrac.position.y, igrac.position.z)
  kamera.lookAt(vec3)

  // model animation
  const delta = casovnik.getDelta()
  if (igrac.mesh) {
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
  renderer.render(scena, kamera)
}

/** EVENTS **/

window.onload = function () {
  ofsetGore = getDomElementPosition(renderer.domElement).gore
  ofsetLevo = getDomElementPosition(renderer.domElement).levo
}

document.addEventListener('keydown', function (e) {
  if (e.keyCode !== 67) return
  if (igrac.stanje === 'stand') {
    igrac.promeniStanje('crstand')
  } else if (igrac.stanje === 'crstand') {
    igrac.promeniStanje('stand')
  }
})

document.addEventListener('keydown', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) {
    return
  }
  if (e.keyCode === 87) {
    igrac.stanjeKretanja.napred = true
    igrac.stanjeKretanja.nazad = false
  } else if (e.keyCode === 83) {
    igrac.stanjeKretanja.nazad = true
    igrac.stanjeKretanja.napred = false
  } else if (e.keyCode === 65) {
    igrac.stanjeKretanja.levo = true
    igrac.stanjeKretanja.desno = false
  } else if (e.keyCode === 68) {
    igrac.stanjeKretanja.desno = true
    igrac.stanjeKretanja.levo = false
  }
  if (!igrac.stanjeKretanja.ide) {
    if (igrac.stanje === 'stand') {
      igrac.promeniStanje('run')
    }
    if (igrac.stanje === 'crstand') {
      igrac.promeniStanje('crwalk')
    }
    igrac.stanjeKretanja.ide = true
    hodaj()
    interval = setInterval(function () {
      hodaj()
    }, 1000 / 60)
  }
})

document.addEventListener('keyup', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) return
  if (e.keyCode === 87) {
    igrac.stanjeKretanja.napred = false
  } else if (e.keyCode === 83) {
    igrac.stanjeKretanja.nazad = false
  } else if (e.keyCode === 65) {
    igrac.stanjeKretanja.levo = false
  } else if (e.keyCode === 68) {
    igrac.stanjeKretanja.desno = false
  }
  if (!igrac.stanjeKretanja.napred && !igrac.stanjeKretanja.nazad && !igrac.stanjeKretanja.levo && !igrac.stanjeKretanja.desno) {
    igrac.promeniStanje(igrac.stanje)
    igrac.stanjeKretanja.ide = false
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
