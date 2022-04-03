import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock, initLights, createOrbitControls } from '/utils/scene.js'

initLights()
createOrbitControls()

function createSmoke() {
  const group = new THREE.Group()
  const texture = THREE.ImageUtils.loadTexture('dim.png')
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff, map: texture, transparent: true })
  const geometry = new THREE.PlaneGeometry(300, 300)

  for (let p = 0; p < 150; p++) {
    const particle = new THREE.Mesh(geometry, material)
    particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100)
    particle.rotation.z = Math.random() * 360
    group.add(particle)
  }
  return group
}

function updateSmoke(group, delta) {
  group.children.forEach(p => {
    p.rotation.z += (delta * 0.2)
  })
}

const smoke = createSmoke()
scene.add(smoke)

/* LOOP */

void function animate() {
  const delta = clock.getDelta()
  requestAnimationFrame(animate)
  updateSmoke(smoke, delta)
  renderer.render(scene, camera)
}()