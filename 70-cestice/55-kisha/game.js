import * as THREE from '/node_modules/three/build/three.module.js'
import {scene, camera, renderer, createOrbitControls} from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const dropsNum = 1000
const rain = []

createOrbitControls()

for (let i = 0; i < dropsNum; i++) {
  const geometry = new THREE.SphereGeometry(5)
  const material = new THREE.MeshBasicMaterial({
    color: 0x9999ff,
    transparent: true,
    opacity: 0.6
  })
  const drop = new THREE.Mesh(geometry, material)
  drop.position.x = Math.random() * 1000 - 500
  drop.position.y = Math.random() * 1000 - 500
  drop.position.z = Math.random() * 1000 - 500
  drop.velocity = randomInRange(5, 10)
  drop.scale.x = drop.scale.z = 0.1
  scene.add(drop)
  rain.push(drop)
}

function animateRain() {
  rain.forEach(drop => {
    drop.position.y -= drop.velocity
    if (drop.position.y < -100) drop.position.y += 1000
  })
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  animateRain()
}()
