import * as THREE from '/node_modules/three/build/three.module.js'
import {scene, camera, renderer, initLights} from '/utils/scene.js'

const rainCount = 15000
const rainGeo = new THREE.Geometry()

for (let i = 0; i < rainCount; i++) {
  const rainDrop = new THREE.Vector3(
    Math.random() * 400 - 200,
    Math.random() * 500 - 250,
    Math.random() * 400 - 200
  )
  rainDrop.velocity = 0
  rainGeo.vertices.push(rainDrop)
}

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
  transparent: true
})

const rain = new THREE.Points(rainGeo, rainMaterial)
scene.add(rain)

/* LOOP */

void function animate() {
  rainGeo.vertices.forEach(p => {
    p.velocity = Math.random() * 0.1
    p.y += p.velocity
    if (p.y < -200) {
      p.y = 200
      p.velocity = 0
    }
  })
  rainGeo.verticesNeedUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()