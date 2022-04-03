import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { Cloud } from './Cloud.js'

createOrbitControls()

renderer.setClearColor(0x7ec0ee)
camera.position.z = 2

const cloudCount = 10
const clouds = []
const range = 5
const angl = Math.PI / 2
const speed = 1.0

for (let i = 0; i < cloudCount; i++) {
  const cloud = new Cloud()
  cloud.position.set(randomInRange(-range, range), randomInRange(-range, range), randomInRange(-range, range))
  cloud.rotation.set(randomInRange(-angl, angl), randomInRange(-angl, angl), randomInRange(-angl, angl))

  const scale = 2.0 + Math.random() * 6
  cloud.scale.set(scale, scale, scale)

  scene.add(cloud)
  clouds.push(cloud)
}

void function loop() {
  requestAnimationFrame(loop)
  const t = clock.getElapsedTime() * speed
  for (let i = 0, n = clouds.length; i < n; i++) {
    const cloud = clouds[i]
    cloud.update(t)
  }
  renderer.render(scene, camera)
}()
