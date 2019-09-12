import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {roll, rndInt} from '../utils/helpers.js'

export default class Mine extends Entity {
  constructor(game) {
    const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
    const collision = game.place(rndPoint)
    collision.y += 10
    super(game, collision)
    this.name = 'mine'
    this.destination = collision.clone()
    this.units = 100
  }

  createMesh() {
    if (models.mine) {
      models.mine.scale.set(10, 10, 10)
      models.mine.castShadow = true
      this.mesh = models.mine.clone()
      this.rotation.y = roll(180) * (Math.PI / 180)
    }
  }
}
