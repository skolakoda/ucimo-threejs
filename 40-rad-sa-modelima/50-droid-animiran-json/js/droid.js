let md2meshBody

const player = {
  model: {
    objects: new THREE.Object3D(),
    motion: 'stand',
    state: 'stand'
  },
  position: {
    x: 0,
    y: 0,
    z: 0,
    direction: 0
  },
  camera: {
    speed: 300,
    distance: 5,
    x: 0,
    y: 0,
    z: 0
  }
}

const width = window.innerWidth
const height = window.innerHeight
const clock = new THREE.Clock()

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x000000, 0.05)
scene.add(player.model.objects)

const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000)
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff, 1.5)
light.position.set(1, 1, 1).normalize()
light.castShadow = true
scene.add(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
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
scene.add(plane)

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
  scene.add(meshArray[i])
}

const md2frames = {
    // first, last, fps
  stand: [0, 39, 9, {
    state: 'stand',
    action: false
  }], // STAND
  run: [40, 45, 10, {
    state: 'stand',
    action: false
  }], // RUN
  attack: [46, 53, 10, {
    state: 'stand',
    action: true
  }], // ATTACK
  pain1: [54, 57, 7, {
    state: 'stand',
    action: true
  }], // PAIN_A
  pain2: [58, 61, 7, {
    state: 'stand',
    action: true
  }], // PAIN_B
  pain3: [62, 65, 7, {
    state: 'stand',
    action: true
  }], // PAIN_C
  jump: [66, 71, 7, {
    state: 'stand',
    action: true
  }], // JUMP
  flip: [72, 83, 7, {
    state: 'stand',
    action: true
  }], // FLIP
  salute: [84, 94, 7, {
    state: 'stand',
    action: true
  }], // SALUTE
  taunt: [95, 111, 10, {
    state: 'stand',
    action: true
  }], // FALLBACK
  wave: [112, 122, 7, {
    state: 'stand',
    action: true
  }], // WAVE
  point: [123, 134, 6, {
    state: 'stand',
    action: true
  }], // POINT
  crstand: [135, 153, 10, {
    state: 'crstand',
    action: false
  }], // CROUCH_STAND
  crwalk: [154, 159, 7, {
    state: 'crstand',
    action: false
  }], // CROUCH_WALK
  crattack: [160, 168, 10, {
    state: 'crstand',
    action: true
  }], // CROUCH_ATTACK
  crpain: [196, 172, 7, {
    state: 'crstand',
    action: true
  }], // CROUCH_PAIN
  crdeath: [173, 177, 5, {
    state: 'freeze',
    action: true
  }], // CROUCH_DEATH
  death1: [178, 183, 7, {
    state: 'freeze',
    action: true
  }], // DEATH_FALLBACK
  death2: [184, 189, 7, {
    state: 'freeze',
    action: true
  }], // DEATH_FALLFORWARD
  death3: [190, 197, 7, {
    state: 'freeze',
    action: true
  }] // DEATH_FALLBACKSLOW
    // boom    : [ 198, 198,  5 ]    // BOOM
}

function changeMotion (motion) {
  player.model.motion = motion
  player.model.state = md2frames[motion][3].state
  const animMin = md2frames[motion][0]
  const animMax = md2frames[motion][1]
  const animFps = md2frames[motion][2]
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
  player.model.objects.add(md2meshBody)
  console.log(player.model.objects)
})

  /**
   * action
   */
document.addEventListener('keydown', function (e) {
  if (!/67/.test(e.keyCode)) {
    return
  } // c key
  if (player.model.state === 'stand') {
    changeMotion('crstand')
  } else if (player.model.state === 'crstand') {
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
  speed: 0.1,
  angle: 0
}

function move () {
  if (player.model.motion !== 'run' && player.model.state === 'stand') {
    changeMotion('run')
  }
  if (player.model.motion !== 'crwalk' && player.model.state === 'crstand') {
    changeMotion('crwalk')
  }
  let speed = moveState.speed
  if (player.model.state === 'crstand') {
    speed *= 0.5
  }
  if (player.model.state === 'freeze') {
    speed *= 0
  }

  let direction = moveState.angle
  if (moveState.front && !moveState.left && !moveState.Backwards && !moveState.right) {
    direction += 0
  }
  if (moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
    direction += 45
  }
  if (!moveState.front && moveState.left && !moveState.Backwards && !moveState.right) {
    direction += 90
  }
  if (!moveState.front && moveState.left && moveState.Backwards && !moveState.right) {
    direction += 135
  }
  if (!moveState.front && !moveState.left && moveState.Backwards && !moveState.right) {
    direction += 180
  }
  if (!moveState.front && !moveState.left && moveState.Backwards && moveState.right) {
    direction += 225
  }
  if (!moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
    direction += 270
  }
  if (moveState.front && !moveState.left && !moveState.Backwards && moveState.right) {
    direction += 315
  }

  player.model.objects.rotation.y = direction * Math.PI / 180
  player.position.x -= Math.sin(direction * Math.PI / 180) * speed
  player.position.z -= Math.cos(direction * Math.PI / 180) * speed
}

let timer
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
    if (player.model.state === 'stand') {
      changeMotion('run')
    }
    if (player.model.state === 'crstand') {
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
    changeMotion(player.model.state)
    moveState.moving = false
    clearInterval(timer)
  }
}, false)

  /**
   * camera rotation
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
  player.camera.x += (oldPointerX - pointer.x) * player.camera.speed
  player.camera.y += (oldPointerY - pointer.y) * player.camera.speed
  if (player.camera.y > 150) {
    player.camera.y = 150
  }
  if (player.camera.y < -150) {
    player.camera.y = -150
  }

  moveState.angle = (player.camera.x / 2) % 360

  oldPointerX = pointer.x
  oldPointerY = pointer.y
}

  /**
   * render
   */
function animate () {
  requestAnimationFrame(animate)

  player.model.objects.position.x = player.position.x
  player.model.objects.position.y = player.position.y
  player.model.objects.position.z = player.position.z

    // camera rotate x
  camera.position.x = player.position.x + player.camera.distance * Math.sin((player.camera.x) * Math.PI / 360)
  camera.position.z = player.position.z + player.camera.distance * Math.cos((player.camera.x) * Math.PI / 360)

    // camera rotate y
    // camera.position.x = player.position.x + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );
  camera.position.y = player.position.y + player.camera.distance * Math.sin((player.camera.y) * Math.PI / 360)
    // camera.position.z = player.position.z + player.camera.distance * Math.cos( (player.camera.y) * Math.PI / 360 );

  camera.position.y += 1
    // console.log(camera.position.z)

  const vec3 = new THREE.Vector3(player.position.x, player.position.y, player.position.z)
  camera.lookAt(vec3)

    // model animation
  const delta = clock.getDelta()
  if (md2meshBody) {
    const isEndFleame = (md2frames[player.model.motion][1] === md2meshBody.currentKeyframe)
    const isAction = md2frames[player.model.motion][3].action

    if (!isAction || (isAction && !isEndFleame)) {
      md2meshBody.updateAnimation(1000 * delta)
    } else if (/freeze/.test(md2frames[player.model.motion][3].state)) {
        // dead...
    } else {
      changeMotion(player.model.state)
    }
  }

  renderer.render(scene, camera)
}
