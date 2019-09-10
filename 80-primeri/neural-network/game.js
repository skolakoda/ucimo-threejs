/* global dat */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import {NeuralNetwork} from './classes/NeuralNetwork.js'

createOrbitControls()
const neuralNet = window.neuralNet = new NeuralNetwork()

// GUI

const gui = new dat.GUI()
gui.width = 300

const gui_info = gui.addFolder('Info')
gui_info.add(neuralNet, 'numNeurons').name('Neurons')
gui_info.add(neuralNet, 'numAxons').name('Axons')
gui_info.add(neuralNet, 'numSignals', 0, neuralNet.limitSignals).name('Signals')
gui_info.autoListen = false

const gui_settings = gui.addFolder('Settings')
gui_settings.add(neuralNet, 'currentMaxSignals', 0, neuralNet.limitSignals).name('Max Signals')
gui_settings.add(neuralNet.particlePool, 'pSize', 0.2, 2).name('Signal Size')
gui_settings.add(neuralNet, 'signalMinSpeed', 0.01, 0.1, 0.01).name('Signal Min Speed')
gui_settings.add(neuralNet, 'signalMaxSpeed', 0.01, 0.1, 0.01).name('Signal Max Speed')
gui_settings.add(neuralNet, 'neuronSize', 0, 2).name('Neuron Size')
gui_settings.add(neuralNet, 'neuronOpacity', 0, 1.0).name('Neuron Opacity')
gui_settings.add(neuralNet, 'axonOpacityMultiplier', 0.0, 5.0).name('Axon Opacity Mult')
gui_settings.addColor(neuralNet.particlePool, 'pColor').name('Signal Color')
gui_settings.addColor(neuralNet, 'neuronColor').name('Neuron Color')
gui_settings.addColor(neuralNet, 'axonColor').name('Axon Color')

gui_info.open()
gui_settings.open()

function updateNeuralNetworkSettings() {
  neuralNet.updateSettings()
}

for (const i in gui_settings.__controllers)
  gui_settings.__controllers[i].onChange(updateNeuralNetworkSettings)

function updateGuiInfo() {
  for (const i in gui_info.__controllers)
    gui_info.__controllers[i].updateDisplay()
}

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  neuralNet.update()
  updateGuiInfo()
  renderer.render(scene, camera)
}()
