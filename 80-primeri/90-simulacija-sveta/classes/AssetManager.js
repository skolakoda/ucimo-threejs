import * as THREE from '/node_modules/three/build/three.module.js'
import {LegacyJSONLoader} from '../libs/LegacyJSONLoader.js'

export const objects   = {}

export default class AssetManager {
  loadMeshes(meshes, callback) {
    const loader = new LegacyJSONLoader()
    let i = 0
    meshes.forEach(mesh => {
      loader.load('assets/' + mesh + '.json', (geometry, materials) => {
        objects[mesh] = new THREE.Mesh(geometry, materials[0])
        i++
        if (i === meshes.length) callback(objects)
      })
    })
  }
}
