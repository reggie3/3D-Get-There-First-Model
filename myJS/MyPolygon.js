//user defined polygons
function MyPolygon(points, newPolygonObject){
    if(!points){
        console.log("create from copy");
        this.polyMesh =  new THREE.Mesh();
    }
    else {
        this.id = MyPolygonProto.id;

        MyPolygonProto.id++;


        var numPoints = points.length;
        var outlineGeometry = new THREE.Geometry(); //the geometry for the plane's outline
        var polyGeometry;

        //build the irregular shape that will be turned into a poligon
        var shape = new THREE.Shape();
        shape.moveTo(points[0].mesh.position.x, points[0].mesh.position.y,
            points[0].mesh.position.z);
        outlineGeometry.vertices.push(new THREE.Vector3(points[0].mesh.position.x,
            points[0].mesh.position.y, points[0].mesh.position.z));
        /*polyGeometry.vertices.push(points[0].mesh.position.x,
         points[0].mesh.position.y, points[0].mesh.position.z);*/
        for (var i=1; i< numPoints; i++){
            shape
                .lineTo(points[i].mesh.position.x, points[i].mesh.position.y,
                points[i].mesh.position.z);
            outlineGeometry.vertices.push(new THREE.Vector3(points[i].mesh.position.x,
                points[i].mesh.position.y, points[i].mesh.position.z));
            /* polyGeometry.vertices.push(points[i].mesh.position.x,
             points[i].mesh.position.y, points[i].mesh.position.z);*/
        }
        outlineGeometry.vertices.push(new THREE.Vector3(points[0].mesh.position.x,
            points[0].mesh.position.y, points[0].mesh.position.z));


        polyGeometry = new THREE.ShapeGeometry(shape); //the geometry for the plane that will make the shape

        //the shape geometry moves the z axis of the points to zero, so let's move towards the surface
        for (var i=0; i< numPoints; i++) {
            polyGeometry.vertices[i].x = points[i].mesh.position.x;
            polyGeometry.vertices[i].y = points[i].mesh.position.y;
            polyGeometry.vertices[i].z = points[i].mesh.position.z;
        }


        //add more subdivisions to the poly mesh so that we can displace them later
        // First we want to clone our original geometry.
        // Just in case we want to get the low poly version back.
        //var smooth = THREE.GeometryUtils.clone( polyGeometry );

        // Next, we need to merge vertices to clean up any unwanted vertex.
        //polyGeometry.mergeVertices();

        // Create a new instance of the modifier and pass the number of divisions.
        var tessellateModifier = new THREE.TessellateModifier(.01);

        // Apply the modifier to our cloned geometry.
        for (var x = 0; x < 25; x++) {
            tessellateModifier.modify(polyGeometry);
        }

        // Finally, add our new detailed geometry to a mesh object and add it to our scene.
        //var mesh = new THREE.Mesh( smooth, new THREE.MeshPhongMaterial( { color: 0x222222 } ) );
        this.polyMesh = new THREE.Mesh(polyGeometry,this.polyMaterial);

        //using a shader here so that I can displace each vertex on its normal vector
        /*            this.polyMesh = new THREE.Mesh( polyGeometry,
         new THREE.ShaderMaterial( {
         vertexShader: document.getElementById( 'boundaryPolygonVertexShader' ).textContent,
         fragmentShader: document.getElementById( 'boundaryPolygonFragmentShader' ).textContent
         } )
         );*/

        /* var planeVector = (new THREE.Vector3( 0, 0, 1 )).applyQuaternion(this.polyMesh.quaternion);
         var quaternion = new THREE.Quaternion();
         quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), Math.PI / 2 );
         var centerVector = (new THREE.Vector3( 0, 0, -1 )).applyQuaternion(quaternion);

         if(planeVector.angleTo(centerVector)>Math.PI/2) {
         console.log('facing front');
         }
         else{
         console.log('facing back');
         }

         var edges = new THREE.VertexNormalsHelper( this.polyMesh, 2, 0x0000FF, 1 );

         this.polyMesh.geometry.computeFaceNormals();
         //get a normalized normal vector of one of the faces
         var normNorm = this.polyMesh.geometry.faces[0].normal.normalize();
         var distanceToCenter =  this.polyMesh.geometry.faces[0].normal.distanceTo(new THREE.Vector3(0,0,0));
         //if(this.polyMesh.geometry.faces[ i ].normal.x === 0) {
         for (var i = 0; i < this.polyMesh.geometry.faces.length; i++) {
         var face = this.polyMesh.geometry.faces[i];
         var temp = face.a;
         face.a = face.c;
         face.c = temp;

         }

         this.polyMesh.geometry.computeFaceNormals();
         this.polyMesh.geometry.computeVertexNormals();

         var faceVertexUvs = this.polyMesh.geometry.faceVertexUvs[0];
         for (var i = 0; i < faceVertexUvs.length; i++) {

         var temp = faceVertexUvs[i][0];
         faceVertexUvs[i][0] = faceVertexUvs[i][2];
         faceVertexUvs[i][2] = temp;

         }*/
        //}
        //push each vertex to just above the surface of the globe
        for(var i = 0; i < this.polyMesh.geometry.vertices.length; i++){
            this.polyMesh.geometry.vertices[i] = this.polyMesh.geometry.vertices[i].
                setLength(this.surfaceDisplacement);
        }
        scene.add(this.polyMesh);
        this.polyMesh.name= "boundary";
        //scene.add( edges );   //to help visualize the normals


        for(var i = 0; i < outlineGeometry.vertices.length; i++){
            outlineGeometry.vertices[i] = outlineGeometry.vertices[i].setLength
            (this.surfaceDisplacement);
        }

        this.outline = new THREE.Line(outlineGeometry, this.outlineMaterial);
        this.outline.name = "boundary";
        //scene.add(this.outline);


        //make all the point markers invisible
        for (var i=0; i< points.length; i++){
            points[i].mesh.visible=false;
            scene.remove(points[i].bounds);
        }
    }
    this.name= "Boundary " + (this.id+1);

    var div = document.createElement('div');
    div.id = this.id;
    div.className = "boundaryListDiv boundary";
    div.innerHTML = this.name;

    div.addEventListener('click', boundaryClicked, false);
    div.addEventListener('mouseover', boundaryMouseOver, false);
    div.addEventListener('mouseout', boundaryMouseOut, false);

    borderListDiv.appendChild(div);
    this.polygons.push(this);

}

var MyPolygonProto = {
    polygons: [],
    name: "",
    id: 0,
    polyMesh: undefined,
    polyMaterial : new THREE.MeshLambertMaterial({
        color: 0xFFFFFF, transparent: true,
        opacity: 0.2,
        wireframe: false,
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
    }),

    outline: undefined,
    outlineMaterial : new THREE.LineBasicMaterial( { color: 0xFFFFFF,
        linewidth: 5,
        opacity:0.5}),
    x: 0,
    y: 0,
    z: 0,
    surfaceDisplacement: 1.005,       //height of polygon above surface of globe
    visible: true,
    delete : function(id){
        scene.remove(this.polygons[id].polyMesh);
        scene.remove(this.polygons[id].outline);
        this.visible = false;
        this.polygons[id] =null;
    },
    deleteAll : function(){
        for (var i = 0; i < this.polygons.length; i++) {
            scene.remove(this.polygons[i].polyMesh);
            scene.remove(this.polygons[i].outline);
        }
        this.polygons = [];
    },
    createFromMesh : function(mesh){
        function CreateNewPolygon(){};
        CreateNewPolygon.prototype = MyPolygonProto;

        var newPoly= new CreateNewPolygon();

        newPoly.id= this.id;
        this.id++;
        newPoly.polyMesh = mesh;
        this.polygons.push(newPoly);

        newPoly.name= "Boundary " + (newPoly.id+1);

        var div = document.createElement('div');
        div.id = newPoly.id;
        div.className = "boundaryListDiv boundary";
        div.innerHTML = newPoly.name;

        div.addEventListener('click', boundaryClicked, false);
        div.addEventListener('mouseover', boundaryMouseOver, false);

        borderListDiv.appendChild(div);

        scene.add(newPoly.polyMesh);
    }
};

MyPolygon.prototype = MyPolygonProto;