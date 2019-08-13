
let renderer
let scene
let camera

const scale = chroma.scale(['blue', 'green', 'red']).domain([0, 50])

function init() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const light = new THREE.DirectionalLight()
  light.position.set(1200, 1200, 1200)
  scene.add(light)

  camera.position.x = 1200
  camera.position.y = 500
  camera.position.z = 1200
  camera.lookAt(scene.position)

  document.body.appendChild(renderer.domElement)

  control = new function() {
    this.rotationSpeed = 0.005
    this.scale = 1
  }
  createGeometryFromMap()
  render()
}

function createGeometryFromMap() {
  const depth = 512
  const width = 512

  const spacingX = 3
  const spacingZ = 3
  const heightOffset = 2

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const img = new Image()
  img.src = '../../assets/heightmap.png'
  img.onload = function() {

    ctx.drawImage(img, 0, 0)
    const pixel = ctx.getImageData(0, 0, width, depth)

    const geom = new THREE.Geometry
    const output = []
    for (var x = 0; x < depth; x++)
      for (var z = 0; z < width; z++) {

        const yValue = pixel.data[z * 4 + (depth * x * 4)] / heightOffset
        const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
        geom.vertices.push(vertex)
      }

    for (var z = 0; z < depth - 1; z++)
      for (var x = 0; x < width - 1; x++) {

        const a = x + z * width
        const b = (x + 1) + (z * width)
        const c = x + ((z + 1) * width)
        const d = (x + 1) + ((z + 1) * width)

        const face1 = new THREE.Face3(a, b, d)
        const face2 = new THREE.Face3(d, c, a)
        face1.color = new THREE.Color(scale(getHighPoint(geom, face1)).hex())
        face2.color = new THREE.Color(scale(getHighPoint(geom, face2)).hex())

        geom.faces.push(face1)
        geom.faces.push(face2)
      }

    geom.computeVertexNormals(true)
    geom.computeFaceNormals()
    geom.computeBoundingBox()

    const zMax = geom.boundingBox.max.z
    const xMax = geom.boundingBox.max.x

    const mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
      color: 0x666666,
      shading: THREE.NoShading
    }))
    mesh.translateX(-xMax / 2)
    mesh.translateZ(-zMax / 2)
    scene.add(mesh)
    mesh.name = 'valley'
  }
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

init()