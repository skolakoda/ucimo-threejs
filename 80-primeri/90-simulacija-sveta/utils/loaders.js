import * as THREE from '/node_modules/three/build/three.module.js'
import {LegacyJSONLoader} from '../libs/LegacyJSONLoader.js'
import {OBJLoader} from '/node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'

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

export function loadObjModels(assets, callback) {
  const loader = new OBJLoader()
  let i = 0
  for (const name in assets)
    loader.load(assets[name], mesh => {
      models[name] = mesh
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