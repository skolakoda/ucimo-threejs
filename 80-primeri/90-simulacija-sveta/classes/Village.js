import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {rndInt} from '../utils/helpers.js'

export default class Village extends Entity {
  constructor(game) {
    const rndPoint = new THREE.Vector3(rndInt(1100), 10, rndInt(1100))
    super(game, rndPoint)
    this.name = 'village'
    this.destination = rndPoint.clone()
  }

  createMesh() {
    if (models.village) {
      models.village.scale.set(.1, .1, .1)
      models.village.castShadow = true
      models.village.rotation.x = -Math.PI / 2
      const group = new THREE.Group()
      group.add(models.village.clone())
      this.mesh = group
    }
  }
}
