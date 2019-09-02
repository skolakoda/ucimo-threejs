/* global Physijs */
Physijs.scripts.worker = '../../libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativno u odnosu na worker

let blocks = [], selected_block = null, mouse_position = new THREE.Vector3, block_offset = new THREE.Vector3, _i, _v3 = new THREE.Vector3

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true
renderer.shadowMapSoft = true
document.body.appendChild(renderer.domElement)

const scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 })
scene.setGravity(new THREE.Vector3(0, -30, 0))

scene.addEventListener(
  'update',
  () => {
    if (selected_block) {
      _v3.copy(mouse_position).add(block_offset).sub(selected_block.position).multiplyScalar(5)
      _v3.y = 0
      selected_block.setLinearVelocity(_v3)
      // Reactivate all of the blocks
      _v3.set(0, 0, 0)
      for (_i = 0; _i < blocks.length; _i++)
        blocks[_i].applyCentralImpulse(_v3)
    }
    scene.simulate(undefined, 1)
  }
)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(25, 20, 25)
camera.lookAt(new THREE.Vector3(0, 7, 0))
scene.add(camera)

const dir_light = new THREE.DirectionalLight(0xFFFFFF)
dir_light.position.set(20, 30, -5)
dir_light.target.position.copy(scene.position)
dir_light.castShadow = true
dir_light.shadowCameraLeft = -30
dir_light.shadowCameraTop = -30
dir_light.shadowCameraRight = 30
dir_light.shadowCameraBottom = 30
dir_light.shadowCameraNear = 20
dir_light.shadowCameraFar = 200
dir_light.shadowBias = -.001
scene.add(dir_light)

const table_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ color: 0xFFFFFF }),
  .9, // high friction
  .2 // low restitution
)

const block_material = Physijs.createMaterial(
  new THREE.MeshLambertMaterial({ color: 0xff0000, ambient: 0xFFFFFF }),
  .4, // medium friction
  .4 // medium restitution
)

const table = new Physijs.BoxMesh(
  new THREE.BoxGeometry(50, 1, 50),
  table_material,
  0, // mass
  { restitution: .2, friction: .8 }
)
table.position.y = -.5
table.receiveShadow = true
scene.add(table)

createTower()

const intersect_plane = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
)
intersect_plane.rotation.x = Math.PI / -2
scene.add(intersect_plane)

requestAnimationFrame(render)
scene.simulate()

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

function createTower() {
  const block_length = 6, block_height = 1, block_width = 1.5, block_offset = 2,
    block_geometry = new THREE.BoxGeometry(block_length, block_height, block_width)

  const rows = 16
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < 3; j++) {
      const block = new Physijs.BoxMesh(block_geometry, block_material)
      block.position.y = (block_height / 2) + block_height * i
      if (i % 2 === 0) {
        block.rotation.y = Math.PI / 2.01 // #TODO: There's a bug somewhere when this is to close to 2
        block.position.x = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      } else
        block.position.z = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)

      block.receiveShadow = true
      block.castShadow = true
      scene.add(block)
      blocks.push(block)
    }
}

/* EVENTS */

const vector = new THREE.Vector3, projector = new THREE.Projector()

function handleMouseDown(evt) {
  vector.set(
    evt.clientX / window.innerWidth * 2 - 1,
    -evt.clientY / window.innerHeight * 2 + 1,
    1
  )
  projector.unprojectVector(vector, camera)
  const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
  const intersections = ray.intersectObjects(blocks)

  if (intersections.length > 0) {
    selected_block = intersections[0].object
    vector.set(0, 0, 0)
    selected_block.setAngularFactor(vector)
    selected_block.setAngularVelocity(vector)
    selected_block.setLinearFactor(vector)
    selected_block.setLinearVelocity(vector)

    mouse_position.copy(intersections[0].point)
    block_offset.subVectors(selected_block.position, mouse_position)
    intersect_plane.position.y = mouse_position.y
  }
}

function handleMouseMove(evt) {
  if (!selected_block) return
  vector.set(
    evt.clientX / window.innerWidth * 2 - 1,
    -evt.clientY / window.innerHeight * 2 + 1,
    1
  )
  projector.unprojectVector(vector, camera)
  const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
  const intersection = ray.intersectObject(intersect_plane)
  mouse_position.copy(intersection[0].point)
}

function handleMouseUp() {
  if (!selected_block) return
  vector.set(1, 1, 1)
  selected_block.setAngularFactor(vector)
  selected_block.setLinearFactor(vector)
  selected_block = null
}

renderer.domElement.addEventListener('mousedown', handleMouseDown)
renderer.domElement.addEventListener('mousemove', handleMouseMove)
renderer.domElement.addEventListener('mouseup', handleMouseUp)
