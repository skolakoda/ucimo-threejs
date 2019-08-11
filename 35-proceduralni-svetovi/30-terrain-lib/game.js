let camera, scene, renderer, clock, terrainScene, decoScene, skyLight, sand, water

function setupThreeJS() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x868293, 0.0007)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  camera = new THREE.PerspectiveCamera(60, renderer.domElement.width / renderer.domElement.height, 1, 10000)
  scene.add(camera)
  camera.position.x = 449
  camera.position.y = 311
  camera.position.z = 376
  camera.rotation.x = -52 * Math.PI / 180
  camera.rotation.y = 35 * Math.PI / 180
  camera.rotation.z = 37 * Math.PI / 180

  clock = new THREE.Clock(false)
}

function setupWorld() {
  water = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(16384 + 1024, 16384 + 1024, 16, 16),
    new THREE.MeshLambertMaterial({color: 0x006ba0, transparent: true, opacity: 0.6})
  )
  water.position.y = -99
  water.rotation.x = -0.5 * Math.PI
  scene.add(water)

  skyLight = new THREE.DirectionalLight(0xe8bdb0, 1.5)
  skyLight.position.set(2950, 2625, -160) // Sun on the sky texture
  scene.add(skyLight)
  const light = new THREE.DirectionalLight(0xc3eaff, 0.75)
  light.position.set(-1, -0.5, -1)
  scene.add(light)
}

function setupDatGui() {
  const heightmapImage = new Image()
  heightmapImage.src = 'img/heightmap.png'
  function Settings() {
    const that = this
    const mat = new THREE.MeshBasicMaterial({color: 0x5566aa, wireframe: true})
    const gray = new THREE.MeshPhongMaterial({ color: 0x88aaaa, specular: 0x444455, shininess: 10 })
    let blend
    const loader = new THREE.TextureLoader()
    loader.load('img/sand1.jpg', t1 => {
      t1.wrapS = t1.wrapT = THREE.RepeatWrapping
      sand = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(16384 + 1024, 16384 + 1024, 64, 64),
        new THREE.MeshLambertMaterial({map: t1})
      )
      sand.position.y = -101
      sand.rotation.x = -0.5 * Math.PI
      scene.add(sand)
      loader.load('img/grass1.jpg', t2 => {
        loader.load('img/stone1.jpg', t3 => {
          loader.load('img/snow1.jpg', t4 => {
            blend = THREE.Terrain.generateBlendedMaterial([
              {texture: t1},
              {texture: t2, levels: [-80, -35, 20, 50]},
              {texture: t3, levels: [20, 50, 60, 85]},
              {texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
              {texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'}, // between 27 and 45 degrees
            ])
            that.Regenerate()
          })
        })
      })
    })
    this.easing = 'Linear'
    this.heightmap = 'PerlinDiamond'
    this.smoothing = 'None'
    this.maxHeight = 200
    this.segments = 63
    this.turbulent = false
    this.size = 1024
    this.sky = true
    this.texture = 'Blended'
    this.edgeDirection = 'Normal'
    this.edgeType = 'Box'
    this.edgeDistance = 256
    this.edgeCurve = 'EaseInOut'
    this['width:length ratio'] = 1.0
    this['Light color'] = '#' + skyLight.color.getHexString()
    this.spread = 60
    this.scattering = 'PerlinAltitude'
    this.after = function(vertices, options) {
      if (that.edgeDirection !== 'Normal')
        (that.edgeType === 'Box' ? THREE.Terrain.Edges : THREE.Terrain.RadialEdges)(
          vertices,
          options,
          that.edgeDirection === 'Up' ? true : false,
          that.edgeType === 'Box' ? that.edgeDistance : Math.min(options.xSize, options.ySize) * 0.5 - that.edgeDistance,
          THREE.Terrain[that.edgeCurve]
        )
    }
    window.rebuild = this.Regenerate = function() {
      const s = parseInt(that.segments, 10),
        h = that.heightmap === 'heightmap.png'
      const o = {
        after: that.after,
        easing: THREE.Terrain[that.easing],
        heightmap: h ? heightmapImage : THREE.Terrain[that.heightmap],
        material: that.texture == 'Wireframe' ? mat : (that.texture == 'Blended' ? blend : gray),
        maxHeight: that.maxHeight - 100,
        minHeight: -100,
        stretch: true,
        turbulent: that.turbulent,
        useBufferGeometry: false,
        xSize: that.size,
        ySize: Math.round(that.size * that['width:length ratio']),
        xSegments: s,
        ySegments: Math.round(s * that['width:length ratio']),
        _mesh: typeof terrainScene === 'undefined' ? null : terrainScene.children[0], // internal only
      }
      scene.remove(terrainScene)
      terrainScene = THREE.Terrain(o)
      scene.add(terrainScene)
      const he = document.getElementById('heightmap')
      if (he) {
        o.heightmap = he
        THREE.Terrain.toHeightmap(terrainScene.children[0].geometry.vertices, o)
      }
      that['Scatter meshes']()
    }
    function altitudeProbability(z) {
      if (z > -80 && z < -50) return THREE.Terrain.EaseInOut((z + 80) / (-50 + 80)) * that.spread * 0.002
      else if (z > -50 && z < 20) return that.spread * 0.002
      else if (z > 20 && z < 50) return THREE.Terrain.EaseInOut((z - 20) / (50 - 20)) * that.spread * 0.002
      return 0
    }
    this.altitudeSpread = function(v, k) {
      return k % 4 === 0 && Math.random() < altitudeProbability(v.z)
    }
    const mesh = buildTree()
    const decoMat = mesh.material.map(
      mat => mat.clone()) // new THREE.MeshBasicMaterial({color: 0x229966, wireframe: true});
    decoMat[0].wireframe = true
    decoMat[1].wireframe = true
    this['Scatter meshes'] = function() {
      let s = parseInt(that.segments, 10),
        spread,
        randomness
      const o = {
        xSegments: s,
        ySegments: Math.round(s * that['width:length ratio']),
      }
      if (that.scattering === 'Linear') {
        spread = that.spread * 0.0005
        randomness = Math.random
      }
      else if (that.scattering === 'Altitude')
        spread = that.altitudeSpread

      else if (that.scattering === 'PerlinAltitude')
        spread = (function() {
          const h = THREE.Terrain.ScatterHelper(THREE.Terrain.Perlin, o, 2, 0.125)(),
            hs = THREE.Terrain.InEaseOut(that.spread * 0.01)
          return function(v, k) {
            let rv = h[k],
              place = false
            if (rv < hs)
              place = true

            else if (rv < hs + 0.2)
              place = THREE.Terrain.EaseInOut((rv - hs) * 5) * hs < Math.random()

            return Math.random() < altitudeProbability(v.z) * 5 && place
          }
        })()

      else {
        spread = THREE.Terrain.InEaseOut(that.spread * 0.01) * 0.5
        randomness = THREE.Terrain.ScatterHelper(THREE.Terrain[that.scattering], o, 2, 0.125)
      }
      const geo = terrainScene.children[0].geometry
      terrainScene.remove(decoScene)
      decoScene = THREE.Terrain.ScatterMeshes(geo, {
        mesh,
        w: s,
        h: Math.round(s * that['width:length ratio']),
        spread,
        smoothSpread: that.scattering === 'Linear' ? 0 : 0.2,
        randomness,
        maxSlope: 0.6283185307179586, // 36deg or 36 / 180 * Math.PI, about the angle of repose of earth
        maxTilt: 0.15707963267948966, //  9deg or  9 / 180 * Math.PI. Trees grow up regardless of slope but we can allow a small variation
      })
      if (decoScene) {
        if (that.texture == 'Wireframe')
          decoScene.children[0].material = decoMat

        else if (that.texture == 'Grayscale')
          decoScene.children[0].material = gray

        terrainScene.add(decoScene)
      }
    }
  }
  const gui = new dat.GUI()
  const settings = new Settings()
  const heightmapFolder = gui.addFolder('Heightmap')
  heightmapFolder.add(settings, 'heightmap', ['Brownian', 'CosineLayers', 'DiamondSquare', 'Fault', 'heightmap.png', 'Hill', 'HillIsland', 'Particles', 'Perlin', 'PerlinDiamond', 'PerlinLayers', 'SimplexLayers', 'Value']).onFinishChange(settings.Regenerate)
  heightmapFolder.add(settings, 'easing', ['Linear', 'EaseIn', 'EaseInWeak', 'EaseOut', 'EaseInOut', 'InEaseOut']).onFinishChange(settings.Regenerate)
  heightmapFolder.add(settings, 'segments', 7, 127).step(1).onFinishChange(settings.Regenerate)
  heightmapFolder.add(settings, 'turbulent').onFinishChange(settings.Regenerate)
  heightmapFolder.open()
  const decoFolder = gui.addFolder('Decoration')
  decoFolder.add(settings, 'texture', ['Blended', 'Grayscale', 'Wireframe']).onFinishChange(settings.Regenerate)
  decoFolder.add(settings, 'scattering', ['Altitude', 'Linear', 'CosineLayers', 'DiamondSquare', 'Particles', 'Perlin', 'PerlinAltitude', 'Value']).onFinishChange(settings['Scatter meshes'])
  decoFolder.add(settings, 'spread', 0, 100).step(1).onFinishChange(settings['Scatter meshes'])
  decoFolder.addColor(settings, 'Light color').onChange(val => {
    skyLight.color.set(val)
  })
  const sizeFolder = gui.addFolder('Size')
  sizeFolder.add(settings, 'size', 1024, 3072).step(256).onFinishChange(settings.Regenerate)
  sizeFolder.add(settings, 'maxHeight', 2, 300).step(2).onFinishChange(settings.Regenerate)
  sizeFolder.add(settings, 'width:length ratio', 0.2, 2).step(0.05).onFinishChange(settings.Regenerate)
  const edgesFolder = gui.addFolder('Edges')
  edgesFolder.add(settings, 'edgeType', ['Box', 'Radial']).onFinishChange(settings.Regenerate)
  edgesFolder.add(settings, 'edgeDirection', ['Normal', 'Up', 'Down']).onFinishChange(settings.Regenerate)
  edgesFolder.add(settings, 'edgeCurve', ['Linear', 'EaseIn', 'EaseOut', 'EaseInOut']).onFinishChange(settings.Regenerate)
  edgesFolder.add(settings, 'edgeDistance', 0, 512).step(32).onFinishChange(settings.Regenerate)
  gui.add(settings, 'Scatter meshes')
  gui.add(settings, 'Regenerate')
}

function draw() {
  renderer.render(scene, camera)
}

function update() {
  if (terrainScene) terrainScene.rotation.z = Date.now() * 0.00001
}

function buildTree() {
  const material = [
    new THREE.MeshLambertMaterial({ color: 0x3d2817 }), // brown
    new THREE.MeshLambertMaterial({ color: 0x2d4c1e }), // green
  ]

  const c0 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6, 1, true))
  c0.position.y = 6
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 14, 8))
  c1.position.y = 18
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 9, 13, 8))
  c2.position.y = 25
  const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 12, 8))
  c3.position.y = 32

  const g = new THREE.Geometry()
  c0.updateMatrix()
  c1.updateMatrix()
  c2.updateMatrix()
  c3.updateMatrix()
  g.merge(c0.geometry, c0.matrix)
  g.merge(c1.geometry, c1.matrix)
  g.merge(c2.geometry, c2.matrix)
  g.merge(c3.geometry, c3.matrix)

  const b = c0.geometry.faces.length
  for (let i = 0, l = g.faces.length; i < l; i++)
    g.faces[i].materialIndex = i < b ? 0 : 1

  const m = new THREE.Mesh(g, material)
  m.scale.x = m.scale.z = 5
  m.scale.y = 1.25
  return m
}

setupThreeJS()
setupWorld()
setupDatGui()
clock.start()

void function animate() {
  draw()
  update()
  requestAnimationFrame(animate)
}()
