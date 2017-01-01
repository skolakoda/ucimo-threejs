const container = document.createElement('div')
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.set(0, 0, 20)

const scene = new THREE.Scene()

const ambient = new THREE.AmbientLight(0x101030)
scene.add(ambient)

const directionalLight = new THREE.DirectionalLight(0xffeedd)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

const texture = new THREE.Texture()
const imageLoader = new THREE.ImageLoader()
imageLoader.load('../../assets/teksture/crate.gif', image => {
  texture.image = image
  texture.needsUpdate = true
})

const loader = new THREE.OBJLoader()
loader.load('modeli/castle-X6.obj', object => {
  object.traverse(child => {
    if (child instanceof THREE.Mesh) child.material.map = texture
  })
  scene.add(object)
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()
