import Robot from './Robot.js'
import {movements} from './movements.js'

const scene = new THREE.Scene()

const robot = new Robot(scene)
const {innerWidth, innerHeight} = window

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000)
camera.position.set(75, 75, 75)
camera.lookAt(scene.position)
scene.add(camera)

const light = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(light)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const clock = new THREE.Clock()

/** FUNCTIONS **/

function update() {
  robot.update(clock.getDelta())
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

/** EXEC **/

update()

const buttons = [...document.querySelectorAll('.js-state')]
buttons.map(btn => btn.addEventListener('click', () => robot.changeMovement(btn.value)))
