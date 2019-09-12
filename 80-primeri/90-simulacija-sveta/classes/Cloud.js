import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {rndInt, roll} from '../utils/helpers.js'

export default class Cloud extends Entity {
  constructor(game) {
    const position = new THREE.Vector3(rndInt(1200), 100 + rndInt(20), rndInt(1200))
    super(game, position)
    this.name = 'cloud'
    this.destination = new THREE.Vector3(1200, position.y, position.z)
    this.speed = 25
  }

  update() {
    if (this.pos.x > 600)
      this.pos.x = -600
    super.update()
  }

  createMesh() {
    if (models.cloud) {
      models.cloud.scale.set(roll(50) + 10, 15, roll(10) + 10)
      models.cloud.castShadow = true
      this.mesh = models.cloud.clone()
      this.mesh.name = 'cloud'
    }
  }
}