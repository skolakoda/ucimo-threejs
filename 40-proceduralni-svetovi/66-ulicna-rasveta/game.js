// https://threejs.org/examples/#webgl_lights_spotlight
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'

const params = {
  color: 0xdceff5,
  x:0,
  z:0,
}

camera.position.set(160, 40, 10)
createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

const spotLight = new THREE.SpotLight(params.color)
spotLight.position.set(params.x, 40, params.z)
spotLight.lookAt(params.x, 0, params.z)

spotLight.angle = Math.PI / 6
spotLight.intensity = .8 // 0-2
spotLight.penumbra = 0.3
spotLight.distance = 200

spotLight.castShadow = true
scene.add(spotLight)

const shadowHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(shadowHelper)

scene.add(createFloor())

void function animate() {
  requestAnimationFrame(animate)
  shadowHelper.update()
  renderer.render(scene, camera)
}()