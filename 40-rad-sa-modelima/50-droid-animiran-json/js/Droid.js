const movements = {
  stand: {
    animMin: 0,
    animMax: 39,
    animFps: 9,
    state: 'stand',
    action: false
  },
  run: {
    animMin: 40,
    animMax: 45,
    animFps: 10,
    state: 'stand',
    action: false
  },
  attack: {
    animMin: 46,
    animMax: 53,
    animFps: 10,
    state: 'stand',
    action: true
  },
  pain1: {
    animMin: 54,
    animMax: 57,
    animFps: 7,
    state: 'stand',
    action: true
  },
  pain2: {
    animMin: 58,
    animMax: 61,
    animFps: 7,
    state: 'stand',
    action: true
  },
  pain3: {
    animMin: 62,
    animMax: 65,
    animFps: 7,
    state: 'stand',
    action: true
  },
  jump: {
    animMin: 66,
    animMax: 71,
    animFps: 7,
    state: 'stand',
    action: true
  },
  flip: {
    animMin: 72,
    animMax: 83,
    animFps: 7,
    state: 'stand',
    action: true
  },
  salute: {
    animMin: 84,
    animMax: 94,
    animFps: 7,
    state: 'stand',
    action: true
  },
  taunt: {
    animMin: 95,
    animMax: 111,
    animFps: 10,
    state: 'stand',
    action: true
  },
  wave: {
    animMin: 112,
    animMax: 122,
    animFps: 7,
    state: 'stand',
    action: true
  },
  point: {
    animMin: 123,
    animMax: 134,
    animFps: 6,
    state: 'stand',
    action: true
  },
  crstand: {
    animMin: 135,
    animMax: 153,
    animFps: 10,
    state: 'crstand',
    action: false
  },
  crwalk: {
    animMin: 154,
    animMax: 159,
    animFps: 7,
    state: 'crstand',
    action: false
  },
  crattack: {
    animMin: 160,
    animMax: 168,
    animFps: 10,
    state: 'crstand',
    action: true
  },
  crpain: {
    animMin: 196,
    animMax: 172,
    animFps: 7,
    state: 'crstand',
    action: true
  },
  crdeath: {
    animMin: 173,
    animMax: 177,
    animFps: 5,
    state: 'freeze',
    action: true
  },
  death1: {
    animMin: 178,
    animMax: 183,
    animFps: 7,
    state: 'freeze',
    action: true
  },
  death2: {
    animMin: 184,
    animMax: 189,
    animFps: 7,
    state: 'freeze',
    action: true
  },
  death3: {
    animMin: 190,
    animMax: 197,
    animFps: 7,
    state: 'freeze',
    action: true
  }
}

const loader = new THREE.JSONLoader()

export default class Droid {
  constructor(scene) {
    this.scene = scene
    this.mesh = null
    this.movement = 'stand'
    this.state = 'stand'
    this.loadModel()
  }

  loadModel() {
    const material = new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture('model/teksture/droid-tekstura.png'),
      morphTargets: true
    })
    loader.load('model/droid.json', geometry => {
      this.mesh = new THREE.MorphAnimMesh(geometry, material)
      this.changeMovement('stand')
      this.scene.add(this.mesh)
    })
  }

  changeMovement(movement) {
    this.movement = movement
    if (!movements[movement]) return
    this.state = movements[movement].state
    const {animMin, animMax, animFps} = movements[movement]
    this.mesh.time = 0
    this.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    this.mesh.setFrameRange(animMin, animMax)
  }

  get isEndFrame() {
    return movements[this.movement].animMax === this.mesh.currentKeyframe
  }

  get isAction() {
    return movements[this.movement].action
  }

  get shouldUpdateAnimation() {
    return !this.isAction || (this.isAction && !this.isEndFrame)
  }

  get isFrozen() {
    return movements[this.movement].state == 'freeze'
  }

  update(delta) {
    if (!this.mesh) return
    if (this.shouldUpdateAnimation)
      this.mesh.updateAnimation(1000 * delta)
    else if (!this.isFrozen)
      this.changeMovement(this.state)
  }
}
