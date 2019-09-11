import Entity from './Entity.js'
import {models} from '../utils/loaders.js'

export default class Village extends Entity {
  constructor(game, data) {
    super(game, data.pos)
    this.name = 'village'
    this.destination = data.pos.clone()
  }

  createMesh() {
    if (models.village) {
      models.village.scale.set(10, 10, 10)
      models.village.castShadow = true
      this.mesh = models.village.clone()
    }
  }
}
