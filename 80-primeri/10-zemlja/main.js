const rotationSpeed = 0.001

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

const sphereGeometry = new THREE.SphereGeometry(15, 60, 60)
const sphereMaterial = createEarthMaterial()
const earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
earthMesh.name = 'earth'
scene.add(earthMesh)

const cloudGeometry = new THREE.SphereGeometry(15.2, 60, 60)
const cloudMaterial = createCloudMaterial()
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
cloudMesh.name = 'clouds'
scene.add(cloudMesh)

const ambientLight = new THREE.AmbientLight(0x111111)
ambientLight.name = 'ambient'
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position = new THREE.Vector3(100, 10, -50)
directionalLight.name = 'directional'
scene.add(directionalLight)

camera.position.x = 50
camera.lookAt(scene.position)

const cameraControl = new THREE.OrbitControls(camera)

document.body.appendChild(renderer.domElement)

function createEarthMaterial() {
  // 4096 is the maximum width for maps
  const texture = THREE.ImageUtils.loadTexture('textures/earthmap4k.jpg')
  const bumpMap = THREE.ImageUtils.loadTexture('textures/earthbump4k.jpg')
  const specularMap = THREE.ImageUtils.loadTexture('textures/earthspec4k.jpg')
  const material = new THREE.MeshPhongMaterial()
  material.map = texture
  // surface reflection
  material.specularMap = specularMap
  material.specular = new THREE.Color(0x262626)
  // izbocine
  material.bumpMap = bumpMap
  return material
}

function createCloudMaterial() {
  const cloudTexture = THREE.ImageUtils.loadTexture('textures/fair_clouds_4k.png')
  const cloudMaterial = new THREE.MeshPhongMaterial()
  cloudMaterial.map = cloudTexture
  cloudMaterial.transparent = true
  return cloudMaterial
}

/* LOOP */

void function render() {
  cameraControl.update()

  scene.getObjectByName('earth').rotation.y += rotationSpeed
  scene.getObjectByName('clouds').rotation.y += rotationSpeed * 1.1

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
