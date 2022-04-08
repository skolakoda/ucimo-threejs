import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'
import { removeTopTexture, generateCityTexture, randomGray } from '/utils/helpers.js'

addLights()
createOrbitControls()
camera.position.y = 80
scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
renderer.setClearColor(0x7ec0ee)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x101018 }))
plane.rotation.x = -90 * Math.PI / 180
scene.add(plane)

const city = generateBuildings(10000)
scene.add(city)

function createBuilding() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))
  removeTopTexture(geometry)
  const color = randomGray({ colorful: .035, max: 1 })
  geometry.faces.forEach(face => {
    face.color = color // set color before merge
  })

  const building = new THREE.Mesh(geometry)
  building.position.x = Math.floor(Math.random() * 200 - 100) * 10
  building.position.z = Math.floor(Math.random() * 200 - 100) * 10
  building.rotation.y = Math.random()
  building.scale.x = building.scale.z = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10
  building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8

  building.updateMatrix() // needed for merge
  return building
}

function generateBuildings(num = 10000) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const building = createBuilding()
    geometry.merge(building.geometry, building.matrix)
  }
  const texture = generateCityTexture()
  const material = new THREE.MeshLambertMaterial({ map: texture, vertexColors: THREE.FaceColors })
  return new THREE.Mesh(geometry, material)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
