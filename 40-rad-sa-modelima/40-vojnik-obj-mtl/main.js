const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
camera.position.z = 250

const scene = new THREE.Scene()

const usmerenoSvetlo = new THREE.DirectionalLight(0xffeedd)
usmerenoSvetlo.position.set(0, 0, 1).normalize()
scene.add(usmerenoSvetlo)

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

/** FUNKCIJE **/

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100
    console.log(Math.round(percentComplete, 2) + '% ucitano')
  }
}

/** LOGIKA **/

const ucitavacModela = new THREE.OBJLoader()
const ucitavacTeksture = new THREE.MTLLoader()

ucitavacTeksture.setPath('modeli/vojnik/')
ucitavacTeksture.load('model.mtl', materijali => {
  ucitavacModela.setMaterials(materijali)
  ucitavacModela.load('modeli/vojnik/model.obj', model => {
    model.position.y = -95
    scene.add(model)
  }, onProgress)
})

void function update() {
  requestAnimationFrame(update)
  controls.update()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
