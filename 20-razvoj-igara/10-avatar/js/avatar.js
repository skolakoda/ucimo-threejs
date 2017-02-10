// pravi scenu
var scena = new THREE.Scene();

// kamera
var razmera_slike = window.innerWidth / window.innerHeight;
var kamera = new THREE.PerspectiveCamera(75, razmera_slike, 1, 10000);
kamera.position.z = 500;
scena.add(kamera);

// pravi kanvas za render
var renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// pravi avatara
var tekstura = new THREE.MeshNormalMaterial();
var telo = new THREE.SphereGeometry(100);
var avatar = new THREE.Mesh(telo, tekstura);
scena.add(avatar);

var ud = new THREE.SphereGeometry(50);
var desna_ruka = new THREE.Mesh(ud, tekstura);
desna_ruka.position.set(-150, 0, 0);
avatar.add(desna_ruka);

var leva_ruka = new THREE.Mesh(ud, tekstura);
leva_ruka.position.set(150, 0, 0);
avatar.add(leva_ruka);

var desna_noga = new THREE.Mesh(ud, tekstura);
desna_noga.position.set(70, -120, 0);
avatar.add(desna_noga);

var leva_noga = new THREE.Mesh(ud, tekstura);
leva_noga.position.set(-70, -120, 0);
avatar.add(leva_noga);

var vrtenje = true;
var okretanje = true;

function animiraj() {
  requestAnimationFrame(animiraj);
  if (vrtenje) {
    avatar.rotation.z += 0.03;
  }
  if (okretanje) {
    avatar.rotation.x += 0.03;
  }
  renderer.render(scena, kamera);

}

animiraj();
