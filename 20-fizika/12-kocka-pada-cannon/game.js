/* global CANNON */
let world
const dt = 1 / 60

let jointBody

const N = 1

// To be synced
const meshes = [], bodies = []

initCannon()

const container = document.createElement('div')
document.body.appendChild(container)

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x000000, 500, 10000)

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 10000)
camera.position.set(10, 2, 0)
camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
scene.add(camera)

scene.add(new THREE.AmbientLight(0x666666))

const light = new THREE.DirectionalLight(0xffffff, 1.75)
const d = 20

light.position.set(d, d, d)

light.castShadow = true
// light.shadowCameraVisible = true;

light.shadowMapWidth = 1024
light.shadowMapHeight = 1024

light.shadowCameraLeft = -d
light.shadowCameraRight = d
light.shadowCameraTop = d
light.shadowCameraBottom = -d

light.shadowCameraFar = 3 * d
light.shadowCameraNear = d
light.shadowDarkness = 0.5

scene.add(light)

// floor
const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
// geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
const material = new THREE.MeshLambertMaterial({ color: 0x777777 })
// THREE.ColorUtils.adjustHSV( material.color, 0, 0, 0.9 );
const mesh = new THREE.Mesh(geometry, material)
mesh.castShadow = true
mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
mesh.receiveShadow = true
scene.add(mesh)

// cubes
const cubeGeo = new THREE.BoxGeometry(1, 1, 1, 10, 10)
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
for(let i = 0; i < N; i++) {
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial)
  cubeMesh.castShadow = true
  meshes.push(cubeMesh)
  scene.add(cubeMesh)
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(scene.fog.color)

container.appendChild(renderer.domElement)

renderer.gammaInput = true
renderer.gammaOutput = true
renderer.shadowMapEnabled = true

function updatePhysics() {
  world.step(dt)
  for(let i = 0; i !== meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position)
    meshes[i].quaternion.copy(bodies[i].quaternion)
  }
}

function initCannon() {
  // Setup our world
  world = new CANNON.World()
  world.quatNormalizeSkip = 0
  world.quatNormalizeFast = false

  world.gravity.set(0, -10, 0)
  world.broadphase = new CANNON.NaiveBroadphase()

  // Create boxes
  const mass = 5
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  for(let i = 0; i < N; i++) {
    const boxBody = new CANNON.Body({ mass })
    boxBody.addShape(boxShape)
    boxBody.position.set(0, 5, 0)
    world.add(boxBody)
    bodies.push(boxBody)
  }

  // Create a plane
  const groundShape = new CANNON.Plane()
  const groundBody = new CANNON.Body({ mass: 0 })
  groundBody.addShape(groundShape)
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.add(groundBody)

  // Joint body
  const shape = new CANNON.Sphere(0.1)
  jointBody = new CANNON.Body({ mass: 0 })
  jointBody.addShape(shape)
  jointBody.collisionFilterGroup = 0
  jointBody.collisionFilterMask = 0
  world.add(jointBody)
}

void function animate() {
  requestAnimationFrame(animate)
  updatePhysics()
  renderer.render(scene, camera)
}()