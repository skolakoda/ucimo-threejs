import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()

const geometry = new THREE.Geometry()

for (let i = 0;i < 6000;i++) {
  const star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  )
  geometry.vertices.push(star)
}

const material = new THREE.PointsMaterial({
  map: new THREE.TextureLoader().load('star.png')
})

const stars = new THREE.Points(geometry, material)
scene.add(stars)

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
