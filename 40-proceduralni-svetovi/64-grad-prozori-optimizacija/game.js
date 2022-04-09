import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, addLights } from '/utils/scene.js'
import { randomInRange, generateCityTexture, randomGray } from '/utils/helpers.js'

const size = 150

createOrbitControls()
createStreetLights()
camera.position.set(0, 50, 200)

scene.add(createFloor(size * 2, 0x101018))

const cityGeometry = new THREE.Geometry()
for (let i = 0; i < size; i++) {
  const bWidth = randomInRange(10, 20, true)
  const bHeight = randomInRange(bWidth, bWidth * 4, true)

  const building = createBuilding(bWidth, bHeight)
  cityGeometry.merge(building.geometry, building.matrix)
  // spoja prozor
  createWindows(building, bWidth, bHeight, cityGeometry)
}
const texture = generateCityTexture()
const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors })
const city = new THREE.Mesh(cityGeometry, material)
scene.add(city)

/* FUNCTIONS */

function createBuilding(bWidth, bHeight) {
  const geometry = new THREE.BoxGeometry(bWidth, bHeight, bWidth)
  const color = randomGray({ colorful: .35 })
  geometry.faces.forEach(face => {
    face.color = color // set color before merge
  })

  const building = new THREE.Mesh(geometry)
  building.position.set(randomInRange(-size, size), bHeight / 2, randomInRange(-size, size))
  building.rotation.y = Math.random()
  building.updateMatrix() // needed for merge
  return building
}

function createWindow(wWidth, wHeight) {
  const colors = [0xffff00, 0xF5F5DC, 0xFFEA00, 0xFDDA0D, 0xFFFF8F, 0xFFFDD0]
  const lightColor = colors[Math.floor(Math.random() * colors.length)]
  const color = Math.random() > 0.5 ? 0x000000 : lightColor
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color })
  const geometry = new THREE.PlaneGeometry(wWidth, wHeight)
  geometry.faces.forEach(face => {
    face.color = 0xffffff // set color before merge
  })

  const window = new THREE.Mesh(geometry, material)
  window.updateMatrix()
  return window
}

function createWindows(building, bWidth, bHeight, cityGeometry) {

  const createSideWindows = setPosition => {
    const wWidth = bWidth / 8
    const wHeight = bHeight / 8
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < bHeight / wHeight / 2; j++) {
        const win = createWindow(wWidth, wHeight)
        const currPos = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
        setPosition(win, currPos)
        win.position.y = bHeight / 8 + j * wHeight * 2
        cityGeometry.merge(win.geometry, win.matrix)
      }
  }

  createSideWindows((win, currPos) => {
    win.position.x = currPos
    win.position.z = building.position.z + bWidth / 2
  })
  createSideWindows((win, currPos) => {
    win.position.x = currPos
    win.position.z = building.position.z - bWidth / 2
  })
  createSideWindows((win, currPos) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z + bWidth / 2
    win.position.z = currPos
  })
  createSideWindows((win, currPos) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z - bWidth / 2
    win.position.z = currPos
  })
}

// function createBuilding() {
//   const width = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10
//   const height = (Math.random() * Math.random() * Math.random() * width) * 8 + 8
//   const geometry = new THREE.BoxGeometry(width, height, width)

//   const color = randomGray({ colorful: .035, max: 1 })
//   geometry.faces.forEach(face => {
//     face.color = color // set color before merge
//   })

//   const building = new THREE.Mesh(geometry)
//   const halfMap = size / 2
//   building.position.set(randomInRange(-halfMap, halfMap), height / 2, randomInRange(-halfMap, halfMap))
//   if (Math.random() > .6) building.rotateY(Math.random())
//   building.updateMatrix() // needed for merge
//   return building
// }

function createFloor(r = 1000, color = 0x60bf63) {
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

function createStreetLights() {
  for (let i = 0; i < 10; i++) {
    const spotLight = new THREE.SpotLight(0xF5F5DC)
    const x = randomInRange(-size, size)
    const z = randomInRange(-size, size)
    spotLight.position.set(x, 10, z)
    spotLight.lookAt(x, 0, z)
    spotLight.castShadow = true
    scene.add(spotLight)
  }
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
