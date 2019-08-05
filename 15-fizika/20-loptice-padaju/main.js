/* global CANNON */

let i = 0

const speed = 5
const ballsFrequency = 30
const ramp1Pos = [-20, 25, 0]
const ramp2Pos = [25, 5, 0]
const balls = []

/* INIT */

const scene = new THREE.Scene

const canvas = document.getElementById('canvas')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(canvas.clientWidth, canvas.clientHeight)

const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight)
camera.position.set(-5, -10, 150)
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff)
light.position.set(-.5, .5, 1.5)
scene.add(light)

const world = new CANNON.World()
world.gravity.set(0, -10, 0)
world.broadphase = new CANNON.NaiveBroadphase()

const red = new THREE.MeshLambertMaterial({color: 0xdd0000})
const box = new THREE.CubeGeometry(50, 2, 10)

const ramp1 = new THREE.Mesh(box, red)
ramp1.position.set(...ramp1Pos)
ramp1.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 32)
scene.add(ramp1)

const ramp1Shape = new CANNON.Box(new CANNON.Vec3(25, 1, 5))
const ramp1Body = new CANNON.RigidBody(0, ramp1Shape)
ramp1Body.position.set(...ramp1Pos)
ramp1Body.quaternion.set(ramp1.quaternion.x, ramp1.quaternion.y, ramp1.quaternion.z, ramp1.quaternion.w)
world.add(ramp1Body)

const ramp2 = new THREE.Mesh(box, red)
ramp2.position.set(...ramp2Pos)
ramp2.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 16)
scene.add(ramp2)

const ramp2Shape = new CANNON.Box(new CANNON.Vec3(25, 1, 5))
const ramp2Body = new CANNON.RigidBody(0, ramp2Shape) // mass 0 indicates static
ramp2Body.position.set(...ramp2Pos)
ramp2Body.quaternion.set(ramp2.quaternion.x, ramp2.quaternion.y, ramp2.quaternion.z, ramp2.quaternion.w)
world.add(ramp2Body)

const plane = new THREE.PlaneGeometry(100, 50)
const floor = new THREE.Mesh(plane, red)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const floorShape = new CANNON.Box(new CANNON.Vec3(50, .01, 25))
const floorBody = new CANNON.RigidBody(0, floorShape)
floorBody.position.y = floor.position.y = -15
world.add(floorBody)

const clock = new THREE.Clock()

/* FUNCTIONS */

function addBall(radius) {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius),
    new THREE.MeshLambertMaterial({color: 0x0000ff})
  )
  const rand = Math.random()
  ball.position.set(rand * 40 - 20, 50, rand * 2 - 1)
  scene.add(ball)
  const ballBody = new CANNON.RigidBody(
    5, new CANNON.Sphere(radius)
  )
  ballBody.mesh = ball
  ballBody.position.set(ball.position.x, ball.position.y, ball.position.z)
  world.add(ballBody)
  balls.push(ballBody)
}

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta() * speed
  if (++i % ballsFrequency == 0) addBall(4)
  world.step(delta)
  balls.map(ball => {
    ball.position.copy(ball.mesh.position)
    ball.quaternion.copy(ball.mesh.quaternion)
  })
  renderer.render(scene, camera)
}()
