import * as THREE from '/node_modules/three/build/three.module.js'
import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { FilmPass } from '/node_modules/three/examples/jsm/postprocessing/FilmPass.js'
import { BloomPass } from '/node_modules/three/examples/jsm/postprocessing/BloomPass.js'

let container
let camera, scene, renderer, composer, clock
let uniforms, mesh

container = document.getElementById('container')
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 3000)
camera.position.z = 4
scene = new THREE.Scene()
clock = new THREE.Clock()

const textureLoader = new THREE.TextureLoader()
uniforms = {
  'fogDensity': { value: 0.45 },
  'fogColor': { value: new THREE.Vector3(0, 0, 0) },
  'time': { value: 1.0 },
  'uvScale': { value: new THREE.Vector2(3.0, 1.0) },
  'texture1': { value: textureLoader.load('/assets/textures/lavacloud.png') },
  'texture2': { value: textureLoader.load('/assets/textures/lavatile.jpg') }
}
uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping
uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping
const size = 0.65
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
})
mesh = new THREE.Mesh(new THREE.TorusBufferGeometry(size, 0.3, 30, 30), material)
mesh.rotation.x = 0.3
scene.add(mesh)

renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)
renderer.autoClear = false

const renderModel = new RenderPass(scene, camera)
const effectBloom = new BloomPass(1.25)
const effectFilm = new FilmPass(0.35, 0.95, 2048, false)

composer = new EffectComposer(renderer)
composer.addPass(renderModel)
composer.addPass(effectBloom)
composer.addPass(effectFilm)

onWindowResize()
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = 5 * clock.getDelta()
  uniforms.time.value += 0.2 * delta
  mesh.rotation.y += 0.0125 * delta
  mesh.rotation.x += 0.05 * delta
  renderer.clear()
  composer.render(0.01)
}()