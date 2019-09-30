import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from '../Entity.js'
import {rndInt, roll} from '../../utils/helpers.js'
import { models } from '../../utils/loaders.js'

const rabbitJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    { id: 'explore', strategy: 'sequential',
      children: [
        { id: 'getRandomDestination' }
      ]
    }
  ]
}

const rabbitStates = {
  idle() {
    console.log('idle')
  },
  getRandomDestination() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 10, rndInt(1100))
    const collision = this.game.place(rndPoint)
    if (collision.y > 5)
      this.destination = collision
  },
  canExplore() {
    return Math.random() > 0.99 && !this.remove && this.health > 0
  },
  sleep() {}
}

export default class Rabbit extends Entity {
  constructor(game) {
    const position = new THREE.Vector3(rndInt(1200), 0, rndInt(1200))
    super(game, position)
    this.name = 'rabbit'
    this.destination = position.clone()
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.state = this.machine.generate(rabbitJson, this, rabbitStates)
  }

  update(delta) {
    const collision = this.game.place(this.pos)
    this.pos.y = collision.y + 5
    this.state = this.state.tick()
    super.update(delta)
  }

  createMesh() {
    if (models.rabbit) {
      models.rabbit.castShadow = true
      const group = new THREE.Group()
      group.scale.set(.05, .05, .05)
      group.add(models.rabbit.clone())
      this.mesh = group
      this.mesh.name = 'rabbit'
    }
  }

  attacked() {
    this.health -= roll(6)
    if (this.health <= 0) {
      this.speed = 0
      this.remove = true
    }
    this.speed = 140
  }
}
