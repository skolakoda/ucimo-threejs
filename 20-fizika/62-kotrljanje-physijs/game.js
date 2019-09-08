/* global Physijs, Perlin */
Physijs.scripts.worker = '/libs/physijs/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'
import {initRenderer, initCamera, initDefaultLighting } from '../../utils/dirk.js'
import {createOrbitControls } from '../../utils/scene.js'

createOrbitControls()

const renderer = initRenderer()
const camera = initCamera(new THREE.Vector3(50, 120, 220))

const scene = new Physijs.Scene
initDefaultLighting(scene, new THREE.Vector3(0, 50, 120))
scene.add(new THREE.AmbientLight(0x0393939))

function addSphere() {
  const sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(3, 20), getMaterial())
  setRandPosition(sphere)
  scene.add(sphere)
}

function addBlock() {
  const cube = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 2, 6), getMaterial())
  setRandPosition(cube)
  scene.add(cube)
}

const pn = new Perlin(new Date().getTime())
const map = createHeightMap(pn)
scene.add(map)

function getMaterial() {
  return Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xcccccc }), 0.5, 0.7)
}

function createHeightMap(pn) {
  const material = Physijs.createMaterial(new THREE.MeshStandardMaterial(), 0.3, 0.8)
  const geometry = new THREE.PlaneGeometry(220, 200, 100, 100)
  geometry.vertices.forEach(vertex => {
    const value = pn.noise(vertex.x / 12, vertex.y / 12, 0)
    vertex.z = value * 13
  })
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()

  const ground = new Physijs.HeightfieldMesh(geometry, material, 0, 100, 100)
  ground.rotation.x = Math.PI / -2
  ground.rotation.y = 0.5
  return ground
}

function setRandPosition(obj) {
  obj.position.set(Math.random() * 20 - 45, 40, Math.random() * 20 - 5)
  obj.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI)
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate()
}()

/* EVENTS */

document.addEventListener('click', () => {
  if (Math.random() > .5) addSphere()
  else addBlock()
})