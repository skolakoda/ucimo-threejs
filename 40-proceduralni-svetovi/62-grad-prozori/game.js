import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange, randomInCircle, createFloor } from '/utils/helpers.js'
import { createBuilding } from '/utils/building.js'

const size = 150
const numBuildings = 200

createOrbitControls()
createStreetLights() // TODO: add size param
camera.position.set(0, 50, 200)

const floor = createFloor({ size })
floor.position.set(0, 0, 0)
scene.add(floor)

for (let i = 0; i < numBuildings; i++) {
  const building = createBuilding()
  const { x, z } = randomInCircle(size * .9)
  building.position.x = x
  building.position.z = z
  building.rotation.y = Math.random()
  scene.add(building)
}

// TODO: move to helpers
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
