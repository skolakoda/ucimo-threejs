/*
To access the bones, we access the childrens of THREE.SkinnedMesh. The easiest way
to determine which bone to use is to look at the console and browse the childrens.

When you enable the `skinning` property on the material, Three.js passes information about
relevant bones and positions into its vertex shader. The shader will use this information
to position vertices to their new position based on movement of the relevant bones.
*/

let giraffe
let skeletonHelper

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.x = 22
camera.position.y = 22
camera.position.z = 22
camera.lookAt(scene.position)

document.body.appendChild(renderer.domElement)
const orbit = new THREE.OrbitControls(camera, renderer.domElement)

const dirLight = new THREE.DirectionalLight()
dirLight.position.set(15, 10, -5)
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight()
dirLight2.position.set(-15, 10, -5)
scene.add(dirLight2)

const spotLight = new THREE.SpotLight()
spotLight.position.set(40, 40, 40)
scene.add(spotLight)

const control = new function() {
  this.neck_rot_x = 0.01
  this.neck_rot_y = 0.01
  this.neck_rot_z = 0.01

  this.neck_pos_x = 0.01
  this.neck_pos_y = 0.01
  this.neck_pos_z = 0.01
}
addControls(control)

const jsonLoader = new THREE.JSONLoader()
jsonLoader.load('/assets/models/giraffe/giraffe.js', (model, materials) => {

  materials.forEach(mat => {
    mat.skinning = true
    mat.side = THREE.DoubleSide
  })

  giraffe = new THREE.SkinnedMesh(model, materials[0])

  giraffe.rotation.x = -0.2
  giraffe.rotation.y = 1.5
  giraffe.rotation.z = 0.2
  giraffe.position.y = -5
  scene.add(giraffe)

  // set defaults for control object
  control.neck_rot_x = giraffe.children[0].children[1].children[0].children[0].rotation.x
  control.neck_rot_y = giraffe.children[0].children[1].children[0].children[0].rotation.y
  control.neck_rot_z = giraffe.children[0].children[1].children[0].children[0].rotation.z

  control.neck_pos_x = giraffe.children[0].children[1].children[0].children[0].position.x
  control.neck_pos_y = giraffe.children[0].children[1].children[0].children[0].position.y
  control.neck_pos_z = giraffe.children[0].children[1].children[0].children[0].position.z

  skeletonHelper = new THREE.SkeletonHelper(giraffe)
  skeletonHelper.visible = false
  scene.add(skeletonHelper)

  render()
})

function addControls(controlObject) {
  const gui = new dat.GUI()
  gui.add(controlObject, 'neck_rot_x', -Math.PI, Math.PI).listen()
  gui.add(controlObject, 'neck_rot_y', -Math.PI, Math.PI).listen()
  gui.add(controlObject, 'neck_rot_z', -Math.PI, Math.PI).listen()

  gui.add(controlObject, 'neck_pos_x', -10, 10).listen()
  gui.add(controlObject, 'neck_pos_y', -10, 10).listen()
  gui.add(controlObject, 'neck_pos_z', -10, 10).listen()

  gui.add({skeletonHelper: false}, 'skeletonHelper').onChange(e => {
    skeletonHelper.visible = e
  })
}

function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)

  // the neck bone
  giraffe.children[0].children[1].children[0].children[0].rotation.x = control.neck_rot_x
  giraffe.children[0].children[1].children[0].children[0].rotation.y = control.neck_rot_y
  giraffe.children[0].children[1].children[0].children[0].rotation.z = control.neck_rot_z

  giraffe.children[0].children[1].children[0].children[0].position.x = control.neck_pos_x
  giraffe.children[0].children[1].children[0].children[0].position.y = control.neck_pos_y
  giraffe.children[0].children[1].children[0].children[0].position.z = control.neck_pos_z

  // the tail bone
  giraffe.children[0].children[0].children[0].rotation.z -= 0.1

  skeletonHelper.update()
  orbit.update()
}
