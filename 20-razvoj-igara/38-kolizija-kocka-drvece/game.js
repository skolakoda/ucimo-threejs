let camera, 
  scene, 
  renderer, 
  controls, 
  container, 
  rotationPoint  

const characterSize = 50
const outlineSize = characterSize * 0.05

const objects = []
const collisions = []

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let movements = []
const playerSpeed = 5

let clickTimer = null

let indicatorTop
let indicatorBottom

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xccddff)
  scene.fog = new THREE.Fog(0xccddff, 500, 2000)
  
  const ambient = new THREE.AmbientLight(0xffffff)
  scene.add(ambient)
  
  const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x000000, 0.5)
  scene.add(hemisphereLight)
  
  rotationPoint = new THREE.Object3D()
  rotationPoint.position.set(0, 0, 0)
  scene.add(rotationPoint)
  
  createCharacter()
  createFloor()
  createTree(300, 300)
  createTree(800, -300)
  createTree(-300, 800)
  createTree(-800, -800)
  
  camera = new THREE.PerspectiveCamera(
    50, 
    window.innerWidth / window.innerHeight, 
    1, 
    20000 
  )
  camera.position.z = -300
  camera.position.y = 200
  box.add(camera)
  
  renderer = new THREE.WebGLRenderer({ antialias: true })
  
  const element = renderer.domElement
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(element)
  
  controls = new THREE.OrbitControls(camera, element)
  controls.enablePan = true
  controls.enableZoom = true 
  controls.maxDistance = 1000 
  controls.minDistance = 60 
  controls.target.copy(new THREE.Vector3(0, characterSize / 2, 0))
  
  document.addEventListener('mousedown', handleMouseDown, false)
  document.addEventListener('touchstart', handleTouchStart, false)
}

function detectDoubleTouch() {
  if (clickTimer == null) 
    clickTimer = setTimeout(() => {
      clickTimer = null
    }, 300)
  else {
    clearTimeout(clickTimer)
    clickTimer = null
    return true
  }
  return false
}

function stopMovement() {
  movements = []
  scene.remove(indicatorTop)
  scene.remove(indicatorBottom)
}

function move(location, destination, speed = playerSpeed) {
	  const moveDistance = speed
    
  const posX = location.position.x
  const posZ = location.position.z
  const newPosX = destination.x
  const newPosZ = destination.z
    
  let multiplierX = 1
  let multiplierZ = 1
    
  const diffX = Math.abs(posX - newPosX)
  const diffZ = Math.abs(posZ - newPosZ)
  const distance = Math.sqrt(diffX * diffX + diffZ * diffZ)
    
  if (posX > newPosX) 
    multiplierX = -1

  if (posZ > newPosZ) 
    multiplierZ = -1
    
  location.position.x += (moveDistance * (diffX / distance)) * multiplierX
  location.position.z += (moveDistance * (diffZ / distance)) * multiplierZ
    
  if ((Math.floor(location.position.x) <= Math.floor(newPosX) + 15 && 
          Math.floor(location.position.x) >= Math.floor(newPosX) - 15) &&
        (Math.floor(location.position.z) <= Math.floor(newPosZ) + 15 && 
          Math.floor(location.position.z) >= Math.floor(newPosZ) - 15)) {
    location.position.x = Math.floor(location.position.x)
    location.position.z = Math.floor(location.position.z)
      
    stopMovement()
  }
}

function detectCollisions() {
  const bounds = {
    xMin: rotationPoint.position.x - box.geometry.parameters.width / 2,
    xMax: rotationPoint.position.x + box.geometry.parameters.width / 2,
    yMin: rotationPoint.position.y - box.geometry.parameters.height / 2,
    yMax: rotationPoint.position.y + box.geometry.parameters.height / 2,
    zMin: rotationPoint.position.z - box.geometry.parameters.width / 2,
    zMax: rotationPoint.position.z + box.geometry.parameters.width / 2,
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

function calculateCollisionPoints(mesh, type = 'collision') {   
  const bbox = new THREE.Box3().setFromObject(mesh)
  const bounds = {
    type,
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  }
  collisions.push(bounds)
}

function createCharacter() {
  const geometry = new THREE.BoxBufferGeometry(characterSize, characterSize, characterSize)
  const material = new THREE.MeshPhongMaterial({ color: 0x22dd88 })
  box = new THREE.Mesh(geometry, material)
  box.position.y = characterSize / 2
  rotationPoint.add(box)
  
  const outline_geo = new THREE.BoxGeometry(characterSize + outlineSize, characterSize + outlineSize, characterSize + outlineSize)
  const outline_mat = new THREE.MeshBasicMaterial({ color : 0x0000000, side: THREE.BackSide })
  outline = new THREE.Mesh(outline_geo, outline_mat)
  box.add(outline)
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
  
  calculateCollisionPoints(trunk)
  
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

function drawIndicator() {
  const topSize = characterSize / 8
  const bottomRadius = characterSize / 4
  
  let geometry = new THREE.TetrahedronGeometry(topSize, 0)
  let material = new THREE.MeshToonMaterial({ color: 0x00ccff, emissive: 0x00ccff  })
  indicatorTop = new THREE.Mesh(geometry, material)
  indicatorTop.position.y = 100 
  indicatorTop.position.x = movements[ 0 ].x 
  indicatorTop.position.z = movements[ 0 ].z 
  indicatorTop.rotation.x = -0.97
  indicatorTop.rotation.y = Math.PI / 4
  indicatorTop.name = 'indicator_top'
  scene.add(indicatorTop)
  
  geometry = new THREE.TetrahedronGeometry(topSize + outlineSize, 0)
  material = new THREE.MeshBasicMaterial({ color : 0x0000000, side: THREE.BackSide })
  const outlineTop = new THREE.Mesh(geometry, material)
  indicatorTop.add(outlineTop)
  
  geometry = new THREE.TorusGeometry(bottomRadius, (bottomRadius * 0.25), 2, 12)
  geometry.dynamic = true
  material = new THREE.MeshToonMaterial({ color: 0x00ccff, emissive: 0x00ccff })
  indicatorBottom = new THREE.Mesh(geometry, material)
  indicatorBottom.position.y = 2.5
  indicatorBottom.position.x = movements[ 0 ].x
  indicatorBottom.position.z = movements[ 0 ].z
  indicatorBottom.rotation.x = -Math.PI / 2
  scene.add(indicatorBottom)
  
  geometry = new THREE.TorusGeometry(bottomRadius + outlineSize / 10, bottomRadius / 2.5, 2, 24)
  material = new THREE.MeshBasicMaterial({ color : 0x0000000, side: THREE.BackSide })
  const outlineBottom = new THREE.Mesh(geometry, material)
  outlineBottom.position.z = -2
  indicatorBottom.add(outlineBottom)
}

function handleMouseDown(event, bypass = false) {
  event.preventDefault()
  if (event.which == 3 || bypass === true) {
    stopMovement()
    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    
    const intersects = raycaster.intersectObjects(objects)
    if (intersects.length > 0) 
      movements.push(intersects[ 0 ].point)
  }
}

function handleTouchStart(event) {
  event.preventDefault()
  event.clientX = event.touches[0].clientX
  event.clientY = event.touches[0].clientY
  
  const bypass = detectDoubleTouch()
  console.log(bypass)
  handleMouseDown(event, bypass)
}

function render() {
  renderer.render(scene, camera)
  if (camera.position.y < 10) camera.position.y = 10
  
  if (movements.length > 0) {
    if (scene.getObjectByName('indicator_top') === undefined) 
      drawIndicator()
    else 
    if (indicatorTop.position.y > 10) 
      indicatorTop.position.y -= 3
    else 
      indicatorTop.position.y = 100
    move(rotationPoint, movements[ 0 ])
  }
  
  if (collisions.length > 0) detectCollisions()
}

init()

void function animate() {
  requestAnimationFrame(animate)
  camera.updateProjectionMatrix()
  render()
}() 

