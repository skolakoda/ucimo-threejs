/* global Physijs */

Physijs.scripts.worker = '../../libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js'

const width = window.innerWidth
const height = window.innerHeight

const boxFriction = 0.5
const groundFriction = 0.8

const boxBounciness = 0.6
const groundBounciness = 0.4

/* INIT */

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -50, -10))

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, width / height)
camera.position.set(60, 50, 60)
camera.lookAt(scene.position)

/* BOX */

const boxMaterial = Physijs.createMaterial(
  new THREE.MeshNormalMaterial(), boxFriction, boxBounciness
)
const box = new Physijs.BoxMesh(
  new THREE.BoxGeometry(15, 15, 15),
  boxMaterial
)
box.position.y = 40
box.rotation.z = 90
box.rotation.y = 50
scene.add(box)

/* GROUND */

const groundMaterial = Physijs.createMaterial(
  new THREE.MeshBasicMaterial(), groundFriction, groundBounciness
)
const ground = new Physijs.BoxMesh(
  new THREE.BoxGeometry(150, 5, 150), groundMaterial, 0
)
ground.name = 'ground'
ground.position.y = -25
scene.add(ground)

/* EVENTS */

box.addEventListener('collision', otherObject => {
  if (otherObject.name === 'ground') console.log('hit ground')
})

/* UPDATE */

void function update() {
  scene.simulate()
  renderer.render(scene, camera)
  window.requestAnimationFrame(update)
}()
