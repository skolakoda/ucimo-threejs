// https://en.wikipedia.org/wiki/Bump_mapping
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 30, 40)
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cubeGeometry = new THREE.BoxGeometry(15, 15, 15)

const cubeMaterial = new THREE.MeshPhongMaterial()
cubeMaterial.map = THREE.ImageUtils.loadTexture('../../assets/textures/Brick-2399.jpg')
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(-13, 0, -5)
scene.add(cube)

const cubeBumpMaterial = cubeMaterial.clone()
cubeBumpMaterial.bumpMap = THREE.ImageUtils.loadTexture('../../assets/textures/Brick-2399-bump-map.jpg')
const bumpCube = new THREE.Mesh(cubeGeometry, cubeBumpMaterial)
bumpCube.position.set(13, 0, -5)
scene.add(bumpCube)

const dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(20, 20, 20)
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight(0xffffff)
dirLight2.position.set(-20, 20, 20)
scene.add(dirLight2)

const control = new function() {
  this.rotSpeed = 0.005
  this.bumpScale = 1
}
addControls(control)

function addControls(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'rotSpeed', -0.1, 0.1)
  gui.add(controlObject, 'bumpScale', -4, 4).step(0.1)
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  cube.rotation.y += control.rotSpeed
  bumpCube.rotation.y -= control.rotSpeed
  bumpCube.material.bumpScale = control.bumpScale
  requestAnimationFrame(render)
}()
