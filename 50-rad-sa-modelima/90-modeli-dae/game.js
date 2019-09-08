import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {scene, camera, renderer, createOrbitControls, addLights} from '/utils/scene.js'

let currentId

addLights()
createOrbitControls()
camera.position.set(-6, 2, 9)

loadModel(document.querySelector('#izaberi-model').value)

/** FUNCTIONS **/

function loadModel(file) {
  const loader = new ColladaLoader()
  loader.load(`/assets/models/${file}`, collada => {
    scene.remove(scene.getObjectById(currentId))
    const model = collada.scene
    scene.add(model)
    currentId = model.id
  })
}

/** EVENTS **/

document.querySelector('#izaberi-model').addEventListener('change', e => {
  loadModel(e.target.value)
})

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
