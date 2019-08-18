/* global pokreti, Robot */

/** KONFIG **/

const igrac = new Robot()
const sirinaScene = window.innerWidth
const visinaScene = window.innerHeight

let ugaoKamere = 0

/** INIT **/

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, sirinaScene / visinaScene, 1, 1000)
scene.add(camera)

const svetlo = new THREE.DirectionalLight(0xffffff, 0.8)
svetlo.position.set(1, 1, 1).normalize()
scene.add(svetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirinaScene, visinaScene)
renderer.setClearColorHex(0xffffff, 1)
document.body.appendChild(renderer.domElement)

const materijal = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
  morphTargets: true
})

const loader = new THREE.JSONLoader()
loader.load('model/droid.json', oblik => {
  igrac.mesh = new THREE.MorphAnimMesh(oblik, materijal)
  igrac.promeniPokret('stand')
  scene.add(igrac.mesh)
})

const clock = new THREE.Clock()

/** FUNCTIONS **/

function azurirajIgraca(deltaVreme) {
  if (!igrac.mesh) return
  const isEndFrame = (pokreti[igrac.pokret].animMax === igrac.mesh.currentKeyframe)
  const isAction = pokreti[igrac.pokret].action
  if (!isAction || (isAction && !isEndFrame))
    igrac.mesh.updateAnimation(1000 * deltaVreme)
  else if (pokreti[igrac.pokret].stanje !== 'freeze')
    igrac.promeniPokret(igrac.stanje)

}

function update() {
  azurirajIgraca(clock.getDelta())
  camera.position.x = 150 * Math.sin(ugaoKamere / 2 * Math.PI / 360)
  camera.position.y = 150 * Math.sin(ugaoKamere / 2 * Math.PI / 360)
  camera.position.z = 150 * Math.cos(ugaoKamere / 2 * Math.PI / 360)
  camera.lookAt(scene.position)
  ugaoKamere++
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

/** EXEC **/

update()

const buttons = [...document.querySelectorAll('.js-stanje')]
buttons.map(btn => btn.addEventListener('click', () => igrac.promeniPokret(btn.value)))
