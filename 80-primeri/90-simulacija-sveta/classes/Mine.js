import Entity from './Entity.js'
import {objects} from './AssetManager.js'
import {roll} from '../utils/helpers.js'

export default class Mine extends Entity {
  constructor(game, {pos}) {
    super(game, pos)
    this.name = 'mine'
    this.destination = pos.clone()
    this.units = 100
  }

  createMesh() {
    if (objects.mine) {
      objects.mine.scale.set(10, 10, 10)
      objects.mine.castShadow = true
      this.mesh = objects.mine.clone()
      this.rotation.y = roll(180) * (Math.PI / 180)
    }
  }
}