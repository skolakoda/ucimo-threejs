import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInSquare, createFloor } from '/utils/helpers.js'
import { createLamppost, createCityLights } from '/utils/streetlights.js'
import { createBuilding } from '/utils/city.js'

const numLampposts = 12 // max num of lights is 16
const numCityLights = 16 - numLampposts

const size = 400
const numBuildings = 200

camera.position.set(0, size * .3, size * .4)
createOrbitControls()
renderer.setClearColor(0x070b34)

const streetLights = createCityLights({ size, numLights: numCityLights })
scene.add(streetLights)

scene.add(createFloor({ size: size * 1.2, circle: false, color: 0x101018 }))

for (let i = 0; i < numLampposts; i++) {
  const { x, z } = randomInSquare(size)
  const lamppost = createLamppost({ x, z })
  scene.add(lamppost)
}

const cityGeometry = new THREE.Geometry()
for (let i = 0; i < numBuildings; i++) {
  const { x, z } = randomInSquare(size)
  const rotY = Math.random() > .9 ? Math.random() : 0
  const building = createBuilding({ x, z, rotY })
  cityGeometry.merge(building.geometry, building.matrix)
}
const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
const city = new THREE.Mesh(cityGeometry, material)
scene.add(city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()