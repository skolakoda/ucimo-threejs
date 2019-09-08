import * as THREE from '/node_modules/three/build/three.module.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {scene, camera, renderer, createOrbitControls, addLights} from '/utils/scene.js'

scene.background = new THREE.Color('lightblue')
camera.position.set(1, .2, 0)

addLights()
createOrbitControls()

addGround()
loadScene()

/* FUNCTIONS */

function loadScene() {
  // http://www.turbosquid.com/Search/Artists/ERLHN
  const loader = new ColladaLoader()
  loader.load('/assets/models/ruins/Ruins_dae.dae', data => {
    scene.add(data.scene)
  })
}

function addGround() {
  const material = new THREE.MeshPhongMaterial({color: 0x555555})
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1024, 1024, 32, 32), material)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
}

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  renderer.render(scene, camera)
}()
