// revolutions per second
var angularSpeed = 0.2;
var lastTime = 0;

// this function is executed on each animation frame
function animate() {
  // update
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
  cylinder.rotation.x += angleChange;
  cylinder.rotation.z += angleChange;
  lastTime = time;

  // render
  renderer.render(scene, camera);

  // request new frame
  requestAnimationFrame(function() {
    animate();
  });
}

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 700;

// scene
var scene = new THREE.Scene();

// cylinder
// API: THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight)
var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(100, 100, 400, 50, 50, false), new THREE.MeshPhongMaterial({
  // light
  specular: '#a9fcff',
  // intermediate
  color: '#00abb1',
  // dark
  emissive: '#006063',
  shininess: 100
}));
cylinder.overdraw = true;
scene.add(cylinder);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// start animation
animate();
