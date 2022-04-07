import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { createBuilding } from '/utils/building.js'

const size = 150

createOrbitControls()
createStreetLights()
camera.position.set(0, 50, 200)

scene.add(createFloor(size * 2, 0x101018))

for (let i = 0; i < size; i++) {
  const building = createBuilding()
  building.position.x = randomInRange(-size, size)
  building.position.z = randomInRange(-size, size)
  scene.add(building)
}

function createFloor(r = 1000, color = 0x60bf63) {
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

function createStreetLights() {
  for (let i = 0; i < 10; i++) {
    const spotLight = new THREE.SpotLight(0xF5F5DC)
    const x = randomInRange(-size, size)
    const z = randomInRange(-size, size)
    spotLight.position.set(x, 10, z)
    spotLight.lookAt(x, 0, z)
    spotLight.castShadow = true
    scene.add(spotLight)
  }
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
