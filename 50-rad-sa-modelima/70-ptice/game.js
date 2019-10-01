import * as THREE from '/node_modules/three/build/three.module.js'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, clock, initLights, createOrbitControls } from '/utils/scene.js'

const mixers = []

initLights()
loadModels()
createOrbitControls()

scene.background = new THREE.Color(0x8FBCD4)

function loadModels() {
  const loader = new GLTFLoader()
  const onLoad = (data, position) => {
    const model = data.scene
    model.position.copy(position)
    model.scale.set(.4, .4, .4)
    const animation = data.animations[0]
    const mixer = new THREE.AnimationMixer(model)
    mixers.push(mixer)
    const action = mixer.clipAction(animation)
    action.play()
    scene.add(model)
  }

  loader.load('/assets/models/ptice/parrot.glb', data => onLoad(data, new THREE.Vector3(0, 1.5, 0)))

  loader.load('/assets/models/ptice/flamingo.glb', data => onLoad(data, new THREE.Vector3(25, 0, -10)))

  loader.load('/assets/models/ptice/stork.glb', data => onLoad(data, new THREE.Vector3(-25, 0, -10)))
}

/* LOOP */

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta()
  for (const mixer of mixers) mixer.update(delta)
  renderer.render(scene, camera)
})
