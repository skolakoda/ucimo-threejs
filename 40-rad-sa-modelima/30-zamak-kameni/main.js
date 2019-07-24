var lesson6 = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null,
  clock: null,
  init: function() { // Initialization
    // create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    // prepare camera
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 2000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0, 100, 300);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // prepare renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    // prepare container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // THREEx.WindowResize(this.renderer, this.camera);

    // prepare controls (OrbitControls)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 2000;

    // prepare clock
    this.clock = new THREE.Clock();

    // add directional light
    var dLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dLight.castShadow = true;
    dLight.position.set(500, 1000, 500);
    this.scene.add(dLight);

    // load a model
    this.loadModel();
  },
  loadModel: function() {
    // prepare loader and load the model
    var oLoader = new THREE.OBJMTLLoader();
    oLoader.load('models/castle.obj', 'models/castle.mtl', function(object) {
      object.position.x = -200;
      object.position.y = 0;
      object.position.z = 100;
      object.scale.set(0.1, 0.1, 0.1);
      lesson6.scene.add(object);
    });
  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls
function update() {
  lesson6.controls.update(lesson6.clock.getDelta());
}

// Render the scene
function render() {
  if (lesson6.renderer) {
    lesson6.renderer.render(lesson6.scene, lesson6.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  lesson6.init();
  animate();
}

window.onload = initializeLesson;
