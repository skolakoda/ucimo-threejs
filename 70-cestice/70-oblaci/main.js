let app, App = function() {
  app = this
  app.init()
}

App.prototype = {

  init() {
    const scene = this.scene = new THREE.Scene()
    const camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000)
    camera.position.z = 2
    scene.add(camera)

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(0, 1, 0)
    scene.add(light)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })

    renderer.setClearColor(0x7ec0ee)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.append(renderer.domElement)

    const cloudCount = 10
    const clouds = []
    const range = 10

    const rand = function() {
      return Math.random() - 0.5
    }

    const wireframeMat = new THREE.MeshBasicMaterial({
      color : new THREE.Color(0x000000),
      wireframe : true
    })

    for (let i = 0; i < cloudCount; i++) {

      const cloud = new THREE.Cloud()

      const wireframe = new THREE.Mesh(cloud.geometry.clone(), wireframeMat.clone())
      cloud.add(wireframe)
      wireframe.visible = false

      cloud.position.set(rand() * range, rand() * range, rand() * range)
      cloud.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI)

      const scale = 2.0 + Math.random() * 6
      cloud.scale.set(scale, scale, scale)

      scene.add(cloud)

      clouds.push(cloud)
    }

    const clock = new THREE.Clock()

    const controller = {
      speed     : 1.0,
      wireframe : false
    }

    const gui = new dat.GUI()
    gui.add(controller, 'speed', 0.1, 10.0).step(0.1)
    gui.add(controller, 'wireframe').onChange(() => {
      for (let i = 0, n = clouds.length; i < n; i++) {
        const cloud = clouds[i]
        const wireframe = cloud.children[0]
        wireframe.visible = controller.wireframe
      }
    });

    (function loop() {
      requestAnimationFrame(loop)
      const t = clock.elapsedTime * controller.speed

      for (let i = 0, n = clouds.length; i < n; i++) {
        const cloud = clouds[i]
        cloud.update(t)
      }

      renderer.render(scene, camera)
    })()

  }
}

new App()
