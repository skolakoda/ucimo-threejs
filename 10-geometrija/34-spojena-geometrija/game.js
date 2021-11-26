import * as THREE from '/node_modules/three108/build/three.module.js'
import {camera, scene, renderer} from '/utils/scene.js'

const cubesNum = 2000
const rotationSpeed = 0.002
const shouldMerge = true // mnogo sporije renderuje sa puno objekata koji nisu spojeni

camera.position.set(25, 25, 25)

if (shouldMerge) scene.add(createMergedCubes())
else for (let i = 0; i < cubesNum; i++) scene.add(createCube())

/* FUNCTIONS */

function createMergedCubes() {
  const parent = new THREE.Geometry()
  for (let i = 0; i < cubesNum; i++)
    parent.merge(createCubeGeometry())
  const material = new THREE.MeshNormalMaterial()
  return new THREE.Mesh(parent, material)
}

function createCubeGeometry() {
  const geometry = new THREE.BoxGeometry(4 * Math.random(), 4 * Math.random(), 4 * Math.random())
  const translation = new THREE.Matrix4().makeTranslation(100 * Math.random() - 50, 0, 100 * Math.random() - 50)
  geometry.applyMatrix(translation)
  return geometry
}

function createCube() {
  const geometry = new THREE.BoxGeometry(4 * Math.random(), 4 * Math.random(), 4 * Math.random())
  const material = new THREE.MeshNormalMaterial()
  material.transparent = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(100 * Math.random() - 50, 0, 100 * Math.random() - 50)
  return mesh
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)

  const {x, z} = camera.position
  camera.position.x = x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed)
  camera.position.z = z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed)

  camera.lookAt(scene.position)
  requestAnimationFrame(render)
}()
