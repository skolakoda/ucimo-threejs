import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const size = 150

createOrbitControls()
camera.position.set(0, 50, 100)
renderer.setClearColor(0x7ec0ee)

function createWindow(wWidth, wHeight) {
  // TODO: random black window
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xffff00 })
  const geometry = new THREE.PlaneGeometry(wWidth, wHeight)
  const window = new THREE.Mesh(geometry, material)
  return window
}

function createWindows(building, bWidth, bHeight) {
  const wWidth = bWidth / 8
  const wHeight = bHeight / 8
  const group = new THREE.Group()

  const createSideWindows = callback => {
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < bHeight / wHeight / 2; j++) {
        const win = createWindow(wWidth, wHeight)
        callback(win, i)
        win.position.y = bHeight / 8 + j * wHeight * 2
        group.add(win)
      }
  }

  createSideWindows((win, i) => {
    win.position.x = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
    win.position.z = building.position.z + bWidth / 2
  })

  createSideWindows((win, i) => {
    win.position.x = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
    win.position.z = building.position.z - bWidth / 2
  })

  createSideWindows((win, i) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z + bWidth / 2
    win.position.z = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
  })

  createSideWindows((win, i) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z - bWidth / 2
    win.position.z = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
  })

  return group
}

function createBuilding(size) {
  const bWidth = randomInRange(10, 20, true)
  const bHeight = randomInRange(bWidth, bWidth * 4, true)

  const geometry = new THREE.CubeGeometry(bWidth, bHeight, bWidth)
  geometry.faces.splice(6, 2) // remove bottom for optimization
  const material = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const building = new THREE.Mesh(geometry, material)
  building.position.set(0, bHeight / 2, 0)

  const group = new THREE.Group()
  group.add(building)
  const windows = createWindows(building, bWidth, bHeight)
  group.add(windows)
  group.rotation.y = Math.random()
  return group
}

scene.add(createBuilding(size))

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
