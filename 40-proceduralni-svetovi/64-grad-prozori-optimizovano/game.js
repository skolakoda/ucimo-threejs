import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange, randomInCircle, randomGray, createFloor } from '/utils/helpers.js'
import { createCityLights } from '/utils/streetlights.js'

const size = 200
const numBuildings = 200

createOrbitControls()
camera.position.set(0, 50, 200)

const streetLights = createCityLights({ size, numLights: 12 })
scene.add(streetLights)

const floor = createFloor({ size })
scene.add(floor)

const cityGeometry = new THREE.Geometry()
for (let i = 0; i < numBuildings; i++) {
  const building = createBuilding()
  const { x, z } = randomInCircle(size * .9)
  building.position.x = x
  building.position.z = z
  building.rotation.y = Math.random()
  building.updateMatrix()
  cityGeometry.merge(building.geometry, building.matrix)
}

const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
const city = new THREE.Mesh(cityGeometry, material)
scene.add(city)

/* FUNCTIONS */

function createWindow(wWidth, wHeight) {
  const colors = [0xffff00, 0xF5F5DC, 0xFFEA00, 0xFDDA0D, 0xFFFF8F, 0xFFFDD0]
  const lightColor = colors[Math.floor(Math.random() * colors.length)]
  const color = Math.random() > 0.5 ? 0x000000 : new THREE.Color(lightColor)
  const geometry = new THREE.PlaneGeometry(wWidth, wHeight)
  geometry.faces.forEach(face => {
    face.color = color
  })
  const window = new THREE.Mesh(geometry)
  return window
}

function createWindows(building, bWidth, bHeight) {
  const windows = new THREE.Geometry()

  const createSideWindows = callback => {
    const wWidth = bWidth / 8
    const wHeight = bHeight / 8
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < bHeight / wHeight / 2; j++) {
        const win = createWindow(wWidth, wHeight)
        const currPos = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
        callback(win, currPos)
        win.position.y = -bHeight * 3 / 8 + j * wHeight * 2
        win.updateMatrix()
        windows.merge(win.geometry, win.matrix)
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
  return windows
}

export function createBuilding() {
  const bWidth = randomInRange(10, 20, true)
  const bHeight = randomInRange(bWidth, bWidth * 4, true)

  const geometry = new THREE.BoxGeometry(bWidth, bHeight, bWidth)
  const color = randomGray({ min: 0, max: .1, colorful: .1 })
  geometry.faces.forEach(face => {
    face.color = color
  })
  const building = new THREE.Mesh(geometry)
  building.position.set(0, bHeight / 2, 0)

  const windows = createWindows(building, bWidth, bHeight)
  building.geometry.merge(windows)
  return building
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
