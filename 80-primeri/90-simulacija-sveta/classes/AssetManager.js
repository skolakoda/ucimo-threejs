const IMAGES = []
export const objects   = {}

const loader = new THREE.LegacyJSONLoader()

export default class AssetManager {
  constructor() {
    this.TEXTURES  = {}
    this.MATERIALS = {}
  }

  loadMaterials(callback) {
    for (let i = 0; i < IMAGES.length; i++) {
      const texture = THREE.ImageUtils.loadTexture('assets/textures/' + IMAGES[i] + '.jpg')
      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.LinearMipMapLinearFilter
      this.TEXTURES[IMAGES[i]] = texture
      this.MATERIALS[IMAGES[i]] = new THREE.MeshLambertMaterial({map: texture })
      this.MATERIALS[IMAGES[i]].dynamic = true
    }
    return callback()
  }

  loadMeshes(meshes, callback) {
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
