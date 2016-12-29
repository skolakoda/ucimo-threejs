/** KONFIG **/

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1
const FAR = 20000

const tackeZvezde = [
  new THREE.Vector2(0, 50),
  new THREE.Vector2(10, 10),
  new THREE.Vector2(40, 10),
  new THREE.Vector2(20, -10),
  new THREE.Vector2(30, -50),
  new THREE.Vector2(0, -20),
  new THREE.Vector2(-30, -50),
  new THREE.Vector2(-20, -10),
  new THREE.Vector2(-40, 10),
  new THREE.Vector2(-10, 10)
]

const parametriEkstruzije = {
  size: 30,
  height: 4,
  curveSegments: 3,
  bevelThickness: 1,
  bevelSize: 2,
  bevelEnabled: false,
  material: 0,
  extrudeMaterial: 1
}

const parametriZicanogOkvira = {
  color: 0x000000,
  wireframe: true,
  transparent: true
}

const materijali = [
  new THREE.MeshBasicMaterial({color: 0xffff00}),
  new THREE.MeshBasicMaterial({color: 0xff8800})
]

/** INIT **/

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
camera.position.set(0, 150, 400)
camera.lookAt(scene.position)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

const oblikZvezde = new THREE.Shape(tackeZvezde)
const ekstruzija = new THREE.ExtrudeGeometry(oblikZvezde, parametriEkstruzije)
const povrsZvezde = new THREE.MeshFaceMaterial(materijali)

const prosirenaZvezda = new THREE.Mesh(ekstruzija, povrsZvezde)
prosirenaZvezda.position.set(0, 50, 0)
scene.add(prosirenaZvezda)

const zicaniOkvir = new THREE.MeshBasicMaterial(parametriZicanogOkvira)
const skelet = new THREE.Mesh(ekstruzija, zicaniOkvir)
skelet.position.set(0, 50, 0)
scene.add(skelet)

/** FUNCTION **/

function animate () {
  window.requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  controls.update()
}

function render () {
  renderer.render(scene, camera)
}

/** LOGIC **/

animate()
