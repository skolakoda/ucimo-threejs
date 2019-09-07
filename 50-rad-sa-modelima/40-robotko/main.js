
import * as THREE from '/node_modules/three/build/three.module.js'
import { GUI } from '/node_modules/three/examples/jsm/libs/dat.gui.module.js'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'

let gui, mixer, actions, activeAction, previousAction, model, face

const api = { state: 'Walking' }

const container = document.createElement('div')
document.body.appendChild(container)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100)
camera.position.set(- 5, 3, 10)
camera.lookAt(new THREE.Vector3(0, 2, 0))

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xe0e0e0)
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100)

const clock = new THREE.Clock()

let light = new THREE.HemisphereLight(0xffffff, 0x444444)
light.position.set(0, 20, 0)
scene.add(light)
light = new THREE.DirectionalLight(0xffffff)
light.position.set(0, 20, 10)
scene.add(light)

// ground
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }))
mesh.rotation.x = - Math.PI / 2
scene.add(mesh)

const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
grid.material.opacity = 0.2
grid.material.transparent = true
scene.add(grid)

// model
const loader = new GLTFLoader()
loader.load('models/RobotExpressive.glb', gltf => {
  model = gltf.scene
  scene.add(model)
  createGUI(model, gltf.animations)
}, undefined, e => {
  console.error(e)
})

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.gammaOutput = true
renderer.gammaFactor = 2.2
container.appendChild(renderer.domElement)

function createGUI(model, animations) {
  const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
  const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

  gui = new GUI()
  mixer = new THREE.AnimationMixer(model)
  actions = {}

  for (let i = 0; i < animations.length; i ++) {
    const clip = animations[i]
    const action = mixer.clipAction(clip)
    actions[clip.name] = action
    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true
      action.loop = THREE.LoopOnce
    }
  }

  // states
  const statesFolder = gui.addFolder('States')
  const clipCtrl = statesFolder.add(api, 'state').options(states)
  clipCtrl.onChange(() => {
    fadeToAction(api.state, 0.5)
  })
  statesFolder.open()

  // emotes
  const emoteFolder = gui.addFolder('Emotes')
  function createEmoteCallback(name) {
    api[name] = function() {
      fadeToAction(name, 0.2)
      mixer.addEventListener('finished', restoreState)
    }
    emoteFolder.add(api, name)
  }

  function restoreState() {
    mixer.removeEventListener('finished', restoreState)
    fadeToAction(api.state, 0.2)
  }

  for (let i = 0; i < emotes.length; i ++)
    createEmoteCallback(emotes[ i ])
  emoteFolder.open()

  // expressions

  face = model.getObjectByName('Head_2')
  const expressions = Object.keys(face.morphTargetDictionary)
  const expressionFolder = gui.addFolder('Expressions')

  for (let i = 0; i < expressions.length; i ++)
    expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[ i ])

  activeAction = actions.Walking
  activeAction.play()
  expressionFolder.open()
}

function fadeToAction(name, duration) {
  previousAction = activeAction
  activeAction = actions[name]

  if (previousAction !== activeAction)
    previousAction.fadeOut(duration)

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play()
}

void function animate() {
  const dt = clock.getDelta()
  if (mixer) mixer.update(dt)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
