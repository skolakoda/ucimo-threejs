import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange, randomColor, randomInCircle, randomInSquare, removeTopTexture } from '/utils/helpers.js'

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

export function createBuilding({
  x = 0,
  z = 0,
  color = new THREE.Color(0x000000),
  bWidth = randomInRange(10, 20, true),
  bHeight = randomInRange(bWidth, bWidth * 4, true),
  y = bHeight * .5,
  addWindows = true,
  rotY = 0,
} = {}) {
  const geometry = new THREE.BoxGeometry(bWidth, bHeight, bWidth)
  removeTopTexture(geometry)
  geometry.faces.forEach(face => {
    face.color = color
  })
  const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
  const building = new THREE.Mesh(geometry, material)
  if (addWindows) building.geometry.merge(createWindows(building, bWidth, bHeight))
  building.position.set(x, y, z)
  if (rotY) building.rotateY(rotY)
  building.updateMatrix() // needed for merge
  return building
}

export function createCity({ numBuildings = 200, size = 200, circle = true, colorful = false, rotPercent = 0 } = {}) {
  const cityGeometry = new THREE.Geometry()
  for (let i = 0; i < numBuildings; i++) {
    const color = colorful ? randomColor({ min: 0, max: .1, colorful: .1 }) : new THREE.Color(0x000000)
    const { x, z } = circle ? randomInCircle(size * .9) : randomInSquare(size)
    const rotY = Math.random() > rotPercent ? Math.random() * Math.PI : 0
    const building = createBuilding({ color, x, z, rotY })
    cityGeometry.merge(building.geometry, building.matrix)
  }
  const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
  const city = new THREE.Mesh(cityGeometry, material)
  return city
}

export function generateCityTexture() {
  // beli kvadrat
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

  const texture = new THREE.Texture(canvas2)
  texture.needsUpdate = true
  return texture
}
