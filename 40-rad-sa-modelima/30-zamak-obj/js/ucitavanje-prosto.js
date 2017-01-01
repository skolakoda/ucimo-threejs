/** KONFIG **/

const skaliranje = 0.1

/** INIT **/

const scena = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 1, 1000
)
kamera.position.set(-6, 6, 9)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfcfcfc, 1)
document.body.appendChild(renderer.domElement)

const kontrole = new THREE.OrbitControls(kamera)

const objLoader = new THREE.OBJLoader()
objLoader.load('modeli/castle/castle.obj', function (object) {
  object.scale.set(skaliranje, skaliranje, skaliranje)
  scena.add(object)
})

const directionalLight = new THREE.DirectionalLight(0xffeedd)
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
