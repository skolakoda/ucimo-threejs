/* global THREE, createjs */
import {scene, camera, renderer} from '/utils/scene.js'

const objects = []
let isObjectSelected = false

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.z = 100

const texture = new THREE.TextureLoader().load('content/grasslight-big.jpg')
const planeMaterial = new THREE.MeshPhongMaterial({map: texture})

const plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.y = -10
plane.name = 'plane'
scene.add(plane)

objects.push(plane)

const box = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshBasicMaterial({
    color: 0xFF0000
  })
)

box.name = 'box'
objects.push(box)

scene.add(box)

function onDocumentMouseDown(event) {
  event.preventDefault()

  const mouseClickVector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5)
  mouseClickVector.unproject(camera)

  const raycaster = new THREE.Raycaster(camera.position, mouseClickVector.sub(camera.position).normalize())
  const intersects = raycaster.intersectObjects(objects)

  if (intersects.length > 0)
    for (let i = 0; i <= intersects.length - 1; i++)
      if (!isObjectSelected && intersects[i].object.name === 'box') {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff)
        isObjectSelected = true
        return
      } else if (isObjectSelected && intersects[i].object.name === 'plane') {
        moveObject(intersects[i].point)
        isObjectSelected = false
        return
      }
}

function moveObject(destinationVector) {
  const geometry = new THREE.Geometry()
  geometry.vertices.push(box.position.clone())
  geometry.vertices.push(destinationVector.clone())

  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 0xffffff
  }))

  scene.add(line)
  createjs.Tween.get(box.position).to({
    x: destinationVector.x,
    z: destinationVector.z
  }, 500)
}

void function render() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}()

document.addEventListener('mousedown', onDocumentMouseDown, false)
