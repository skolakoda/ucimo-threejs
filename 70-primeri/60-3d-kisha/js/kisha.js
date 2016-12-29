// https://github.com/solusipse/threejs-examples
var rainDensity = 20000;

var container, camera, scene, renderer, particles, geometry, materials = [],
  parameters, i, h, color, sprite, size;
var layer = false;

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0008);

  initRain();
  createBackground();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

}

function initRain() {
  geometry = new THREE.Geometry();

  sprite1 = THREE.ImageUtils.loadTexture("images/rain1.png");
  sprite2 = THREE.ImageUtils.loadTexture("images/rain2.png");
  sprite3 = THREE.ImageUtils.loadTexture("images/rain3.png");
  sprite4 = THREE.ImageUtils.loadTexture("images/rain4.png");
  sprite5 = THREE.ImageUtils.loadTexture("images/rain5.png");

  for (i = 0; i < rainDensity; i++) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2000 - 1000;
    vertex.y = Math.random() * 4000 + 500;
    vertex.z = Math.random() * 2000 - 1000;

    geometry.vertices.push(vertex);

  }

  parameters = [
    [
      [1.0, 0.2, 0.5], sprite2, 20
    ],
    [
      [0.95, 0.1, 0.5], sprite3, 15
    ],
    [
      [0.90, 0.05, 0.5], sprite1, 10
    ],
    [
      [0.85, 0, 0.5], sprite5, 8
    ],
    [
      [0.80, 0, 0.5], sprite4, 5
    ],
  ];

  for (i = 0; i < parameters.length; i++) {

    color = parameters[i][0];
    sprite = parameters[i][1];
    size = parameters[i][2];

    materials[i] = new THREE.PointCloudMaterial({
      size: size,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    materials[i].color.setHSL(color[0], color[1], color[2]);

    particles = new THREE.PointCloud(geometry, materials[i]);

    particles.rotation.z = Math.random() * 0.20 + 0.10;

    scene.add(particles);

  }
}

function createBackground() {
  var bg = new THREE.ImageUtils.loadTexture('images/background.jpg');
  bg.minFilter = THREE.LinearFilter;

  var geometry = new THREE.PlaneBufferGeometry(1920, 1080);
  var color = new THREE.Color(0x330000);
  var material = new THREE.MeshBasicMaterial({
    map: bg,
    side: THREE.DoubleSide
  });
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(50, 30, 0);
  scene.add(mesh);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  animateRain();
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function animateRain() {
  var time = Date.now() * 0.00005;

  for (i = 0; i < scene.children.length; i++) {

    var object = scene.children[i];


    if (object instanceof THREE.PointCloud) {

      if (i == 0) {
        object.translateY(-10);
      }

      if (i > 0) {
        if (layer)
          object.translateY(-10);
        else
        if (scene.children[i - 1].position.y < ((window.innerHeight * -1) / 2 - 1000))
          object.translateY(-10);
      }


      if ((object.position.y < window.innerHeight * -1 * 5)) {
        object.position.y = 500;
        object.position.x = 0;
        if (i == 0) layer = true;
      }
    }
  }

  for (i = 0; i < materials.length; i++) {

    color = parameters[i][0];

    h = (360 * (color[0] + time) % 360) / 360;
    materials[i].color.setHSL(h, color[1], color[2]);

  }
}
