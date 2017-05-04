/* global Ammo */

let numObjectsToRemove = 0

const gravity = 7.8
const numStones = 8
const ballRadius = 0.4
const rigidBodies = [] // all movable objects
const objectsToRemove = []

const clock = new THREE.Clock()
const pos = new THREE.Vector3()
const quat = new THREE.Quaternion()
const mouseCoords = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const convexBreaker = new THREE.ConvexObjectBreaker()
const transformAux1 = new Ammo.btTransform()
const tempBtVec3_1 = new Ammo.btVector3(0, 0, 0)
const impactPoint = new THREE.Vector3()
const impactNormal = new THREE.Vector3()

/* PURE FUNCTIONS */

const phongMaterial = color => new THREE.MeshPhongMaterial({color})

/* INIT */

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight)
camera.position.set(-14, 8, 16)

const controls = new THREE.OrbitControls(camera)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xbfd1e5)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0x707070)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-10, 18, 5)
light.castShadow = true
scene.add(light)

// Physics configuration
const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
const physicsWorld = new Ammo.btDiscreteDynamicsWorld(
  dispatcher,
  new Ammo.btDbvtBroadphase(),
  new Ammo.btSequentialImpulseConstraintSolver(),
  collisionConfiguration
)
physicsWorld.setGravity(new Ammo.btVector3(0, -gravity, 0))

// Ground
const ground = new THREE.Mesh(
  new THREE.BoxGeometry(40, 1, 40, 1, 1, 1),
  new THREE.MeshPhongMaterial({color: 0xFFFFFF})
)
const groundShape = new Ammo.btBoxShape(
  new Ammo.btVector3(40 * 0.5, 1 * 0.5, 40 * 0.5)
)
createRigidBody(
  ground,
  groundShape, 0,
  THREE.Vector3(0, -0.5, 0),
  new THREE.Quaternion(0, 0, 0, 1)
)
ground.receiveShadow = true

// Tower 1
createObject(
  1000,
  new THREE.Vector3(2, 5, 2),
  pos.set(-8, 5, 0),
  quat.set(0, 0, 0, 1),
  phongMaterial(0xF0A024)
)

// Tower 2
createObject(
  1000,
  new THREE.Vector3(2, 5, 2),
  pos.set(8, 5, 0),
  quat.set(0, 0, 0, 1),
  phongMaterial(0xF4A321)
)

// Bridge
createObject(
  100,
  new THREE.Vector3(7, 0.2, 1.5),
  pos.set(0, 10.2, 0),
  quat.set(0, 0, 0, 1),
  phongMaterial(0xB38835)
)

// Stones
for (let i = 0; i < numStones; i++) {
  const z = 15 * (0.5 - i / (numStones + 1))
  createObject(
    120,
    new THREE.Vector3(1, 2, 0.15),
    pos.set(0, 2, z),
    quat.set(0, 0, 0, 1),
    phongMaterial(0xB0B0B0)
  )
}

// pyramid
const pyramidVec = new THREE.Vector3(4, 5, 4)
const pyramidPoints = [
  new THREE.Vector3(pyramidVec.x, -pyramidVec.y, pyramidVec.z),
  new THREE.Vector3(-pyramidVec.x, -pyramidVec.y, pyramidVec.z),
  new THREE.Vector3(pyramidVec.x, -pyramidVec.y, -pyramidVec.z),
  new THREE.Vector3(-pyramidVec.x, -pyramidVec.y, -pyramidVec.z),
  new THREE.Vector3(0, pyramidVec.y, 0)
]
const pyramid = new THREE.Mesh(
  new THREE.ConvexGeometry(pyramidPoints),
  phongMaterial(0xFFB443)
)
pyramid.position.set(5, pyramidVec.y * 0.5, -7)
convexBreaker.prepareBreakableObject(
  pyramid,
  860,
  new THREE.Vector3(),
  new THREE.Vector3(),
  true
)
createDebrisFromBreakableObject(pyramid)

/* FUNCTIONS */

function createObject(mass, halfExtents, pos, quat, material) {
  const object = new THREE.Mesh(
    new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2),
    material
  )
  object.position.copy(pos)
  object.quaternion.copy(quat)
  convexBreaker.prepareBreakableObject(object, mass, new THREE.Vector3(), new THREE.Vector3(), true)
  createDebrisFromBreakableObject(object)
}

function createParalellepipedWithPhysics(sx, sy, sz, mass, pos, quat, material) {
  const object = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material)
  const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
  createRigidBody(object, shape, mass, pos, quat)
  return object
}

function createDebrisFromBreakableObject(object) {
  object.castShadow = true
  object.receiveShadow = true
  const shape = createConvexHullPhysicsShape(object.geometry.vertices)
  const body = createRigidBody(object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity)
  // Set pointer back to the three object only in the debris objects
  const btVecUserData = new Ammo.btVector3(0, 0, 0)
  btVecUserData.threeObject = object
  body.setUserPointer(btVecUserData)
}

function removeDebris(object) {
  scene.remove(object)
  physicsWorld.removeRigidBody(object.userData.physicsBody)
}

function createConvexHullPhysicsShape(points) {
  const shape = new Ammo.btConvexHullShape()
  for (let i = 0, il = points.length; i < il; i++) {
    const p = points[i]
    tempBtVec3_1.setValue(p.x, p.y, p.z)
    const lastOne = (i === (il - 1))
    shape.addPoint(tempBtVec3_1, lastOne)
  }
  return shape
}

function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {
  if (pos) object.position.copy(pos)
  else pos = object.position
  if (quat) object.quaternion.copy(quat)
  else quat = object.quaternion

  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  const motionState = new Ammo.btDefaultMotionState(transform)

  const localInertia = new Ammo.btVector3(0, 0, 0)
  physicsShape.calculateLocalInertia(mass, localInertia)

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia)
  const body = new Ammo.btRigidBody(rbInfo)

  body.setFriction(0.5)

  if (vel) {
    body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z))
  }
  if (angVel) {
    body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z))
  }
  object.userData.physicsBody = body
  object.userData.collided = false
  scene.add(object)

  if (mass > 0) {
    rigidBodies.push(object)
    // Disable deactivation
    body.setActivationState(4)
  }
  physicsWorld.addRigidBody(body)
  return body
}

function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10)
  // Update rigid bodies
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
      objThree.userData.collided = false
    }
  }

  for (let i = 0, il = dispatcher.getNumManifolds(); i < il; i++) {
    const contactManifold = dispatcher.getManifoldByIndexInternal(i)
    const rb0 = contactManifold.getBody0()
    const rb1 = contactManifold.getBody1()

    const threeObject0 = Ammo.castObject(rb0.getUserPointer(), Ammo.btVector3).threeObject
    const threeObject1 = Ammo.castObject(rb1.getUserPointer(), Ammo.btVector3).threeObject

    if (!threeObject0 && !threeObject1) continue

    const userData0 = threeObject0 ? threeObject0.userData : null
    const userData1 = threeObject1 ? threeObject1.userData : null

    const breakable0 = userData0 ? userData0.breakable : false
    const breakable1 = userData1 ? userData1.breakable : false

    const collided0 = userData0 ? userData0.collided : false
    const collided1 = userData1 ? userData1.collided : false

    if ((!breakable0 && !breakable1) || (collided0 && collided1)) continue

    let contact = false
    let maxImpulse = 0
    for (let j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
      const contactPoint = contactManifold.getContactPoint(j)
      if (contactPoint.getDistance() < 0) {
        contact = true
        const impulse = contactPoint.getAppliedImpulse()
        if (impulse > maxImpulse) {
          maxImpulse = impulse
          const pos = contactPoint.get_m_positionWorldOnB()
          const normal = contactPoint.get_m_normalWorldOnB()
          impactPoint.set(pos.x(), pos.y(), pos.z())
          impactNormal.set(normal.x(), normal.y(), normal.z())
        }
        break
      }
    }

    if (!contact) continue

    // Subdivision

    const fractureImpulse = 250
    if (breakable0 && !collided0 && maxImpulse > fractureImpulse) {
      const debris = convexBreaker.subdivideByImpact(threeObject0, impactPoint, impactNormal, 1, 2, 1.5)
      const numObjects = debris.length
      for (let j = 0; j < numObjects; j++) {
        createDebrisFromBreakableObject(debris[j])
      }
      objectsToRemove[numObjectsToRemove++] = threeObject0
      userData0.collided = true
    }

    if (breakable1 && !collided1 && maxImpulse > fractureImpulse) {
      const debris = convexBreaker.subdivideByImpact(threeObject1, impactPoint, impactNormal, 1, 2, 1.5)
      const numObjects = debris.length
      for (let j = 0; j < numObjects; j++) {
        createDebrisFromBreakableObject(debris[j])
      }
      objectsToRemove[numObjectsToRemove++] = threeObject1
      userData1.collided = true
    }
  }
  for (let i = 0; i < numObjectsToRemove; i++) {
    removeDebris(objectsToRemove[i])
  }
  numObjectsToRemove = 0
}

function render() {
  const deltaTime = clock.getDelta()
  updatePhysics(deltaTime)
  controls.update(deltaTime)
  renderer.render(scene, camera)
}

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  render()
}()

/* EVENTS */

window.addEventListener('mousedown', function throwBall(event) {
  mouseCoords.set(
    event.clientX / window.innerWidth * 2 - 1,
    -event.clientY / window.innerHeight * 2 + 1
  )
  raycaster.setFromCamera(mouseCoords, camera)
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(ballRadius),
    new THREE.MeshPhongMaterial({color: 0x202020})
  )
  ball.castShadow = ball.receiveShadow = true
  const sphereShape = new Ammo.btSphereShape(ballRadius)
  pos.copy(raycaster.ray.direction).add(raycaster.ray.origin)
  const ballBody = createRigidBody(
    ball, sphereShape, 35, pos, quat.set(0, 0, 0, 1)
  )
  pos.copy(raycaster.ray.direction).multiplyScalar(24)
  ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z))
})
