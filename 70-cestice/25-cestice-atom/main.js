const width = window.innerWidth
const height = window.innerHeight
let particleGroup,
  particleAttributes

const clock = new THREE.Clock()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000)
scene.add(camera)
camera.position.set(0, 150, 400)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(width, height)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000)
const skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide})
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
scene.add(skyBox)

const particleTexture = THREE.ImageUtils.loadTexture('images/spark.png')

particleGroup = new THREE.Object3D()
particleAttributes = {
  startSize: [],
  startPosition: [],
  randomness: []
}

const totalParticles = 200
const radiusRange = 50
for (let i = 0; i < totalParticles; i++) {
  const spriteMaterial = new THREE.SpriteMaterial({map: particleTexture, useScreenCoordinates: false, color: 0xffffff})

  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(32, 32, 1.0) // imageWidth, imageHeight
  sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  // for a cube:
  // sprite.position.multiplyScalar( radiusRange );
  // for a solid sphere:
  // sprite.position.setLength( radiusRange * Math.random() );
  // for a spherical shell:
  sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9))
  sprite.material.color.setHSL(Math.random(), 0.9, 0.7)
  sprite.material.blending = THREE.AdditiveBlending // "glowing" particles

  particleGroup.add(sprite)
  // add variable qualities to arrays, if they need to be accessed later
  particleAttributes.startPosition.push(sprite.position.clone())
  particleAttributes.randomness.push(Math.random())
}
particleGroup.position.y = 50
scene.add(particleGroup)

function update() {
  const time = 4 * clock.getElapsedTime()

  for (let c = 0; c < particleGroup.children.length; c++) {
    const sprite = particleGroup.children[c]
    // pulse away/towards center (individual rates of movement)
    const a = particleAttributes.randomness[c] + 1
    const pulseFactor = Math.sin(a * time) * 0.1 + 0.9
    sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor
    sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor
    sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor
  }
  // rotate the entire group
  particleGroup.rotation.y = time * 0.75
  controls.update()
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()
