/* global ThreeBSP */

const material = new THREE.MeshLambertMaterial({
  shading: THREE.SmoothShading,
  map: new THREE.TextureLoader().load('texture.png')
})

/* INIT */

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff)
light.position.set(1, 1, 1).normalize()
scene.add(light)

const camera = new THREE.PerspectiveCamera(
	35, window.innerWidth / window.innerHeight, 1, 1000
)
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
result.position.x = -3
scene.add(result)

// Sphere union Cube

const sphere2_geometry = new THREE.SphereGeometry(2, 16, 16)
const sphere2_bsp = new ThreeBSP(sphere2_geometry)

const cube2_geometry = new THREE.CubeGeometry(7, .5, 3)
const cube2_bsp = new ThreeBSP(cube2_geometry)

const union_bsp = sphere2_bsp.union(cube2_bsp)
const result2 = union_bsp.toMesh(material)
result2.geometry.computeVertexNormals()
result2.position.x = 3
scene.add(result2)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
