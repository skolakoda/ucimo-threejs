var SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight
var VIEW_ANGLE = 45,
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
  NEAR = 0.1,
  FAR = 20000

var clock = new THREE.Clock()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(camera)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const renderer = window.WebGLRenderingContext
      ? new THREE.WebGLRenderer({antialias: true})
      : new THREE.CanvasRenderer()
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const stats = new Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.bottom = '0px'
stats.domElement.style.zIndex = 100
container.appendChild(stats.domElement)

var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000)
var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide})
var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial)
scene.add(skyBox)

var particleTexture = THREE.ImageUtils.loadTexture('images/spark.png')

particleGroup = new THREE.Object3D()
particleAttributes = {
  startSize: [],
  startPosition: [],
  randomness: []
}

var totalParticles = 200
var radiusRange = 50
for (var i = 0; i < totalParticles; i++) {
  var spriteMaterial = new THREE.SpriteMaterial({map: particleTexture, useScreenCoordinates: false, color: 0xffffff})

  var sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(32, 32, 1.0) // imageWidth, imageHeight
  sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  // for a cube:
  // sprite.position.multiplyScalar( radiusRange );
  // for a solid sphere:
  // sprite.position.setLength( radiusRange * Math.random() );
  // for a spherical shell:
  sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9))
  // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() );
  sprite.material.color.setHSL(Math.random(), 0.9, 0.7)
  // sprite.opacity = 0.80; // translucent particles
  sprite.material.blending = THREE.AdditiveBlending // "glowing" particles

  particleGroup.add(sprite)
  // add variable qualities to arrays, if they need to be accessed later
  particleAttributes.startPosition.push(sprite.position.clone())
  particleAttributes.randomness.push(Math.random())
}
particleGroup.position.y = 50
scene.add(particleGroup)

var particleGroup,
  particleAttributes

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  var time = 4 * clock.getElapsedTime()

  for (var c = 0; c < particleGroup.children.length; c++) {
    var sprite = particleGroup.children[c]
    // particle wiggle
    // var wiggleScale = 2;
    // sprite.position.x += wiggleScale * (Math.random() - 0.5);
    // sprite.position.y += wiggleScale * (Math.random() - 0.5);
    // sprite.position.z += wiggleScale * (Math.random() - 0.5);

    // pulse away/towards center
    // individual rates of movement
    var a = particleAttributes.randomness[c] + 1
    var pulseFactor = Math.sin(a * time) * 0.1 + 0.9
    sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor
    sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor
    sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor
  }

  // rotate the entire group
  // particleGroup.rotation.x = time * 0.5;
  particleGroup.rotation.y = time * 0.75
  // particleGroup.rotation.z = time * 1.0;
  controls.update()
  stats.update()
}

function render () {
  renderer.render(scene, camera)
}

animate()
