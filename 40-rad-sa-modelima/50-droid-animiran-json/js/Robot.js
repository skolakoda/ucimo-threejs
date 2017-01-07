/* global pokreti */

class Robot {
  constructor () {
    this.mesh = null
    this.pokret = 'stand'
    this.stanje = 'stand'
  }

  promeniPokret (pokret) {
    this.pokret = pokret
    this.stanje = pokreti[pokret].stanje
    const animMin = pokreti[pokret].animMin
    const animMax = pokreti[pokret].animMax
    const animFps = pokreti[pokret].animFps
    this.mesh.time = 0
    this.mesh.duration = 1000 * ((animMax - animMin) / animFps)
    this.mesh.setFrameRange(animMin, animMax)
  }
}
