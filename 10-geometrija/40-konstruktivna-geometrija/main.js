/* global ThreeBSP */

const material = new THREE.MeshLambertMaterial()

/* INIT */

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff)
light.position.set(1, 1, 1)
scene.add(light)

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(5, 5, 15)
camera.lookAt(scene.position)
scene.add(camera)

// Cube subtract Sphere

const cube_geometry = new THREE.CubeGeometry(3, 3, 3)
const cube_bsp = new ThreeBSP(cube_geometry)

const sphere_geometry = new THREE.SphereGeometry(1.8, 32, 32)
const sphere_bsp = new ThreeBSP(sphere_geometry)

const subtract_bsp = cube_bsp.subtract(sphere_bsp)
const result = subtract_bsp.toMesh(material)
result.geometry.computeVertexNormals()
scene.add(result)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()