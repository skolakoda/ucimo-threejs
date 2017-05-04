/* global OIMO */

const max = 50
const materials = {
  sph: new THREE.MeshPhongMaterial(),
  box: new THREE.MeshPhongMaterial(),
  ground: new THREE.MeshPhongMaterial({color: 0x3D4143})
}
const geometries = {
  sphere: new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(1, 16, 10)),
  box: new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 1))
}
const meshs = []
const grounds = []
const bodies = []

const scene = new THREE.Scene()
const world = new OIMO.World({worldscale: 100})

/* FUNCTIONS */

function addGround(size, pos) {
  world.add({
    size,
    pos
  })
  const mesh = new THREE.Mesh(geometries.box, materials.ground)
  mesh.scale.set(size[0], size[1], size[2])
  mesh.position.set(pos[0], pos[1], pos[2])
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
  grounds.push(mesh)
}

function clearMeshes() {
  let i = meshs.length
  while (i--) scene.remove(meshs[i])
  i = grounds.length
  while (i--) scene.remove(grounds[i])
  grounds.length = meshs.length = 0
}

function populate(code) {
  clearMeshes()
  world.clear()
  bodies.length = 0

  addGround([40, 40, 390], [-180, 20, 0])
  addGround([40, 40, 390], [180, 20, 0])
  addGround([400, 80, 400], [0, -40, 0])

  let i = max
  while (i--) {
    const x = -100 + Math.random() * 200
    const z = -100 + Math.random() * 200
    const y = 100 + Math.random() * 1000
    const w = 10 + Math.random() * 10
    const h = 10 + Math.random() * 10
    const d = 10 + Math.random() * 10

    let type
    let size
    let scalar = 1
    if (code === 1) {
      scalar = 0.5
      type = 'sphere'
      size = [w * scalar]
      meshs[i] = new THREE.Mesh(geometries.sphere, materials.sph)
    } else if (code === 2) {
      type = 'box'
      size = [w, h, d]
      meshs[i] = new THREE.Mesh(geometries.box, materials.box)
    }
    meshs[i].scale.set(w * scalar, w * scalar, w * scalar)
    meshs[i].castShadow = meshs[i].receiveShadow = true
    scene.add(meshs[i])
    bodies[i] = world.add({
      pos: [x, y, z],
      move: true,
      world,
      type,
      size
    })
  }
}

function updatePhysics() {
  world.step()
  bodies.map((body, i) => {
    const mesh = meshs[i]
    mesh.position.copy(body.getPosition())
    mesh.quaternion.copy(body.getQuaternion())
  })
}

/* INIT */

const canvas = document.getElementById('canvas')

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 160, 400)

const controls = new THREE.OrbitControls(camera, canvas)
controls.target.set(0, 20, 0)
controls.update()

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

scene.add(new THREE.AmbientLight(0x3D4143))
const light = new THREE.DirectionalLight(0xffffff, 1.4)
light.position.set(300, 1000, 500)
light.castShadow = true
const d = 300
light.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600)
light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
scene.add(light)

populate(1)

/* UPDATE */

void function update() {
  updatePhysics()
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
