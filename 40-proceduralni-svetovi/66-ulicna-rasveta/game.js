import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor, randomInRange } from '/utils/helpers.js'

const size = 600, numLights = 10, y = 10

createOrbitControls()
camera.position.set(0, 50, 200)

const floor = createFloor({ size, circle: false })
scene.add(floor)

/**
 * TODO:
 * popraviti svetlo
 * dodati sijalice
 * opcija za kruznu podlogu
 */
for (let i = 0; i < numLights; i++) {
  const spotLight = new THREE.SpotLight(0xF5F5DC)
  const x = randomInRange(-size, size)
  const z = randomInRange(-size, size)
  spotLight.position.set(x, y, z)
  spotLight.lookAt(x, 0, z)
  spotLight.castShadow = true
  scene.add(spotLight)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
