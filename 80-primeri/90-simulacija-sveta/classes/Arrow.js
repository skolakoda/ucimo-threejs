import Entity from './Entity.js'
import {rndInt, roll} from '../utils/helpers.js'

export default class Arrow extends Entity {
  constructor(game, data) {
    super(game, data.pos)
    const offset = data.offset || 10
    const randomOffset = new THREE.Vector3(rndInt(offset), roll(offset), rndInt(offset))
    this.name = 'arrow'
    this.destination = data.destination.add(randomOffset)
    this.speed = data.speed || 600
    this.lifeSpan = data.lifeSpan || 150
  }

  update() {
    this.lifeSpan--
    this.speed--
    if (this.lifeSpan <= 0) {
      this.speed = 0
      this.remove = true
    }
    super.update()
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 5)
    const material = new THREE.MeshLambertMaterial({ color: 0x966f33 })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
  }
}
