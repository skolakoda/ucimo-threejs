import { scene, camera, renderer, createOrbitControls, createStreetLights } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'
import { createBuilding } from '/utils/building.js'

const size = 200
const numBuildings = 200

createOrbitControls()
// TODO: srediti svetla
scene.add(createStreetLights({ size, numLights: numBuildings / 10 }))
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

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
