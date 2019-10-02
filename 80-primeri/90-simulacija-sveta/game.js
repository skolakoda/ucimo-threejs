import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import {loadJsonModels, loadGlbModels, loadDaeModels} from './utils/loaders.js'
import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Castle from './classes/Castle.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'

const loader = new GLTFLoader()

const MOBS = 1
const BIRDS = 10
const RABBITS = 10
const CLOUDS = 5
const MINES = 2

const glbAssets = {
  bird: '/assets/models/ptice/flamingo.glb'
}

const jsonAssets = {
  mine: 'assets/mine.json',
  cloud: 'assets/cloud.json',
}

const daeAssets = {
  village: '/assets/models/wildsgate-keep/model.dae',
  mob: '/assets/models/nightelf-priest/model.dae',
  rabbit: '/assets/models/rabbit.dae'
}

game.init()
game.start()
game.plantTrees()

loadGlbModels(glbAssets, () => {
  for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird())
})

loader.load('/assets/models/ptice/flamingo.glb', data => {
  console.log(data)
  // TODO: kreirati ptice
})

loadJsonModels(jsonAssets, () => {
  for (let i = 0; i < CLOUDS; i++) game.addEntity(new Cloud())
  for (let i = 0; i < MINES; i++) game.randomPlaceEntity(new Mine())
})

loadDaeModels(daeAssets, () => {
  game.randomPlaceEntity(new Castle())
  for (let i = 0; i < MOBS; i++) game.randomPlaceEntity(new Mob(game))
  for (let i = 0; i < RABBITS; i++) game.randomPlaceEntity(new Rabbit())
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
