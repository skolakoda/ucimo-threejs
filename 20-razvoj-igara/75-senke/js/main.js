const SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45,
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
  NEAR = 0.1,
  FAR = 20000

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
// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement)
// LIGHT
const light = new THREE.PointLight(0xffffff)
light.position.set(0, 250, 0)
scene.add(light)
// FLOOR
const floorTexture = new THREE.ImageUtils.loadTexture('../../assets/teksture/checkerboard.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

// SKYBOX/FOG
const materialArray = []
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-xpos.png')}))
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-xneg.png')}))
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-ypos.png')}))
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-yneg.png')}))
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-zpos.png')}))
materialArray.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/dawnmountain-zneg.png')}))
for (let i = 0; i < 6; i++) {
  materialArray[i].side = THREE.BackSide
}
const skyboxMaterial = new THREE.MeshFaceMaterial(materialArray)

const skyboxGeom = new THREE.CubeGeometry(5000, 5000, 5000, 1, 1, 1)

const skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial)
scene.add(skybox)

const cubeGeometry = new THREE.CubeGeometry(50, 50, 50)
const crateTexture = new THREE.ImageUtils.loadTexture('../../assets/teksture/crate.gif')
const crateMaterial = new THREE.MeshBasicMaterial({map: crateTexture})
const cube = new THREE.Mesh(cubeGeometry, crateMaterial)
cube.position.set(-50, 26, 0)
scene.add(cube)

const sphereGeometry = new THREE.SphereGeometry(50, 32, 16)
const sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(50, 50, -50)
scene.add(sphere)

// ///////////////////
// POST-PROCESSING //
// ///////////////////

// first, create the composer, which will combine the shader effects
const composer = new THREE.EffectComposer(renderer)
// the first step is to render the scene
//  (so the special effects can have a base image to affect)
composer.addPass(new THREE.RenderPass(scene, camera))

// setup and add (another) effect to the composer
const shaderSepia = THREE.SepiaShader
const effectSepia = new THREE.ShaderPass(shaderSepia)
// supply values to shader constiables if needed
effectSepia.uniforms['amount'].value = 0.9
// only the final effect should set renderToScreen = true
effectSepia.renderToScreen = true
// add to the composer
composer.addPass(effectSepia)

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  controls.update()
}

function render () {
  // instead of asking "renderer" to render the scene,
  // we ask "composer", which contains all the effects, to render the scene:
  composer.render()
}

animate()
