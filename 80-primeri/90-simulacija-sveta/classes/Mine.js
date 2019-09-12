import Entity from './Entity.js'
import {models} from '../utils/loaders.js'
import {roll} from '../utils/helpers.js'

export default class Mine extends Entity {
  constructor(game, pos) {
    super(game, pos)
    this.name = 'mine'
    this.destination = pos.clone()
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
