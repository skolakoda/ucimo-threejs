import { models } from './utils/loaders.js'
import game from './classes/GameEngine.js'
import Bird from './classes/creatures/Bird.js'
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

game.init()
game.start()

loader.load('/assets/models/ptice/flamingo.glb', data => {
  models.bird = data
  for (let i = 0; i < 10; i++) game.addEntity(new Bird())
})