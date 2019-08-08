/* global chroma */
const scale = chroma.scale(['black', '#111111', '#222222', 'white', 'red']).domain([0, 1], 10)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.set(7, 12, 10)
camera.lookAt(new THREE.Vector3(-10, 0, -10))

const dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(25, 25, 10)
scene.add(dirLight)

function generateBuildingTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 512

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.mozImageSmoothingEnabled = false

  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, 512, 512)

  for (let x = 0; x < 256; x += 8)
    for (let y = 0; y < 490; y += 8) {
      ctx.fillStyle = scale(Math.random()).hex()
      ctx.fillRect(x + 1, y + 1, 6, 6)
    }

  for (let x = 0; x < 256; x += 8)
    for (let y = 490; y < 512; y += 8) {
      ctx.fillStyle = '#333333'
      ctx.fillRect(x + 1, y + 1, 8, 8)
    }
  return canvas
}

function createCity(buildingCount, rangeX, rangeY, scale) {
  const buildingBlock = new THREE.BoxGeometry(1, 1, 1)
  buildingBlock.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))

  const uvPixel = 0.0
  buildingBlock.faceVertexUvs[0][4][0] = new THREE.Vector2(uvPixel, uvPixel)
  buildingBlock.faceVertexUvs[0][4][1] = new THREE.Vector2(uvPixel, uvPixel)
  buildingBlock.faceVertexUvs[0][4][2] = new THREE.Vector2(uvPixel, uvPixel)
  buildingBlock.faceVertexUvs[0][5][0] = new THREE.Vector2(uvPixel, uvPixel)
  buildingBlock.faceVertexUvs[0][5][1] = new THREE.Vector2(uvPixel, uvPixel)
  buildingBlock.faceVertexUvs[0][5][2] = new THREE.Vector2(uvPixel, uvPixel)

  for (let i = 0; i < buildingCount; i++) {
    const material = new THREE.MeshLambertMaterial()
    material.color = new THREE.Color(0xffffff)
    material.map = new THREE.Texture(generateBuildingTexture())
    material.map.anisotropy = renderer.getMaxAnisotropy()
    material.map.needsUpdate = true

    const building = new THREE.Mesh(buildingBlock, material)
    const randomScale = (Math.random() / 1.2 + 0.5) * scale

    building.scale.x = randomScale
    building.scale.z = randomScale
    building.scale.y = randomScale * 4

    building.position.x = (Math.random() / 2 * rangeX) - rangeX / 2
    building.position.z = (Math.random() / 2 * rangeY) - rangeY / 2

    scene.add(building)
  }
}

/* INIT */

createCity(40, 20, 10, 3)

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
