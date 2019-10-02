import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, clock, initLights, createOrbitControls } from '/utils/scene.js'
import Bird from './classes/creatures/Bird2.js'

const loader = new GLTFLoader()
const birds = []

initLights()
createOrbitControls()

loader.load('/assets/models/ptice/flamingo.glb', model => {
  const bird1 = new Bird(model)
  const bird2 = new Bird(model)

  scene.add(bird1.mesh)
  birds.push(bird1)

  scene.add(bird2.mesh)
  birds.push(bird2)
})

/* LOOP */

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta()
  birds.forEach(bird => {
    if (birds) bird.update(delta)
  })
  renderer.render(scene, camera)
})
