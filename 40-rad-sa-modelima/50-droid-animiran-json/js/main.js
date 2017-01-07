/** KONFIG **/

let timer
let md2meshBody

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
  }
}

const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

/** INIT **/

const clock = new THREE.Clock()

const scena = new THREE.Scene()
scena.fog = new THREE.FogExp2(0x000000, 0.05)
scena.add(igrac.model.objekat)

const kamera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scena.add(kamera)

const light = new THREE.DirectionalLight(0xffffff, 1.5)
light.position.set(1, 1, 1).normalize()
light.castShadow = true
scena.add(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
renderer.shadowMapEnabled = true
renderer.shadowMapSoft = true
renderer.shadowMapEnabled = true
document.body.appendChild(renderer.domElement)

animate()

/* create field */

const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
const planeMaterial = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/trava.jpg'),
  color: 0xffffff
})
planeMaterial.map.repeat.x = 300
planeMaterial.map.repeat.y = 300
planeMaterial.map.wrapS = THREE.RepeatWrapping
planeMaterial.map.wrapT = THREE.RepeatWrapping
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.castShadow = false
plane.receiveShadow = true
scena.add(plane)

const meshArray = []
const geometry = new THREE.CubeGeometry(1, 1, 1)
for (let i = 0; i < 100; i++) {
  meshArray[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random()
  }))
  meshArray[i].position.x = i % 2 * 5 - 2.5
  meshArray[i].position.y = 0.5
  meshArray[i].position.z = -1 * i * 4
  meshArray[i].castShadow = true
  meshArray[i].receiveShadow = true
  scena.add(meshArray[i])
}

const md2frames = {
    // first, last, fps
  stand: [0, 39, 9, {
    stanje: 'stand',
    action: false
  }], // STAND
  run: [40, 45, 10, {
    stanje: 'stand',
    action: false
  }], // RUN
  attack: [46, 53, 10, {
    stanje: 'stand',
    action: true
  }], // ATTACK
  pain1: [54, 57, 7, {
    stanje: 'stand',
    action: true
  }], // PAIN_A
  pain2: [58, 61, 7, {
    stanje: 'stand',
    action: true
  }], // PAIN_B
  pain3: [62, 65, 7, {
    stanje: 'stand',
    action: true
  }], // PAIN_C
  jump: [66, 71, 7, {
    stanje: 'stand',
    action: true
  }], // JUMP
  flip: [72, 83, 7, {
    stanje: 'stand',
    action: true
  }], // FLIP
  salute: [84, 94, 7, {
    stanje: 'stand',
    action: true
  }], // SALUTE
  taunt: [95, 111, 10, {
    stanje: 'stand',
    action: true
  }], // FALLBACK
  wave: [112, 122, 7, {
    stanje: 'stand',
    action: true
  }], // WAVE
  point: [123, 134, 6, {
    stanje: 'stand',
    action: true
  }], // POINT
  crstand: [135, 153, 10, {
    stanje: 'crstand',
    action: false
  }], // CROUCH_STAND
  crwalk: [154, 159, 7, {
    stanje: 'crstand',
    action: false
  }], // CROUCH_WALK
  crattack: [160, 168, 10, {
    stanje: 'crstand',
    action: true
  }], // CROUCH_ATTACK
  crpain: [196, 172, 7, {
    stanje: 'crstand',
    action: true
  }], // CROUCH_PAIN
  crdeath: [173, 177, 5, {
    stanje: 'freeze',
    action: true
  }], // CROUCH_DEATH
  death1: [178, 183, 7, {
    stanje: 'freeze',
    action: true
  }], // DEATH_FALLBACK
  death2: [184, 189, 7, {
    stanje: 'freeze',
    action: true
  }], // DEATH_FALLFORWARD
  death3: [190, 197, 7, {
    stanje: 'freeze',
    action: true
  }] // DEATH_FALLBACKSLOW
    // boom    : [ 198, 198,  5 ]    // BOOM
}

function changeMotion (kretnja) {
  igrac.model.kretnja = kretnja
  igrac.model.stanje = md2frames[kretnja][3].stanje
  const animMin = md2frames[kretnja][0]
  const animMax = md2frames[kretnja][1]
  const animFps = md2frames[kretnja][2]
  md2meshBody.time = 0
  md2meshBody.duration = 1000 * ((animMax - animMin) / animFps)
  md2meshBody.setFrameRange(animMin, animMax)
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
  md2meshBody = new THREE.MorphAnimMesh(geometry, material)
  md2meshBody.rotation.y = -Math.PI / 2
  md2meshBody.scale.set(0.02, 0.02, 0.02)
  md2meshBody.position.y = 0.5
  md2meshBody.castShadow = true
  md2meshBody.receiveShadow = true
  changeMotion('stand')
  igrac.model.objekat.add(md2meshBody)
})

  /**
   * action
   */
document.addEventListener('keydown', function (e) {
  if (!/67/.test(e.keyCode)) {
    return
  } // c key
  if (igrac.model.stanje === 'stand') {
    changeMotion('crstand')
  } else if (igrac.model.stanje === 'crstand') {
    changeMotion('stand')
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
    changeMotion('run')
  }
  if (igrac.model.kretnja !== 'crwalk' && igrac.model.stanje === 'crstand') {
    changeMotion('crwalk')
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
      changeMotion('run')
    }
    if (igrac.model.stanje === 'crstand') {
      changeMotion('crwalk')
    }
    moveState.moving = true
    move()
    timer = setInterval(function () {
      move()
    }, 1000 / 60)
  }
}, false)

document.addEventListener('keyup', function (e) {
  if (!/65|68|83|87/.test(e.keyCode)) {
    return
  }
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
    changeMotion(igrac.model.stanje)
    moveState.moving = false
    clearInterval(timer)
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

function animate () {
  requestAnimationFrame(animate)

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
  const delta = clock.getDelta()
  if (md2meshBody) {
    const isEndFleame = (md2frames[igrac.model.kretnja][1] === md2meshBody.currentKeyframe)
    const isAction = md2frames[igrac.model.kretnja][3].action

    if (!isAction || (isAction && !isEndFleame)) {
      md2meshBody.updateAnimation(1000 * delta)
    } else if (/freeze/.test(md2frames[igrac.model.kretnja][3].stanje)) {
        // dead...
    } else {
      changeMotion(igrac.model.stanje)
    }
  }

  renderer.render(scena, kamera)
}
