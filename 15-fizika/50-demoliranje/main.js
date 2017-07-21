/* global Ammo */

const clock = new THREE.Clock()

const gravityConstant = -9.8
const rigidBodies = []
const margin = 0.05

const ballMass = 1.2
const ballRadius = 0.6

const brickMass = 0.5
const brickLength = 1.2
const brickDepth = 0.6
const brickHeight = brickLength * 0.5
const numBricksLength = 6
const numBricksHeight = 8

const ropeNumSegments = 10
const ropeLength = 4
const ropeMass = 3

const pos = new THREE.Vector3()
const quat = new THREE.Quaternion()
const transformAux1 = new Ammo.btTransform()

let armMovement = 0

/* INIT SCENE */

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight)
camera.position.x = -7
camera.position.y = 5
camera.position.z = 8

const controls = new THREE.OrbitControls(camera)
controls.target.y = 2

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xbfd1e5)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-10, 10, 5)
light.castShadow = true
scene.add(light)

/* INIT PHYSIC */

const collisionConfig = new Ammo.btSoftBodyRigidBodyCollisionConfiguration()
const world = new Ammo.btSoftRigidDynamicsWorld(
  new Ammo.btCollisionDispatcher(collisionConfig),
  new Ammo.btDbvtBroadphase(),
  new Ammo.btSequentialImpulseConstraintSolver(),
  collisionConfig,
  new Ammo.btDefaultSoftBodySolver()
)
world.setGravity(new Ammo.btVector3(0, gravityConstant, 0))

/* CREATE OBJECTS */

const ground = createParalellepiped(
  40, 1, 40, 0,
  pos.set(0, -0.5, 0),
  quat.set(0, 0, 0, 1),
  new THREE.MeshPhongMaterial({
    color: 0xFFFFFF
  })
)
ground.castShadow = ground.receiveShadow = true

const ball = new THREE.Mesh(
  new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({
    color: 0x202020
  })
)
ball.castShadow = ball.receiveShadow = true
const ballShape = new Ammo.btSphereShape(ballRadius)
ballShape.setMargin(margin)
createRigidBody(
  ball, ballShape, ballMass,
  pos.set(-3, 2, 0),
  quat.set(0, 0, 0, 1)
)
ball.userData.physicsBody.setFriction(0.5)

/* ZID */

const z0 = -numBricksLength * brickLength * 0.5
pos.set(0, brickHeight * 0.5, z0)
quat.set(0, 0, 0, 1)

for (let j = 0; j < numBricksHeight; j++) {
  const oddRow = (j % 2) == 1
  pos.z = z0
  if (oddRow) pos.z -= 0.25 * brickLength
  const nRow = oddRow ? numBricksLength + 1 : numBricksLength
  for (let i = 0; i < nRow; i++) {
    let brickLengthCurrent = brickLength
    let brickMassCurrent = brickMass
    if (oddRow && (i == 0 || i == nRow - 1)) {
      brickLengthCurrent *= 0.5
      brickMassCurrent *= 0.5
    }
    const brick = createParalellepiped(brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, createMaterial())
    brick.castShadow = brick.receiveShadow = true
    if (oddRow && (i == 0 || i == nRow - 2)) {
      pos.z += 0.75 * brickLength
    } else {
      pos.z += brickLength
    }
  }
  pos.y += brickHeight
}

const ropePos = ball.position.clone()
ropePos.y += ballRadius

const segmentLength = ropeLength / ropeNumSegments
const ropeGeometry = new THREE.BufferGeometry()
const ropeMaterial = new THREE.LineBasicMaterial({
  color: 0x000000
})
const ropePositions = []
const ropeIndices = []

for (let i = 0; i < ropeNumSegments + 1; i++) {
  ropePositions.push(ropePos.x, ropePos.y + i * segmentLength, ropePos.z)
}

for (let i = 0; i < ropeNumSegments; i++) {
  ropeIndices.push(i, i + 1)
}

ropeGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(ropeIndices), 1))
ropeGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ropePositions), 3))
ropeGeometry.computeBoundingSphere()
const rope = new THREE.LineSegments(ropeGeometry, ropeMaterial)
rope.castShadow = true
rope.receiveShadow = true
scene.add(rope)

// Rope physic object
const softBodyHelpers = new Ammo.btSoftBodyHelpers()
const ropeStart = new Ammo.btVector3(ropePos.x, ropePos.y, ropePos.z)
const ropeEnd = new Ammo.btVector3(ropePos.x, ropePos.y + ropeLength, ropePos.z)
const ropeSoftBody = softBodyHelpers.CreateRope(world.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0)
const sbConfig = ropeSoftBody.get_m_cfg()
sbConfig.set_viterations(10)
sbConfig.set_piterations(10)
ropeSoftBody.setTotalMass(ropeMass, false)
Ammo.castObject(ropeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin * 3)
world.addSoftBody(ropeSoftBody, 1, -1)
rope.userData.physicsBody = ropeSoftBody
// Disable deactivation
ropeSoftBody.setActivationState(4)

// The base
const armMass = 2
const armLength = 3
const pylonHeight = ropePos.y + ropeLength
const baseMaterial = new THREE.MeshPhongMaterial({
  color: 0x606060
})
pos.set(ropePos.x, 0.1, ropePos.z - armLength)
quat.set(0, 0, 0, 1)
const base = createParalellepiped(1, 0.2, 1, 0, pos, quat, baseMaterial)
base.castShadow = true
base.receiveShadow = true
pos.set(ropePos.x, 0.5 * pylonHeight, ropePos.z - armLength)
const pylon = createParalellepiped(0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial)
pylon.castShadow = true
pylon.receiveShadow = true
pos.set(ropePos.x, pylonHeight + 0.2, ropePos.z - 0.5 * armLength)
const arm = createParalellepiped(0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial)
arm.castShadow = true
arm.receiveShadow = true

// Glue the rope extremes to the ball and the arm
const influence = 1
ropeSoftBody.appendAnchor(0, ball.userData.physicsBody, true, influence)
ropeSoftBody.appendAnchor(ropeNumSegments, arm.userData.physicsBody, true, influence)

// Hinge constraint to move the arm
const pivotA = new Ammo.btVector3(0, pylonHeight * 0.5, 0)
const pivotB = new Ammo.btVector3(0, -0.2, -armLength * 0.5)
const axis = new Ammo.btVector3(0, 1, 0)
const hinge = new Ammo.btHingeConstraint(pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true)
world.addConstraint(hinge, true)

/* FUNCTIONS */

function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
  const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material)
  const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
  shape.setMargin(margin)
  createRigidBody(threeObject, shape, mass, pos, quat)
  return threeObject
}

function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
  threeObject.position.copy(pos)
  threeObject.quaternion.copy(quat)

  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  const motionState = new Ammo.btDefaultMotionState(transform)

  const localInertia = new Ammo.btVector3(0, 0, 0)
  physicsShape.calculateLocalInertia(mass, localInertia)

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia)

  const body = new Ammo.btRigidBody(rbInfo)
  threeObject.userData.physicsBody = body
  scene.add(threeObject)
  if (mass > 0) {
    rigidBodies.push(threeObject)
    // Disable deactivation
    body.setActivationState(4)
  }
  world.addRigidBody(body)
}

function createRandomColor() {
  return Math.floor(Math.random() * (1 << 24))
}

function createMaterial() {
  return new THREE.MeshPhongMaterial({
    color: createRandomColor()
  })
}

function updatePhysics(deltaTime) {
  hinge.enableAngularMotor(true, 1.5 * armMovement, 50)
  world.stepSimulation(deltaTime, 10)
  // Update rope
  const softBody = rope.userData.physicsBody
  const ropePositions = rope.geometry.attributes.position.array
  const numVerts = ropePositions.length / 3
  const nodes = softBody.get_m_nodes()
  let indexFloat = 0
  for (let i = 0; i < numVerts; i++) {
    const node = nodes.at(i)
    const nodePos = node.get_m_x()
    ropePositions[indexFloat++] = nodePos.x()
    ropePositions[indexFloat++] = nodePos.y()
    ropePositions[indexFloat++] = nodePos.z()
  }
  rope.geometry.attributes.position.needsUpdate = true
  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i]
    const objPhys = objThree.userData.physicsBody
    const ms = objPhys.getMotionState()
    if (ms) {
      ms.getWorldTransform(transformAux1)
      const p = transformAux1.getOrigin()
      const q = transformAux1.getRotation()
      objThree.position.set(p.x(), p.y(), p.z())
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
    }
  }
}

void function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  updatePhysics(deltaTime)
  controls.update(deltaTime)
  renderer.render(scene, camera)
}()

/* EVENTS */

window.addEventListener('keydown', e => {
  switch (e.keyCode) {
  case 81: // Q
    armMovement = 1
    break
  case 65: // A
    armMovement = -1
    break
  }
})

window.addEventListener('keyup', () => armMovement = 0)
