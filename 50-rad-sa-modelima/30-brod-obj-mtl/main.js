import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import {scene, camera, renderer, createOrbitControls, initLights} from '/utils/scene.js'

camera.position.z = 250

createOrbitControls()
initLights()

const loader = new OBJLoader()
loader.load('/assets/models/BlackPearl/BlackPearl.obj', model => {
  model.position.y = -95
  scene.add(model)
})

/** LOOP **/

const update = () => {
  requestAnimationFrame(update)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}

update()
