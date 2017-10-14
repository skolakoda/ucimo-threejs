// originalno su crna pozadina i bele cestice

const razmak = 100
const kolicinaX = 50
const kolicinaY = 50
const KRUZNICA = Math.PI * 2

let count = 0
let mouseX = 0,
  mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

/* INIT */

const container = document.createElement('div')
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 1000
camera.position.y = 100

const renderer = new THREE.CanvasRenderer()
renderer.setClearColor (0xffffff, 1)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const cestice = new Array()

let i = 0
for (let ix = 0; ix < kolicinaX; ix++) {
  for (let iy = 0; iy < kolicinaY; iy++) {
    const nijansa = i % 255
    const boja = new THREE.Color(`rgb(${nijansa}, ${nijansa}, ${nijansa})`)
    const material = new THREE.SpriteCanvasMaterial({
      color: boja,
      program(context) {
        context.beginPath()
        context.arc(0, 0, 0.5, 0, KRUZNICA, true)
        context.fill()
      }
    })
    const cestica = cestice[i++] = new THREE.Sprite(material)
    cestica.position.x = ix * razmak - (kolicinaX * razmak / 2)
    cestica.position.z = iy * razmak - (kolicinaY * razmak / 2)
    scene.add(cestica)
  }
}

/* FUNCTIONS */

function handleResize() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function handleMouseMove(event) {
  mouseX = event.clientX - windowHalfX
  mouseY = event.clientY - windowHalfY
}

function handleTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
  }
}

function handleTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
  }
}

void function update() {
  requestAnimationFrame(update)

  camera.position.x += (mouseX - camera.position.x) * .05
  // camera.lookAt(scene.position)
  let i = 0
  for (let ix = 0; ix < kolicinaX; ix++) {
    for (let iy = 0; iy < kolicinaY; iy++) {
      const cestica = cestice[i++]
      cestica.position.y = (Math.sin((ix + count) * 0.3) * 50) +
        (Math.sin((iy + count) * 0.5) * 50)
      cestica.scale.x = cestica.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 +
        (Math.sin((iy + count) * 0.5) + 1) * 4
    }
  }
  renderer.render(scene, camera)
  count += 0.1
}()

/* EVENTS */

document.addEventListener('mousemove', handleMouseMove, false)
document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)
window.addEventListener('resize', handleResize, false)
