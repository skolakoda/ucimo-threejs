/* global chroma */
let renderer
let scene
let camera
let control
let context
let sourceNode
let analyser
let javascriptNode

const scale = chroma.scale(['white', 'blue', 'red']).domain([0, 20])

const pm = new THREE.ParticleBasicMaterial()
pm.map = THREE.ImageUtils.loadTexture('../../assets/teksture/ball.png')
pm.transparent = true
pm.opacity = 0.4
pm.size = 0.9
pm.vertexColors = true

const particleWidth = 100
const spacing = 0.26
let centerParticle

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xffffff, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

camera.position.x = 200
camera.position.y = 200
camera.position.z = 200
camera.lookAt(scene.position)

control = {
  rotationSpeed: 0.001,
  opacity: 0.6,
}

document.body.appendChild(renderer.domElement)

create3DTerrain(100, 100, 2.5, 2.5, 10)
setupSound()
loadSound('../../assets/audio/wagner-short.ogg')

function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y

  return Math.max(v1, v2, v3)
}

function create3DTerrain(width, depth, spacingX, spacingZ, height) {
  const date = new Date()
  noise.seed(date.getMilliseconds())

  const geometry = new THREE.Geometry()
  for (let z = 0; z < depth; z++)
    for (let x = 0; x < width; x++) {

      const yValue = 0
      const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
      geometry.vertices.push(vertex)
    }

  for (let z = 0; z < depth - 1; z++)
    for (let x = 0; x < width - 1; x++) {

      const a = x + z * width
      const b = (x + 1) + (z * width)
      const c = x + ((z + 1) * width)
      const d = (x + 1) + ((z + 1) * width)

      const uva = new THREE.Vector2(x / (width - 1), 1 - z / (depth - 1))
      const uvb = new THREE.Vector2((x + 1) / (width - 1), 1 - z / (depth - 1))
      const uvc = new THREE.Vector2(x / (width - 1), 1 - (z + 1) / (depth - 1))
      const uvd = new THREE.Vector2((x + 1) / (width - 1), 1 - (z + 1) / (depth - 1))

      const face1 = new THREE.Face3(b, a, c)
      const face2 = new THREE.Face3(c, d, b)

      face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex())
      face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())

      geometry.faces.push(face1)
      geometry.faces.push(face2)

      geometry.faceVertexUvs[0].push([uvb, uva, uvc])
      geometry.faceVertexUvs[0].push([uvc, uvd, uvb])
    }

  centerParticle = getCenterParticle()

  geometry.computeVertexNormals(true)
  geometry.computeFaceNormals()

  const mat = new THREE.MeshBasicMaterial()

  mat.map = THREE.ImageUtils.loadTexture('../../assets/teksture/wood_1-1024x1024.png')

  const groundMesh = new THREE.Mesh(geometry, mat)
  groundMesh.translateX(-width * spacingX / 2)
  groundMesh.translateZ(-depth * spacingZ / 2)
  groundMesh.translateY(50)
  groundMesh.name = 'terrain'

  scene.add(groundMesh)
}

function setupSound() {
  context = new AudioContext()

  javascriptNode = context.createScriptProcessor(1024, 1, 1)
  javascriptNode.connect(context.destination)
  javascriptNode.onaudioprocess = function() {

    const array = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(array)

    const lowValue = getAverageVolume(array, 0, 300)
    const midValue = getAverageVolume(array, 301, 600)
    const highValue = getAverageVolume(array, 601, 1000)

    const ps = scene.getObjectByName('terrain')
    const geom = ps.geometry

    const lowOffsets = []
    const midOffsets = []
    const highOffsets = []
    const lowRings = 10
    const midRings = 10
    const highRings = 10
    const midFrom = 12
    const highFrom = 24
    const lowVolumeDownScale = 5
    const midVolumeDownScale = 0.5
    const highVolumeDownScale = 0.5

    for (let i = lowRings; i > 0; i--)
      lowOffsets.push(Math.sin(Math.PI * (0.5 * (i / lowRings))))

    const lowParticles = []
    for (let i = 0; i < lowRings; i++)
      lowParticles.push(getFallOffParticles(centerParticle, (i + 1) * spacing, i * spacing))

    for (let i = 0; i < midRings / 2; i++)
      midOffsets.push(Math.sin(Math.PI * (0.5 * (i / (midRings / 2)))))

    for (let i = midRings / 2; i < midRings; i++)
      midOffsets.push(Math.sin(Math.PI * (0.5 * (i / (midRings / 2)))))

    const midParticles = []
    for (let i = 0; i < midRings; i++)
      midParticles.push(getFallOffParticles(centerParticle, (i + 1 + midFrom) * spacing, (i + midFrom) * spacing))

    for (let i = 0; i < midRings / 2; i++)
      highOffsets.push(Math.sin(Math.PI * (0.5 * (i / (highRings / 2)))))

    for (let i = highRings / 2; i < highRings; i++)
      highOffsets.push(Math.sin(Math.PI * (0.5 * (i / (highRings / 2)))))

    const highParticles = []
    for (let i = 0; i < highRings; i++)
      highParticles.push(getFallOffParticles(centerParticle, (i + 1 + highFrom) * spacing, (i + highFrom) * spacing))

    renderRing(geom, [centerParticle], lowValue, 1, lowVolumeDownScale)

    for (let i = 0; i < lowRings; i++)
      renderRing(geom, lowParticles[i], lowValue, lowOffsets[i], lowVolumeDownScale)

    for (let i = 0; i < midRings; i++)
      renderRing(geom, midParticles[i], midValue, midOffsets[i], midVolumeDownScale)

    for (let i = 0; i < highRings; i++)
      renderRing(geom, highParticles[i], highValue, highOffsets[i], highVolumeDownScale)
  }

  analyser = context.createAnalyser()
  analyser.smoothingTimeConstant = 0.1
  analyser.fftSize = 2048

  sourceNode = context.createBufferSource()
  const splitter = context.createChannelSplitter()
  sourceNode.connect(splitter)
  splitter.connect(analyser, 0, 0)
  analyser.connect(javascriptNode)
  sourceNode.connect(context.destination)
  context = new AudioContext()
}

function renderRing(geom, particles, value, distanceOffset, volumeDownScale) {
  for (let i = 0; i < particles.length; i++)
    if (geom.vertices[i]) {
      geom.vertices[particles[i]].y = distanceOffset * value / volumeDownScale
      geom.colors[particles[i]] = new THREE.Color(scale(distanceOffset * value).hex())
    }
}

function getCenterParticle() {
  const center = Math.ceil(particleWidth / 2)
  const centerParticle = center + (center * particleWidth)
  return centerParticle
}

function getFallOffParticles(center, radiusStart, radiusEnd) {
  const result = []
  const ps = scene.getObjectByName('terrain')
  const geom = ps.geometry
  const centerParticle = geom.vertices[center]
  const dStart = Math.sqrt(radiusStart * radiusStart + radiusStart * radiusStart)
  const dEnd = Math.sqrt(radiusEnd * radiusEnd + radiusEnd * radiusEnd)

  for (let i = 0; i < geom.vertices.length; i++) {
    const point = geom.vertices[i]
    const xDistance = Math.abs(centerParticle.x - point.x)
    const zDistance = Math.abs(centerParticle.z - point.z)
    const dParticle = Math.sqrt(xDistance * xDistance + zDistance * zDistance)
    if (dParticle < dStart && dParticle >= dEnd && i !== center)
      result.push(i)
  }
  return result
}

function getAverageVolume(array, start, end) {
  let values = 0
  let average
  const length = end - start
  for (let i = start; i < end; i++)
    values += array[i]
  average = values / length
  return average
}

function playSound(buffer) {
  sourceNode.buffer = buffer
  sourceNode.start(0)
}

function loadSound(url) {
  const http = new XMLHttpRequest()
  http.open('GET', url, true)
  http.responseType = 'arraybuffer'
  http.onload = () => context.decodeAudioData(http.response, buffer => {
    playSound(buffer)
  })
  http.send()
}

void function render() {
  const rotSpeed = control.rotationSpeed
  camera.position.x = camera.position.x * Math.cos(rotSpeed) + camera.position.z * Math.sin(rotSpeed)
  camera.position.z = camera.position.z * Math.cos(rotSpeed) - camera.position.x * Math.sin(rotSpeed)
  camera.lookAt(scene.position)

  renderer.render(scene, camera)

  if (scene.getObjectByName('terrain')) {
    scene.getObjectByName('terrain').geometry.verticesNeedUpdate = true
    scene.getObjectByName('terrain').geometry.computeVertexNormals(true)
    scene.getObjectByName('terrain').geometry.computeFaceNormals()
  }

  window.requestAnimationFrame(render)
}()