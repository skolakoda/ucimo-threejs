var demo = (function(){
    "use strict";
    
    var scene = new THREE.Scene(),
        light = new THREE.DirectionalLight (0xffffff, 1),
        light2 = new THREE.DirectionalLight (0xffffff, 0.5),
        
        renderer,
        camera,
        renderer = new THREE.WebGLRenderer(),
        box,
        childBox,
        kockica,
        ground,
        controls=null;

	var aspectRatio = window.innerWidth / window.innerHeight;

	light.position.set( -10, 20, 0 );
	light2.position.set( 10, 20, 0 );


	var initScene = function(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.getElementById("webgl-container").appendChild(renderer.domElement);
		scene.add(light);
		scene.add(light2);
		
		camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000);
		camera.position.set( 0, 20, 100 );
		camera.lookAt(new THREE.Vector3(0,1,0));
		scene.add( camera );  

		box = new THREE.Mesh(
		  new THREE.CubeGeometry(20, 20, 20),
		  new THREE.MeshBasicMaterial({ 
			color: 0xffffff, 
			//shading: THREE.FlatShading, 
			vertexColors: THREE.VertexColors 
		}));

		childBox = new THREE.Mesh(
		  new THREE.CubeGeometry(10, 10, 10),
		  new THREE.MeshBasicMaterial({color: 0xffff00}));
		childBox.position.x -=30;
		childBox.name = "dete";
		box.add(childBox)

		for (var i = 0; i < 12; i+=2) {
			var r = Math.random(); 
			var g = Math.random(); 
			var b = Math.random();         
			box.geometry.faces[i].color.setRGB(r,g,b);
			box.geometry.faces[i+1].color.setRGB(r,g,b);                
		}
		scene.add(box);
		
		kockica = new THREE.Mesh(
		  new THREE.CubeGeometry(5, 5, 5),
		  new THREE.MeshBasicMaterial({ 
			color: 0xff0000, 
			vertexColors: THREE.VertexColors 
		}));
		scene.add(kockica);
		
		requestAnimationFrame(render); 
	};	// initScene		

	   
	function render() {
		box.rotation.x +=0.1;
		box.rotation.y +=0.1;
		
		// logika kruzenja
		var time = Math.floor(Date.now() / 100);
		kockica.position.x = Math.cos(time);
		kockica.position.y = Math.sin(time);

		kockica.position.x += 50;	// pomera desno, da bi se videla

		renderer.render(scene, camera); 
		requestAnimationFrame(render);
	};


	// ne radi
	function onDocumentMouseDown(event) {
		event.preventDefault();
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera);
		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		var intersects = raycaster.intersectObjects(objects);
		if (intersects.length > 0) {
			intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
		}

		
	}


	window.onload = initScene;
	document.addEventListener('mousedown', onDocumentMouseDown, false);

	
})();
