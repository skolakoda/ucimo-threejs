import * as THREE from '/node_modules/three/build/three.module.js'
import Entity from '../Entity.js'
import {rndInt, roll} from '../../utils/helpers.js'

const birdJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    { id: 'explore', strategy: 'sequential',
      children: [
        {id: 'getRandomDestination'},
      ]
    }
  ]
}

const birdStates = {
  idle() {
    console.log('idle')
  },
  getRandomDestination() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 30 + roll(50), rndInt(1100))
    this.destination = rndPoint
  },
  canExplore() {
    return Math.random() > 0.99
  }
}

export default class Bird extends Entity {
  constructor(models) {
    super(models)
    this.mesh.position.y = 60 + roll(50)
    this.name = 'bird'
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.state = this.machine.generate(birdJson, this, birdStates)
    this.mixer = null
  }

  createMesh() {
    if (this.model) {
      const {scene, animations} = this.model
      scene.scale.set(.1, .1, .1)
      scene.castShadow = true
      this.mesh = scene.clone()
      this.mesh.name = 'bird'
      this.mixer = new THREE.AnimationMixer(scene)
      this.mixer.clipAction(animations[0]).play()
    }
  }

  update(delta) {
    this.state = this.state.tick()
    super.update(delta)
    if (this.mixer) this.mixer.update(delta)
  }

  attacked() {
    this.health -= roll(6)
    if (this.health <= 0) {
      this.speed = 0
      this.remove = true
    }
  }
}
