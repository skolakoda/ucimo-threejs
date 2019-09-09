// TODO: https://threejs.org/examples/webgl_points_sprites.html

function initRenderer(additionalProperties) {
  const props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {}
  const renderer = new THREE.WebGLRenderer(props)
  renderer.shadowMap.enabled = true
  renderer.shadowMapSoft = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.getElementById('webgl-output').appendChild(renderer.domElement)

  return renderer
}

function initCamera(initialPosition) {
  const position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-30, 40, 30)
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.copy(position)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  return camera
}

const renderer = initRenderer()
const scene = new THREE.Scene()
const camera = initCamera(new THREE.Vector3(20, 40, 110))
camera.lookAt(new THREE.Vector3(20, 30, 0))

const controls = new function() {
  this.size = 6
  this.opacity = 0.9
  this.color = 0xffffff

  this.sizeAttenuation = true

  this.redraw = function() {
    const toRemove = []
    scene.children.forEach(child => {
      if (child instanceof THREE.Points)
        toRemove.push(child)

    })
    toRemove.forEach(child => {
      scene.remove(child)
    })
    createPointInstances(controls.size, controls.opacity, controls.sizeAttenuation,
      controls.color)
  }
}

const gui = new dat.GUI()
gui.add(controls, 'size', 0, 20).onChange(controls.redraw)
gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw)
gui.addColor(controls, 'color').onChange(controls.redraw)
gui.add(controls, 'sizeAttenuation').onChange(controls.redraw)

controls.redraw()

function createPointCloud(texture, size, opacity, sizeAttenuation, color) {
  const geom = new THREE.Geometry()
  color = new THREE.Color(color)
  color.setHSL(color.getHSL().h,
    color.getHSL().s,
    (Math.random()) * color.getHSL().l)

  const material = new THREE.PointsMaterial({
    size,
    opacity,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation,
    color
  })

  const range = 40
  for (let i = 0; i < 150; i++) {
    const particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2)
    particle.velocityY = 0.1 + Math.random() / 5
    particle.velocityX = (Math.random() - 0.5) / 3
    particle.velocityZ = (Math.random() - 0.5) / 3
    geom.vertices.push(particle)
  }

  const system = new THREE.Points(geom, material)
  return system
}

function createPointInstances(size, opacity, sizeAttenuation, color) {
  const loader = new THREE.TextureLoader()
  const texture = loader.load('../../assets/textures/snowflake.png')
  scene.add(createPointCloud(texture, size, opacity, sizeAttenuation, color))
}

void function render() {
  scene.children.forEach(child => {
    if (child instanceof THREE.Points) {
      const vertices = child.geometry.vertices
      vertices.forEach(v => {
        v.y -= (v.velocityY)
        v.x -= (v.velocityX)
        v.z -= (v.velocityZ)

        if (v.y <= 0) v.y = 60
        if (v.x <= -20 || v.x >= 20) v.velocityX *= -1
        if (v.z <= -20 || v.z >= 20) v.velocityZ *= -1
      })

      child.geometry.verticesNeedUpdate = true
    }
  })

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
