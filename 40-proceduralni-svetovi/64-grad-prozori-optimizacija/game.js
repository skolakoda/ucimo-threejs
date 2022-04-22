import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange, randomGray, createFloor } from '/utils/helpers.js'

const size = 400
const numBuildings = 1000

createOrbitControls()
createStreetLights()
camera.position.set(0, 50, 200)

scene.add(createFloor({ size: size * 1.5 }))

const cityGeometry = new THREE.Geometry()

for (let i = 0; i < numBuildings; i++) {
  const bWidth = randomInRange(10, 20, true)
  const bHeight = randomInRange(bWidth, bWidth * 4, true)
  const x = randomInRange(-size, size)
  const y = bHeight / 2
  const z = randomInRange(-size, size)
  const rotY = Math.random()

  const building = createBuilding({ bWidth, bHeight, x, y, z, rotY })
  cityGeometry.merge(building.geometry, building.matrix)
  addWindows({ building, bWidth, bHeight, cityGeometry })
}
const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
const city = new THREE.Mesh(cityGeometry, material)
scene.add(city)

/* FUNCTIONS */

// TODO: reuse from helpers
function createBuilding({ bWidth, bHeight, x, y, z, rotY }) {
  const geometry = new THREE.BoxGeometry(bWidth, bHeight, bWidth)
  const color = randomGray({ min: 0, max: .03, colorful: .001 })
  geometry.faces.forEach(face => {
    face.color = color
  })

  const building = new THREE.Mesh(geometry)
  building.position.set(x, y, z)
  // building.rotation.y = rotY // TODO: fix window rotation
  building.updateMatrix()
  return building
}

function createWindow(wWidth, wHeight) {
  const colors = [0xffff00, 0xF5F5DC, 0xFFEA00, 0xFDDA0D, 0xFFFF8F, 0xFFFDD0]
  const lightColor = colors[Math.floor(Math.random() * colors.length)]
  const color = Math.random() > 0.5 ? 0x000000 : lightColor
  const geometry = new THREE.PlaneGeometry(wWidth, wHeight)
  geometry.faces.forEach(face => {
    face.color = new THREE.Color(color)
  })
  const window = new THREE.Mesh(geometry)
  return window
}

function addWindows({ building, bWidth, bHeight, cityGeometry }) {
  const createSideWindows = setPosition => {
    const wWidth = bWidth / 8
    const wHeight = bHeight / 8
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < bHeight / wHeight / 2; j++) {
        const win = createWindow(wWidth, wHeight)
        const currPos = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
        setPosition(win, currPos)
        win.position.y = bHeight / 8 + j * wHeight * 2
        win.updateMatrix()
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
