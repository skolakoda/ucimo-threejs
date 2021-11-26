/* global chroma, dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

const MAX_HEIGHT = 6

const scale = chroma.scale(['blue', 'green', 'red']).domain([0, MAX_HEIGHT])

camera.position.set(40, 40, 50)
camera.lookAt(scene.position)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 100, 10)
scene.add(spotLight)
scene.add(new THREE.AmbientLight(0x252525))

const control = {
  flatShading: false,
  toFaceMaterial() {
    const mesh = scene.getObjectByName('terrain')
    const mat = new THREE.MeshLambertMaterial()
    mat.vertexColors = THREE.FaceColors
    mat.flatShading = false
    mesh.material = mat
  },
  toNormalMaterial() {
    const mesh = scene.getObjectByName('terrain')
    const mat = new THREE.MeshNormalMaterial()
    mesh.material = mat
  },
  onSmoothShadingChange() {
    const {material} = scene.getObjectByName('terrain')
    const geom = scene.getObjectByName('terrain').geometry
    material.flatShading = this.object.flatShading ? true : false
    material.needsUpdate = true
    geom.normalsNeedUpdate = true
  }
}

addControlGui(control)
document.body.appendChild(renderer.domElement)
create3DTerrain(80, 80, 3, 3, MAX_HEIGHT)

function create3DTerrain(width, depth, spacingX, spacingZ, height) {
  const geometry = new THREE.Geometry()
  for (let z = 0; z < depth; z++)
    for (let x = 0; x < width; x++) {
      const vertex = new THREE.Vector3(x * spacingX, Math.random() * height, z * spacingZ)
      geometry.vertices.push(vertex)
    }

  for (let z = 0; z < depth - 1; z++)
    for (let x = 0; x < width - 1; x++) {

      const a = x + z * width
      const b = (x + 1) + (z * width)
      const c = x + ((z + 1) * width)
      const d = (x + 1) + ((z + 1) * width)

      const face1 = new THREE.Face3(b, a, c)
      const face2 = new THREE.Face3(c, d, b)

      face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex())
      face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())
      geometry.faces.push(face1)
      geometry.faces.push(face2)
    }

  geometry.computeVertexNormals(true)
  geometry.computeFaceNormals()

  const mat = new THREE.MeshPhongMaterial()
  mat.vertexColors = THREE.FaceColors
  mat.flatShading = false

  const groundMesh = new THREE.Mesh(geometry, mat)
  groundMesh.translateX(-width / 1.5)
  groundMesh.translateZ(-depth / 4)
  groundMesh.name = 'terrain'

  scene.add(groundMesh)
}

function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y
  return Math.max(v1, v2, v3)
}

function addControlGui(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'toFaceMaterial')
  gui.add(controlObject, 'toNormalMaterial')
  gui.add(controlObject, 'flatShading').onChange(controlObject.onSmoothShadingChange)
}

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()