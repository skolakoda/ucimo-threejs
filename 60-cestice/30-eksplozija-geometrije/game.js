const avgVertexNormals = []
const avgVertexCount = []

let doExplode = true

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 15
camera.position.y = 16
camera.position.z = 13
camera.lookAt(scene.position)

const orbit = new THREE.OrbitControls(camera)

const control = new function() {
  this.explode = function() {
    doExplode = true
  }
  this.implode = function() {
    doExplode = false
  }
  this.scale = 0.02
}
addControls(control)

const sphere = new THREE.BoxGeometry(4, 6, 4, 20, 20, 20)
sphere.vertices.forEach(v => {
  v.velocity = Math.random()
})
createParticleSystemFromGeometry(sphere)

function explode(outwards) {
  const dir = outwards === true ? 1 : -1
  let count = 0
  sphere.vertices.forEach(v => {
    v.x += (avgVertexNormals[count].x * v.velocity * control.scale) * dir
    v.y += (avgVertexNormals[count].y * v.velocity * control.scale) * dir
    v.z += (avgVertexNormals[count].z * v.velocity * control.scale) * dir
    count++
  })
  sphere.verticesNeedUpdate = true
}

function createParticleSystemFromGeometry(geom) {
  const psMat = new THREE.PointCloudMaterial()
  psMat.map = THREE.ImageUtils.loadTexture('../../assets/textures/ps_ball.png')
  psMat.blending = THREE.AdditiveBlending
  psMat.transparent = true
  psMat.opacity = 0.6
  const ps = new THREE.PointCloud(geom, psMat)
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

function addControls(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'explode')
  gui.add(controlObject, 'implode')
  gui.add(controlObject, 'scale', 0, 1).step(0.01)
}

void function render() {
  renderer.render(scene, camera)
  orbit.update()
  if (doExplode) explode(true)
  else explode(false)
  requestAnimationFrame(render)
}()
