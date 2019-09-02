/*
* https://en.wikipedia.org/wiki/Morph_target_animation
In models that support multiple morph targets, an additional set of vertices is stored to represent that position for each of the targets. So, if you've got a face model that has a morph target for a smile, one for a frown, and one for a smirk, you effectively store four times as many vertex positions. With the `morphTargetInfluences` property, you decide how far the base state (`geometry.vertices` property) should be morphed toward that specific morph target. Three.js will then calculate the average position of each individual vertex and render the updated model. For example, you can have separate morph targets for eye movement and mouth movement.
*/

let step1 = 0.01
let step2 = 0.01
let step3 = 0.01
let car, control

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.x = 5
camera.position.y = 6
camera.position.z = 3
camera.lookAt(scene.position)

document.body.appendChild(renderer.domElement)

const orbit = new THREE.OrbitControls(camera, renderer.domElement)

var dirLight = new THREE.DirectionalLight()
dirLight.position.set(10, 10, 10)
scene.add(dirLight)

var dirLight = new THREE.DirectionalLight()
dirLight.position.set(-10, 10, -10)
scene.add(dirLight)

// Model adapted from: http://www.blendswap.com/blends/view/70892
const jsonLoader = new THREE.JSONLoader()
jsonLoader.load('../../assets/models/morph/car.js', (model, materials) => {

  // enable morph targets and set flatshading for best demo effet
  materials.forEach(mat => {
    mat.morphTargets = true
    mat.shading = THREE.FlatShading
  })

  // fix some missing facevertexes from the model
  car = new THREE.Mesh(model, new THREE.MeshFaceMaterial(materials))
  for (let i = 0; i < 60; i++)
    model.faceVertexUvs[0][i] = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]

    // repositon the model
  car.position.y = -1

  scene.add(car)
  render()
})

addControls()

function addControls() {
  control = new function() {
    this.mt_1 = 0.01
    this.mt_2 = 0.01
    this.mt_3 = 0.01
    this.animate = false
  }

  const gui = new dat.GUI()
  gui.add(control, 'mt_1', 0, 1).step(0.01).listen().onChange(a => {
    car.morphTargetInfluences[1] = a
  })
  gui.add(control, 'mt_2', 0, 1).step(0.01).listen().onChange(a => {
    car.morphTargetInfluences[2] = a
  })
  gui.add(control, 'mt_3', 0, 1).step(0.01).listen().onChange(a => {
    car.morphTargetInfluences[3] = a
  })
  gui.add(control, 'animate')
}

function render() {
  renderer.render(scene, camera)
  orbit.update()

  if (control.animate) {
    car.morphTargetInfluences[1] += step1
    car.morphTargetInfluences[2] += step2
    car.morphTargetInfluences[3] += step3

    if (car.morphTargetInfluences[1] > 1 || car.morphTargetInfluences[1] < 0) step1 *= -1
    if (car.morphTargetInfluences[2] > 1 || car.morphTargetInfluences[2] < 0) step2 *= -1
    if (car.morphTargetInfluences[3] > 1 || car.morphTargetInfluences[3] < 0) step3 *= -1

    control.mt_1 = car.morphTargetInfluences[1]
    control.mt_2 = car.morphTargetInfluences[2]
    control.mt_3 = car.morphTargetInfluences[3]
  }
  requestAnimationFrame(render)
}
