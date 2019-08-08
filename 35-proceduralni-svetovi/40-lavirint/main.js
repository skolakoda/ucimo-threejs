/* global Maze */
const scene = new THREE.Scene()

const maze = new Maze(scene, 17, 100, 100)
maze.generate()
maze.draw()

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(80, 120, 100)
camera.lookAt(scene.position)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(40, 100, 80)
scene.add(spotLight)

document.body.appendChild(renderer.domElement)

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
