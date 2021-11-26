/* global dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import {
  mlib, terrain, quadTarget, uniformsNoise, uniformsTerrain, heightMap, normalMap, cameraOrtho
} from './shader-config.js'

let animDelta = 0

// RENDER TARGET
const sceneRenderTarget = new THREE.Scene()

createOrbitControls()
camera.position.set(-1200, 800, 1200)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

sceneRenderTarget.add(quadTarget)
scene.add(terrain)

// TODO: pomerati u odnosu na igraca
const gui = new dat.GUI()
const position = { x: 2, y: 2 }
gui.add(position, 'x', -20, 20).name('x')
gui.add(position, 'y', -20, 20).name('y')

function updateTerrain(pos) {
  animDelta = THREE.Math.clamp(animDelta, 0, 0.05)
  uniformsNoise.time.value += animDelta
  uniformsNoise.offset.value.x += pos.x * 0.0005
  uniformsTerrain.uOffset.value.x = 4 * uniformsNoise.offset.value.x
  uniformsNoise.offset.value.y += pos.y * 0.0005
  uniformsTerrain.uOffset.value.y = 4 * uniformsNoise.offset.value.y
}

function renderTerrain() {
  quadTarget.material = mlib.heightmap
  renderer.setRenderTarget(heightMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  quadTarget.material = mlib.normal
  renderer.setRenderTarget(normalMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  renderer.setRenderTarget(null)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  updateTerrain(position)
  renderTerrain()
  renderer.render(scene, camera)
}()