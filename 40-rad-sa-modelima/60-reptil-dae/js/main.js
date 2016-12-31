/* KONFIG */

const gridSize = 14
const gridStep = 1
const skaliranje = 0.002

/* INIT */

const clock = new THREE.Clock()
const container = document.createElement('div')
document.body.appendChild(container)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
camera.position.set(2, 2, 3)

const particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}))
scene.add(particleLight)

let loader = new THREE.ColladaLoader()
loader.options.convertUpAxis = true
loader.load('modeli/reptil.dae', function (collada) {
  const model = collada.scene
  model.traverse(child => {
    if (!(child instanceof THREE.SkinnedMesh)) return
    const animation = new THREE.Animation(child, child.geometry.animation)
    animation.play()
  })
  model.scale.x = model.scale.y = model.scale.z = skaliranje
  scene.add(model)
})

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

const stats = new Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.top = '0px'
container.appendChild(stats.domElement)

/** FUNCTIONS **/

function drawGrid () {
  const geometry = new THREE.Geometry()
  const material = new THREE.LineBasicMaterial({color: 0x303030})
  for (let i = -gridSize; i <= gridSize; i += gridStep) {
    geometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i))
    geometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i))

    geometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize))
    geometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize))
  }
  const line = new THREE.Line(geometry, material, THREE.LinePieces)
  scene.add(line)
}

function addLights () {
  scene.add(new THREE.AmbientLight(0xcccccc))

  const directionalLight = new THREE.DirectionalLight(/* Math.random() * 0xffffff */
    0xeeeeee)
  directionalLight.position.x = Math.random() - 0.5
  directionalLight.position.y = Math.random() - 0.5
  directionalLight.position.z = Math.random() - 0.5
  directionalLight.position.normalize()
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0xffffff, 4)
  particleLight.add(pointLight)
}

function onWindowRegridSize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  const timer = Date.now() * 0.0005
  camera.position.x = Math.cos(timer) * 10
  camera.position.y = 2
  camera.position.z = Math.sin(timer) * 10
  camera.lookAt(scene.position)

  particleLight.position.x = Math.sin(timer * 4) * 3009
  particleLight.position.y = Math.cos(timer * 5) * 4000
  particleLight.position.z = Math.cos(timer * 4) * 3009

  THREE.AnimationHandler.update(clock.getDelta())
  renderer.render(scene, camera)
  stats.update()
}

/** LOGIC **/

drawGrid()
addLights()
animate()

/** EVENTS **/

window.addEventListener('regridSize', onWindowRegridSize, false)
