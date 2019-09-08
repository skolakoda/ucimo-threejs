import * as THREE from '/node_modules/three/build/three.module.js'
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import {scene, camera, renderer, createOrbitControls, addLights} from '/utils/scene.js'

addLights()
createOrbitControls()
camera.position.set(-2, 6, 20)

const texture = new THREE.TextureLoader().load('/assets/textures/crate.gif')

const loader = new OBJLoader()
loader.load('/assets/models/carobni-zamak.obj', model => {
  model.traverse(child => {
    if (child instanceof THREE.Mesh) child.material.map = texture
  })
  scene.add(model)
})

/** LOOP **/

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
