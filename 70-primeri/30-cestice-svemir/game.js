/* global TWEEN */
let mouseX = 0,
  mouseY = 0

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const container = document.createElement('div')
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.z = 1000

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000040)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

document.addEventListener('mousemove', onDocumentMouseMove, false)
document.addEventListener('touchstart', onDocumentTouchStart, false)
document.addEventListener('touchmove', onDocumentTouchMove, false)

function generateSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
  gradient.addColorStop(1, 'rgba(0,0,0,1)')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return canvas
}

function initParticle(initParticle, initDelay) {
  const particle = this instanceof THREE.Sprite ? this : initParticle
  const delay = initDelay !== undefined ? initDelay : 0

  particle.position.set(0, 0, 0)
  particle.scale.x = particle.scale.y = Math.random() * 32 + 16

  new TWEEN.Tween(particle)
    .delay(delay)
    .to({}, 10000)
    .onComplete(initParticle)
    .start()

  new TWEEN.Tween(particle.position)
    .delay(delay)
    .to({
      x: Math.random() * 4000 - 2000,
      y: Math.random() * 1000 - 500,
      z: Math.random() * 4000 - 2000
    }, 10000)
    .start()

  new TWEEN.Tween(particle.scale)
    .delay(delay)
    .to({
      x: 0.01,
      y: 0.01
    }, 10000)
    .start()
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX
  mouseY = event.clientY - windowHalfY
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    mouseY = event.touches[0].pageY - windowHalfY
  }
}

/* INIT */

const material = new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(generateSprite()),
  blending: THREE.AdditiveBlending
})

for (let i = 0; i < 1000; i++) {
  const particle = new THREE.Sprite(material)
  initParticle(particle, i * 10)
  scene.add(particle)
}

void function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()

  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}()