import * as THREE from '/node_modules/three/build/three.module.js'
import {camera, scene, renderer, clock, createOrbitControls} from '/utils/scene.js'

const material = new THREE.MeshNormalMaterial()

const lopta = new THREE.Mesh(
  new THREE.SphereGeometry(150, 20, 20), material
)
scene.add(lopta)
lopta.position.set(-250, 250, -250)

const kocka = new THREE.Mesh(
  new THREE.CubeGeometry(100, 100, 100), material
)
scene.add(kocka)
kocka.position.set(250, 250, -250)

const valjak = new THREE.Mesh(
  new THREE.CylinderGeometry(40, 40, 160), material)
valjak.position.set(250, 0, 0)
scene.add(valjak)

const piramida = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 100, 150, 4), material)
scene.add(piramida)

const ravan = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
)
ravan.position.set(-250, -250, -250)
scene.add(ravan)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(100, 25, 15, 30),
  material
)
torus.position.set(100, -200, 0)
scene.add(torus)

/* LOOP */

void function animiraj() {
  window.requestAnimationFrame(animiraj)
  const vreme = clock.getElapsedTime()
  lopta.rotation.set(vreme, 2 * vreme, 0)
  kocka.rotation.set(vreme, 2 * vreme, 0)
  valjak.rotation.set(vreme, 2 * vreme, 0)
  piramida.rotation.set(vreme, 2 * vreme, 0)
  ravan.rotation.set(vreme, 2 * vreme, 0)
  torus.rotation.set(vreme, 2 * vreme, 0)
  renderer.render(scene, camera)
}()
