import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import Bird from './classes/creatures/Bird2.js'
import game from './classes/GameEngine.js'

const BIRDS = 10
const loader = new GLTFLoader()

game.init()
game.start()
game.plantTrees()

loader.load('/assets/models/ptice/flamingo.glb', model => {
  for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird(model))
})
