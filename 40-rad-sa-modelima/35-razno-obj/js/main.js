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

let loader = new THREE.OBJLoader()
// loader.options.convertUpAxis = true
loader.load('modeli/castle/castle.obj', object => {
  object.scale.set(skaliranje, skaliranje, skaliranje)
  scena.add(object)
})

var directionalLight = new THREE.DirectionalLight(0xffeedd)
directionalLight.position.set(0, 0, 1)
scena.add(directionalLight)

/** FUNCTIONS **/

function update () {
  requestAnimationFrame(update)
  kontrole.update()
  renderer.render(scena, kamera)
}

/** LOGIC **/

update()
