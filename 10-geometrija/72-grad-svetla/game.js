import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const size = 150

createOrbitControls()
camera.position.set(0, 50, 100)
renderer.setClearColor(0x7ec0ee)

function createWindow({ width, height }) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xffff00 })
  const geometry = new THREE.PlaneGeometry(width, height)
  const window = new THREE.Mesh(geometry, material)
  return window
}

function createBuilding(size) {
  const width = randomInRange(10, 20)
  const height = randomInRange(width, width * 4)
  const geometry = new THREE.CubeGeometry(width, height, width)
  geometry.faces.splice(6, 2) // remove bottom for optimization

  const material = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const mesh = new THREE.Mesh(geometry, material)

  mesh.position.set(0, height / 2, 0)
  // mesh.rotation.y = Math.random()
  // prozor.rotation.y = mesh.rotation.y
  const wWidth = width / 8
  const wHeight = height / 8

  for (let i = 0; i < width / wWidth / 2; i++)
    for (let j = 0; j < height / wHeight / 2; j++) {
      const prozor = createWindow({ width: wWidth, height: wHeight })
      prozor.position.set(
        (mesh.position.x - width / 2 + wWidth) + i * wWidth * 2,
        (height / 8) + j * wHeight * 2,
        mesh.position.z + (width / 2)
      )
      scene.add(prozor)
    }

  return mesh
}

scene.add(createBuilding(size))

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
