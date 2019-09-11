import * as THREE from '/node_modules/three/build/three.module.js'
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three/examples/jsm/loaders/MTLLoader.js'
import { TrackballControls } from '/node_modules/three/examples/jsm/controls/TrackballControls.js'
import {scene, camera, renderer, initLights} from '/utils/scene.js'

let SELECTED, DRAGGED, CHEST

const items = []
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const offset = new THREE.Vector3()
const intersection = new THREE.Vector3()
const mtlLoader = new MTLLoader()
mtlLoader.setPath('/assets/models/items/')

scene.background = new THREE.Color(0xe0e0e0)
camera.position.z = 6
camera.position.y = 4

const controls = new TrackballControls(camera)
initLights()

loadOBJ('potion.mtl', 'potion.obj', potion => {
  for (let i = 0; i < 4; i++) placeObject(potion)
})

loadOBJ('potion2.mtl', 'potion.obj', potion2 => {
  for (let i = 0; i < 4; i++) placeObject(potion2)
})

loadOBJ('potion3.mtl', 'potion.obj', potion3 => {
  for (let i = 0; i < 4; i++) placeObject(potion3)
})

loadOBJ('money.mtl', 'money.obj', money => {
  for (let i = 0; i < 4; i++) placeObject(money)
})

loadOBJ('axe.mtl', 'axe.obj', axe => {
  for (let i = 0; i < 2; i++) placeObject(axe, true)
})

loadOBJ('hammer.mtl', 'hammer.obj', hammer => {
  for (let i = 0; i < 2; i++) placeObject(hammer, true)
})

loadOBJ('shield.mtl', 'shield.obj', shield => {
  placeObject(shield, true)
})

loadOBJ('sword.mtl', 'sword.obj', sword => {
  placeObject(sword, true)
})

loadOBJ('staff.mtl', 'staff.obj', staff => {
  placeObject(staff, true)
})

loadOBJ('chest.mtl', 'chest.obj', chest => {
  CHEST = chest
  chest.position.x = 0
  chest.position.z = 0
  chest.rotation.y = -Math.PI / 2
  scene.add(chest)
})

/* FUNCTIONS */

function placeObject(item, shouldRotate) {
  const object = item.clone()
  object.position.x = Math.random() * 20 - 10
  object.position.z = Math.random() * 10 - 10
  object.rotation.y = Math.random() * 2 * Math.PI
  if (shouldRotate) {
    object.rotation.z = Math.PI / 2
    object.rotation.y = Math.random() * 2 * Math.PI
  }
  scene.add(object)
  items.push(object)
}

function loadOBJ(fileMaterial, fileOBJ, callback) {
  mtlLoader.load(fileMaterial, materials => {
    const objLoader = new OBJLoader() // mora nova instanca zbog setMaterials
    objLoader.setPath('/assets/models/items/')
    objLoader.setMaterials(materials)
    objLoader.load(fileOBJ, object => {
      callback(object.children[0])
    })
  })
};

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()

/* EVENTS */

renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false)
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)

function onDocumentMouseMove(event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  if (DRAGGED) {
    if (raycaster.ray.intersectPlane(plane, intersection))
      DRAGGED.position.copy(intersection.sub(offset))
    return
  }

  const intersects = raycaster.intersectObjects(items)
  if (intersects.length > 0) {
    if (SELECTED != intersects[0].object) {
      SELECTED = intersects[0].object
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        SELECTED.position)
    }
    document.body.style.cursor = 'pointer'
  } else {
    SELECTED = null
    document.body.style.cursor = 'auto'
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault()
  if (SELECTED) {
    controls.enabled = false
    DRAGGED = SELECTED
    if (raycaster.ray.intersectPlane(plane, intersection))
      offset.copy(intersection).sub(DRAGGED.position)
    document.body.style.cursor = 'move'
  }
}

function onDocumentMouseUp(event) {
  event.preventDefault()
  controls.enabled = true
  if (DRAGGED) {
    const intersects = raycaster.intersectObject(CHEST)
    if (intersects.length > 0)
      scene.remove(DRAGGED)
    DRAGGED = null
  }
  document.body.style.cursor = 'auto'
}
