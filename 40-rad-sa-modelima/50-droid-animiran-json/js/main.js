/* global movements, Robot */

const player = new Robot()
const {innerWidth, innerHeight} = window

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000)
camera.position.set(75, 75, 75)
camera.lookAt(scene.position)
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const materijal = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  morphTargets: true
})

const loader = new THREE.JSONLoader()
loader.load('model/droid.json', oblik => {
  player.mesh = new THREE.MorphAnimMesh(oblik, materijal)
  player.changeMovement('stand')
  scene.add(player.mesh)
})

const clock = new THREE.Clock()

/** FUNCTIONS **/

function azurirajIgraca(deltaVreme) {
  if (!player.mesh) return
  const isEndFrame = (movements[player.movement].animMax === player.mesh.currentKeyframe)
  const isAction = movements[player.movement].action
  if (!isAction || (isAction && !isEndFrame))
    player.mesh.updateAnimation(1000 * deltaVreme)
  else if (movements[player.movement].state !== 'freeze')
    player.changeMovement(player.state)
}

function update() {
  azurirajIgraca(clock.getDelta())
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

/** EXEC **/

update()

const buttons = [...document.querySelectorAll('.js-state')]
buttons.map(btn => btn.addEventListener('click', () => player.changeMovement(btn.value)))
