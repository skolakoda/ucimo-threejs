import Entity from './Entity.js'
import {objects} from './AssetManager.js'

export default class Village extends Entity {
  constructor(game, data) {
    super(game, data.pos)
    this.name = 'village'
    this.destination = data.pos.clone()
  }

  createMesh() {
    if (objects.village) {
      objects.village.scale.set(15, 15, 15)
      objects.village.castShadow = true
      this.mesh = objects.village.clone()
      for (let i = 0; i < this.mesh.geometry.vertices.length; i++)
        this.mesh.geometry.vertices[i].y += 1.25
    }
  }
}
