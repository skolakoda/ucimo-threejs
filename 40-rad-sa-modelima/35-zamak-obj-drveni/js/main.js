/** INIT **/

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(-2, 6, 20)

const ambijent = new THREE.AmbientLight(0x201010)
scene.add(ambijent)

const usmerenoSvetlo = new THREE.DirectionalLight(0xffeedd)
usmerenoSvetlo.position.set(0, 0, 1)
scene.add(usmerenoSvetlo)

const tekstura = new THREE.Texture()
const ucitavacSlika = new THREE.ImageLoader()
ucitavacSlika.load('../../assets/teksture/crate.gif', slika => {
  tekstura.image = slika
  tekstura.needsUpdate = true
})

const loader = new THREE.OBJLoader()
loader.load('modeli/carobni-zamak.obj', model => {
  model.traverse(komad => {
    if (komad instanceof THREE.Mesh) komad.material.map = tekstura
  })
  scene.add(model)
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

/** FUNKCIJE **/

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()
