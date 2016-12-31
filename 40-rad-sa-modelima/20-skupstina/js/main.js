/** KONFIG **/

const skaliranje = 0.002
const ugaoKamere = 45
const daljinaKamere = 9

/** INIT **/

const scena = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(
  ugaoKamere, window.innerWidth / window.innerHeight, 1, 1000)
kamera.position.z = daljinaKamere

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfcfcfc, 1)
document.body.appendChild(renderer.domElement)

const light = new THREE.AmbientLight(0xfcfcfc)
scena.add(light)

const kontrole = new THREE.OrbitControls(kamera)

let loader = new THREE.ColladaLoader()
loader.options.convertUpAxis = true
loader.load('modeli/skupstina.dae',
  collada => {
    const model = collada.scene
    model.scale.x = model.scale.y = model.scale.z = skaliranje
    model.updateMatrix()
    scena.add(model)
  }
)

/** FUNCTIONS **/

function update () {
  requestAnimationFrame(update)
  kontrole.update()
  renderer.render(scena, kamera)
}

/** LOGIC **/

update()
