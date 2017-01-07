/** INIT **/

const scena = new THREE.Scene()

const kamera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 1, 1000)
kamera.position.set(-2, 6, 20)

const ambijent = new THREE.AmbientLight(0x201010)
scena.add(ambijent)

const usmerenoSvetlo = new THREE.DirectionalLight(0xffeedd)
usmerenoSvetlo.position.set(0, 0, 1)
scena.add(usmerenoSvetlo)

const tekstura = new THREE.Texture()
const ucitavacSlika = new THREE.ImageLoader()
ucitavacSlika.load('../../assets/teksture/crate.gif', slika => {
  tekstura.image = slika
  tekstura.needsUpdate = true
})

const ucitavac = new THREE.OBJLoader()
ucitavac.load('modeli/carobni-zamak.obj', model => {
  model.traverse(komad => {
    if (komad instanceof THREE.Mesh) komad.material.map = tekstura
  })
  scena.add(model)
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const kontrole = new THREE.OrbitControls(kamera, renderer.domElement)

/** FUNKCIJE **/

function animate () {
  requestAnimationFrame(animate)
  kontrole.update()
  renderer.render(scena, kamera)
}

animate()
