import * as THREE from '/node_modules/three/build/three.module.js'
import { rndInt } from '../../utils/helpers.js'

export default class Bird {
  constructor(model) {
    this.model = model
    this.name = 'bird'
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.mixer = null
    this.createMesh()
  }

  createMesh() {
    const {scene, animations} = this.model
    this.mesh = scene.clone()
    this.mesh.scale.set(.4, .4, .4)
    this.mesh.name = 'bird'
    this.mesh.position.x = rndInt(50)
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.mixer.clipAction(animations[0]).play()
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta)
  }
}
