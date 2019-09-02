/* global Physijs */
// primer sa vise kocki: http://chandlerprall.github.io/Physijs/examples/collisions.html
Physijs.scripts.worker = '../../libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativno u odnosu na worker

const {innerWidth, innerHeight} = window
const boxFriction = 0.5
const groundFriction = 0.8
const boxBounciness = 0.6
const groundBounciness = 0.4
let brojac = 0

/* INIT */

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -50, -10))

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight)
camera.position.set(60, 50, 60)
camera.lookAt(scene.position)

scene.add(createBox())
scene.add(createGround())

/* FUNCTIONS */

function createBox(x = 0, y = 50, z = 0, size = 5) {
  const boxMaterial = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), boxFriction, boxBounciness
  )
  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    boxMaterial
  )
  box.position.set(x, y, z)
  box.rotation.z = Math.random() * Math.PI
  box.rotation.y = Math.random() * Math.PI
  // box.addEventListener('collision', otherObject => {
  //   if (otherObject.name === 'ground') console.log('hit ground')
  // })
  return box
}

function createGround(size = 150) {
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

/* UPDATE */

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  renderer.render(scene, camera)
  if (brojac++ > 100) {
    scene.add(createBox())
    brojac = 0
  }
}()
