/* global THREEx */
import * as THREE from '/node_modules/three/build/three.module.js'
import {scene, camera, renderer, clock} from '/utils/scene.js'

const keyboard = new THREEx.KeyboardState()

camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const floorTexture = new THREE.TextureLoader().load('../../assets/textures/sand-512.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

const player = new THREE.Mesh()
player.position.set(0, 25.1, 0)
scene.add(player)

function update() {
  const delta = clock.getDelta() // seconds
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  if (keyboard.pressed('W'))
    player.translateZ(-moveDistance)

  if (keyboard.pressed('S'))
    player.translateZ(moveDistance)

  if (keyboard.pressed('Q'))  player.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    player.translateX(moveDistance)

  if (keyboard.pressed('A'))
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)

  if (keyboard.pressed('D'))
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)

  if (keyboard.pressed('R'))
    player.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)

  if (keyboard.pressed('F'))  player.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('Z')) {
    player.position.set(0, 25.1, 0)
    player.rotation.set(0, 0, 0)
  }

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(player.position)
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()
