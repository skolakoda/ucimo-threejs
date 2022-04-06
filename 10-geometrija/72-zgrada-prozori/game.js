import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'
import { createBuilding } from '/utils/building.js'

initLights()

createOrbitControls()
camera.position.set(0, 50, 100)
renderer.setClearColor(0x7ec0ee)

scene.add(createBuilding())

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
