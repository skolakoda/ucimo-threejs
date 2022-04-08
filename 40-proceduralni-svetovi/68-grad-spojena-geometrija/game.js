import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const space = 60
const height = 10
const cubesNum = 2000
const shouldMerge = true // mnogo sporije renderuje sa puno objekata koji nisu spojeni

const textureLoader = new THREE.TextureLoader()

camera.position.set(25, 25, 25)
createOrbitControls()

if (shouldMerge) scene.add(createMergedCubes())
else for (let i = 0; i < cubesNum; i++) scene.add(createCube())

/* FUNCTIONS */

function createMergedCubes() {
  const parent = new THREE.Geometry()
  for (let i = 0; i < cubesNum; i++) parent.merge(createCubeGeometry())
  const normalMap = textureLoader.load('/assets/textures/RooftilesWood.jpg')
  const material = new THREE.MeshNormalMaterial({ normalMap })
  return new THREE.Mesh(parent, material)
}

function createCubeGeometry() {
  const y = height * Math.random()
  const geometry = new THREE.BoxGeometry(4 * Math.random(), y, 4 * Math.random())
  const translation = new THREE.Matrix4().makeTranslation(randomInRange(-space, space), y / 2, randomInRange(-space, space))
  geometry.applyMatrix(translation)
  if (Math.random() > .8) geometry.rotateY(Math.random())
  return geometry
}

function createCube() {
  const y = height * Math.random()
  const geometry = new THREE.BoxGeometry(4 * Math.random(), y, 4 * Math.random())
  const material = new THREE.MeshNormalMaterial()
  material.transparent = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(randomInRange(-space, space), y / 2, randomInRange(-space, space))
  return mesh
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
