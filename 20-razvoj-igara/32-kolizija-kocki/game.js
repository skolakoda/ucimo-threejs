const cubes = []

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff2255 })
const player = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(player)

const cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xff0000 })
const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2)
cube2.position.set(5, 0, 0)
cube2.name = 'cube-red'
scene.add(cube2)
cubes.push(cube2)

const cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
const cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial3)
cube3.position.set(0, 0, 5)
cube3.name = 'cube-green'
scene.add(cube3)
cubes.push(cube3)

const cubeMaterial4 = new THREE.MeshLambertMaterial({ color: 0x0000ff })
const cube4 = new THREE.Mesh(cubeGeometry, cubeMaterial4)
cube4.position.set(0, 0, -5)
cube4.name = 'cube-blue'
scene.add(cube4)
cubes.push(cube4)

const cubeMaterial5 = new THREE.MeshLambertMaterial({ color: 0xff00ff })
const cube5 = new THREE.Mesh(cubeGeometry, cubeMaterial5)
cube5.position.set(-5, 0, 0)
cube5.name = 'cube-purple'
scene.add(cube5)
cubes.push(cube5)

const groundPlane = new THREE.PlaneGeometry(1000, 1000, 20, 20)
const groundMat = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  map: THREE.ImageUtils.loadTexture('../assets/textures/wood_1-1024x1024.png')
})
groundMat.map.wrapS = groundMat.map.wrapT = THREE.RepeatWrapping
groundMat.map.repeat.set(10, 10)

const physMesh = new THREE.Mesh(groundPlane, groundMat)
physMesh.rotation.x = -0.5 * Math.PI
physMesh.receiveShadow = true
physMesh.position.y = -2

const dirLight = new THREE.DirectionalLight()
dirLight.position.set(25, 23, 15)
scene.add(dirLight)

const dirLight2 = new THREE.DirectionalLight()
dirLight2.position.set(-25, 23, 15)
scene.add(dirLight2)

scene.add(physMesh)

camera.position.x = 15
camera.position.y = 16
camera.position.z = 13
camera.lookAt(scene.position)

document.body.appendChild(renderer.domElement)

/* FUNCTIONS */

function moveCube(e) {
  const moveDistance = 0.15
  if (e.keyCode == '37') player.position.x -= moveDistance // left arrow
  if (e.keyCode == '38') player.position.z -= moveDistance // up arrow
  if (e.keyCode == '39') player.position.x += moveDistance // right arrow
  if (e.keyCode == '40') player.position.z += moveDistance // down arrow
}

function checkCollision() {
  cubes.forEach(cube => {
    cube.material.transparent = false
    cube.material.opacity = 1.0
  })

  const originPoint = player.position.clone()

  for (let vertexIndex = 0; vertexIndex < player.geometry.vertices.length; vertexIndex++) {
    const localVertex = player.geometry.vertices[vertexIndex].clone()
    const globalVertex = localVertex.applyMatrix4(player.matrix)
    const directionVector = globalVertex.sub(player.position)
    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize())
    const collisionResults = ray.intersectObjects(cubes)

    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      console.log(collisionResults[0].object.name)
      collisionResults[0].object.material.transparent = true
      collisionResults[0].object.material.opacity = 0.4
    }
  }
}

/* INIT */

void function render() {
  renderer.render(scene, camera)
  checkCollision()
  requestAnimationFrame(render)
}()

window.addEventListener('keydown', moveCube)
