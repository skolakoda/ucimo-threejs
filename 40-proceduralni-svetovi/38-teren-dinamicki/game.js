/* global dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import {
  mlib, terrain, quadTarget, uniformsNoise, uniformsTerrain, heightMap, normalMap
} from './shader-config.js'

const { innerWidth, innerHeight } = window
let animDelta = 0
const animDeltaDir = -1

// RENDER TARGET
const sceneRenderTarget = new THREE.Scene()
const cameraOrtho = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / -2, -10000, 10000)
cameraOrtho.position.z = 100

createOrbitControls()
camera.position.set(-1200, 800, 1200)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

sceneRenderTarget.add(quadTarget)
scene.add(terrain)

// GUI
const gui = new dat.GUI()
const controller = { x: 5, y: 5 }
gui.add(controller, 'x', -20, 20).name('x')
gui.add(controller, 'y', -20, 20).name('y')

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  // TODO: pomerati u odnosu na igraca
  animDelta = THREE.Math.clamp(animDelta + 0.00075 * animDeltaDir, 0, 0.05)
  uniformsNoise.time.value += animDelta
  uniformsNoise.offset.value.x += controller.x * 0.0005
  uniformsTerrain.uOffset.value.x = 4 * uniformsNoise.offset.value.x
  uniformsNoise.offset.value.y += controller.y * 0.0005
  uniformsTerrain.uOffset.value.y = 4 * uniformsNoise.offset.value.y
  // renda teren
  quadTarget.material = mlib.heightmap
  renderer.setRenderTarget(heightMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  quadTarget.material = mlib.normal
  renderer.setRenderTarget(normalMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}()