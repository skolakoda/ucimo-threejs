/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

function BlendCharacterGui(blendMesh) {

  const controls = {

    gui: null,
    'Time Scale': 1.0,
    'Step Size': 0.016,
    'Crossfade Time': 3.5,
    'idle': 0.33,
    'walk': 0.33,
    'run': 0.33

  }

  var blendMesh = blendMesh

  this.getTimeScale = function() {

    return controls[ 'Time Scale' ]

  }

  this.update = function(time) {

    controls.idle = blendMesh.getWeight('idle')
    controls.walk = blendMesh.getWeight('walk')
    controls.run = blendMesh.getWeight('run')

  }

  const init = function() {

    controls.gui = new dat.GUI()

    const settings = controls.gui.addFolder('Settings')
    const playback = controls.gui.addFolder('Playback')
    const blending = controls.gui.addFolder('Blend Tuning')

    settings.add(controls, 'Time Scale', 0, 1, 0.01)
    settings.add(controls, 'Step Size', 0.01, 0.1, 0.01)
    settings.add(controls, 'Crossfade Time', 0.1, 6.0, 0.05)

    // These controls execute functions
    playback.add(controls, 'start')
    playback.add(controls, 'pause')
    playback.add(controls, 'step')
    playback.add(controls, 'idle to walk')
    playback.add(controls, 'walk to run')
    playback.add(controls, 'warp walk to run')

    blending.add(controls, 'idle', 0, 1, 0.01).listen().onChange(controls.weight)
    blending.add(controls, 'walk', 0, 1, 0.01).listen().onChange(controls.weight)
    blending.add(controls, 'run', 0, 1, 0.01).listen().onChange(controls.weight)

    settings.open()
    playback.open()
    blending.open()

  }

  const getAnimationData = function() {

    return {

      detail: {

        anims: [ 'idle', 'walk', 'run' ],

        weights: [ controls.idle,
						   controls.walk,
						   controls.run ]
      }

    }

  }

  controls.start = function() {

    const startEvent = new CustomEvent('start-animation', getAnimationData())
    window.dispatchEvent(startEvent)

  }

  controls.stop = function() {

    const stopEvent = new CustomEvent('stop-animation')
    window.dispatchEvent(stopEvent)

  }

  controls.pause = function() {

    const pauseEvent = new CustomEvent('pause-animation')
    window.dispatchEvent(pauseEvent)

  }

  controls.step = function() {

    const stepData = { detail: { stepSize: controls[ 'Step Size' ] } }
    window.dispatchEvent(new CustomEvent('step-animation', stepData))

  }

  controls.weight = function() {

    // renormalize
    const sum = controls.idle + controls.walk + controls.run
    controls.idle /= sum
    controls.walk /= sum
    controls.run /= sum

    const weightEvent = new CustomEvent('weight-animation', getAnimationData())
    window.dispatchEvent(weightEvent)

  }

  controls.crossfade = function(from, to) {

    const fadeData = getAnimationData()
    fadeData.detail.from = from
    fadeData.detail.to = to
    fadeData.detail.time = controls[ 'Crossfade Time' ]

    window.dispatchEvent(new CustomEvent('crossfade', fadeData))

  }

  controls.warp = function(from, to) {

    const warpData = getAnimationData()
    warpData.detail.from = 'walk'
    warpData.detail.to = 'run'
    warpData.detail.time = controls[ 'Crossfade Time' ]

    window.dispatchEvent(new CustomEvent('warp', warpData))

  }

  controls[ 'idle to walk' ] = function() {

    controls.crossfade('idle', 'walk')

  }

  controls[ 'walk to run' ] = function() {

    controls.crossfade('walk', 'run')

  }

  controls[ 'warp walk to run' ] = function() {

    controls.warp('walk', 'run')

  }

  init.call(this)

}
