import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, clock, initLights, createOrbitControls} from '/utils/scene.js'

initLights()
createOrbitControls()

const texture = THREE.ImageUtils.loadTexture('dim.png')
const material = new THREE.MeshLambertMaterial({color: 0x00dddd, map: texture, transparent: true})
const geometry = new THREE.PlaneGeometry(300, 300)
const smokeParticles = []

for (let p = 0; p < 150; p++) {
  const particle = new THREE.Mesh(geometry, material)
  particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100)
  particle.rotation.z = Math.random() * 360
  scene.add(particle)
  smokeParticles.push(particle)
}

function evolveSmoke(delta) {
  smokeParticles.forEach(particle => {
    particle.rotation.z += (delta * 0.2)
  })
}

/* LOOP */

void function animate() {
  const delta = clock.getDelta()
  requestAnimationFrame(animate)
  evolveSmoke(delta)
  renderer.render(scene, camera)
}()