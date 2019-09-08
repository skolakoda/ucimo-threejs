/* global CANNON, THREE, PointerLockControls */

// import * as THREE from '/node_modules/three/build/three.module.js'
// import { PointerLockControls } from '/node_modules/three/examples/jsm/controls/PointerLockControls.js'
import {camera, scene, renderer, clock} from '/utils/scene.js'

camera.position.z = 5

const step = 1 / 60
const shootVelocity = 15
const balls = []
const ballMeshes = []
const boxes = []
const boxMeshes = []

const direction = new THREE.Vector3()

const world = new CANNON.World()
world.gravity.set(0, -20, 0)

const sphereShape = new CANNON.Sphere(1.3)  // radius
const player = new CANNON.Body({mass: 5})
player.addShape(sphereShape)
player.position.set(0, 3, 0)
world.addBody(player)

const groundShape = new CANNON.Plane()
const ground = new CANNON.Body({mass: 0})
ground.addShape(groundShape)
ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(ground)

const light = new THREE.DirectionalLight(0xffffff, 0.9)
light.position.set(10, 30, 20)
light.castShadow = true
scene.add(light)

const controls = new PointerLockControls(camera, player)
controls.enabled = true
scene.add(controls.getObject())

const material = new THREE.MeshLambertMaterial()

const floorGeometry = new THREE.PlaneGeometry(300, 300)
floorGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
const floor = new THREE.Mesh(floorGeometry, material)
floor.receiveShadow = true
scene.add(floor)

const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
for (let i = 0; i < 10; i++) {
  const box = new CANNON.Body({mass: 5})
  box.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)))
  box.position.set(
    (Math.random() - 0.5) * 20,
    1 + Math.random() - 0.5,
    (Math.random() - 0.5) * 20
  )
  const boxMesh = new THREE.Mesh(boxGeometry, material)
  boxMesh.position.copy(box.position)
  boxMesh.castShadow = boxMesh.receiveShadow = true
  world.addBody(box)
  boxes.push(box)
  scene.add(boxMesh)
  boxMeshes.push(boxMesh)
}

/* HELPERS */

function updateShootDirection(targetVec) {
  const vector = targetVec
  targetVec.set(0, 0, 1)
  const projector = new THREE.Projector()
  projector.unprojectVector(vector, camera)
  const ray = new THREE.Ray(player.position, vector.sub(player.position).normalize())
  targetVec.copy(ray.direction)
}

function shootBall() {
  const ball = new CANNON.Body({mass: 3})
  const ballShape = new CANNON.Sphere(0.4)
  ball.addShape(ballShape)
  world.addBody(ball)
  balls.push(ball)
  updateShootDirection(direction)
  const {x, y, z} = direction
  ball.velocity.set(x * shootVelocity, y * shootVelocity, z * shootVelocity)
  ball.position.set(
    player.position.x + x * (sphereShape.radius * 1.02 + ballShape.radius),
    player.position.y + y * (sphereShape.radius * 1.02 + ballShape.radius),
    player.position.z + z * (sphereShape.radius * 1.02 + ballShape.radius)
  )
  const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32)
  const ballMesh = new THREE.Mesh(ballGeometry, material)
  ballMesh.position.copy(ball.position)
  ballMesh.castShadow = ballMesh.receiveShadow = true
  scene.add(ballMesh)
  ballMeshes.push(ballMesh)
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  world.step(step)
  balls.forEach((ball, i) => {
    ballMeshes[i].position.copy(ball.position)
    ballMeshes[i].quaternion.copy(ball.quaternion)
  })
  boxes.forEach((box, i) => {
    boxMeshes[i].position.copy(box.position)
    boxMeshes[i].quaternion.copy(box.quaternion)
  })
  controls.update(delta)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.body.addEventListener('click', document.body.requestPointerLock)

window.addEventListener('click', shootBall)
