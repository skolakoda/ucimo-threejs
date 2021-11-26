import * as THREE from '/node_modules/three108/build/three.module.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()
let mixer, a = 0
let prevTime = Date.now()

const light = new THREE.DirectionalLight(0xefefff, 1.5)
light.position.set(1, 1, 1).normalize()
scene.add(light)

const loader = new GLTFLoader()
loader.load('/assets/models/monster/glTF-Binary/Monster.glb', ({ scene: mesh, animations }) => {
  scene.add(mesh)
  mixer = new THREE.AnimationMixer(mesh)
  mixer.clipAction(animations[2]).play()

  document.addEventListener('click', () => {
    const animation = animations[++a % animations.length]
    mixer.clipAction(animation).play()
  })
})

function render() {
  if (mixer) {
    const time = Date.now()
    mixer.update((time - prevTime) * 0.001)
    prevTime = time
  }
  renderer.render(scene, camera)
}

void function animate() {
  requestAnimationFrame(animate)
  render()
}()
