import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'
import { createBuilding } from '/utils/building.js'
import { createCityLights } from '/utils/streetlights.js'

const size = 200
const numBuildings = 200

createOrbitControls()
scene.add(createCityLights({ size, numLights: 10 }))
camera.position.set(0, 50, 200)

const floor = createFloor({ size })
scene.add(floor)

for (let i = 0; i < numBuildings; i++) {
  const building = createBuilding()
  const { x, z } = randomInCircle(size * .9)
  building.position.x = x
  building.position.z = z
  building.rotation.y = Math.random()
  scene.add(building)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
