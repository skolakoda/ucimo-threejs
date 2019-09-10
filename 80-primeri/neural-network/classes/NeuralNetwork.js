/* global THREE */

const textureLoader = new THREE.TextureLoader()

function NeuralNetwork() {
  this.initialized = false

  // settings
  this.verticesSkipStep = 2	// 2
  this.maxAxonDist = 8	// 8
  this.maxConnectionPerNeuron = 6	// 6

  this.currentMaxSignals = 8000
  this.limitSignals = 12000
  this.particlePool = new ParticlePool(this.limitSignals)	// *************** ParticlePool must bigger than limit Signal ************

  this.signalMinSpeed = 0.035
  this.signalMaxSpeed = 0.065

  // NN component containers
  this.allNeurons = []
  this.allSignals = []
  this.allAxons = []

  // axon
  this.axonOpacityMultiplier = 1.0
  this.axonColor = 0x0099ff
  this.axonGeom = new THREE.BufferGeometry()
  this.axonPositions = []
  this.axonIndices = []
  this.axonNextPositionsIndex = 0

  this.shaderUniforms = {
    color:             { type: 'c', value: new THREE.Color(this.axonColor) },
    opacityMultiplier: { type: 'f', value: 1.0 }
  }

  this.shaderAttributes = {
    opacityAttr:       { type: 'f', value: [] }
  }

  // neuron
  this.neuronSize = 0.7
  this.spriteTextureNeuron = textureLoader.load('sprites/electric.png')
  this.neuronColor = 0x00ffff
  this.neuronOpacity = 1.0
  this.neuronsGeom = new THREE.Geometry()
  this.neuronMaterial = new THREE.PointsMaterial({
    map: this.spriteTextureNeuron,
    size: this.neuronSize,
    color: this.neuronColor,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: this.neuronOpacity
  })

  // info api
  this.numNeurons = 0
  this.numAxons = 0
  this.numSignals = 0

  // initialize NN
  this.initNeuralNetwork()
}

NeuralNetwork.prototype.initNeuralNetwork = function() {

  // obj loader
  const self = this
  let loadedMesh, loadedMeshVertices
  const loader = new THREE.OBJLoader()

  loader.load('models/brain_vertex_low.obj', loadedObject => {

    loadedMesh = loadedObject.children[0]
    loadedMeshVertices = loadedMesh.geometry.vertices

    self.initNeurons(loadedMeshVertices)
    self.initAxons()

    self.initialized = true

    console.log('Neural Network initialized')
    document.getElementById('loading').style.display = 'none'	// hide loading animation when finish loading model

  }) // end of loader
}

NeuralNetwork.prototype.initNeurons = function(inputVertices) {

  for (let i = 0; i < inputVertices.length; i += this.verticesSkipStep) {
    const pos = inputVertices[i]
    const n = new Neuron(pos.x, pos.y, pos.z)
    this.allNeurons.push(n)
    this.neuronsGeom.vertices.push(n)
  }

  // neuron mesh
  this.neuronParticles = new THREE.Points(this.neuronsGeom, this.neuronMaterial)
  scene.add(this.neuronParticles)
}

NeuralNetwork.prototype.initAxons = function() {

  const allNeuronsLength = this.allNeurons.length
  for (let j = 0; j < allNeuronsLength; j++) {
    const n1 = this.allNeurons[j]
    for (let k = j + 1; k < allNeuronsLength; k++) {
      const n2 = this.allNeurons[k]
      // connect neuron if distance ... and limit connection per neuron to not more than x
      if (n1 !== n2 && n1.distanceTo(n2) < this.maxAxonDist &&
						n1.connection.length < this.maxConnectionPerNeuron &&
						n2.connection.length < this.maxConnectionPerNeuron)
      {
        const connectedAxon = n1.connectNeuronTo(n2)
        this.constructAxonArrayBuffer(connectedAxon)
      }
    }
  }

  // *** attirbute size must bigger than its content ***
  const axonIndices = new Uint32Array(this.axonIndices.length)
  const axonPositions = new Float32Array(this.axonPositions.length)
  const axonOpacities = new Float32Array(this.shaderAttributes.opacityAttr.value.length)

  // transfer temp-array to arrayBuffer
  transferToArrayBuffer(this.axonIndices, axonIndices)
  transferToArrayBuffer(this.axonPositions, axonPositions)
  transferToArrayBuffer(this.shaderAttributes.opacityAttr.value, axonOpacities)

  function transferToArrayBuffer(fromArr, toArr) {
    for (i = 0; i < toArr.length; i++)
      toArr[i] = fromArr[i]

  }

  this.axonGeom.addAttribute('index', new THREE.BufferAttribute(axonIndices, 1))
  this.axonGeom.addAttribute('position', new THREE.BufferAttribute(axonPositions, 3))
  this.axonGeom.addAttribute('opacityAttr', new THREE.BufferAttribute(axonOpacities, 1))

  // axons mesh
  this.shaderMaterial = new THREE.ShaderMaterial({
    uniforms:       this.shaderUniforms,
    attributes:     this.shaderAttributes,
    vertexShader:   document.getElementById('vertexshader-axon').textContent,
    fragmentShader: document.getElementById('fragmentshader-axon').textContent,
    blending:       THREE.AdditiveBlending,
    // depthTest:      false,
    transparent:    true
  })

  this.axonMesh = new THREE.Line(this.axonGeom, this.shaderMaterial, THREE.LinePieces)

  scene.add(this.axonMesh)
}

NeuralNetwork.prototype.update = function() {
  if (!this.initialized) return

  let n, ii
  const currentTime = Date.now()

  // update neurons state and release signal
  for (ii = 0; ii < this.allNeurons.length; ii++) {
    n = this.allNeurons[ii]

    if (this.allSignals.length < this.currentMaxSignals - this.maxConnectionPerNeuron) 		// currentMaxSignals - maxConnectionPerNeuron because allSignals can not bigger than particlePool size

      if (n.recievedSignal && n.firedCount < 8)  {	// Traversal mode
        // if (n.recievedSignal && (currentTime - n.lastSignalRelease > n.releaseDelay) && n.firedCount < 8)  {	// Random mode
        // if (n.recievedSignal && !n.fired )  {	// Single propagation mode
        n.fired = true
        n.lastSignalRelease = currentTime
        n.releaseDelay = THREE.Math.randInt(100, 1000)
        this.releaseSignalAt(n)
      }

    n.recievedSignal = false	// if neuron recieved signal but still in delay reset it
  }

  // reset all neurons and when there is X signal
  if (this.allSignals.length <= 0) {
    for (ii = 0; ii < this.allNeurons.length; ii++) {	// reset all neuron state
      n = this.allNeurons[ii]
      n.releaseDelay = 0
      n.fired = false
      n.recievedSignal = false
      n.firedCount = 0
    }
    this.releaseSignalAt(this.allNeurons[THREE.Math.randInt(0, this.allNeurons.length)])
  }

  // update and remove signals
  for (let j = this.allSignals.length - 1; j >= 0; j--) {
    const s = this.allSignals[j]
    s.travel()

    if (!s.alive) {
      s.particle.free()
      for (let k = this.allSignals.length - 1; k >= 0; k--)
        if (s === this.allSignals[k]) {
          this.allSignals.splice(k, 1)
          break
        }
    }
  }
  // update particle pool vertices
  this.particlePool.update()
  // update info for GUI
  this.updateInfo()
}

// add vertices to temp-arrayBuffer, generate temp-indexBuffer and temp-opacityArrayBuffer
NeuralNetwork.prototype.constructAxonArrayBuffer = function(axon) {
  this.allAxons.push(axon)
  const {vertices} = axon.geom
  const numVerts = vertices.length

  // &&&&&&&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^
  // var opacity = THREE.Math.randFloat(0.001, 0.1);

  for (let i = 0; i < numVerts; i++) {
    this.axonPositions.push(vertices[i].x, vertices[i].y, vertices[i].z)

    if (i < numVerts - 1) {
      const idx = this.axonNextPositionsIndex
      this.axonIndices.push(idx, idx + 1)
      const opacity = THREE.Math.randFloat(0.002, 0.2)
      this.shaderAttributes.opacityAttr.value.push(opacity, opacity)
    }
    this.axonNextPositionsIndex += 1
  }
}

NeuralNetwork.prototype.releaseSignalAt = function(neuron) {
  const signals = neuron.createSignal(this.particlePool, this.signalMinSpeed, this.signalMaxSpeed)
  for (let ii = 0; ii < signals.length; ii++) {
    const s = signals[ii]
    this.allSignals.push(s)
  }
}

NeuralNetwork.prototype.updateInfo = function() {
  this.numNeurons = this.allNeurons.length
  this.numAxons = this.allAxons.length
  this.numSignals = this.allSignals.length
}

NeuralNetwork.prototype.updateSettings = function() {
  this.neuronMaterial.opacity = this.neuronOpacity
  this.neuronMaterial.color.setHex(this.neuronColor)
  this.neuronMaterial.size = this.neuronSize

  this.shaderUniforms.color.value.set(this.axonColor)
  this.shaderUniforms.opacityMultiplier.value = this.axonOpacityMultiplier
  this.particlePool.updateSettings()
}
