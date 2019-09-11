import AssetManager from './classes/AssetManager.js'
import GameEngine from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Village from './classes/Village.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'
import {rndInt} from './utils/helpers.js'

const MESHES = ['tree', 'mine', 'cloud', 'village']
const MOBS = 3
const BIRDS = 15
const RABBITS = 50
const CLOUDS = 15
const MINES = 2

const game = new GameEngine()
const assets = new AssetManager()

assets.loadMeshes(MESHES, () => {
  game.init()
  game.start()
  game.plantTrees()

  for (let i = 0; i < RABBITS; i++)
    game.addEntity(new Rabbit(game))

  for (let i = 0; i < CLOUDS; i++)
    game.addEntity(new Cloud(game))

  for (let i = 0; i < BIRDS; i++)
    game.addEntity(new Bird(game))

  for (let i = 0; i < MOBS; i++)
    game.addEntity(new Mob(game))

  for (let i = 0; i < MINES; i++) {
    const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
    const collision = game.place(rndPoint)
    collision.y += 10
    game.addEntity(new Mine(game, {pos: collision}))
  }

  const rndPoint = new THREE.Vector3(rndInt(1100), 100, rndInt(1100))
  const collision = game.place(rndPoint)
  collision.y += 20
  game.addEntity(new Village(game, {pos: collision}))
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())