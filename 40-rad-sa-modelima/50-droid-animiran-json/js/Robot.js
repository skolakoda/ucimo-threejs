/* global movements */

class Robot {
  constructor() {
    this.mesh = null
    this.movement = 'stand'
    this.state = 'stand'
  }

  changeMovement(movement) {
    this.movement = movement
    this.state = movements[movement].state
    const {animMin, animMax, animFps} = movements[movement]
    this.mesh.time = 0
    this.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    this.mesh.setFrameRange(animMin, animMax)
  }
}
