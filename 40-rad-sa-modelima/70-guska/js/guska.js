const aspectRatio = window.innerWidth / window.innerHeight

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const light = new THREE.AmbientLight(0xffffff)
document.body.appendChild(renderer.domElement)
scene.add(light)

const camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000)
camera.position.set(-20, 110, 900)
scene.add(camera)

const loader = new THREE.JSONLoader()
loader.load('modeli/guska.json', function (geometry) {
  var gooseMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('teksture/guska.jpg')
  })
  const mesh = new THREE.Mesh(geometry, gooseMaterial)
  mesh.scale.set(1000, 1000, 1000)
  scene.add(mesh)
})

function update () {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

update()
