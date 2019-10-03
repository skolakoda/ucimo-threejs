import * as THREE from '/node_modules/three/build/three.module.js'
import Entity from './Entity.js'
import {rndInt, roll} from '../utils/helpers.js'

export default class Cloud extends Entity {
  constructor(model) {
    const position = new THREE.Vector3(rndInt(1200), 100 + rndInt(20), rndInt(1200))
    super(model, position)
    this.name = 'cloud'
    this.destination = new THREE.Vector3(1200, position.y, position.z)
    this.speed = 25
  }

  update(delta) {
    if (this.pos.x > 600)
      this.pos.x = -600
    super.update(delta)
  }

  createMesh() {
    this.model.scale.set(roll(50) + 10, 15, roll(10) + 10)
    this.model.castShadow = true
    this.mesh = this.model.clone()
    this.mesh.name = 'cloud'
  }
}
