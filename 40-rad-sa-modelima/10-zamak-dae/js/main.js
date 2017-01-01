/** KONFIG **/

const skaliranje = 0.1
const ugaoKamere = 45

/** INIT **/

const scena = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(
  ugaoKamere, window.innerWidth / window.innerHeight, 1, 1000
)
kamera.position.set(-6, 6, 9)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfcfcfc, 1)
document.body.appendChild(renderer.domElement)

const kontrole = new THREE.OrbitControls(kamera)

let loader = new THREE.ColladaLoader()
// loader.options.convertUpAxis = true
loader.load('modeli/gradjevina.dae',
  collada => {
    const model = collada.scene
    model.scale.set(skaliranje, skaliranje, skaliranje)
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
