const WIDTH = window.innerWidth - 30,
  HEIGHT = window.innerHeight - 30

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000)
camera.position.set(0, 0, 1000)

const light = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI / 2, 1)
light.position.set(4000, 0, 1500)
scene.add(light)

const earthGeo = new THREE.SphereGeometry(200, 64, 64)
const earthMat = new THREE.MeshPhongMaterial()
earthMat.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg')
earthMat.bumpMap = THREE.ImageUtils.loadTexture('images/elev_bump_16ka.jpg')
earthMat.bumpScale = 8
const earthMesh = new THREE.Mesh(earthGeo, earthMat)
scene.add(earthMesh)

const starGeo = new THREE.SphereGeometry(3000, 10, 100)
const starMat = new THREE.MeshBasicMaterial()
starMat.map = THREE.ImageUtils.loadTexture('images/star-field.png')
starMat.side = THREE.BackSide
const starMesh = new THREE.Mesh(starGeo, starMat)
scene.add(starMesh)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()

/* INIT */

void function animate() {
  const delta = clock.getDelta()
  requestAnimationFrame(animate)
  earthMesh.rotateY(0.05 * delta)
  controls.update()
  renderer.render(scene, camera)
}()
