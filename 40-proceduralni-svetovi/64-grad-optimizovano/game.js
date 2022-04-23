import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, randomGray, createFloor } from '/utils/helpers.js'
import { createCityLights } from '/utils/streetlights.js'
import { createBuilding } from '/utils/city.js'

const size = 200
const numBuildings = 200

const controls = createOrbitControls()
camera.position.set(0, size * .5, size)

const streetLights = createCityLights({ size, numLights: 12 })
scene.add(streetLights)

const floor = createFloor({ size })
scene.add(floor)

const cityGeometry = new THREE.Geometry()
for (let i = 0; i < numBuildings; i++) {
  const color = randomGray({ min: 0, max: .1, colorful: .1 })
  const building = createBuilding({ color })
  const { x, z } = randomInCircle(size * .9)
  building.position.x = x
  building.position.z = z
  building.rotation.y = Math.random()
  building.updateMatrix()
  cityGeometry.merge(building.geometry, building.matrix)
}
const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
const city = new THREE.Mesh(cityGeometry, material)
scene.add(city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
