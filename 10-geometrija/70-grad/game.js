import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import {randomInRange} from '/utils/helpers.js'

const size = 100

createOrbitControls()
camera.position.set(0, 50, 200)

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, 0x101018))

for (let i = 0; i < size; i++)
  scene.add(generateBuilding(size))

/* FUNCTIONS */

export function generateBuilding(size) {
  const geometry = new THREE.CubeGeometry(1, 1, 1)
  geometry.faces.splice(6, 2) // remove bottom for optimization
  const material = new THREE.MeshLambertMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.y = Math.random()
  mesh.scale.x = mesh.scale.z = randomInRange(10, 20)
  const scaleY = Math.random() * mesh.scale.x * 4 + 4
  mesh.scale.y = scaleY
  mesh.position.set(randomInRange(-size, size), scaleY / 2, randomInRange(-size, size))
  return mesh
}

export function createFloor(r = 1000, color = 0x60bf63) {
  const material = new THREE.MeshBasicMaterial({color})
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  return new THREE.Mesh(geometry, material)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
