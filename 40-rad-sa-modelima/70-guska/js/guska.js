var demo = (function() {
  "use strict";

  var aspectRatio = window.innerWidth / window.innerHeight;
  var scene = new THREE.Scene(),
    light = new THREE.AmbientLight(0xffffff),
    renderer = new THREE.WebGLRenderer(),
    camera,
    box,
    ground,
    controls = null;

  var loader = new THREE.JSONLoader(),
    mesh;


  function initScene() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-container").appendChild(renderer.domElement);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000);
    camera.position.set(-20, 110, 900);
    scene.add(camera);

    requestAnimationFrame(render);
  }

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }


  window.onload = initScene;

  loader.load('modeli/guska.json', function(geometry) {
    var gooseMaterial = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture('teksture/guska.jpg')
    });

    mesh = new THREE.Mesh(geometry, gooseMaterial);
    mesh.scale.set(1000, 1000, 1000);

    scene.add(mesh);
  });

})();
