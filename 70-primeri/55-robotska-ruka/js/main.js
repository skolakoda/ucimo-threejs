/* global THREE, TWEEN */
// Izvor: http://www.engineering-bear.com/projects/three-js-webgl

let base, mesh2, mesh3, mesh4, hand // robot parts
const sirina = window.innerWidth
const visina = window.innerHeight

const geometrije = []
const delovi = []
const tweens = [{status: false}, {status: false}, {status: false}, {status: false}]

const dummy = new THREE.Object3D() // base to body joint (rotation limited to y osa)
const dummy2 = new THREE.Object3D() // body to arm1 (rotation limited to z osa)
const dummy3 = new THREE.Object3D() // arm1 to arm2 (rotation limited to z osa)
const dummy4 = new THREE.Object3D() // arm2 to hand (rotation limited to z osa)

/* INIT */

const camera = new THREE.Camera(45, sirina / visina, 1, 20000)
camera.position.x = 3000
camera.position.y = 1000
camera.position.z = 8000
camera.useTarget = false

const scene = new THREE.Scene()
scene.addLight(new THREE.AmbientLight(0x333333))
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(0, 0, 1)
light.position.normalize()
scene.addLight(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirina, visina)
const container = document.getElementById('container')
container.appendChild(renderer.domElement)

/* FUNCTIONS */

function createBase(geometry) {
  geometrije[0] = geometry
  const material = new THREE.MeshFaceMaterial()
  base = new THREE.Mesh(geometry, material)
  base.scale.x = base.scale.y = base.scale.z = 75
  // adding joint for body
  base.addChild(dummy)
  // control body location by moving joint x,y,z
  dummy.position.y = 18
  dummy.control = 'y' // y osa is controlled
  // add all dummy joints to an array so i can control them easier later
  delovi.push(dummy)
}

function createBody(geometry) {
  geometrije[1] = geometry
  const material = new THREE.MeshFaceMaterial()
  mesh2 = new THREE.Mesh(geometry, material)
  dummy.addChild(mesh2)
  // adding joint for arm1
  dummy.addChild(dummy2)
  dummy2.position.x = 0
  dummy2.position.y = -8
  dummy2.control = 'z' // z osa is controlled
  delovi.push(dummy2)
}

function createArm1(geometry) {
  geometrije[2] = geometry
  const material = new THREE.MeshFaceMaterial()
  mesh3 = new THREE.Mesh(geometry, material)
  dummy2.addChild(mesh3)
  // add joint for arm 2
  dummy2.addChild(dummy3)
  // these offsets are set manually
  dummy3.position.x = -14.5
  dummy3.position.y = 13
  dummy3.control = 'z'
  delovi.push(dummy3)
}

function createArm2(geometry) {
  geometrije[3] = geometry
  const material = new THREE.MeshFaceMaterial()
  mesh4 = new THREE.Mesh(geometry, material)
  dummy3.addChild(mesh4)
  dummy3.addChild(dummy4)
  // these offsets are set manually
  dummy4.position.x = -18.5
  dummy4.position.y = 5.5
  dummy4.control = 'z'
  delovi.push(dummy4)
}

function createHand(geometry) {
  const material = new THREE.MeshFaceMaterial()
  geometrije[4] = geometry
  hand = new THREE.Mesh(geometry, material)
  dummy4.addChild(hand)
  scene.addObject(base)
}

function moveRobot() {
  // ne pusta ako je neka animacija u toku
  for (const i in tweens) {
    if (tweens[i].status) return false
  }

  for (const i in delovi) {
    const deo = delovi[i]
    if (!deo.control) continue

    const osa = deo.control
    const smer = Math.random() > 0.5 ? -1 : 1
    const randRotate = 4 * Math.random() * smer
    const randTime = 6000 * Math.random()

    const param = {
      obj: deo,
      tween: tweens[i],
      [osa]: deo.rotation[osa],
      updateRotation() {
        this.obj.rotation[osa] = this[osa]
      }
    }

    tweens[i].status = true
    tweens[i].tween = new TWEEN.Tween(param)
      .to({[osa]: deo.rotation[osa] + randRotate}, randTime)
      .onUpdate(param.updateRotation)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => param.tween.status = false)
      .start()
  }
}

/* EXEC */

const loader = new THREE.JSONLoader()
loader.load({
  model: 'obj/robot_arm_base.js',
  callback: createBase
})
loader.load({
  model: 'obj/robot_arm_body.js',
  callback: createBody
})
loader.load({
  model: 'obj/robot_arm_arm1.js',
  callback: createArm1
})
loader.load({
  model: 'obj/robot_arm_arm2.js',
  callback: createArm2
})
loader.load({
  model: 'obj/robot_arm_hand.js',
  callback: createHand
})

setInterval(moveRobot, 3000)

void function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
  renderer.render(scene, camera)
}()
