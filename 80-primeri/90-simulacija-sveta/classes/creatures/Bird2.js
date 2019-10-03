import * as THREE from '/node_modules/three/build/three.module.js'
import Entity from '../Entity.js'
import { rndInt, roll } from '../../utils/helpers.js'

export default class Bird extends Entity {
  constructor(model) {
    super(model)
    this.name = 'bird'
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.mixer = null
    this.createMesh()
    this.mesh.position.copy(new THREE.Vector3(rndInt(1100), 60 + roll(50), rndInt(1100)))
  }

  createMesh() {
    const {scene, animations} = this.model
    this.mesh = scene.clone()
    this.mesh.scale.set(.4, .4, .4)
    this.mesh.name = 'bird'
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.mixer.clipAction(animations[0]).play()
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
