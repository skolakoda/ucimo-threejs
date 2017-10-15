/* global TWEEN */

const sirina = window.innerWidth
const visina = window.innerHeight

/* INIT */

const camera = new THREE.PerspectiveCamera(45, sirina / visina, 1, 1000)
camera.position.x = 20
camera.position.y = 10
camera.position.z = 100

const scene = new THREE.Scene()

scene.add(new THREE.AmbientLight(0x333333))
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(0, 0, 1).normalize()
scene.add(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sirina, visina)
renderer.setClearColor (0xffffff, 1)
document.body.appendChild(renderer.domElement)

const loader = new THREE.JSONLoader()

/* DELOVI */

loader.load('obj2/robot_arm_base.json', function(geometry) {
  const obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  obj.material.color.setHex(0x35203B)
  scene.add(obj)
})

loader.load('obj2/robot_arm_arm1.json', function(geometry) {
  const obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  obj.material.color.setHex(0x911146)
  scene.add(obj)
})

loader.load('obj2/robot_arm_arm2.json', function(geometry) {
  const obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  obj.material.color.setHex(0x5C5C5C)
  scene.add(obj)
})

loader.load('obj2/robot_arm_body.json', function(geometry) {
  const obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  obj.material.color.setHex(0xCF4A30)
  scene.add(obj)
})

loader.load('obj2/robot_arm_hand.json', function(geometry) {
  const obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  obj.material.color.setHex(0xED8C2B)
  scene.add(obj)
})

/* POKRET */

void function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
  renderer.render(scene, camera)
}()
