import * as THREE from '/node_modules/three/build/three.module.js'
import { NormalMapShader } from '/node_modules/three/examples/jsm/shaders/NormalMapShader.js'
import { TerrainShader } from '/node_modules/three/examples/jsm/shaders/TerrainShader.js'
import { BufferGeometryUtils } from '/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'
import {camera, scene, renderer, clock, createOrbitControls} from '/utils/scene.js'

const {innerWidth, innerHeight} = window
let animDelta = 0, animDeltaDir = - 1
const mlib = {}

// RENDER TARGET
const sceneRenderTarget = new THREE.Scene()
const cameraOrtho = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / -2, -10000, 10000)
cameraOrtho.position.z = 100
sceneRenderTarget.add(cameraOrtho)

createOrbitControls()
camera.position.set(-1200, 800, 1200)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

// HEIGHT + NORMAL MAPS
const rx = 256, ry = 256
const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat }
const heightMap = new THREE.WebGLRenderTarget(rx, ry, pars)
const normalMap = new THREE.WebGLRenderTarget(rx, ry, pars)
const uniformsNoise = {
  'time': { value: 1.0 },
  'scale': { value: new THREE.Vector2(1.5, 1.5) },
  'offset': { value: new THREE.Vector2(0, 0) }
}
const uniformsNormal = THREE.UniformsUtils.clone(NormalMapShader.uniforms)
uniformsNormal.height.value = 0.05
uniformsNormal.resolution.value.set(rx, ry)
uniformsNormal.heightMap.value = heightMap.texture
const vertexShader = document.getElementById('vertexShader').textContent

// TEXTURES
const textureLoader = new THREE.TextureLoader()
const diffuseTexture1 = textureLoader.load('textures/grasslight-big.jpg')
const diffuseTexture2 = textureLoader.load('textures/backgrounddetailed6.jpg')
const detailTexture = textureLoader.load('textures/grasslight-big-nm.jpg')
diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping
diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping
detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping

// TERRAIN SHADER
const uniformsTerrain = THREE.UniformsUtils.clone(TerrainShader.uniforms)
uniformsTerrain.tNormal.value = normalMap.texture
uniformsTerrain.uNormalScale.value = 3.5
uniformsTerrain.tDisplacement.value = heightMap.texture
uniformsTerrain.tDiffuse1.value = diffuseTexture1
uniformsTerrain.tDiffuse2.value = diffuseTexture2
uniformsTerrain.tDetail.value = detailTexture
uniformsTerrain.enableDiffuse1.value = true
uniformsTerrain.enableDiffuse2.value = true
uniformsTerrain.uDisplacementScale.value = 375
uniformsTerrain.uRepeatOverlay.value.set(6, 6)

const shaders = [
  ['heightmap', document.getElementById('fragmentShaderNoise').textContent, vertexShader, uniformsNoise, false],
  ['normal', NormalMapShader.fragmentShader, NormalMapShader.vertexShader, uniformsNormal, false],
  ['terrain', TerrainShader.fragmentShader, TerrainShader.vertexShader, uniformsTerrain, true]
]
shaders.forEach(shader => {
  const material = new THREE.ShaderMaterial({
    fragmentShader: shader[1],
    vertexShader: shader[2],
    uniforms: shader[3],
    lights: shader[4],
    fog: true
  })
  mlib[shader[0]] = material
})

const plane = new THREE.PlaneBufferGeometry(innerWidth, innerHeight)
const quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x000000 }))
quadTarget.position.z = - 500
sceneRenderTarget.add(quadTarget)

// TERRAIN
const geometry = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256)
BufferGeometryUtils.computeTangents(geometry)
const terrain = new THREE.Mesh(geometry, mlib.terrain)
terrain.position.set(0, -125, 0)
terrain.rotation.x = -Math.PI / 2
scene.add(terrain)

function render() {
  const delta = clock.getDelta()
  // TODO: pomerati dinamicki u odnosu na igraca
  animDelta = THREE.Math.clamp(animDelta + 0.00075 * animDeltaDir, 0, 0.05)
  uniformsNoise.time.value += delta * animDelta
  uniformsNoise.offset.value.x += delta * 0.05
  uniformsTerrain.uOffset.value.x = 4 * uniformsNoise.offset.value.x
  // renda teren
  quadTarget.material = mlib.heightmap
  renderer.setRenderTarget(heightMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  quadTarget.material = mlib.normal
  renderer.setRenderTarget(normalMap)
  renderer.render(sceneRenderTarget, cameraOrtho)
  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  render()
}()