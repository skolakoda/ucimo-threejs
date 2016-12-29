/* VARIJABLE */

var hoda_levo,
  hoda_desno,
  hoda_napred,
  hoda_nazad;
var vrtenje = false;
var salto = false;
var tacka_gledanja = 75; // blizina gledanja
var casovnik = new THREE.Clock(true);

// pravi scenu
var scena = new THREE.Scene();

// pravi marker za kameru i avatara
var marker = new THREE.Object3D();
scena.add(marker);

// kamera
var razmera_slike = window.innerWidth / window.innerHeight;
var kamera = new THREE.PerspectiveCamera(tacka_gledanja, razmera_slike, 1, 10000);
kamera.position.z = 500;
marker.add(kamera);

// pravi renderer
var renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// pravi avatara
var tekstura = new THREE.MeshNormalMaterial();
var telo = new THREE.SphereGeometry(100);
var avatar = new THREE.Mesh(telo, tekstura);
marker.add(avatar);

// pravi udove
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

/* POZIVANJE FUNKCIJA */

praviDrvo(500, 0);
praviDrvo(-500, 0);
praviDrvo(300, -200);
praviDrvo(-200, -800);
praviDrvo(-750, -1000);
praviDrvo(500, -1000);

animiraj();

/* FUNKCIJE */

function praviDrvo(x, z) {
  var stablo = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 200), new THREE.MeshBasicMaterial({color: 0xA0522D}));

  var krosnja = new THREE.Mesh(new THREE.SphereGeometry(150), new THREE.MeshBasicMaterial({color: 0x228b22}))
  krosnja.position.y = 175;
  stablo.add(krosnja);

  stablo.position.set(x, -75, z);
  scena.add(stablo);
}

function hodaj() {
  if (!sadaHoda())
    return;
  var polozaj = Math.sin(casovnik.getElapsedTime() * 5) * 100;
  leva_ruka.position.z = -polozaj;
  desna_ruka.position.z = polozaj;
  leva_noga.position.z = -polozaj;
  desna_noga.position.z = polozaj;
}

function sadaHoda() {
  if (hoda_desno)
    return true;
  if (hoda_levo)
    return true;
  if (hoda_nazad)
    return true;
  if (hoda_napred)
    return true;
  return false;
}

function gledajPravcem() {
  var pravac = 0;
  if (hoda_napred)
    pravac = Math.PI;
  if (hoda_nazad)
    pravac = 0;
  if (hoda_desno)
    pravac = Math.PI / 2;
  if (hoda_levo)
    pravac = -Math.PI / 2;

  //avatar.rotation.y = pravac;
  glatkoOkreni(pravac);
}

function glatkoOkreni(direction) {
  new TWEEN.Tween({y: avatar.rotation.y}).to({
    y: direction
  }, 100).onUpdate(function() {
    avatar.rotation.y = this.y;
  }).start();
}

function praviAkrobacije() {
  if (vrtenje)
    avatar.rotation.z += 0.05;
  if (salto)
    avatar.rotation.x += 0.05;
  }

function animiraj() {
  requestAnimationFrame(animiraj);
  TWEEN.update();
  hodaj();
  gledajPravcem();
  praviAkrobacije();
  renderer.render(scena, kamera);
}

/* SLUSACI */

document.addEventListener('keydown', function(event) {
  //console.log(event.keyCode);

  if (event.keyCode == 37) {
    marker.position.x -= 10;
    hoda_levo = true;
  }
  if (event.keyCode == 39) {
    marker.position.x += 10;
    hoda_desno = true;
  }
  if (event.keyCode == 38) {
    marker.position.z -= 10;
    hoda_napred = true;
  }
  if (event.keyCode == 40) {
    marker.position.z += 10;
    hoda_nazad = true;
  }

  if (event.keyCode == 67)
    vrtenje = true;
  if (event.keyCode == 70)
    salto = true;

  if (event.keyCode == 65)
    kamera.position.x += 10;
  if (event.keyCode == 68)
    kamera.position.x -= 10;
  }
);

document.addEventListener('keyup', function(event) {
  var tipka = event.keyCode;
  if (tipka == 37)
    hoda_levo = false;
  if (tipka == 39)
    hoda_desno = false;
  if (tipka == 38)
    hoda_napred = false;
  if (tipka == 40)
    hoda_nazad = false;

  if (tipka == 67)
    vrtenje = false;
  if (tipka == 70)
    salto = false;
  }
);
