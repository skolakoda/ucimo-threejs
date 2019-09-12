import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'

export default class Village extends Entity {
  constructor(game, pos) {
    super(game, pos)
    this.name = 'village'
    this.destination = pos.clone()
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
