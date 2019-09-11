import * as THREE from '/node_modules/three/build/three.module.js'
import {LegacyJSONLoader} from '../libs/LegacyJSONLoader.js'

export const models = {}

export function loadJsonMeshes(assets, callback) {
  const loader = new LegacyJSONLoader()
  let i = 0
  for (const name in assets)
    loader.load(assets[name], (geometry, materials) => {
      models[name] = new THREE.Mesh(geometry, materials)
      if (++i === Object.keys(assets).length) callback(models)
    })
}
