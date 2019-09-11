import Entity from './Entity.js'

/**
 * Small items to be carried by mobs.
 */
export default class Resource extends Entity {
  constructor(game, name, position) {
    const color = name == 'mine' ? 0xfdd017 : 0x966f33
    super(game, position, color)
    switch(name) {
      case 'tree':
        this.name = 'wood'
        break
      case 'mine':
        this.name = 'gold'
        break
    }
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    const material = new THREE.MeshLambertMaterial({ color: this.color })
    this.mesh = new THREE.Mesh(geometry, material)
    for (let i = 0; i < this.mesh.geometry.vertices.length; i++)
      this.mesh.geometry.vertices[i].y += 5
    this.mesh.castShadow = true
  }
}
