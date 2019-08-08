/* global chroma */
const MAX_HEIGHT = 10
let renderer
let scene
let camera
let control
const scale = chroma.scale(['blue', 'green', 'red']).domain([0, MAX_HEIGHT])

function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMapEnabled = true

  camera.position.x = 100
  camera.position.y = 100
  camera.position.z = 100
  camera.lookAt(scene.position)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(10, 300, 10)

  scene.add(spotLight)

  scene.add(new THREE.AmbientLight(0x252525))

  control = new function() {
    this.toFaceMaterial = function() {
      const mesh = scene.getObjectByName('terrain')
      const mat = new THREE.MeshLambertMaterial()
      mat.vertexColors = THREE.FaceColors
      mat.shading = THREE.NoShading
      mesh.material = mat
    }
    this.toNormalMaterial = function() {
      const mesh = scene.getObjectByName('terrain')
      const mat = new THREE.MeshNormalMaterial()
      mesh.material = mat
    }

    this.smoothShading = false
    this.onSmoothShadingChange = function() {
      const {material} = scene.getObjectByName('terrain')
      const geom = scene.getObjectByName('terrain').geometry

      if (this.object.smoothShading)
        material.shading = THREE.SmoothShading
      else
        material.shading = THREE.NoShading

      material.needsUpdate = true
      geom.normalsNeedUpdate = true
    }
  }()

  addControlGui(control)
  document.body.appendChild(renderer.domElement)
  create3DTerrain(140, 140, 2.5, 2.5, MAX_HEIGHT)
  render()
}

function create3DTerrain(width, depth, spacingX, spacingZ, height) {
  const date = new Date()
  noise.seed(date.getMilliseconds())

  const geometry = new THREE.Geometry()
  for (let z = 0; z < depth; z++)
    for (let x = 0; x < width; x++) {
      const yValue = Math.abs(noise.perlin2(x / 7, z / 7) * height * 2)
      const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
      geometry.vertices.push(vertex)
    }

  for (let z = 0; z < depth - 1; z++)
    for (let x = 0; x < width - 1; x++) {

      const a = x + z * width
      const b = (x + 1) + (z * width)
      const c = x + ((z + 1) * width)
      const d = (x + 1) + ((z + 1) * width)

      const uva = new THREE.Vector2(x / (width - 1), 1 - z / (depth - 1))
      const uvb = new THREE.Vector2((x + 1) / (width - 1), 1 - z / (depth - 1))
      const uvc = new THREE.Vector2(x / (width - 1), 1 - (z + 1) / (depth - 1))
      const uvd = new THREE.Vector2((x + 1) / (width - 1), 1 - (z + 1) / (depth - 1))

      const face1 = new THREE.Face3(b, a, c)
      const face2 = new THREE.Face3(c, d, b)

      face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex())
      face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())

      geometry.faces.push(face1)
      geometry.faces.push(face2)

      geometry.faceVertexUvs[0].push([uvb, uva, uvc])
      geometry.faceVertexUvs[0].push([uvc, uvd, uvb])
    }

  geometry.computeVertexNormals(true)
  geometry.computeFaceNormals()

  const mat = new THREE.MeshPhongMaterial()
  mat.map = THREE.ImageUtils.loadTexture('../../assets/teksture/wood_1-1024x1024.png')

  const groundMesh = new THREE.Mesh(geometry, mat)
  groundMesh.translateX(-width / 1.5)
  groundMesh.translateZ(-depth / 4)
  groundMesh.translateY(50)
  groundMesh.name = 'terrain'

  scene.add(groundMesh)
}

function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y

  return Math.max(v1, v2, v3)
}

function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

function addControlGui(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'toFaceMaterial')
  gui.add(controlObject, 'toNormalMaterial')
  gui.add(controlObject, 'smoothShading').onChange(controlObject.onSmoothShadingChange)
}

window.onload = init
