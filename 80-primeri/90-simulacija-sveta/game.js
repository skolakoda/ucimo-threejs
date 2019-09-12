import * as THREE from '/node_modules/three/build/three.module.js'

import {loadJsonModels, loadObjModels, loadDaeModels} from './utils/loaders.js'
import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Village from './classes/Village.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'
import {rndInt} from './utils/helpers.js'

const objAssets = {}

const jsonAssets = {
  tree: 'assets/tree.json',
  mine: 'assets/mine.json',
  cloud: 'assets/cloud.json',
}
const daeAssets = {
  village: '/assets/models/wildsgate-keep/model.dae',
  mob: '/assets/models/nightelf-priest/model.dae'
}

const MOBS = 2
const BIRDS = 15
const RABBITS = 20
const CLOUDS = 5
const MINES = 2

game.init()
game.start()
game.plantTrees()

loadObjModels(objAssets, () => {

})

loadJsonModels(jsonAssets, () => {
  for (let i = 0; i < CLOUDS; i++) game.addEntity(new Cloud(game))
  for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird(game))
  for (let i = 0; i < RABBITS; i++) game.addEntity(new Rabbit(game))

  for (let i = 0; i < MINES; i++) {
    const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
    const collision = game.place(rndPoint)
    collision.y += 10
    game.addEntity(new Mine(game, collision))
  }
})

loadDaeModels(daeAssets, () => {
  game.addEntity(new Village(game))
  for (let i = 0; i < MOBS; i++) game.addEntity(new Mob(game))
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
