import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'

const starGeo = new THREE.Geometry()

for (let i = 0;i < 6000;i++) {
  const star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  )
  star.velocity = 0
  star.acceleration = 0.02
  starGeo.vertices.push(star)
}

const sprite = new THREE.TextureLoader().load('star.png')
const starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite
})

const stars = new THREE.Points(starGeo, starMaterial)
scene.add(stars)

animate()

function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
