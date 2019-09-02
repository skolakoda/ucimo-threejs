/** KONFIG **/
/* global THREE, dat */

const parameters = {
  a: 0.51,
  b: 0.01,
  c: true
}

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const VIEW_ANGLE = 45
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1
const FAR = 20000

/** INIT **/

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const gui = new dat.GUI()
const bGUI = gui.add(parameters, 'b').min(-3.500).max(3.500).step(0.001).name('middle ball height').listen()
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

scene.add(camera)
camera.position.set(10, 5, 10)
camera.lookAt(scene.position)

// RENDERER
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
const container = document.getElementById('ThreeJS')
container.appendChild(renderer.domElement)

// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement)

// LIGHT
const redlight = new THREE.PointLight(0xff0000)
redlight.position.set(10, 0, 0)
scene.add(redlight)
const greenlight = new THREE.PointLight(0x00cc00)
greenlight.position.set(0, 10, 0)
scene.add(greenlight)
const bluelight = new THREE.PointLight(0x0000ff)
bluelight.position.set(0, 0, 10)
scene.add(bluelight)
const light = new THREE.AmbientLight(0x333333)
scene.add(light)

// //////////
// CUSTOM //
// //////////

const axisMin = -5
const axisMax = 5
const axisRange = axisMax - axisMin

scene.add(new THREE.AxisHelper(axisMax))

// The Marching Cubes Algorithm draws an isosurface of a given value.
// To use this for a Metaballs simulation, we need to:
// (1) Initialize the domain - create a grid of size*size*size points in space
// (2) Initialize the range  - a set of values, corresponding to each of the points, to zero.
// (3) Add 1 to values array for points on boundary of the sphere;
//       values should decrease to zero quickly for points away from sphere boundary.
// (4) Repeat step (3) as desired
// (5) Implement Marching Cubes algorithm with isovalue slightly less than 1.

const size = 30
const size3 = size * size * size

const points = []

// generate the list of 3D points
for (let k = 0; k < size; k++)
  for (let j = 0; j < size; j++)
    for (let i = 0; i < size; i++) {
      const x = axisMin + axisRange * i / (size - 1)
      const y = axisMin + axisRange * j / (size - 1)
      const z = axisMin + axisRange * k / (size - 1)
      points.push(new THREE.Vector3(x, y, z))
    }

const values = []
// initialize values
for (let i = 0; i < size3; i++)  values[i] = 0

// resetValues();
addBall(points, values, new THREE.Vector3(0, 3.5, 0))
addBall(points, values, new THREE.Vector3(0, 0, 0))
addBall(points, values, new THREE.Vector3(-1, -1, 0))

// isolevel = 0.5;
const geometry = marchingCubes(points, values, 0.5)

const colorMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
let mesh = new THREE.Mesh(geometry, colorMaterial)
scene.add(mesh)

// GUI for experimenting with parameters

const aGUI = gui.add(parameters, 'a').min(0.000).max(1.100).step(0.001).name('isolevel').listen()

aGUI.onChange(
  value => {
    scene.remove(mesh)
    const newGeometry = marchingCubes(points, values, parameters.a)
    mesh = new THREE.Mesh(newGeometry, colorMaterial)
    scene.add(mesh)
  }
)

bGUI.onChange(
  value => {
    resetValues(values)
    addBall(points, values, new THREE.Vector3(0, 3.5, 0))
    addBall(points, values, new THREE.Vector3(0, parameters.b, 0))
    addBall(points, values, new THREE.Vector3(-1, -1, 0))

    scene.remove(mesh)
    const newGeometry = marchingCubes(points, values, parameters.a)
    mesh = new THREE.Mesh(newGeometry, colorMaterial)
    scene.add(mesh)
  }
)

/** FUNCTIONS **/

function animate() {
  window.requestAnimationFrame(animate)
  render()
  update()
}

function update() {
  controls.update()
  if (parameters.c) {
    const time = clock.getElapsedTime()
    bGUI.setValue(3.5 * Math.sin(0.5 * time))
  }
}

function render() {
  renderer.render(scene, camera)
}

// METABALLS FUNCTIONS

function resetValues(values) {
  for (let i = 0; i < values.length; i++)
    values[i] = 0

}

// add values corresponding to a ball with radius 1 to values array
function addBall(points, values, center) {
  for (let i = 0; i < values.length; i++) {
    const OneMinusD2 = 1.0 - center.distanceToSquared(points[i])
    values[i] += Math.exp(-(OneMinusD2 * OneMinusD2))
  }
}

/*
 * MARCHING CUBES ALGORITHM
 * @params: domain points, range values, isolevel
 * @return: geometry object
 */
function marchingCubes(points, values, isolevel) {
  // assumes the following global values have been defined:
  // THREE.edgeTable, THREE.triTable

  const size = Math.round(Math.pow(values.length, 1 / 3))
  const size2 = size * size

  // Vertices may occur along edges of cube, when the values at the edge's endpoints
  //   straddle the isolevel value.
  // Actual position along edge weighted according to function values.
  const vlist = new Array(12)

  const geometry = new THREE.Geometry()
  let vertexIndex = 0

  for (let z = 0; z < size - 1; z++)
    for (let y = 0; y < size - 1; y++)
      for (let x = 0; x < size - 1; x++) {
        // index of base point, and also adjacent points on cube
        const p = x + size * y + size2 * z
        const px = p + 1
        const py = p + size
        const pxy = py + 1
        const pz = p + size2
        const pxz = px + size2
        const pyz = py + size2
        const pxyz = pxy + size2

        // store scalar values corresponding to vertices
        const value0 = values[p]
        const value1 = values[px]
        const value2 = values[py]
        const value3 = values[pxy]
        const value4 = values[pz]
        const value5 = values[pxz]
        const value6 = values[pyz]
        const value7 = values[pxyz]

        // place a "1" in bit positions corresponding to vertices whose
        //   isovalue is less than given constant.
        let cubeindex = 0
        if (value0 < isolevel) cubeindex |= 1
        if (value1 < isolevel) cubeindex |= 2
        if (value2 < isolevel) cubeindex |= 8
        if (value3 < isolevel) cubeindex |= 4
        if (value4 < isolevel) cubeindex |= 16
        if (value5 < isolevel) cubeindex |= 32
        if (value6 < isolevel) cubeindex |= 128
        if (value7 < isolevel) cubeindex |= 64

        // bits = 12 bit number, indicates which edges are crossed by the isosurface
        const bits = THREE.edgeTable[cubeindex]

        // if none are crossed, proceed to next iteration
        if (bits === 0) continue

        // check which edges are crossed, and estimate the point location
        //    using a weighted average of scalar values at edge endpoints.
        // store the vertex in an array for use later.
        let mu = 0.5

        // bottom of the cube
        if (bits & 1) {
          mu = (isolevel - value0) / (value1 - value0)
          vlist[0] = points[p].clone().lerp(points[px], mu)
        }
        if (bits & 2) {
          mu = (isolevel - value1) / (value3 - value1)
          vlist[1] = points[px].clone().lerp(points[pxy], mu)
        }
        if (bits & 4) {
          mu = (isolevel - value2) / (value3 - value2)
          vlist[2] = points[py].clone().lerp(points[pxy], mu)
        }
        if (bits & 8) {
          mu = (isolevel - value0) / (value2 - value0)
          vlist[3] = points[p].clone().lerp(points[py], mu)
        }
        // top of the cube
        if (bits & 16) {
          mu = (isolevel - value4) / (value5 - value4)
          vlist[4] = points[pz].clone().lerp(points[pxz], mu)
        }
        if (bits & 32) {
          mu = (isolevel - value5) / (value7 - value5)
          vlist[5] = points[pxz].clone().lerp(points[pxyz], mu)
        }
        if (bits & 64) {
          mu = (isolevel - value6) / (value7 - value6)
          vlist[6] = points[pyz].clone().lerp(points[pxyz], mu)
        }
        if (bits & 128) {
          mu = (isolevel - value4) / (value6 - value4)
          vlist[7] = points[pz].clone().lerp(points[pyz], mu)
        }
        // vertical lines of the cube
        if (bits & 256) {
          mu = (isolevel - value0) / (value4 - value0)
          vlist[8] = points[p].clone().lerp(points[pz], mu)
        }
        if (bits & 512) {
          mu = (isolevel - value1) / (value5 - value1)
          vlist[9] = points[px].clone().lerp(points[pxz], mu)
        }
        if (bits & 1024) {
          mu = (isolevel - value3) / (value7 - value3)
          vlist[10] = points[pxy].clone().lerp(points[pxyz], mu)
        }
        if (bits & 2048) {
          mu = (isolevel - value2) / (value6 - value2)
          vlist[11] = points[py].clone().lerp(points[pyz], mu)
        }

        // construct triangles -- get correct vertices from triTable.
        let i = 0
        cubeindex <<= 4 // multiply by 16...
        // "Re-purpose cubeindex into an offset into triTable."
        //  since each row really isn't a row.

        // the while loop should run at most 5 times,
        //   since the 16th entry in each row is a -1.

        while (THREE.triTable[cubeindex + i] !== -1) {
          const index1 = THREE.triTable[cubeindex + i]
          const index2 = THREE.triTable[cubeindex + i + 1]
          const index3 = THREE.triTable[cubeindex + i + 2]

          geometry.vertices.push(vlist[index1].clone())
          geometry.vertices.push(vlist[index2].clone())
          geometry.vertices.push(vlist[index3].clone())
          const face = new THREE.Face3(vertexIndex, vertexIndex + 1, vertexIndex + 2)
          geometry.faces.push(face)

          geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)])

          vertexIndex += 3
          i += 3
        }
      }

  geometry.mergeVertices()
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()

  return geometry
}

/** LOGIC **/

animate()
