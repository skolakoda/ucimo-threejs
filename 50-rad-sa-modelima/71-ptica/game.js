import * as THREE from '/node_modules/three/build/three.module.js'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, clock, initLights, createOrbitControls } from '/utils/scene.js'

const loader = new GLTFLoader()
let mixer

initLights()
createOrbitControls()

loader.load('/assets/models/ptice/flamingo.glb', data => {
  const {scene: model, animations} = data
  model.scale.set(.4, .4, .4)
  mixer = new THREE.AnimationMixer(model)
  const action = mixer.clipAction(animations[0])
  action.play()
  scene.add(model)
})

/* LOOP */

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
})
