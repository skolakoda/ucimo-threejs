const characterSize = 50
const outlineSize = characterSize * 0.05

const objects = []
const collisions = []

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let movements = []
const playerSpeed = 5

const container = document.createElement('div')
document.body.appendChild(container)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x000000, 0.5)
scene.add(hemisphereLight)

const rotationPoint = new THREE.Object3D()
rotationPoint.position.set(0, 0, 0)
scene.add(rotationPoint)

const geometry = new THREE.BoxBufferGeometry(characterSize, characterSize, characterSize)
const material = new THREE.MeshPhongMaterial({ color: 0x22dd88 })
const player = new THREE.Mesh(geometry, material)
player.position.y = characterSize / 2
rotationPoint.add(player)

const outline_geo = new THREE.BoxGeometry(characterSize + outlineSize, characterSize + outlineSize, characterSize + outlineSize)
const outline_mat = new THREE.MeshBasicMaterial({ color : 0x0000000, side: THREE.BackSide })
const outline = new THREE.Mesh(outline_geo, outline_mat)
player.add(outline)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000)
camera.position.z = -300
camera.position.y = 200
player.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true })

const element = renderer.domElement
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(element)

const controls = new THREE.OrbitControls(camera, element)
controls.enablePan = true
controls.enableZoom = true
controls.maxDistance = 1000
controls.minDistance = 60
controls.target.copy(new THREE.Vector3(0, characterSize / 2, 0))

/* FUNCTIONS */

function stopMovement() {
  movements = []
}

function move(obj, destination) {
  const {position} = obj
  const newPosX = destination.x
  const newPosZ = destination.z

  const diffX = Math.abs(position.x - newPosX)
  const diffZ = Math.abs(position.z - newPosZ)
  const distance = Math.sqrt(diffX * diffX + diffZ * diffZ)

  const multiplierX = position.x > newPosX ? -1 : 1
  const multiplierZ = position.z > newPosZ ? -1 : 1
  position.x += (playerSpeed * (diffX / distance)) * multiplierX
  position.z += (playerSpeed * (diffZ / distance)) * multiplierZ

  if (Math.floor(position.x) <= Math.floor(newPosX) + 15 &&
      Math.floor(position.x) >= Math.floor(newPosX) - 15 &&
      Math.floor(position.z) <= Math.floor(newPosZ) + 15 &&
      Math.floor(position.z) >= Math.floor(newPosZ) - 15
  ) {
    position.x = Math.floor(position.x)
    position.z = Math.floor(position.z)
    stopMovement()
  }
}

function detectCollisions() {
  const bounds = {
    xMin: rotationPoint.position.x - player.geometry.parameters.width / 2,
    xMax: rotationPoint.position.x + player.geometry.parameters.width / 2,
    yMin: rotationPoint.position.y - player.geometry.parameters.height / 2,
    yMax: rotationPoint.position.y + player.geometry.parameters.height / 2,
    zMin: rotationPoint.position.z - player.geometry.parameters.width / 2,
    zMax: rotationPoint.position.z + player.geometry.parameters.width / 2,
  }

  for (let index = 0; index < collisions.length; index ++)

    if (collisions[ index ].type == 'collision')
      if ((bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin) &&
         (bounds.yMin <= collisions[ index ].yMax && bounds.yMax >= collisions[ index ].yMin) &&
         (bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin)) {

        stopMovement()
        let objectCenterZ, playerCenterZ
        if (bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin) {
          const objectCenterX = ((collisions[ index ].xMax - collisions[ index ].xMin) / 2) + collisions[ index ].xMin
          const playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin
          objectCenterZ = ((collisions[ index ].zMax - collisions[ index ].zMin) / 2) + collisions[ index ].zMin
          playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin

          if (objectCenterX > playerCenterX)
            rotationPoint.position.x -= 1
          else
            rotationPoint.position.x += 1
        }
        if (bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin)
          if (objectCenterZ > playerCenterZ) {
            rotationPoint.position.z -= 1
          } else {
            rotationPoint.position.z += 1
          }
      }
}

function addCollisionPoints(mesh) {
  const bbox = new THREE.Box3().setFromObject(mesh)
  const bounds = {
    type: 'collision',
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  }
  collisions.push(bounds)
}

function createFloor() {
  const geometry = new THREE.PlaneBufferGeometry(100000, 100000)
  const material = new THREE.MeshToonMaterial({color: 0x336633})
  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -1 * Math.PI / 2
  plane.position.y = 0
  scene.add(plane)
  objects.push(plane)
}

function createTree(posX, posZ) {
  const randomScale = (Math.random() * 3) + 0.8
  const randomRotateY = Math.PI / (Math.floor((Math.random() * 32) + 1))

  let geometry = new THREE.CylinderGeometry(characterSize / 3.5, characterSize / 2.5, characterSize * 1.3, 8)
  let material = new THREE.MeshToonMaterial({color: 0x664422})
  const trunk = new THREE.Mesh(geometry, material)
  trunk.position.set(posX, ((characterSize * 1.3 * randomScale) / 2), posZ)
  trunk.scale.x = trunk.scale.y = trunk.scale.z = randomScale
  scene.add(trunk)

  addCollisionPoints(trunk)

  let outline_geo = new THREE.CylinderGeometry(characterSize / 3.5 + outlineSize, characterSize / 2.5 + outlineSize, characterSize * 1.3 + outlineSize, 8)
  let outline_mat = new THREE.MeshBasicMaterial({
    color : 0x0000000,
    side: THREE.BackSide
  })
  const outlineTrunk = new THREE.Mesh(outline_geo, outline_mat)
  trunk.add(outlineTrunk)

  geometry = new THREE.DodecahedronGeometry(characterSize)
  material = new THREE.MeshToonMaterial({ color: 0x44aa44 })
  const treeTop = new THREE.Mesh(geometry, material)
  treeTop.position.set(posX, ((characterSize * 1.3 * randomScale) / 2) + characterSize * randomScale, posZ)
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = randomScale
  treeTop.rotation.y = randomRotateY
  scene.add(treeTop)

  outline_geo = new THREE.DodecahedronGeometry(characterSize + outlineSize)
  outline_mat = new THREE.MeshBasicMaterial({
    color : 0x0000000,
    side: THREE.BackSide
  })
  const outlineTreeTop = new THREE.Mesh(outline_geo, outline_mat)
  treeTop.add(outlineTreeTop)
}

function handleMouseDown(event) {
  event.preventDefault()
  stopMovement()

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(objects)
  if (intersects.length > 0) movements.push(intersects[0].point)
}

/* INIT */

createFloor()
createTree(300, 300)
createTree(800, -300)
createTree(-300, 800)
createTree(-800, -800)

void function animate() {
  requestAnimationFrame(animate)
  if (movements.length > 0) move(rotationPoint, movements[0])
  if (camera.position.y < 10) camera.position.y = 10
  detectCollisions()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mousedown', handleMouseDown)
