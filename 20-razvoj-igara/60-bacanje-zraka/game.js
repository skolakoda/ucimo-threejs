const scene = new THREE.Scene()
const renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer()
const light = new THREE.AmbientLight(0xffffff)
const objects = []
const width = 800
const height = 600

renderer.setSize(width, height)
document.getElementById('webgl-container').appendChild(renderer.domElement)

scene.add(light)

const camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000)
camera.position.z = 150
scene.add(camera)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), new THREE.MeshBasicMaterial({
  color: 0xff0000
}))
sphere.position.set(-25, 0, 0)
objects.push(sphere)

const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), new THREE.MeshBasicMaterial({
  color: 0x00ff00
}))
sphere2.position.set(25, 0, 0)
objects.push(sphere2)
scene.add(sphere)
scene.add(sphere2)

function handleMouseDown(event) {
  const projector = new THREE.Projector()
  const mouseClickVector = new THREE.Vector3(
    (event.clientX / width) * 2 - 1,
    -(event.clientY / height) * 2 + 1,
    0.5
  )
  projector.unprojectVector(mouseClickVector, camera)

  const raycaster = new THREE.Raycaster(camera.position, mouseClickVector.sub(camera.position).normalize())
  const intersects = raycaster.intersectObjects(objects)
  if (intersects.length > 0) 
    intersects[0].object.material.color.setHex(Math.random() * 0xffffff)    
}

void function render() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}()

window.addEventListener('mousedown', handleMouseDown, false)
