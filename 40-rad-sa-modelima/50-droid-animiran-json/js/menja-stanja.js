/* global robotStanja */

const igrac = {
  mesh: null,
  kretnja: 'stand',
  stanje: 'stand',
  changeMotion: function (kretnja) {
    igrac.kretnja = kretnja
    igrac.stanje = robotStanja[kretnja][3].stanje
    const animMin = robotStanja[kretnja][0]
    const animMax = robotStanja[kretnja][1]
    const animFps = robotStanja[kretnja][2]
    igrac.mesh.time = 0
    igrac.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    igrac.mesh.setFrameRange(animMin, animMax)
  }
}

const width = window.innerWidth
const height = window.innerHeight

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000)
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(1, 1, 1).normalize()
scene.add(light)

const light2 = new THREE.DirectionalLight(0xffffff)
light2.position.set(-1, -1, -1).normalize()
scene.add(light2)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

// load converted md2 data
const material = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  ambient: 0x999999,
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 25,
  morphTargets: true
})
const loader = new THREE.JSONLoader()
loader.load('model/droid.json', function (geometry) {
  igrac.mesh = new THREE.MorphAnimMesh(geometry, material)
  igrac.mesh.rotation.y = -Math.PI / 2
  igrac.mesh.castShadow = true
  igrac.mesh.receiveShadow = false
  igrac.changeMotion('stand')
  scene.add(igrac.mesh)
})

let theta = 0
const clock = new THREE.Clock()

function update () {
  const delta = clock.getDelta()
  if (igrac.mesh && igrac.kretnja) {
    const isEndFleame = (robotStanja[igrac.kretnja][1] === igrac.mesh.currentKeyframe)
    const isAction = robotStanja[igrac.kretnja][3].action

    if (!isAction || (isAction && !isEndFleame)) {
      igrac.mesh.updateAnimation(1000 * delta)
    } else if (/freeze/.test(robotStanja[igrac.kretnja][3].stanje)) {
              // dead...
    } else {
      igrac.changeMotion(igrac.stanje)
    }
  }
  camera.position.x = 150 * Math.sin(theta / 2 * Math.PI / 360)
  camera.position.y = 150 * Math.sin(theta / 2 * Math.PI / 360)
  camera.position.z = 150 * Math.cos(theta / 2 * Math.PI / 360)
  camera.lookAt(scene.position)
  theta++

  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

update()
