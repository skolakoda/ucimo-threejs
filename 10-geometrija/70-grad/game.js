import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

// TODO: dodati prozore
const size = 150

createOrbitControls()
initLights(scene, new THREE.Vector3(-10, 130, 40))
renderer.setClearColor(0x7ec0ee)

camera.position.set(0, 50, 200)

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, 0x101018))

for (let i = 0; i < size; i++)
  scene.add(generateBuilding(size))

/* FUNCTIONS */

export function generateBuilding(size) {
  const width = randomInRange(10, 20)
  const height = randomInRange(width, width * 4)
  const geometry = new THREE.CubeGeometry(width, height, width)
  geometry.faces.splice(6, 2) // remove bottom for optimization

  const TEXTURE_SIZE = 16
  const texture = Math.random() > 0.2 ? 'gray-bricks.jpg' : 'bricks.jpg'
  const map = new THREE.TextureLoader().load(`/assets/textures/${texture}`)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(width / TEXTURE_SIZE, height / TEXTURE_SIZE)

  const material = new THREE.MeshStandardMaterial({ map })
  const mesh = new THREE.Mesh(geometry, material)

  mesh.rotation.y = Math.random()
  mesh.position.set(randomInRange(-size, size), height / 2, randomInRange(-size, size))
  return mesh
}

export function createFloor(r = 1000, color = 0x60bf63) {
  const material = new THREE.MeshBasicMaterial({ color })
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  return new THREE.Mesh(geometry, material)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
