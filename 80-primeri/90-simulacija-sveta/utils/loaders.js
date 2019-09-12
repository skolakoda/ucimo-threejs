import * as THREE from '/node_modules/three/build/three.module.js'
import {LegacyJSONLoader} from '../libs/LegacyJSONLoader.js'
import {ColladaLoader} from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'

export const models = {}

export function loadJsonModels(assets, callback) {
  const loader = new LegacyJSONLoader()
  let i = 0
  for (const name in assets)
    loader.load(assets[name], (geometry, materials) => {
      models[name] = new THREE.Mesh(geometry, materials)
      if (++i === Object.keys(assets).length) callback(models)
    })
}

export function loadGlbModels(assets, callback) {
  const loader = new GLTFLoader()
  let i = 0
  for (const name in assets)
    loader.load(assets[name], data => {
      models[name] = data.scene // ili data.scene.children[0]
      if (++i === Object.keys(assets).length) callback(models)
    })
}

export function loadDaeModels(assets, callback) {
  const loader = new ColladaLoader()
  let i = 0
  for (const name in assets)
    loader.load(assets[name], collada => {
      const { scene } = collada
      models[name] = scene
      if (++i === Object.keys(assets).length) callback()
    })
}