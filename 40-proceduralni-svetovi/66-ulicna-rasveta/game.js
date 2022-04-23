// https://threejs.org/examples/#webgl_lights_spotlight
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, randomInRange, createFloor } from '/utils/helpers.js'

const numLampposts = 15
const size = 200

camera.position.set(160, 40, 10)
createOrbitControls()

scene.add(createFloor({ size: size * 1.1 }))

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

for (let i = 0; i < numLampposts; i++) {
  const { x, z } = randomInCircle(size)
  const lamppost = createLamppost({ x, z })
  scene.add(lamppost)
}

/* FUNCTIONS */

function createLamppost({ x, z, height = 40 } = {}) {
  const group = new THREE.Group()

  const sphereGeometry = new THREE.SphereGeometry(2, 12, 16)
  const colors = [0xF5F5DC, 0xdceff5, 0xFFFF8F, 0xFFFDD0]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const sphereMaterial = new THREE.MeshBasicMaterial({ color })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(x, height, z)
  group.add(sphere)

  const cylinderGeometry = new THREE.CylinderGeometry(.5, .5, height, 6)
  const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x242731 })
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  cylinder.position.set(x, height * .5, z)
  cylinder.receiveShadow = true
  group.add(cylinder)

  const lamppost = new THREE.SpotLight(color)
  lamppost.position.set(x, height, z)
  lamppost.target.position.set(x, 0, z)
  lamppost.target.updateMatrixWorld()

  lamppost.angle = randomInRange(Math.PI / 6, Math.PI / 3)
  lamppost.intensity = randomInRange(.5, 2) // 1.8 // 0-2
  lamppost.penumbra = 0.5
  lamppost.distance = height * 2

  lamppost.castShadow = true
  group.add(lamppost)

  return group
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()