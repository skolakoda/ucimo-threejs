/* global THREE, TWEEN */
// Izvor: http://www.engineering-bear.com/projects/three-js-webgl

const sirina = window.innerWidth
const visina = window.innerHeight

const deo1 = new THREE.Object3D() // rotation limited to y
const deo2 = new THREE.Object3D() // rotation limited to z osa
const deo3 = new THREE.Object3D() // rotation limited to z osa
const deo4 = new THREE.Object3D() // rotation limited to z osa
const delovi = [deo1, deo2, deo3, deo4]

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
  const material = new THREE.MeshFaceMaterial()
  const base = new THREE.Mesh(geometry, material)
  base.scale.x = base.scale.y = base.scale.z = 75
  base.addChild(deo1)
  deo1.position.y = 18
  deo1.osaRotacije = 'y'
  scene.addObject(base)
}

function createBody(geometry) {
  const material = new THREE.MeshFaceMaterial()
  const body = new THREE.Mesh(geometry, material)
  deo1.addChild(body)
  deo1.addChild(deo2)
  deo2.position.x = 0
  deo2.position.y = -8
  deo2.osaRotacije = 'z'
}

function createArm1(geometry) {
  const material = new THREE.MeshFaceMaterial()
  const arm1 = new THREE.Mesh(geometry, material)
  deo2.addChild(arm1)
  deo2.addChild(deo3)
  deo3.position.x = -14.5
  deo3.position.y = 13
  deo3.osaRotacije = 'z'
}

function createArm2(geometry) {
  const material = new THREE.MeshFaceMaterial()
  const arm2 = new THREE.Mesh(geometry, material)
  deo3.addChild(arm2)
  deo3.addChild(deo4)
  deo4.position.x = -18.5
  deo4.position.y = 5.5
  deo4.osaRotacije = 'z'
}

function createHand(geometry) {
  const material = new THREE.MeshFaceMaterial()
  const hand = new THREE.Mesh(geometry, material)
  deo4.addChild(hand)
}

function moveRobot() {
  for (const i in delovi) {
    const deo = delovi[i]
    if (deo.rotira) return false
    if (!deo.osaRotacije) continue

    const osa = deo.osaRotacije
    const smer = Math.random() > 0.5 ? -1 : 1
    const randRotate = 4 * Math.random() * smer
    const randTime = 6000 * Math.random()

    const params = {
      obj: deo,
      [osa]: deo.rotation[osa],
      updateRotation() {
        this.obj.rotation[osa] = this[osa]
      }
    }

    deo.rotira = true
    deo.tween = new TWEEN.Tween(params)
      .to({[osa]: deo.rotation[osa] + randRotate}, randTime)
      .onUpdate(params.updateRotation)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => deo.rotira = false)
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
