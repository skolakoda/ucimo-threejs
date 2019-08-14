const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const FLOOR = -1000

let r = 0

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x34583e, 0, 10000)

const camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000)
camera.position.y = FLOOR + 2750
scene.add(camera)

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const renderer = new THREE.WebGLRenderer({ scene, clearColor: 0x34583e, clearAlpha: 0.5 })
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
document.body.appendChild(renderer.domElement)

function getHeightData(img, size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  const data = new Float32Array(size * size)
  context.drawImage(img, 0, 0)

  const pixel = context.getImageData(0, 0, size, size)
  const pix = pixel.data

  let j = 0 // i je kvadriran
  for (let i = 0, n = pix.length; i < n; i += (4)) {
    const all = pix[i] + pix[i + 1] + pix[i + 2]
    data[j++] = all / 30
  }
  return data
}

const img = new Image()
img.onload = function() {
  const data = getHeightData(img)
  const plane = new THREE.PlaneGeometry(100, 100, 127, 127)

  for (let i = 0, l = plane.vertices.length; i < l; i++)
    plane.vertices[i].position.z = data[i]

  const mesh = new THREE.Mesh(plane, new THREE.MeshPhongMaterial())
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 100
  mesh.position.y = FLOOR
  mesh.rotation.x = -1.57
  scene.add(mesh)
}
img.src = 'heightmap_128.jpg'

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const dist = 4000
  camera.position.x = dist * Math.cos(r)
  camera.position.z = dist * Math.sin(r)
  r += 0.001
  renderer.render(scene, camera)
}()
