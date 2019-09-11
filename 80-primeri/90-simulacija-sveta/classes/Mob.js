import Entity from './Entity.js'
import Arrow from './Arrow.js'
import Resource from './Resource.js'
import {rndInt, roll} from '../utils/helpers.js'

const mobJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    {
      id: 'explore', strategy: 'sequential',
      children: [
        {
          id: 'hunt', strategy: 'sequential',
          children: [
            { id: 'getPrey' },
            { id: 'track' },
            { id: 'attack' },
            { id: 'getKill' },
            { id: 'deliverKill' },
            { id: 'dropKill' }
          ]
        }
      ]
    }
  ]
}

const mobStates = {
  idle() {
    console.log('idle')
  },
  explore() {
    console.log('exploring')
  },
  hunt() {
    console.log('hunting')
  },
  getRandomDestination() {
    this.goRandom()
  },
  canExplore() {
    return Math.random() > 0.99
  },
  canHunt() {
    return !this.carryEntity
  },
  getPrey() {
    if (!this.hasPrey())
      this.getPrey()
  },
  canGetPrey() {
    return !this.hasPrey() && !this.carryEntity
  },
  track() {
    this.track()
  },
  canTrack() {
    return this.hasPrey()
  },
  attack() {
    this.attack()
  },
  canAttack() {
    return this.hasPrey() && this.prey.pos.distanceTo(this.pos) < 500 && this.prey.health > 0
  },
  getKill() {
    this.destination = this.prey.pos.clone()
  },
  canGetKill() {
    return this.hasPrey() && this.prey.health <= 0 && !this.carryEntity
  },
  deliverKill() {
    this.carry(this.prey)
    this.destination = this.game.getCloseEntity('village', this.pos, 2000).pos.clone()
  },
  canDeliverKill() {
    return this.hasPrey() && this.prey.pos.distanceTo(this.pos) < 50 && this.prey.health <= 0
  },
  dropKill() {
    this.drop()
  },
  canDropKill() {
    return this.hasPrey() && this.prey.health <= 0 && this.carryEntity && this.game.getCloseEntity('village', this.pos, 1500).pos.distanceTo(this.pos) < 100
  }
}

export default class Mob extends Entity {
  constructor(game) {
    const position = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
    super(game, position)
    this.name = 'mob'
    this.destination = position.clone()
    this.target = null
    this.speed = 40
    this.log = false
    this.fps = false
    this.state = this.game.machine.generate(mobJson, this, mobStates)
    this.carryEntity = undefined
    this.shootCooldown = 5
    this.vision = 50
  }

  update() {
    const collision = this.game.place(this.pos)
    this.pos.y = collision.y + 1.5
    this.shootCooldown--
    this.state = this.state.tick()
    // carrying resource
    if (this.carryEntity) {
      this.carryEntity.pos.x = this.pos.x - 4
      this.carryEntity.pos.y = this.pos.y
      this.carryEntity.pos.z = this.pos.z - 4
    }
    super.update()
    if (this.fps) this.game.cameraFPS.lookAt(this.destination)
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(5, 10, 5)
    const material = new THREE.MeshLambertMaterial({ color: 0xecc2a7 })
    this.mesh = new THREE.Mesh(geometry, material)
    for (let i = 0; i < this.mesh.geometry.vertices.length; i++)
      this.mesh.geometry.vertices[i].y += 5

    this.mesh.castShadow = true
    this.mesh.name = this.name
  }

  carry(entity) {
    if (entity.name !== 'rabbit') {
      if (entity.units > 0) {
        entity.units -= 1
        const resource = new Resource(this.game, entity.name, this.pos.clone())
        this.game.addEntity(resource)
        this.carryEntity = resource
      }
    } else this.carryEntity = entity
  }

  drop() {
    if (this.carryEntity) {
      this.carryEntity.pos = new THREE.Vector3(this.pos.x, 0, this.pos.z)
      this.carryEntity = undefined
    }
    if (this.prey) this.prey = undefined
  }

  shoot(destination) {
    if (this.shootCooldown > 0) return
    this.game.addEntity(
      new Arrow(
        this.game,
        {
          pos: this.pos.clone(),
          destination,
          lifeSpan: 300,
          speed: 600,
          offset: 10
        }
      )
    )
    this.shootCooldown = 5
  }

  getPrey() {
    const rabbit = this.game.getCloseEntity('rabbit', this.pos, 1100)
    const bird = this.game.getCloseEntity('bird', this.pos, 1100)
    const prey = [rabbit, bird]
    this.prey = prey[roll(2)]
  }

  hasPrey() {
    return this.prey
  }

  track() {
    this.destination = this.prey.pos.clone()
  }

  goRandom() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 10, rndInt(1100))
    const collision = this.game.place(rndPoint)
    if (collision.y > 5) this.destination = collision
  }

  attack() {
    this.shoot(this.prey.pos.clone())
    if (roll(5) === 1) this.prey.attacked()
  }
}
