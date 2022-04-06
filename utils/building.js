import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

function createWindow(wWidth, wHeight) {
  const color = Math.random() > 0.7 ? 0x000000 : 0xffff00
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color })
  const geometry = new THREE.PlaneGeometry(wWidth, wHeight)
  const window = new THREE.Mesh(geometry, material)
  return window
}

function createWindows(building, bWidth, bHeight) {
  const windows = new THREE.Group()

  const createSideWindows = setPosition => {
    const wWidth = bWidth / 8
    const wHeight = bHeight / 8
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < bHeight / wHeight / 2; j++) {
        const win = createWindow(wWidth, wHeight)
        const currPos = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
        setPosition(win, currPos)
        win.position.y = bHeight / 8 + j * wHeight * 2
        windows.add(win)
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

export function createBuilding({ textured = true } = {}) {
  const bWidth = randomInRange(10, 20, true)
  const bHeight = randomInRange(bWidth, bWidth * 4, true)

  const geometry = new THREE.BoxGeometry(bWidth, bHeight, bWidth)
  geometry.faces.splice(6, 2) // remove bottom for optimization

  const TEXTURE_SIZE = 16
  const texture = Math.random() > 0.2 ? 'gray-bricks.jpg' : 'bricks.jpg'
  const map = new THREE.TextureLoader().load(`/assets/textures/${texture}`)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(bWidth / TEXTURE_SIZE, bHeight / TEXTURE_SIZE)

  const params = textured ? { map } : { color: 0x000000 }
  const material = new THREE.MeshStandardMaterial(params)
  const building = new THREE.Mesh(geometry, material)
  building.position.set(0, bHeight / 2, 0)

  const group = new THREE.Group()
  group.add(building)
  const windows = createWindows(building, bWidth, bHeight)
  group.add(windows)
  group.rotation.y = Math.random()
  return group
}
