import * as THREE from '/node_modules/three108/build/three.module.js'
import { Cloud } from './Cloud.js'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000)

camera.position.z = 2
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 1, 0)
scene.add(light)

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})

renderer.setClearColor(0x7ec0ee)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

const cloudCount = 10
const clouds = []
const range = 10

const rand = function() {
  return Math.random() - 0.5
}

for (let i = 0; i < cloudCount; i++) {
  const cloud = new Cloud()
  cloud.position.set(rand() * range, rand() * range, rand() * range)
  cloud.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI)

  const scale = 2.0 + Math.random() * 6
  cloud.scale.set(scale, scale, scale)

  scene.add(cloud)
  clouds.push(cloud)
}

const speed = 1.0

void function loop() {
  requestAnimationFrame(loop)
  const t = clock.getElapsedTime() * speed
  for (let i = 0, n = clouds.length; i < n; i++) {
    const cloud = clouds[i]
    cloud.update(t)
  }
  renderer.render(scene, camera)
}()
