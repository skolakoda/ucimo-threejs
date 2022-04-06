import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { createBuilding } from '/utils/building.js'

const size = 150

createOrbitControls()
initLights()
renderer.setClearColor(0x7ec0ee)

camera.position.set(0, 50, 200)

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, 0x101018))

for (let i = 0; i < size; i++) {
  const building = createBuilding()
  building.position.x = randomInRange(-size, size)
  building.position.z = randomInRange(-size, size)
  scene.add(building)
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
