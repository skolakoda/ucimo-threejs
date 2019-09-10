/* global THREE */

const textureLoader = new THREE.TextureLoader()

// Private class for particle pool
function Particle(particlePool) {
  this.particlePool = particlePool
  this.available = true
  THREE.Vector3.call(this, particlePool.offScreenPos.x, particlePool.offScreenPos.y, particlePool.offScreenPos.z)
}

Particle.prototype = Object.create(THREE.Vector3.prototype)

Particle.prototype.free = function() {
  this.available = true
  this.set(this.particlePool.offScreenPos.x, this.particlePool.offScreenPos.y, this.particlePool.offScreenPos.z)
}

function ParticlePool(poolSize) {
  this.spriteTextureSignal = textureLoader.load('sprites/electric.png')
  this.poolSize = poolSize
  this.pGeom = new THREE.Geometry()
  this.particles = this.pGeom.vertices
  this.offScreenPos = new THREE.Vector3(9999, 9999, 9999)	// #CM0A r68 Points default frustumCull = true(extended from Object3D), so need to set to 'false' for this to work with oppScreenPos, else particles will dissappear
  this.pColor = 0xff4400
  this.pSize = 0.6

  for (let ii = 0; ii < this.poolSize; ii++)
    this.particles[ii] = new Particle(this)

  // inner particle
  this.pMat = new THREE.PointsMaterial({
    map: this.spriteTextureSignal,
    size: this.pSize,
    color: this.pColor,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  })

  this.pMesh = new THREE.Points(this.pGeom, this.pMat)
  this.pMesh.frustumCulled = false // ref: #CM0A

  scene.add(this.pMesh)

  // outer particle glow
  this.pMat_outer = new THREE.PointsMaterial({
    map: this.spriteTextureSignal,
    size: this.pSize * 10,
    color: this.pColor,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.025
  })

  this.pMesh_outer = new THREE.Points(this.pGeom, this.pMat_outer)
  this.pMesh_outer.frustumCulled = false // ref:#CM0A

  scene.add(this.pMesh_outer)
}

ParticlePool.prototype.getParticle = function() {
  for (let ii = 0; ii < this.poolSize; ii++) {
    const p = this.particles[ii]
    if (p.available) {
      p.available = false
      return p
    }
  }
  return null
}

ParticlePool.prototype.update = function() {
  this.pGeom.verticesNeedUpdate = true
}

ParticlePool.prototype.updateSettings = function() {
  // inner particle
  this.pMat.color.setHex(this.pColor)
  this.pMat.size = this.pSize
  // outer particle
  this.pMat_outer.color.setHex(this.pColor)
  this.pMat_outer.size = this.pSize * 10
}
