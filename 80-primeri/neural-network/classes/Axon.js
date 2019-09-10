import * as THREE from '/node_modules/three/build/three.module.js'

export function Axon(neuronA, neuronB) {
  this.bezierSubdivision = 8
  this.neuronA = neuronA
  this.neuronB = neuronB
  this.cpLength = neuronA.distanceTo(neuronB) / THREE.Math.randFloat(1.5, 4.0)
  this.controlPointA = this.getControlPoint(neuronA, neuronB)
  this.controlPointB = this.getControlPoint(neuronB, neuronA)
  THREE.CubicBezierCurve3.call(this, this.neuronA, this.controlPointA, this.controlPointB, this.neuronB)
  this.geom = new THREE.Geometry()
  this.geom.vertices = this.calculateVertices()
}

Axon.prototype = Object.create(THREE.CubicBezierCurve3.prototype)

Axon.prototype.calculateVertices = function() {
  return this.getSpacedPoints(this.bezierSubdivision)
}

// generate uniformly distribute vector within x-theta cone from arbitrary vector v1, v2
Axon.prototype.getControlPoint = function(v1, v2) {
  const dirVec = new THREE.Vector3().copy(v2).sub(v1).normalize()
  const northPole = new THREE.Vector3(0, 0, 1)	// this is original axis where point get sampled
  const axis = new THREE.Vector3().crossVectors(northPole, dirVec).normalize()	// get axis of rotation from original axis to dirVec
  const axisTheta = dirVec.angleTo(northPole)	// get angle
  const rotMat = new THREE.Matrix4().makeRotationAxis(axis, axisTheta)	// build rotation matrix
  const minz = Math.cos(THREE.Math.degToRad(45))	// cone spread in degrees
  const z = THREE.Math.randFloat(minz, 1)
  const theta = THREE.Math.randFloat(0, Math.PI * 2)
  const r = Math.sqrt(1 - z * z)
  const cpPos = new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), z)
  cpPos.multiplyScalar(this.cpLength)	// length of cpPoint
  cpPos.applyMatrix4(rotMat)	// rotate to dirVec
  cpPos.add(v1)	// translate to v1
  return cpPos
}