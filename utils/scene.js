import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xe0e0e0)

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 50
camera.lookAt(scene.position)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.gammaInput = true
renderer.gammaOutput = true
document.body.style.margin = 0
document.body.appendChild(renderer.domElement)
renderer.domElement.focus()

export const clock = new THREE.Clock()

/* FUNCTIONS */

export function createOrbitControls() {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1
  // controls.maxDistance = 20
  controls.zoomSpeed = .3
  controls.enableKeys = false
  return controls
}

export function initLights(theScene = scene, position = new THREE.Vector3(-10, 30, 40)) {
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.copy(position)
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.fov = 15
  spotLight.castShadow = true
  spotLight.decay = 2
  spotLight.penumbra = 0.05
  spotLight.name = 'spotLight'
  theScene.add(spotLight)

  const ambientLight = new THREE.AmbientLight(0x343434)
  ambientLight.name = 'ambientLight'
  theScene.add(ambientLight)
}

export function addLights(theScene = scene) {
  const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25)
  theScene.add(light)
}

