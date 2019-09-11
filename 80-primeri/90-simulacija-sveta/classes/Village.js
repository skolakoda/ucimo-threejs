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
      models.village.scale.set(15, 15, 15)
      models.village.castShadow = true
      this.mesh = models.village.clone()
      for (let i = 0; i < this.mesh.geometry.vertices.length; i++)
        this.mesh.geometry.vertices[i].y += 1.25
    }
  }
}
