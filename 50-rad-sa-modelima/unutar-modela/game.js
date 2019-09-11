/* global dat */
import * as THREE from '/node_modules/three/build/three.module.js'
import { OBJLoader } from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three/examples/jsm/loaders/MTLLoader.js'
import {scene, camera, renderer, initLights} from '/utils/scene.js'

let tower

renderer.setClearColor(0x63adef, 1.0)
renderer.gammaInput = true
renderer.gammaOutput = true

const planeGeometry = new THREE.CircleGeometry(50, 32)
const planeMaterial = new THREE.MeshPhongMaterial({color:0x23ef13})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI
scene.add(plane)

camera.lookAt(new THREE.Vector3(0, 2.5, 0))
initLights()

const controlObject = {
  side: THREE.DoubleSide,
  cameraPos: 1
}
addControlGui(controlObject)

loadOBJ ('/assets/models/houses02/', 'house2-02.mtl', 'house2-02.obj',  scene, obj => {
  tower = obj
  tower.scale.x = tower.scale.z = 1.5
  tower.updateMatrix()
  render()
})

function addControlGui(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'side', {
    'THREE.FrontSide' : THREE.FrontSide,
    'THREE.DoubleSide' : THREE.DoubleSide
  })
  gui.add(controlObject, 'cameraPos', {
    'inside' : 0,
    'outside' : 1
  })
}

function render() {
  tower.traverse(child => {
    if (child instanceof THREE.Mesh)
      child.material.side = +controlObject.side
  })

  if (controlObject.cameraPos == 0) {
    camera.position.set(1.5, 2.5, -6.5)
    camera.lookAt(new THREE.Vector3(0, 2.5, 0))
  } else {
    camera.position.set(10, 20, 25)
    camera.lookAt(scene.position)
  }

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

function loadOBJ(path, fileMaterial, fileOBJ, scene, callback) {
  const mtlLoader = new MTLLoader()
  const objLoader = new OBJLoader()
  mtlLoader.setPath(path)
  mtlLoader.load(fileMaterial, materials => {
    objLoader.setMaterials(materials)
    objLoader.setPath(path)
    objLoader.load(fileOBJ, object => {
      object.traverse(child => {
        if (child instanceof THREE.Mesh) child.castShadow = true
      })
      object.castShadow = true
      object.position.set(0, 0, 0)
      scene.add(object)
      callback(object)
    })
  })
};
