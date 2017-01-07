/* global robotStanja */

/** KONFIG **/

let interval
let igracMesh

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

const igrac = {
  model: {
    objekat: new THREE.Object3D(),
    kretnja: 'stand',
    stanje: 'stand'
  },
  position: {
    x: 0,
    y: 0,
    z: 0,
    smer: 0
  },
  kamera: {
    brzina: 300,
    daljina: 5,
    x: 0,
    y: 0,
    z: 0
  },
  changeMotion: function (kretnja) {
    igrac.model.kretnja = kretnja
    igrac.model.stanje = robotStanja[kretnja][3].stanje
    const animMin = robotStanja[kretnja][0]
    const animMax = robotStanja[kretnja][1]
    const animFps = robotStanja[kretnja][2]
    igracMesh.time = 0
    igracMesh.duration = 1000 * ((animMax - animMin) / animFps)
    igracMesh.setFrameRange(animMin, animMax)
  }
}

/** INIT **/

const casovnik = new THREE.Clock()

const scena = new THREE.Scene()
scena.fog = new THREE.FogExp2(0x000000, 0.05)
scena.add(igrac.model.objekat)

const kamera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scena.add(kamera)

const svetlo = new THREE.DirectionalLight(0xffffff, 1.5)
svetlo.position.set(1, 1, 1)
scena.add(svetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
document.body.appendChild(renderer.domElement)

const ravanOblik = new THREE.PlaneGeometry(1000, 1000)
const ravanMaterijal = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/trava.jpg')
})
ravanMaterijal.map.repeat.x = 300
ravanMaterijal.map.repeat.y = 300
ravanMaterijal.map.wrapS = THREE.RepeatWrapping
ravanMaterijal.map.wrapT = THREE.RepeatWrapping
const ravan = new THREE.Mesh(ravanOblik, ravanMaterijal)
scena.add(ravan)

const kocke = []
const geometry = new THREE.CubeGeometry(1, 1, 1)
for (let i = 0; i < 100; i++) {
  kocke[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random()
  }))
  kocke[i].position.x = i % 2 * 5 - 2.5
  kocke[i].position.y = 0.5
  kocke[i].position.z = -1 * i * 4
  scena.add(kocke[i])
}

const material = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  ambient: 0x999999,
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 25,
  morphTargets: true
})

const loader = new THREE.JSONLoader()
loader.load('model/droid.json', function (geometry) {
  igracMesh = new THREE.MorphAnimMesh(geometry, material)
  igracMesh.rotation.y = -Math.PI / 2
  igracMesh.scale.set(0.02, 0.02, 0.02)
  igracMesh.position.y = 0.5
  igracMesh.castShadow = true
  igracMesh.receiveShadow = true
  igrac.changeMotion('stand')
  igrac.model.objekat.add(igracMesh)
})

  /**
   * action
   */
document.addEventListener('keydown', function (e) {
  if (!/67/.test(e.keyCode)) {
    return
  } // c key
  if (igrac.model.stanje === 'stand') {
    igrac.changeMotion('crstand')
  } else if (igrac.model.stanje === 'crstand') {
    igrac.changeMotion('stand')
  }
}, false)

  /**
   * move
   */
const moveState = {
  moving: false,
  front: false,
  Backwards: false,
  left: false,
  right: false,
  brzina: 0.1,
  angle: 0
}

function move () {
  if (igrac.model.kretnja !== 'run' && igrac.model.stanje === 'stand') {
    igrac.changeMotion('run')
  }
  if (igrac.model.kretnja !== 'crwalk' && igrac.model.stanje === 'crstand') {
    igrac.changeMotion('crwalk')
  }
  let brzina = moveState.brzina
  if (igrac.model.stanje === 'crstand') {
    brzina *= 0.5
  }
  if (igrac.model.stanje === 'freeze') {
    brzina *= 0
  }

  let smer = moveState.angle
  if (moveState.front && !moveState.left && !moveState.Backwards && !moveState.right) {
    smer += 0
  }
  if (moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
    smer += 45
  }
  if (!moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
    smer += 90
  }
  if (!moveState.front && moveState.left && moveState.Backwards && !moveState.right) {
    smer += 135
  }
  if (!moveState.front && !moveState.left && moveState.Backwards && !moveState.right) {
    smer += 180
  }
  if (!moveState.front && !moveState.left && moveState.Backwards && moveState.right) {
    smer += 225
  }
  if (!moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
    smer += 270
  }
  if (moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
    smer += 315
  }

  igrac.model.objekat.rotation.y = smer * Math.PI / 180
  igrac.position.x -= Math.sin(smer * Math.PI / 180) * brzina
  igrac.position.z -= Math.cos(smer * Math.PI / 180) * brzina
}

document.addEventListener('keydown', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) {
    return
  }
  if (e.keyCode === 87) {
    moveState.front = true
    moveState.Backwards = false
  } else if (e.keyCode === 83) {
    moveState.Backwards = true
    moveState.front = false
  } else if (e.keyCode === 65) {
    moveState.left = true
    moveState.right = false
  } else if (e.keyCode === 68) {
    moveState.right = true
    moveState.left = false
  }
  if (!moveState.moving) {
    if (igrac.model.stanje === 'stand') {
      igrac.changeMotion('run')
    }
    if (igrac.model.stanje === 'crstand') {
      igrac.changeMotion('crwalk')
    }
    moveState.moving = true
    move()
    interval = setInterval(function () {
      move()
    }, 1000 / 60)
  }
}, false)

document.addEventListener('keyup', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) return
  if (e.keyCode === 87) {
    moveState.front = false
  } else if (e.keyCode === 83) {
    moveState.Backwards = false
  } else if (e.keyCode === 65) {
    moveState.left = false
  } else if (e.keyCode === 68) {
    moveState.right = false
  }
  if (!moveState.front && !moveState.Backwards && !moveState.left && !moveState.right) {
    igrac.changeMotion(igrac.model.stanje)
    moveState.moving = false
    clearInterval(interval)
  }
}, false)

/**
 * kamera rotation
 */
const getElementPosition = function (element) {
  let top = 0
  let left = 0
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  }
  while (element)
  return {
    top: top,
    left: left
  }
}

const pointer = {
  x: 0,
  y: 0
}
document.addEventListener('mousemove', function (e) {
  const mouseX = e.clientX - getElementPosition(renderer.domElement).left
  const mouseY = e.clientY - getElementPosition(renderer.domElement).top
  pointer.x = (mouseX / renderer.domElement.width) * 2 - 1
  pointer.y = -(mouseY / renderer.domElement.height) * 2 + 1
}, false)

let oldPointerX = 0
let oldPointerY = 0
document.addEventListener('mousedown', rotateStart, false)

function rotateStart () {
  oldPointerX = pointer.x
  oldPointerY = pointer.y
  renderer.domElement.addEventListener('mousemove', rotate, false)
  renderer.domElement.addEventListener('mouseup', rotateStop, false)
}

function rotateStop () {
  renderer.domElement.removeEventListener('mousemove', rotate, false)
  renderer.domElement.removeEventListener('mouseup', rotateStop, false)
}

function rotate () {
  igrac.kamera.x += (oldPointerX - pointer.x) * igrac.kamera.brzina
  igrac.kamera.y += (oldPointerY - pointer.y) * igrac.kamera.brzina
  if (igrac.kamera.y > 150) {
    igrac.kamera.y = 150
  }
  if (igrac.kamera.y < -150) {
    igrac.kamera.y = -150
  }
  moveState.angle = (igrac.kamera.x / 2) % 360
  oldPointerX = pointer.x
  oldPointerY = pointer.y
}

function update () {
  requestAnimationFrame(update)

  igrac.model.objekat.position.x = igrac.position.x
  igrac.model.objekat.position.y = igrac.position.y
  igrac.model.objekat.position.z = igrac.position.z

  kamera.position.x = igrac.position.x + igrac.kamera.daljina * Math.sin((igrac.kamera.x) * Math.PI / 360)
  kamera.position.z = igrac.position.z + igrac.kamera.daljina * Math.cos((igrac.kamera.x) * Math.PI / 360)
  kamera.position.y = igrac.position.y + igrac.kamera.daljina * Math.sin((igrac.kamera.y) * Math.PI / 360)
  kamera.position.y += 1

  const vec3 = new THREE.Vector3(igrac.position.x, igrac.position.y, igrac.position.z)
  kamera.lookAt(vec3)

  // model animation
  const delta = casovnik.getDelta()
  if (igracMesh) {
    const isEndFleame = (robotStanja[igrac.model.kretnja][1] === igracMesh.currentKeyframe)
    const isAction = robotStanja[igrac.model.kretnja][3].action

    if (!isAction || (isAction && !isEndFleame)) {
      igracMesh.updateAnimation(1000 * delta)
    } else if (/freeze/.test(robotStanja[igrac.model.kretnja][3].stanje)) {
        // dead...
    } else {
      igrac.changeMotion(igrac.model.stanje)
    }
  }

  renderer.render(scena, kamera)
}

/** LOGIKA **/

update()
