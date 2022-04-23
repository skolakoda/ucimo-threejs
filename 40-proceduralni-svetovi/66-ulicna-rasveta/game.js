/* global dat */
// https://threejs.org/examples/#webgl_lights_spotlight
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'

const params = {
  'light color': 0xF5F5DC, // spotLight.color.getHex(),
  intensity: 1, // 0-2 spotLight.intensity,
  distance: 200, // spotLight.distance,
  angle: Math.PI / 4, // spotLight.angle,
  penumbra: 0.4, // spotLight.penumbra,
  decay: 2, // spotLight.decay,
}

const gui = new dat.GUI()

camera.position.set(160, 40, 10)

createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

const spotLight = new THREE.SpotLight(params.color, 1)
spotLight.position.set(15, 40, 35)
spotLight.angle = params.angle
spotLight.penumbra = params.penumbra
spotLight.decay = params.decay
spotLight.distance = params.distance

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 512
spotLight.shadow.mapSize.height = 512
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 200
scene.add(spotLight)

const shadowHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(shadowHelper)

const material = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
const geometry = new THREE.PlaneGeometry(2000, 2000)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, - 1, 0)
mesh.rotation.x = - Math.PI * 0.5
mesh.receiveShadow = true
scene.add(mesh)

function buildGui() {
  gui.addColor(params, 'light color').onChange(val => {
    spotLight.color.setHex(val)
  })
  gui.add(params, 'intensity', 0, 2).onChange(val => {
    spotLight.intensity = val
  })
  gui.add(params, 'distance', 50, 200).onChange(val => {
    spotLight.distance = val
  })
  gui.add(params, 'angle', 0, Math.PI / 3).onChange(val => {
    spotLight.angle = val
  })
  gui.add(params, 'penumbra', 0, 1).onChange(val => {
    spotLight.penumbra = val
  })
  gui.add(params, 'decay', 1, 2).onChange(val => {
    spotLight.decay = val
  })
  gui.open()
}

buildGui()

void function animate() {
  requestAnimationFrame(animate)
  shadowHelper.update()
  renderer.render(scene, camera)
}()