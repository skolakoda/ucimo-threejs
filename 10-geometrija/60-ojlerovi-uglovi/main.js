// Euler angle js: order of rotation application is Z, Y, X in three.js

/* global Coordinates, dat */

const width = window.innerWidth
const height = window.innerHeight
const aspectRatio = width / height

/* FUNCTIONS */

function createAirplane() {
  const airplane = new THREE.Object3D()
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x95E4FB,
    specular: 0x505050,
    shininess: 100
  })

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 16), planeMaterial)
  nose.rotation.x = 90 * Math.PI / 180
  nose.scale.y = 3.0
  nose.position.y = 0
  nose.position.z = 70
  airplane.add(nose)

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 180, 32), planeMaterial)
  body.rotation.x = 90 * Math.PI / 180
  body.position.y = 0
  body.position.z = -20
  airplane.add(body)

  const wing = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 250, 32), planeMaterial)
  wing.scale.x = 0.2
  wing.rotation.z = 90 * Math.PI / 180
  wing.position.y = 5
  airplane.add(wing)

  const tailWing = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 100, 32), planeMaterial)
  tailWing.scale.x = 0.2
  tailWing.rotation.z = 90 * Math.PI / 180
  tailWing.position.y = 5
  tailWing.position.z = -90
  airplane.add(tailWing)

  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 15, 40, 32), planeMaterial)
  tail.scale.x = 0.15
  tail.rotation.x = -10 * Math.PI / 180
  tail.position.y = 20
  tail.position.z = -96
  airplane.add(tail)
  return airplane
}

function createRing(radius, color, axis) {
  const sphere_radius = 12
  const ringMaterial = new THREE.MeshLambertMaterial({color})
  const circleMesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 5, 6, 50),
    ringMaterial
  )
  const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(sphere_radius, 12, 10),
    ringMaterial
  )
  sphereMesh.position.x = radius

  const composite = new THREE.Object3D()
  composite.add(circleMesh)
  composite.add(sphereMesh)

  if (axis === 'x') {
    composite.rotation.y = Math.PI / 2
  } else if (axis === 'y') {
    composite.rotation.x = Math.PI / 2
  }
  const ringObj = new THREE.Object3D()
  ringObj.add(composite)

  return ringObj
}

/* INIT */

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 10000)
camera.position.set(-668, 474, 210)

const controls = new THREE.OrbitAndPanControls(camera, renderer.domElement)

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

// rings

const ringx = createRing(200, 0xFF0000, 'x')
const ringy = createRing(175, 0x00FF00, 'y')
const ringz = createRing(150, 0x0000FF, 'z')

ringy.add(ringz)
ringx.add(ringy)
scene.add(ringx)

// gui

const gui = new dat.GUI()
const controller = {
  ex: 0.0,
  ey: 0.0,
  ez: 0.0
}
const h = gui.addFolder('Euler angles')
h.add(controller, 'ez', -180.0, 180.0, 0.025).name('Euler z')
h.add(controller, 'ey', -180.0, 180.0, 0.025).name('Euler y')
h.add(controller, 'ex', -180.0, 180.0, 0.025).name('Euler x')

/* UPDATE */

void function update() {
  window.requestAnimationFrame(update)
  controls.update()
  airplane.rotation.x = controller.ex * Math.PI / 180 // pitch
  airplane.rotation.y = controller.ey * Math.PI / 180 // yaw
  airplane.rotation.z = controller.ez * Math.PI / 180 // roll
  ringx.rotation = airplane.rotation
  renderer.render(scene, camera)
}()
