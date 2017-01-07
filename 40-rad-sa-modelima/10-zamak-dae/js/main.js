/** KONFIG **/

const skaliranje = 0.1
const ugaoKamere = 45

/** INIT **/

const scena = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(
  ugaoKamere, window.innerWidth / window.innerHeight, 1, 1000)
kamera.position.set(-6, 6, 9)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const kontrole = new THREE.OrbitControls(kamera)

let ucitavac = new THREE.ColladaLoader()
ucitavac.load('modeli/tvrdjava.dae', data => {
  const model = data.scene
  model.scale.set(skaliranje, skaliranje, skaliranje)
  scena.add(model)
})

/** FUNCTIONS **/

const update = () => {
  requestAnimationFrame(update)
  kontrole.update()
  renderer.render(scena, kamera)
}

/** LOGIC **/

update()
