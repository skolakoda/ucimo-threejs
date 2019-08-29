/**
 * @author inear
 * 
 */
var leafTexture = THREE.ImageUtils.loadTexture( "leaf.png" );
var leafGeometry = new THREE.Plane( 20, 20,1, 1 );
var leafMaterial = new THREE.MeshBasicMaterial( { opacity:0.95, map: leafTexture, blending: THREE.NormalBlending, depthTest: true, transparent : true} );

//move leaf pivot 
for( i=0;i<leafGeometry.vertices.length;i++) {
	leafGeometry.vertices[i].position.y -= 10;
}

var PI2 = Math.PI * 2
var TO_RADIANS = Math.PI / 180;
var _branchSegments = 10;



var branchMap = [
	[0,1,0,0,1, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0,0,0,1,0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0],
	[0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0],
	[0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var randomTable = [200,45,149,271,219,242,172,269,0,335,211,223,176,326,94,306,161,236,73,286,222,119,98,33,336,204,59,81,356,318,331,183,272,101,344,251,110,42,324,169,334,144,114,9,112,110,98,127,320,136,13,200,286,263,230,164,340,211,191,33,326,33,54,128,228,231,47,46,355,336,108,348,251,337,280,80,222,95,13,79,53,203,137,267,291,315,331,50,145,51,255,58,282,141,189,310];
var totalBranchesCreated = 0;


Tree = function ( materials, level, radius, entryPointIndex, maxScale ) {
	
	THREE.Mesh.call( this, new THREE.Geometry(), materials );
	
	level++
	
	this.level = level;
	this.doubleSided = false;
	this.entryPointIndex = entryPointIndex;
	this.maxScale = maxScale;
	this.branchOffset = ( branchMap[level] )? branchMap[level].length - entryPointIndex : 0;
	
	
	this.radius = radius*0.95;
	if( this.radius < 0.5 ) this.radius = .5
	
	build( this )
	
	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();

	this.geometry.__dirtyVertices = true;
	this.geometry.__dirtyNormals = true;

	//animate branch
	if( level == 0  ) {
		//var tweenTarget = this 
		
		//animate rotation
	}
	
	function build( scope ) {
	
		var numCurrentPos = 0;
		var R;
		var S;
		var branchPoint;
		var height;
		var radiusStep;

		branchPoint = new THREE.Object3D();
		
		height = 34*scope.maxScale;
		
		radiusStep = scope.radius / scope.branchOffset;
		//reset
		basePoint = new THREE.Vector3(0,0,0);
		
		//for each step
		while (numCurrentPos < scope.branchOffset)
		{
			//last point
			basePoint.x = branchPoint.position.x;
			basePoint.y = branchPoint.position.y;
			basePoint.z = branchPoint.position.z;
			
			//move forward
			branchPoint.translateZ(height);
			
			if( scope.level > 0 ) {
				branchPoint.rotation.y += 6 * TO_RADIANS;
				//branchPoint.translateX(Math.random()* 5 + 5 );
				//branchPoint.translateY(Math.random()*5);
			}
			else {
				branchPoint.rotation.y += 2 * TO_RADIANS;
			}
			
			height *= 0.9;
			
			//branchPoint.rotation.z =  360 * TO_RADIANS;
			//difference from last segment
			var diffVector = new THREE.Vector3();
			diffVector.sub( branchPoint.position, basePoint)

			var transformPoint = new THREE.Vector3()
			transformPoint.add(diffVector, new THREE.Vector3(10, 0, 0));

			//height from transformPoint
			R = new THREE.Vector3()
			R.cross(transformPoint, diffVector);

			S = new THREE.Vector3()
			S.cross(R, diffVector);

			R.normalize();
			S.normalize();
		
			//build branch
			buildNode( numCurrentPos == 0  );

			//branchPoint.rotation.x = numCurrentPos * 1 * TO_RADIANS;
			branchPoint.updateMatrix();

			if ( branchMap[scope.level][ scope.entryPointIndex + numCurrentPos] ) {
			
				var totalBranches = branchMap[scope.level][ scope.entryPointIndex + numCurrentPos];
				
				var newBranchIndex = totalBranches
				
				while (  newBranchIndex > 0  )
				{
				
					var newBranch = new Tree( scope.materials, scope.level, scope.radius, scope.entryPointIndex + numCurrentPos-3, scope.maxScale*.9)
					newBranch.position = branchPoint.position.clone();
					newBranch.rotation = branchPoint.rotation.clone();
					newBranch.rotation.z += randomTable[ totalBranchesCreated ] * TO_RADIANS;
					scope.addChild( newBranch );
					
					//add one step in random table
					totalBranchesCreated++
					
					//if random index larger than table, reset to zero
					if( totalBranchesCreated > randomTable.length-1) totalBranchesCreated = 0
					
					//scope.radius *= 0.95
					//if( scope.radius < 1 ) scope.radius = 1
					
					
					newBranchIndex--
				}
				
			}
			else if( numCurrentPos > scope.branchOffset-4 ) {
				
				for( i=0; i<2; i++ ) {
					var mesh = new THREE.Mesh( leafGeometry, leafMaterial );
					mesh.doubleSided = true
					mesh.position = branchPoint.position.clone();
					mesh.position.x += Math.random()*50-25
					mesh.position.y += Math.random()*50-25
					mesh.position.z += Math.random()*50-25
					mesh.rotation = branchPoint.rotation.clone();
					mesh.rotation.x = 90 * TO_RADIANS;
					mesh.rotation.y = Math.random()*90 * TO_RADIANS
					mesh.rotation.z = Math.random()*90 * TO_RADIANS;
					scope.addChild( mesh );
					
					var tweenTarget = mesh; 
					var initRotY = mesh.rotation.y
					var initRotZ = mesh.rotation.z
					var randomTime = Math.random()*2000+200
					mesh.tween = new TWEEN.Tween(tweenTarget.rotation)
						.to({ z: (initRotZ+30*Math.random()) * TO_RADIANS, y: initRotY + Math.random() * 65 * TO_RADIANS }, randomTime)
						.easing(TWEEN.Easing.Quadratic.EaseInOut)
						.start();
			
					mesh.tweenBack = new TWEEN.Tween(tweenTarget.rotation, false)
						.to({ z: initRotZ, y: initRotY }, randomTime)
						.easing(TWEEN.Easing.Quadratic.EaseInOut);
			
					mesh.tween.chain(mesh.tweenBack);
					mesh.tweenBack.chain(mesh.tween);
					
				}
				
			}
			
			numCurrentPos++;
			scope.radius = scope.radius-radiusStep;

			function buildNode( bFirstNode ) {
				
				var segmentAngle;
				var intSegmentStep;
				var pX;
				var pY;
				var pZ;
				var newVertex3D;
				var p1,p2,p3,p4;
				
				var vertices = scope.geometry.vertices
				var faces = scope.geometry.faces
				var faceVertexUvs = scope.geometry.faceVertexUvs
				
				segmentAngle = Math.PI * 2 / _branchSegments;
				
				//ring 2-len
				var transformedRadius = scope.radius;
				
				intSegmentStep = 0;
				
				while (intSegmentStep < _branchSegments)
				{
					//root node
					if ( bFirstNode && scope.level == 0 ) {
						transformedRadius = scope.radius + 15* Math.random();
					}
					else if( numCurrentPos < 2 && scope.level > 0 && scope.radius > 10){
						transformedRadius = scope.radius;// + Math.random() * radius *.2;
					}
					else {
						transformedRadius = scope.radius + Math.random() * scope.radius *.2;
					}
					
					if( transformedRadius < 1) transformedRadius = 1
					
					pX = basePoint.x + transformedRadius * Math.cos(intSegmentStep * segmentAngle) * R.x + transformedRadius * Math.sin(intSegmentStep * segmentAngle) * S.x;
					pY = basePoint.y + transformedRadius * Math.cos(intSegmentStep * segmentAngle) * R.y + transformedRadius * Math.sin(intSegmentStep * segmentAngle) * S.y;
					pZ = basePoint.z + transformedRadius * Math.cos(intSegmentStep * segmentAngle) * R.z + transformedRadius * Math.sin(intSegmentStep * segmentAngle) * S.z;
					
					newVertex3D = new THREE.Vertex( new THREE.Vector3(pX, pY, pZ));

					vertices.push(newVertex3D);

					intSegmentStep++;
				}
				
				if ( bFirstNode ) return;

				intSegmentStep = 0;
				while (intSegmentStep < _branchSegments)
				{
					
					if ( intSegmentStep < (_branchSegments - 1)) {
						//second floor
						p1 = vertices.length - _branchSegments + intSegmentStep + 1;
						p4 = vertices.length - _branchSegments + intSegmentStep ;
						
						//first floor
						p2 = vertices.length - _branchSegments * 2 + intSegmentStep + 1;
						p3 = vertices.length - _branchSegments * 2 + intSegmentStep;
					}
					else {
						//last side - connected to first point in ring
						//second floor
						p1 = vertices.length - _branchSegments;
						p4 = vertices.length - _branchSegments + intSegmentStep;
						
						p2 = vertices.length - _branchSegments * 2;
						p3 = vertices.length - _branchSegments * 2 + intSegmentStep;
					}	

					faces.push( new THREE.Face4( p1, p2, p3, p4  ) );

					var maxHeight = height*(scope.branchOffset+1);
					
					var startX = 1/_branchSegments*(intSegmentStep+1);
					var endX = startX - 1/_branchSegments;
					
					var startY = numCurrentPos/scope.branchOffset*3;
					var endY = startY + 1/scope.branchOffset*3
					
					faceVertexUvs[ 0 ].push([
						new THREE.UV( startX, endY),
						new THREE.UV( startX,startY ),
						new THREE.UV( endX ,startY ),
						new THREE.UV( endX, endY )
					])
					
					intSegmentStep++;
				}
			}
		}
	}
	
};


Tree.prototype = new THREE.Mesh();
Tree.prototype.constructor = Tree;
Tree.prototype.supr = THREE.Mesh.prototype;
