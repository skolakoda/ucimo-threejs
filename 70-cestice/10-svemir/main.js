import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()

const geometry = new THREE.Geometry()
const radiusMin = 500
const radius = 2000

for (let i = 0; i < 10000; i++) {
  const direction = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
  const distance = Math.random() * radius + radiusMin
  const position = direction.multiplyScalar(distance)
  geometry.vertices.push(position)
}

const material = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  transparent: true,
  map: new THREE.TextureLoader().load('star.png')
})

const stars = new THREE.Points(geometry, material)
scene.add(stars)

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
