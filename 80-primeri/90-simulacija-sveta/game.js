import * as THREE from '/node_modules/three/build/three.module.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'

import {loadJsonModels, loadObjModels, models} from './utils/loaders.js'
import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Village from './classes/Village.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'
import {rndInt} from './utils/helpers.js'

const objAssets = {
  village: '/assets/models/carobni-zamak.obj'
}
const jsonAssets = {
  tree: 'assets/tree.json',
  mine: 'assets/mine.json',
  cloud: 'assets/cloud.json',
}

const MOBS = 3
const BIRDS = 15
const RABBITS = 30
const CLOUDS = 15
const MINES = 2

game.init()
game.start()
game.plantTrees()

// loadObjModels(objAssets, () => {
//   const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
//   const collision = game.place(rndPoint)
//   collision.y += 20
//   game.addEntity(new Village(game, collision))
// })

// loadJsonModels(jsonAssets, () => {
//   for (let i = 0; i < CLOUDS; i++) game.addEntity(new Cloud(game))
//   for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird(game))
//   for (let i = 0; i < RABBITS; i++) game.addEntity(new Rabbit(game))
//   for (let i = 0; i < MOBS; i++) game.addEntity(new Mob(game))

//   for (let i = 0; i < MINES; i++) {
//     const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
//     const collision = game.place(rndPoint)
//     collision.y += 10
//     game.addEntity(new Mine(game, collision))
//   }
// })

const loader = new ColladaLoader()
loader.load('/assets/models/nightelf-priest/model.dae', collada => {
  const { scene } = collada
  for (let i = 0; i < MOBS; i++) {
    const mesh = scene.clone()
    mesh.rotation.x = -Math.PI / 2
    mesh.scale.set(.1, .1, .1)
    mesh.position.y = 20
    const group = new THREE.Group()
    group.add(mesh)
    const actor = new Mob(game)
    actor.mesh = group
    game.addEntity(actor)
  }
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
