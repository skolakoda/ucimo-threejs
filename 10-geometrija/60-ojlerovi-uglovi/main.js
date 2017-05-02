// Euler angle: order of rotation application is Z, Y, X in three.js

/* global Coordinates, dat */

function createAirplane() {
  const airplane = new THREE.Object3D()
  const material = new THREE.MeshPhongMaterial({shininess: 100})

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 16), material)
  nose.rotation.x = 90 * Math.PI / 180
  nose.scale.y = 3
  nose.position.y = 0
  nose.position.z = 70
  airplane.add(nose)

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 180, 32), material)
  body.rotation.x = 90 * Math.PI / 180
  body.position.y = 0
  body.position.z = -20
  airplane.add(body)

  const wing = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 250, 32), material)
  wing.scale.x = 0.2
  wing.rotation.z = 90 * Math.PI / 180
  wing.position.y = 5
  airplane.add(wing)

  const tailWing = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 100, 32), material)
  tailWing.scale.x = 0.2
  tailWing.rotation.z = 90 * Math.PI / 180
  tailWing.position.y = 5
  tailWing.position.z = -90
  airplane.add(tailWing)

  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 15, 40, 32), material)
  tail.scale.x = 0.15
  tail.rotation.x = -10 * Math.PI / 180
  tail.position.y = 20
  tail.position.z = -96
  airplane.add(tail)
  return airplane
}

/* INIT */

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({alpha:true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
	30, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.set(-668, 474, 210)
camera.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
light.position.set(-10, 10, 0)
scene.add(light)

Coordinates.drawAllAxes({
  axisLength: 200,
  axisRadius: 1,
  axisTess: 50
})

const airplane = createAirplane()
scene.add(airplane)

// gui

const gui = new dat.GUI()
const controller = {
  x: 0,
  y: 0,
  z: 0
}
gui.add(controller, 'x', -180, 180).name('pitch (x)')
gui.add(controller, 'y', -180, 180).name('yaw (y)')
gui.add(controller, 'z', -180, 180).name('roll (z)')

/* UPDATE */

void function update() {
  window.requestAnimationFrame(update)
  airplane.rotation.x = controller.x * Math.PI / 180 // pitch
  airplane.rotation.y = controller.y * Math.PI / 180 // yaw
  airplane.rotation.z = controller.z * Math.PI / 180 // roll
  renderer.render(scene, camera)
}()
