import * as THREE from '/node_modules/three/build/three.module.js'

import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {roll, rndInt} from '../utils/helpers.js'

export default class Mine extends Entity {
  constructor() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 10, rndInt(1100))
    super(rndPoint)
    this.name = 'mine'
    this.destination = rndPoint.clone()
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
