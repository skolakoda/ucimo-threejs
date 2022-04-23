/* global dat */
// https://threejs.org/examples/#webgl_lights_spotlight
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'

const gui = new dat.GUI()

camera.position.set(160, 40, 10)

createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

const spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(15, 40, 35)
spotLight.angle = Math.PI / 4
spotLight.penumbra = 0.1
spotLight.decay = 2
spotLight.distance = 200

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 512
spotLight.shadow.mapSize.height = 512
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 200
spotLight.shadow.focus = 1
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
  const params = {
    'light color': spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay,
    focus: spotLight.shadow.focus
  }

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

  gui.add(params, 'focus', 0, 1).onChange(val => {
    spotLight.shadow.focus = val
  })
  gui.open()
}

buildGui()

void function animate() {
  requestAnimationFrame(animate)
  shadowHelper.update()
  renderer.render(scene, camera)
}()