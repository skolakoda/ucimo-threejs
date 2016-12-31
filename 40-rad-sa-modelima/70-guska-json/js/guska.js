const aspectRatio = window.innerWidth / window.innerHeight

const scena = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const svetlo = new THREE.AmbientLight(0xffffff)
document.body.appendChild(renderer.domElement)
scena.add(svetlo)

const kamera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000)
kamera.position.set(0, 0, 5)
scena.add(kamera)
const kontrole = new THREE.OrbitControls(kamera)

const loader = new THREE.JSONLoader()
loader.load('modeli/guska.json', function (oblik) {
  const tekstura = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('teksture/guska.jpg')
  })
  const guska = new THREE.Mesh(oblik, tekstura)
  scena.add(guska)
})

function update () {
  kontrole.update()
  renderer.render(scena, kamera)
  requestAnimationFrame(update)
}

update()
