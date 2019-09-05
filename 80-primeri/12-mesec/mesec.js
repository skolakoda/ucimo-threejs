const duration = 10000 // ms
let currentTime = Date.now()

const canvas = document.getElementById('webglcanvas')

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})

renderer.setSize(canvas.width, canvas.height)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000)
camera.position.z = 10
scene.add(camera)

const root = new THREE.Object3D

let light = new THREE.DirectionalLight(0xffffff, 2)

light.position.set(.5, 0, 1)
root.add(light)

light = new THREE.AmbientLight(0) // 0x222222 );
root.add(light)

const group = new THREE.Object3D
root.add(group)

const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('textures/moon_1024.jpg')
const bumpMap = textureLoader.load('textures/cloud.png')
const material = new THREE.MeshPhongMaterial({ map, bumpMap })

const geometry = new THREE.SphereGeometry(2, 20, 20)
const mesh = new THREE.Mesh(geometry, material)
mesh.visible = true
group.add(mesh)

scene.add(root)

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  const now = Date.now()
  const deltat = now - currentTime
  currentTime = now
  const fract = deltat / duration
  const angle = Math.PI * 2 * fract
  // Rotate the sphere group about its Y axis
  group.rotation.y += angle
  renderer.render(scene, camera)
}()
