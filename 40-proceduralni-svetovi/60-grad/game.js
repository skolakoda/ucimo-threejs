import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights, initLights } from '/utils/scene.js'
import { randomInRange, randomGray, generateCityTexture, removeTopTexture } from '/utils/helpers.js'

const size = 300

createOrbitControls()
addLights()
initLights()
renderer.setClearColor(0x7ec0ee)

camera.position.set(0, 50, 200)

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, 0x101018))

for (let i = 0; i < size; i++)
  scene.add(createBuilding(size))

/* FUNCTIONS */

function createBuilding(size) {
  const width = randomInRange(10, 20)
  const height = randomInRange(width, width * 4)
  const geometry = new THREE.BoxGeometry(width, height, width)
  removeTopTexture(geometry)
  geometry.faces.splice(6, 2) // remove bottom for optimization

  const material = new THREE.MeshStandardMaterial({ map: generateCityTexture(), color: randomGray({ colorful: .04 }) })
  const mesh = new THREE.Mesh(geometry, material)

  mesh.rotation.y = Math.random()
  mesh.position.set(randomInRange(-size, size), height / 2, randomInRange(-size, size))
  return mesh
}

function createFloor(r = 1000, color = 0x60bf63) {
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
