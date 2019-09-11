import * as THREE from '/node_modules/three/build/three.module.js'
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three/examples/jsm/loaders/MTLLoader.js'
import {scene, camera, renderer} from '/utils/scene.js'

const objects = []
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const offset = new THREE.Vector3()
const intersection = new THREE.Vector3()
let SELECTED, DRAGGED, CHEST

camera.position.z = 8
camera.position.y = 4

// const controls = new THREE.TrackballControls(camera)
// controls.rotateSpeed = 1.0
// controls.zoomSpeed = 1.2
// controls.panSpeed = 0.8
// controls.noZoom = false
// controls.noPan = false
// controls.staticMoving = true
// controls.dynamicDampingFactor = 0.3

scene.add(new THREE.AmbientLight(0x505050))
const light = new THREE.SpotLight(0xffffff, 1.5)
light.position.set(0, 500, 2000)
scene.add(light)

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
  objects.push(object)
}

loadOBJ('/assets/models/items/', 'potion.mtl', 'potion.obj', potion => {
  loadOBJ('/assets/models/items/', 'potion2.mtl', 'potion.obj', potion2 => {
    loadOBJ('/assets/models/items/', 'potion3.mtl', 'potion.obj', potion3 => {
      loadOBJ('/assets/models/items/', 'money.mtl', 'money.obj', money => {
        loadOBJ('/assets/models/items/', 'axe.mtl', 'axe.obj', axe => {
          loadOBJ('/assets/models/items/', 'hammer.mtl', 'hammer.obj', hammer => {
            loadOBJ('/assets/models/items/', 'shield.mtl', 'shield.obj', shield => {
              loadOBJ('/assets/models/items/', 'sword.mtl', 'sword.obj', sword => {
                loadOBJ('/assets/models/items/', 'staff.mtl', 'staff.obj', staff => {
                  loadOBJ('/assets/models/items/', 'chest.mtl', 'chest.obj', chest => {
                    placeObject(shield, true)
                    placeObject(staff, true)
                    placeObject(sword, true)

                    for (let i = 0; i < 2; i++)
                      placeObject(axe, true)

                    for (let i = 0; i < 2; i++)
                      placeObject(hammer, true)

                    for (let i = 0; i < 4; i++)
                      placeObject(potion)

                    for (let i = 0; i < 4; i++)
                      placeObject(potion2)

                    for (let i = 0; i < 4; i++)
                      placeObject(potion3)

                    for (let i = 0; i < 4; i++)
                      placeObject(money)

                    CHEST = chest
                    chest.position.x = 0
                    chest.position.z = 0
                    chest.rotation.y = -Math.PI / 2
                    scene.add(chest)

                    animate()
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

function loadOBJ(path, fileMaterial, fileOBJ, callback) {
  const mtlLoader = new MTLLoader()
  mtlLoader.setPath(path)
  mtlLoader.load(fileMaterial, materials => {
    materials.preload()
    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.setPath(path)
    objLoader.load(fileOBJ, object => {
      let mesh = object
      object.traverse(child => {
        if (child instanceof THREE.Mesh) mesh = child
      })
      callback(mesh)
    })
  })
};

function animate() {
  requestAnimationFrame(animate)
  // controls.update()
  renderer.render(scene, camera)
}

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

  const intersects = raycaster.intersectObjects(objects)
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
    // controls.enabled = false
    DRAGGED = SELECTED
    if (raycaster.ray.intersectPlane(plane, intersection))
      offset.copy(intersection).sub(DRAGGED.position)
    document.body.style.cursor = 'move'
  }
}

function onDocumentMouseUp(event) {
  event.preventDefault()
  // controls.enabled = true
  if (DRAGGED) {
    const intersects = raycaster.intersectObject(CHEST)
    if (intersects.length > 0)
      scene.remove(DRAGGED)
    DRAGGED = null
  }
  document.body.style.cursor = 'auto'
}
