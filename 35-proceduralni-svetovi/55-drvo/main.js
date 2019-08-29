/* global Tree */
const camera =  new THREE.Camera(70, window.innerWidth / window.innerHeight, 0.1, 8000)
camera.position.z = -600
camera.position.y = 400

const cameraTarget = new THREE.Object3D()
cameraTarget.position.y = 400
camera.target = cameraTarget

const scene = new THREE.Scene()

const light2 = new THREE.DirectionalLight(0xffffff)
light2.position.x = 1
light2.position.y = 1
light2.position.z = -2
scene.addLight(light2)

const skyMesh = new THREE.Mesh(new THREE.Sphere(4000, 30, 20), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('img/sky2.jpg')}))
skyMesh.scale.x = -1
skyMesh.position.y = -700
scene.addObject(skyMesh)

const groundTexture = THREE.ImageUtils.loadTexture('img/ground2.jpg')
const groundMaterial = new THREE.MeshPhongMaterial({ map:groundTexture, ambient:0xffffff, shininess:0.3})
groundMaterial.shading = THREE.SmoothShading

const planet = new THREE.Sphere(1000, 30, 30)
planet.vertices.forEach(vertex => {
  vertex.position.x += Math.random() * 30
  vertex.position.y += Math.random() * 30
  vertex.position.z += Math.random() * 30
})

planet.computeVertexNormals()
planet.computeFaceNormals()

const planetMesh = new THREE.Mesh(planet, groundMaterial)
planetMesh.position.y = -800
planetMesh.position.z = 0

const branchTexture = THREE.ImageUtils.loadTexture('img/treebark.jpg')
branchTexture.wrapS = branchTexture.wrapT = THREE.RepeatWrapping
const branchMaterial = new THREE.MeshPhongMaterial({ map:branchTexture, shininess: 2, ambient:0x998822})

const tree = new Tree(branchMaterial, -1, 40, 0, 1)
tree.position = new THREE.Vector3(0, 970, 0)
tree.rotation.x = -90 * Math.PI / 180

const treeContainer = new THREE.Object3D()
treeContainer.addChild(tree)

planetMesh.addChild(treeContainer)
scene.addObject(planetMesh)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

scene.addObject(planetMesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
