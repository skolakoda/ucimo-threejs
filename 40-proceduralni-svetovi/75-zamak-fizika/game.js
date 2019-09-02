/* global Physijs */
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativno u odnosu na worker

const brojCigli = 10
const brojSpratova = 7
const razmak = 10
const d = razmak * brojCigli

/** SCENA **/

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -30, 0))

const camera = new THREE.PerspectiveCamera()
camera.position.set(55, 50, 250)

const controls = new THREE.OrbitControls(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

scene.add(createRigidGround(500))
// scene.add(createRigidBox(0, 0))

/** FUNCTIONS **/

function createRigidGround(size = 150) {
  const groundFriction = 1
  const groundBounciness = 0
  const groundMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial(), groundFriction, groundBounciness
  )
  const ground = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(size, size), groundMaterial, 0
  )
  ground.name = 'ground'
  ground.rotateX(- Math.PI / 2)
  return ground
}

function createRigidBox(x = 0, y = 0, z = 0, size = 10) {
  const boxFriction = 1
  const boxBounciness = 0
  const boxMaterial = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), boxFriction, boxBounciness
  )
  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    boxMaterial
  )
  box.position.set(x, y + size/2, z)
  return box
}

function praviSprat(y, i) {
  if (i > d + 1) return
  ;[[i, y, 0], [i, y, d], [0, y, i], [d, y, i]].map(kord => scene.add(createRigidBox(...kord)))
  praviSprat(y, i + razmak)
}


/** LOOP **/

void function praviZgradu(y) {
  if (y > razmak * brojSpratova) return
  const start = Math.floor(y / razmak) % 2 == 0 ? 0 : razmak / 2
  praviSprat(y, start)
  praviZgradu(y + razmak)
}(0)

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  controls.update()
  renderer.render(scene, camera)
}()
