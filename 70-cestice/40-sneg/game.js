import * as THREE from '/node_modules/three/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

const materials = []

camera.position.z = 1000
scene.fog = new THREE.FogExp2(0x000000, 0.0008)

const geometry = new THREE.BufferGeometry()
const vertices = []
const textureLoader = new THREE.TextureLoader()

const sprite = textureLoader.load('/assets/textures/snowflake.png')

for (let i = 0; i < 10000; i ++) {
  const x = Math.random() * 2000 - 1000
  const y = Math.random() * 2000 - 1000
  const z = Math.random() * 2000 - 1000
  vertices.push(x, y, z)
}
geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

const parameters = [
  [[ 1.0, 0.2, 0.5 ], 20 ],
  [[ 0.95, 0.1, 0.5 ], 15 ],
  [[ 0.90, 0.05, 0.5 ], 10 ],
  [[ 0.85, 0, 0.5 ], 8 ],
  [[ 0.80, 0, 0.5 ], 5 ]
]

for (let i = 0; i < parameters.length; i ++) {
  const color = parameters[i][0]
  const size = parameters[i][1]

  materials[i] = new THREE.PointsMaterial({ size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true })
  materials[i].color.setHSL(color[0], color[1], color[2])

  const particles = new THREE.Points(geometry, materials[i])

  particles.rotation.x = Math.random() * 6
  particles.rotation.y = Math.random() * 6
  particles.rotation.z = Math.random() * 6

  scene.add(particles)
}

/* LOOP */

function render() {
  const time = Date.now() * 0.00005
  for (let i = 0; i < scene.children.length; i ++) {
    const object = scene.children[ i ]
    if (object instanceof THREE.Points)
      object.rotation.y = time * (i < 4 ? i + 1 : - (i + 1))
  }
  for (let i = 0; i < materials.length; i ++) {
    const color = parameters[ i ][ 0 ]
    const h = (360 * (color[ 0 ] + time) % 360) / 360
    materials[ i ].color.setHSL(h, color[ 1 ], color[ 2 ])
  }
  renderer.render(scene, camera)
}

void function animate() {
  requestAnimationFrame(animate)
  render()
}()
