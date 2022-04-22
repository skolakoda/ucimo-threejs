import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'
import { randomInRange, removeTopTexture, generateCityTexture, randomGray, createFloor } from '/utils/helpers.js'

const size = 2000
const numBuildings = 10000

addLights()
createOrbitControls()
camera.position.y = 80

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
renderer.setClearColor(0x7ec0ee)

scene.add(createFloor({ size, circle: false }))
scene.add(generateBuildings(numBuildings))

/* FUNCTIONS */

function createBuilding() {
  const width = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10
  const height = (Math.random() * Math.random() * Math.random() * width) * 8 + 8
  const geometry = new THREE.BoxGeometry(width, height, width)

  removeTopTexture(geometry)
  const color = randomGray({ colorful: .035, max: 1 })
  geometry.faces.forEach(face => {
    face.color = color // set color before merge
  })

  const building = new THREE.Mesh(geometry)
  const halfMap = size / 2
  building.position.set(randomInRange(-halfMap, halfMap), height / 2, randomInRange(-halfMap, halfMap))
  if (Math.random() > .6) building.rotateY(Math.random())
  building.updateMatrix() // needed for merge
  return building
}

function generateBuildings(num) {
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
