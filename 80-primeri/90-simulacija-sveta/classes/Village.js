import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {rndInt} from '../utils/helpers.js'

export default class Village extends Entity {
  constructor(game) {
    const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
    const collision = game.place(rndPoint)
    collision.y += 20
    super(game, collision)
    this.name = 'village'
    this.destination = collision.clone()
  }

  createMesh() {
    if (models.village) {
      models.village.scale.set(.1, .1, .1)
      models.village.castShadow = true
      models.village.rotation.x = -Math.PI / 2
      models.village.position.y = -5
      const group = new THREE.Group()
      group.add(models.village.clone())
      this.mesh = group
    }
  }
}
