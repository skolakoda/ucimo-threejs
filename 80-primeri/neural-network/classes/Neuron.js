import * as THREE from '/node_modules/three/build/three.module.js'
import {Axon} from './Axon.js'
import {Signal} from './Signal.js'

function Connection(axon, startingPoint) {
  this.axon = axon
  this.startingPoint = startingPoint
}

export function Neuron(x, y, z) {
  this.connection = []
  this.recievedSignal = false
  this.lastSignalRelease = 0
  this.releaseDelay = 0
  this.fired = false
  this.firedCount = 0
  this.prevReleaseAxon = null
  THREE.Vector3.call(this, x, y, z)
}

Neuron.prototype = Object.create(THREE.Vector3.prototype)

Neuron.prototype.connectNeuronTo = function(neuronB) {
  const neuronA = this
  // create axon and establish connection
  const axon = new Axon(neuronA, neuronB)
  neuronA.connection.push(new Connection(axon, 'A'))
  neuronB.connection.push(new Connection(axon, 'B'))
  return axon
}

Neuron.prototype.createSignal = function(particlePool, minSpeed, maxSpeed) {

  this.firedCount += 1
  this.recievedSignal = false

  const signals = []
  // create signal to all connected axons
  for (let i = 0; i < this.connection.length; i++)
    if (this.connection[i].axon !== this.prevReleaseAxon) {
      const c = new Signal(particlePool, minSpeed, maxSpeed)
      c.setConnection(this.connection[i])
      signals.push(c)
    }

  return signals

}