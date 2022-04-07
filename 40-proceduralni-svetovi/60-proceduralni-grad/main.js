import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'

addLights()
createOrbitControls()
camera.position.y = 80
scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x101018 }))
plane.rotation.x = -90 * Math.PI / 180
scene.add(plane)

function generateBuildings(num = 10000) {
  const city = new THREE.Geometry()
  const box = new THREE.CubeGeometry(1, 1, 1)
  box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))
  const building = new THREE.Mesh(box)

  for (let i = 0; i < num; i++) {
    building.position.x = Math.floor(Math.random() * 200 - 100) * 10
    building.position.z = Math.floor(Math.random() * 200 - 100) * 10
    building.rotation.y = Math.random()
    building.scale.x = building.scale.z = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10
    building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8

    building.updateMatrix() // needed for merge
    city.merge(building.geometry, building.matrix)
  }
  return city
}

function generateTexture() {
  // kvadrat bele pozadine
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 32, 64)

  // crno-sive nijanse
  for (let y = 2; y < 64; y += 2)
    for (let x = 0; x < 32; x += 2) {
      const value = Math.floor(Math.random() * 64)
      context.fillStyle = `rgb(${value}, ${value}, ${value})`
      context.fillRect(x, y, 2, 1)
    }

  const canvas2 = document.createElement('canvas')
  canvas2.width = 512
  canvas2.height = 1024
  const context2 = canvas2.getContext('2d')
  context2.imageSmoothingEnabled = false
  context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)
  return canvas2
}

const city = generateBuildings(10000)
const texture = new THREE.Texture(generateTexture())
texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
texture.needsUpdate = true

const cityMesh = new THREE.Mesh(city, new THREE.MeshLambertMaterial({
  map: texture,
  vertexColors: THREE.VertexColors
}))
scene.add(cityMesh)

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
