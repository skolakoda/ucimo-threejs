import Entity from '../Entity.js'
import {rndInt, roll} from '../../utils/helpers.js'

const birdJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    { id: 'explore', strategy: 'sequential',
      children: [
        {id: 'getRandomDestination'},
      ]
    }
  ]
}

function createBird() {
  const geometry = new THREE.BoxGeometry(2, 2, 5)
  const material = new THREE.MeshLambertMaterial({ color: 0xff6666, vertexColors: THREE.FaceColors })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  return mesh
}

const birdStates = {
  idle() {
    console.log('idle')
  },
  getRandomDestination() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 30 + roll(50), rndInt(1100))
    this.destination = rndPoint
  },
  canExplore() {
    return Math.random() > 0.99
  },
  sleep() {}
}

export default class Bird extends Entity {
  constructor(game) {
    const position = new THREE.Vector3(rndInt(1100), 60 + roll(50), rndInt(1100))
    super(game, position)
    this.name = 'bird'
    this.destination = position.clone()
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.state = this.game.machine.generate(birdJson, this, birdStates)
  }

  update() {
    this.state = this.state.tick()
    super.update()
  }

  createMesh() {
    this.mesh = createBird()
  }

  attacked() {
    this.health -= roll(6)
    if (this.health <= 0) {
      this.speed = 0
      this.remove = true
    }
  }
}
