/* global Physijs */

Physijs.scripts.worker = 'libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js'

let selectedBlock = null

const rows = 16
const blocksPerRow = 3
const blockOffset = 2
const block_length = 6
const block_height = 1
const block_width = 1.5
const blocks = []

const mouse_position = new THREE.Vector3()
const block_offset = new THREE.Vector3()
const _vector = new THREE.Vector3()

/* INIT */

const loader = new THREE.TextureLoader()
const wood = loader.load('texture/plywood.jpg')
const wood2 = loader.load('texture/wood.jpg')

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = renderer.shadowMapSoft = true
document.body.appendChild(renderer.domElement)

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -30, 0))

const camera = new THREE.PerspectiveCamera(
  35, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.set(25, 20, 25)
camera.lookAt(new THREE.Vector3(0, 7, 0))
scene.add(camera)

const am_light = new THREE.AmbientLight(0x444444)
scene.add(am_light)

const dir_light = new THREE.DirectionalLight(0xFFFFFF)
dir_light.position.set(20, 30, -5)
scene.add(dir_light)

/* TABLE */

const tableMaterial = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ map: wood2 }),
  .9, // high friction
  .2 // low restitution
)
tableMaterial.map.wrapS = tableMaterial.map.wrapT = THREE.RepeatWrapping
tableMaterial.map.repeat.set(5, 5)

const table = new Physijs.BoxMesh(
  new THREE.BoxGeometry(50, 1, 50),
  tableMaterial,
  0, // mass
  {
    restitution: .2,
    friction: .8
  }
)
table.position.y = -.5
table.receiveShadow = true
scene.add(table)

/* INVISIBLE PLANE */

const intersectPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshBasicMaterial({
    opacity: 0,
    transparent: true
  })
)
intersectPlane.rotation.x = Math.PI / -2
scene.add(intersectPlane)

/* TOWER */

const block_geometry = new THREE.BoxGeometry(
  block_length, block_height, block_width
)
const block_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({map: wood}),
  .4, // medium friction
  .4 // medium restitution
)
block_material.map.wrapS = block_material.map.wrapT = THREE.RepeatWrapping
block_material.map.repeat.set(1, .5)

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < blocksPerRow; j++) {
    const block = new Physijs.BoxMesh(block_geometry, block_material)
    const offset = blockOffset * j - (blockOffset * blocksPerRow / 2 - blockOffset / 2)
    block.position.y = (block_height / 2) + block_height * i
    if (i % 2 === 0) {
      block.rotation.y = Math.PI / 2
      block.position.x = offset
    } else {
      block.position.z = offset
    }
    block.receiveShadow = block.castShadow = true
    scene.add(block)
    blocks.push(block)
  }
}

/* UPDATE */

scene.addEventListener('update', () => {
  if (selectedBlock !== null) {
    const vel = new THREE.Vector3()
    vel.copy(mouse_position)
      .add(block_offset)
      .sub(selectedBlock.position)
      .multiplyScalar(5)
    selectedBlock.setLinearVelocity(vel)
    blocks.map(b => b.applyCentralImpulse(new THREE.Vector3()))
  }
  scene.simulate()
})

scene.simulate()

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()

/* HELPERS */

const handleMouseDown = function(evt) {
  _vector.set(
    (evt.clientX / window.innerWidth) * 2 - 1, -(evt.clientY / window.innerHeight) * 2 + 1,
    1
  )
  _vector.unproject(camera)
  const ray = new THREE.Raycaster(camera.position, _vector.sub(camera.position).normalize())
  const intersections = ray.intersectObjects(blocks)

  if (intersections.length > 0) {
    selectedBlock = intersections[0].object
    _vector.set(0, 0, 0)
    selectedBlock.setAngularFactor(_vector)
    selectedBlock.setAngularVelocity(_vector)
    selectedBlock.setLinearFactor(_vector)
    selectedBlock.setLinearVelocity(_vector)
    mouse_position.copy(intersections[0].point)
    block_offset.subVectors(selectedBlock.position, mouse_position)
    intersectPlane.position.y = mouse_position.y
  }
}

const handleMouseMove = function(evt) {
  if (!selectedBlock) return
  _vector.set(
    (evt.clientX / window.innerWidth) * 2 - 1,
    -(evt.clientY / window.innerHeight) * 2 + 1,
    1
  )
  _vector.unproject(camera)
  const ray = new THREE.Raycaster(camera.position, _vector.sub(camera.position).normalize())
  const intersection = ray.intersectObject(intersectPlane)
  mouse_position.copy(intersection[0].point)
}

const handleMouseUp = function() {
  if (!selectedBlock) return
  _vector.set(1, 1, 1)
  selectedBlock.setAngularFactor(_vector)
  selectedBlock.setLinearFactor(_vector)
  selectedBlock = null
}

/* EVENTS */

renderer.domElement.addEventListener('mousedown', handleMouseDown)
renderer.domElement.addEventListener('mousemove', handleMouseMove)
renderer.domElement.addEventListener('mouseup', handleMouseUp)
