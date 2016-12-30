// MAIN

// standard global variables
var container,
  scene,
  camera,
  renderer,
  controls

// custom global variables
var cube
var parameters
var gui

init()
animate()

// FUNCTIONS
function init () {
  // SCENE
  scene = new THREE.Scene()
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  scene.add(camera)
  camera.position.set(0, 150, 400)
  camera.lookAt(scene.position)
  // RENDERER
  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  container = document.getElementById('ThreeJS')
  container.appendChild(renderer.domElement)
  // EVENTS
  THREEx.WindowResize(renderer, camera)
  THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)})
  // CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement)
  // LIGHT
  var light = new THREE.PointLight(0xffffff)
  light.position.set(-100, 150, 100)

  var lightbulbGeometry = new THREE.SphereGeometry(10, 16, 8)
  var lightbulbMaterial = new THREE.MeshBasicMaterial({color: 0xffff44, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending})
  var wireMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
  var materialArray = [lightbulbMaterial, wireMaterial]
  var lightbulb = THREE.SceneUtils.createMultiMaterialObject(lightbulbGeometry, materialArray)
  // var lightbulb = new THREE.Mesh( lightbulbGeometry, lightbulbMaterial );
  lightbulb.position = light.position
  // lightbulb.material.;
  scene.add(lightbulb)
  scene.add(light)
  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(10, 10)
  var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
  var floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = -0.5
  floor.rotation.x = Math.PI / 2
  scene.add(floor)

  // //////////
  // CUSTOM //
  // //////////
  var cubeGeometry = new THREE.CubeGeometry(50, 50, 50)
  var cubeMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: true, opacity: 1})
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(0, 30, 0)
  scene.add(cube)

  var axes = new THREE.AxisHelper()
  scene.add(axes)

  gui = new dat.GUI()

  parameters = {
    x: 0,
    y: 30,
    z: 0,
    color: '#ff0000', // color (change "#" to "0x")
    opacity: 1,
    visible: true,
    material: 'Phong',
    reset: function () {
      resetCube()
    }
  }

  var folder1 = gui.addFolder('Position')
  var cubeX = folder1.add(parameters, 'x').min(-200).max(200).step(1).listen()
  var cubeY = folder1.add(parameters, 'y').min(0).max(100).step(1).listen()
  var cubeZ = folder1.add(parameters, 'z').min(-200).max(200).step(1).listen()
  folder1.open()

  cubeX.onChange(function (value) {
    cube.position.x = value
  })
  cubeY.onChange(function (value) {
    cube.position.y = value
  })
  cubeZ.onChange(function (value) {
    cube.position.z = value
  })

  var cubeColor = gui.addColor(parameters, 'color').name('Color').listen()
  cubeColor.onChange(function (value) { // onFinishChange
    cube.material.color.setHex(value.replace('#', '0x'))
  })
  var cubeOpacity = gui.add(parameters, 'opacity').min(0).max(1).step(0.01).name('Opacity').listen()
  cubeOpacity.onChange(function (value) {
    cube.material.opacity = value
  })
  gui
    .add(parameters, 'material', ['Basic', 'Lambert', 'Phong', 'Wireframe'])
    .name('Material Type')
    .listen()
    .onChange(function (value) {
      updateCube()
    })
  var cubeVisible = gui.add(parameters, 'visible').name('Visible?').listen()
  cubeVisible.onChange(function (value) {
    cube.visible = value
  })
  gui.add(parameters, 'reset').name('Reset Cube Parameters')
  gui.open()
}

function
updateCube () {
  var value = parameters.material
  var newMaterial
  // TODO: switch
  if (value === 'Basic') {
    newMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
  } else if (value === 'Lambert') {
    newMaterial = new THREE.MeshLambertMaterial({color: 0x000000})
  } else if (value === 'Phong') {
    newMaterial = new THREE.MeshPhongMaterial({color: 0x000000})
  } else
  // (value == "Wireframe")
  {
    newMaterial = new THREE.MeshBasicMaterial({wireframe: true})
  }
  cube.material = newMaterial
  cube.position.x = parameters.x
  cube.position.y = parameters.y
  cube.position.z = parameters.z
  cube.material.color.setHex(parameters.color.replace('#', '0x'))
  cube.material.opacity = parameters.opacity
  cube.material.transparent = true
  cube.visible = parameters.visible
}

function
resetCube () {
  parameters.x = 0
  parameters.y = 30
  parameters.z = 0
  parameters.color = '#ff0000'
  parameters.opacity = 1
  parameters.visible = true
  parameters.material = 'Phong'
  updateCube()
}

function
animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function
update () {
  controls.update()
}

function
render () {
  renderer.render(scene, camera)
}
