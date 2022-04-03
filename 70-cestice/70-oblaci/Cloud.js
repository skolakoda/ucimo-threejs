/**
 * @author mattatz / http://github.com/mattatz
 *
 * Ray tracing based cloud noise object.
 */
import { CloudShader } from './CloudShader.js'

THREE.Cloud = function(color) {

  const cloudMaterial = new THREE.ShaderMaterial({
    defines         : CloudShader.defines,
    uniforms        : THREE.UniformsUtils.clone(CloudShader.uniforms),
    vertexShader    : CloudShader.vertexShader,
    fragmentShader  : CloudShader.fragmentShader,
    transparent     : true,
    depthWrite      : false,
    depthTest       : false
  })

  // initialize uniforms

  cloudMaterial.uniforms.color.value = color || new THREE.Color(0xeeeeee)
  cloudMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4()
  cloudMaterial.uniforms.scale.value = new THREE.Vector3(1, 1, 1)
  cloudMaterial.uniforms.seed.value = Math.random() * 19.19

  THREE.Mesh.call(this, new THREE.BoxGeometry(1, 1, 1), cloudMaterial)

}

THREE.Cloud.prototype = Object.create(THREE.Mesh.prototype)
THREE.Cloud.prototype.constructor = THREE.Cloud

THREE.Cloud.prototype.update = function(time) {

  const invModelMatrix = this.material.uniforms.invModelMatrix.value

  this.updateMatrix()
  invModelMatrix.getInverse(this.matrix)

  if (time !== undefined)
    this.material.uniforms.time.value = time

  this.material.uniforms.invModelMatrix.value = invModelMatrix
  this.material.uniforms.scale.value = this.scale

}
