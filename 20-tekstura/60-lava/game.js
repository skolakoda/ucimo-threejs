import * as THREE from '/node_modules/three/build/three.module.js'
import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { FilmPass } from '/node_modules/three/examples/jsm/postprocessing/FilmPass.js'
import { BloomPass } from '/node_modules/three/examples/jsm/postprocessing/BloomPass.js'

import {camera, scene, renderer, clock, createOrbitControls} from '/utils/scene.js'

camera.position.z = 2
renderer.autoClear = false
createOrbitControls()

const textureLoader = new THREE.TextureLoader()
const uniforms = {
  'fogDensity': { value: 0.55 },
  'fogColor': { value: new THREE.Vector3(0, 0, 0) },
  'time': { value: 1.0 },
  'uvScale': { value: new THREE.Vector2(3.0, 1.0) },
  'texture1': { value: textureLoader.load('/assets/textures/lavacloud.png') },
  'texture2': { value: textureLoader.load('/assets/textures/lavatile.jpg') }
}
uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping
uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
})

const mesh = new THREE.Mesh(new THREE.TorusBufferGeometry(0.65, 0.3, 30, 30), material)
scene.add(mesh)

const composer = new EffectComposer(renderer)
const renderModel = new RenderPass(scene, camera)
const effectBloom = new BloomPass(1.25)
const effectFilm = new FilmPass(0.35, 0.95, 2048, false)
composer.addPass(renderModel)
composer.addPass(effectBloom)
composer.addPass(effectFilm)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  uniforms.time.value += 0.4 * delta
  renderer.clear()
  composer.render(0.01)
}()