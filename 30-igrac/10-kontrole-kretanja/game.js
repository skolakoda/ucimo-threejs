/* global THREEx */
import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, clock} from '/utils/scene.js'

const keyboard = new THREEx.KeyboardState()

camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const cubeMat = new THREE.MeshNormalMaterial()
const cubeGeom = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1)
const player = new THREE.Mesh(cubeGeom, cubeMat)
player.position.set(0, 25.1, 0)
scene.add(player)

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  if (keyboard.pressed('W'))
    player.translateZ(-moveDistance)
  if (keyboard.pressed('S'))
    player.translateZ(moveDistance)
  if (keyboard.pressed('Q'))
    player.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    player.translateX(moveDistance)

  if (keyboard.pressed('A'))
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed('D'))
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed('R'))
    player.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed('F'))
    player.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('left'))
    player.position.x -= moveDistance
  if (keyboard.pressed('right'))
    player.position.x += moveDistance
  if (keyboard.pressed('up'))
    player.position.z -= moveDistance
  if (keyboard.pressed('down'))
    player.position.z += moveDistance
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()