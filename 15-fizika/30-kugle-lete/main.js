/* global CANNON, PointerLockControls */

let time = Date.now()

const dt = 1 / 60
const shootVelocity = 15
const balls = []
const ballMeshes = []
const boxes = []
const boxMeshes = []

/* INIT */

const ballShape = new CANNON.Sphere(0.2)
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32)
const direction = new THREE.Vector3()

const world = new CANNON.World()
world.gravity.set(0, -20, 0)

const physicsMaterial = new CANNON.Material('slipperyMaterial')
const physicsContactMaterial = new CANNON.ContactMaterial(
  physicsMaterial,
  physicsMaterial
)
world.addContactMaterial(physicsContactMaterial)

const sphereShape = new CANNON.Sphere(1.3)  // radius
const sphere = new CANNON.Body({mass: 5})
sphere.addShape(sphereShape)
sphere.position.set(0, 5, 0)
world.addBody(sphere)

const groundShape = new CANNON.Plane()
const ground = new CANNON.Body({mass: 0})
ground.addShape(groundShape)
ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(ground)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const scene = new THREE.Scene()

const light = new THREE.DirectionalLight(0xffffff, 0.9)
light.position.set(10, 30, 20)
light.castShadow = true
scene.add(light)

const controls = new PointerLockControls(camera, sphere)
controls.enabled = true
scene.add(controls.getObject())

const material = new THREE.MeshLambertMaterial()

const floorGeometry = new THREE.PlaneGeometry(300, 300, 50, 50)
floorGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

const floor = new THREE.Mesh(floorGeometry, material)
floor.receiveShadow = true
scene.add(floor)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// boxes
const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
for (let i = 0; i < 7; i++) {
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

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  world.step(dt)
  balls.map((b, i) => {
    ballMeshes[i].position.copy(b.position)
    ballMeshes[i].quaternion.copy(b.quaternion)
  })
  boxes.map((b, i) => {
    boxMeshes[i].position.copy(b.position)
    boxMeshes[i].quaternion.copy(b.quaternion)
  })
  controls.update(Date.now() - time)
  renderer.render(scene, camera)
  time = Date.now()
}()

/* HELPERS */

function updateShootDirection(targetVec) {
  const vector = targetVec
  targetVec.set(0, 0, 1)
  const projector = new THREE.Projector()
  projector.unprojectVector(vector, camera)
  const ray = new THREE.Ray(
    sphere.position,
    vector.sub(sphere.position).normalize()
  )
  targetVec.copy(ray.direction)
}

function shootBall() {
  const ball = new CANNON.Body({mass: 1})
  ball.addShape(ballShape)
  world.addBody(ball)
  balls.push(ball)
  updateShootDirection(direction)
  ball.velocity.set(
    direction.x * shootVelocity,
    direction.y * shootVelocity,
    direction.z * shootVelocity
  )
  ball.position.set(
    sphere.position.x + direction.x * (sphereShape.radius * 1.02 + ballShape.radius),
    sphere.position.y + direction.y * (sphereShape.radius * 1.02 + ballShape.radius),
    sphere.position.z + direction.z * (sphereShape.radius * 1.02 + ballShape.radius)
  )
  const ballMesh = new THREE.Mesh(ballGeometry, material)
  ballMesh.position.copy(ball.position)
  ballMesh.castShadow = ballMesh.receiveShadow = true
  scene.add(ballMesh)
  ballMeshes.push(ballMesh)
}

/* EVENTS */

document.getElementById('instructions').addEventListener('click', e => {
  e.target.style.display = 'none'
  document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock
  document.body.requestPointerLock()
})

window.addEventListener('click', shootBall)
