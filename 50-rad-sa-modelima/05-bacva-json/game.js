/* global THREE */
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'

addLights()
createOrbitControls()

const textureLoader = new THREE.TextureLoader()

camera.position.set(1, 1, 1)
camera.lookAt(new THREE.Vector3(0, 0.4, 0))

// commercial textures from http://gametextures.com/
const map = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25480/Misc_WoodBarrelOldMold_2k_d.jpg')
const specularMap = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25480/Misc_WoodBarrelOldMold_2k_s.jpg')
const normalMap = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25480/Misc_WoodBarrelOldMold_2k_n.jpg')
const material = new THREE.MeshPhongMaterial({
  map,
  normalMap,
  specularMap,
  specular: 0xffffff,
  shininess: 10,
})

const loader = new THREE.LegacyJSONLoader()
loader.load('/assets/models/barrel.js', geometry => {
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
