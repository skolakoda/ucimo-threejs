var scene = new THREE.Scene();
document.body.style.backgroundColor = 'black';
var vreme = 0,
  brzina = 1,
  pauza = false;

// pravi kamere
var razmera_slike = window.innerWidth / window.innerHeight;
var glavna_kamera = new THREE.PerspectiveCamera(75, razmera_slike, 1, 1e6);
glavna_kamera.position.z = 1000;
scene.add(glavna_kamera);
var camera = glavna_kamera; // default camera

var kamera_zemlja_sunce = new THREE.PerspectiveCamera(75, razmera_slike, 1, 1e6);
var kamera_zemlja_mesec = new THREE.PerspectiveCamera(75, razmera_slike, 1, 1e6);

// pravi renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// pravi sunce
var surface = new THREE.MeshPhongMaterial({ambient: 0xFFD700});
var zvezda = new THREE.SphereGeometry(50, 28, 21);
var sunce = new THREE.Mesh(zvezda, surface);
scene.add(sunce);
var ambijent = new THREE.AmbientLight(0xffffff);
scene.add(ambijent);
var sunceva_svetlost = new THREE.PointLight(0xffffff, 5, 1000);
sunce.add(sunceva_svetlost);

// pravi zemlju
var surface = new THREE.MeshPhongMaterial({ambient: 0x1a1a1a, color: 0x0000cd});
var planeta = new THREE.SphereGeometry(20, 20, 15);
var zemlja = new THREE.Mesh(planeta, surface);

// pravi zemljinu orbitu
var zemljina_orbita = new THREE.Object3D();
sunce.add(zemljina_orbita);
zemljina_orbita.add(zemlja);
zemlja.position.set(250, 0, 0);
zemljina_orbita.add(kamera_zemlja_sunce);
kamera_zemlja_sunce.rotation.set(Math.PI / 2, 0, 0);

// pravi mesec
var surface = new THREE.MeshPhongMaterial({ambient: 0x1a1a1a, color: 0xffffff});
var planeta = new THREE.SphereGeometry(15, 30, 25);
var mesec = new THREE.Mesh(planeta, surface);

// pravi mesecevu orbitu
var meseceva_orbita = new THREE.Object3D();
zemlja.add(meseceva_orbita);
meseceva_orbita.add(mesec);
mesec.position.set(0, 100, 0);
meseceva_orbita.add(kamera_zemlja_mesec);
kamera_zemlja_mesec.rotation.set(Math.PI / 2, 0, 0);

// pravi zvezde
var zvezde = new THREE.Geometry();
while (zvezde.vertices.length < 1e4) {
  var lat = Math.PI * Math.random() - Math.PI / 2;
  var lon = 2 * Math.PI * Math.random();

  zvezde.vertices.push(new THREE.Vector3(1e5 * Math.cos(lon) * Math.cos(lat), 1e5 * Math.sin(lon) * Math.cos(lat), 1e5 * Math.sin(lat)));
}
var zvezdica = new THREE.ParticleBasicMaterial({size: 500});
var zvezdani_sistem = new THREE.ParticleSystem(zvezde, zvezdica);

scene.add(zvezdani_sistem);

// FUNKCIJE

function okreciPlanete() {
  vreme = vreme + brzina;
  var brzina_zemlje = vreme * 0.001;
  zemlja.position.set(250 * Math.cos(brzina_zemlje), 250 * Math.sin(brzina_zemlje), 0);
  var brzina_meseca = vreme * 0.02;
  meseceva_orbita.rotation.set(0, 0, brzina_meseca);
}

function racunajUgao() {
  var y_razlika_zemlja_sunce = sunce.position.y - zemlja.position.y;
  var x_razlika_zemlja_sunce = sunce.position.x - zemlja.position.x;
  var ugao_zemlja_sunce = Math.atan2(x_razlika_zemlja_sunce, y_razlika_zemlja_sunce);
  kamera_zemlja_sunce.rotation.set(Math.PI / 2, -ugao_zemlja_sunce, 0);
  kamera_zemlja_sunce.position.set(zemlja.position.x, zemlja.position.y, 22);
}

function animiraj() {
  requestAnimationFrame(animiraj);
  renderer.render(scene, camera);

  if (pauza)
    return;

  okreciPlanete();
  racunajUgao();
}

animiraj();

// SLUSACI

document.addEventListener("keydown", function(event) {
  var code = event.keyCode;

  if (code == 81) { // Q
    camera = kamera_zemlja_sunce;
  }
  if (code == 87) { // W
    camera = kamera_zemlja_mesec;
  }
  if (code == 69) { // E
    camera = glavna_kamera;
  }

  if (code == 80)
    pauza = !pauza; // P
  if (code == 49)
    brzina = 1; // 1
  if (code == 50)
    brzina = 2; // 2
  if (code == 51)
    brzina = 10; // 3
  }
);
