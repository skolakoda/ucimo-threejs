import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'
import { createLamppost } from '/utils/streetlights.js'

const numLampposts = 15
const size = 200

camera.position.set(160, 40, 10)
createOrbitControls()

scene.add(createFloor({ size: size * 1.1 }))

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

for (let i = 0; i < numLampposts; i++) {
  const { x, z } = randomInCircle(size)
  const lamppost = createLamppost({ x, z })
  scene.add(lamppost)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()