import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'

const space = 120
const height = 10
const cubesNum = 2000
const shouldMerge = true // mnogo sporije renderuje sa puno objekata koji nisu spojeni

camera.position.set(25, 25, 25)
createOrbitControls()

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
  const y = height * Math.random()
  const geometry = new THREE.BoxGeometry(4 * Math.random(), y, 4 * Math.random())
  const translation = new THREE.Matrix4().makeTranslation(space * Math.random() - space / 2, y / 2, space * Math.random() - space / 2)
  geometry.applyMatrix(translation)
  return geometry
}

function createCube() {
  const y = height * Math.random()
  const geometry = new THREE.BoxGeometry(4 * Math.random(), y, 4 * Math.random())
  const material = new THREE.MeshNormalMaterial()
  material.transparent = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(space * Math.random() - space / 2, y / 2, space * Math.random() - space / 2)
  return mesh
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
