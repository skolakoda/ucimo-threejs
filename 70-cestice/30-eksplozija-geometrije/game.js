import * as THREE from '/node_modules/three/build/three.module.js'
import {scene, camera, renderer, createOrbitControls} from '/utils/scene.js'

const scale = 0.02
const avgVertexNormals = []
const avgVertexCount = []

scene.background = new THREE.Color(0x000000)

camera.position.x = 15
camera.position.y = 16
camera.position.z = 13
camera.lookAt(scene.position)

const orbit = createOrbitControls()

const sphere = new THREE.BoxGeometry(4, 6, 4, 20, 20, 20)
sphere.vertices.forEach(v => {
  v.velocity = Math.random()
})
createParticleSystemFromGeometry(sphere)

function explode() {
  let count = 0
  sphere.vertices.forEach(v => {
    v.x += avgVertexNormals[count].x * v.velocity * scale
    v.y += avgVertexNormals[count].y * v.velocity * scale
    v.z += avgVertexNormals[count].z * v.velocity * scale
    count++
  })
  sphere.verticesNeedUpdate = true
}

function createParticleSystemFromGeometry(geom) {
  const psMat = new THREE.PointsMaterial()
  psMat.map = new THREE.TextureLoader().load('../../assets/textures/ps_ball.png')
  psMat.blending = THREE.AdditiveBlending
  psMat.transparent = true
  psMat.opacity = 0.6
  const ps = new THREE.Points(geom, psMat)
  ps.sortParticles = true
  scene.add(ps)

  for (let i = 0; i < sphere.vertices.length; i++) {
    avgVertexNormals.push(new THREE.Vector3(0, 0, 0))
    avgVertexCount.push(0)
  }

  sphere.faces.forEach(f => {
    const vA = f.vertexNormals[0]
    const vB = f.vertexNormals[1]
    const vC = f.vertexNormals[2]

    avgVertexCount[f.a] += 1
    avgVertexCount[f.b] += 1
    avgVertexCount[f.c] += 1

    avgVertexNormals[f.a].add(vA)
    avgVertexNormals[f.b].add(vB)
    avgVertexNormals[f.c].add(vC)
  })

  for (let i = 0; i < avgVertexNormals.length; i++)
    avgVertexNormals[i].divideScalar(avgVertexCount[i])
}

void function render() {
  renderer.render(scene, camera)
  orbit.update()
  explode()
  requestAnimationFrame(render)
}()
