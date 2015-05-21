var progressBarMesh;

function performCalculations(params) {

    var faceIndices = ['a', 'b', 'c', 'd'];
    var face, geometry, numVertices, vertex, vertexIndex;
    var redSpeedsAcum, blueSpeedsAcum;

    if (MyPolygonProto.polygons.length > 0) {
        var faceCounter = 0;
        var redVertexCounter = 0;
        var blueVertexCounter = 0;
        var progressDiv = document.getElementById("progress");
        var color;
        var blueForceDelay = parseFloat(document.getElementById("delay").value);
        if (isNaN(blueForceDelay)) {
            alert("Blue force delay is not a valid number.  Setting it to 0.")
        }

        progressDiv.innerHTML = "";
        document.getElementById("redStats").innerHTML = "";
        document.getElementById("blueStats").innerHTML = "";

        var numIterations = document.getElementById("numIterations").value;
        if (numIterations < 0) {
            alert("'Number of iterations' must be set to a positive interger.");
        }
        else {
            var totRedVertexCounter=0, totBlueVertexCounter=0;  //for final stats
            
            //now that we know we're going to do some work add the progress bar
            scene.add(params.pgBar);
            bolRenderOverlay = true;
            
           //count the number of faces that we'll have to look at for the progress bar
            var totalFaces = 0, totalFacesCompleted = 0;
            for (var iBorderCounter = 0; iBorderCounter < MyPolygonProto.polygons.length; iBorderCounter++) {
                geometry = MyPolygonProto.polygons[iBorderCounter].polyMesh.geometry;
                totalFaces += geometry.faces.length;
            }
             //turn the overlay on
            //showOverlay();
            createProgressBar();
            var startTime = (new Date()).getTime();
            
            var red = {r: 1, g: .0, b: .0};
            var blue = {r: .0, g: .0 , b: 1};
            var iterationCounter = 0;
             
            //go through each face in each boundary
            for (var iBorderCounter = 0; iBorderCounter < MyPolygonProto.polygons.length; iBorderCounter++) {
                //loop through each face
                for (var faceCounter = 0; faceCounter <
                        MyPolygonProto.polygons[iBorderCounter].polyMesh.geometry.faces.length; faceCounter++) {
                    geometry = MyPolygonProto.polygons[iBorderCounter].polyMesh.geometry;
                    face = geometry.faces[faceCounter];
                    numVertices = (face instanceof THREE.Face3) ? 3 : 4;
                    //var faceVertices = [];
                    
                    //var vertices = MyPolygonProto.polygons[iBorderCounter].polyMesh.geometry.vertices;
                    //var vertColors = MyPolygonProto.polygons[iBorderCounter].polyMesh.geometry.vertexColors;
                    //loop through all the vertices
                    //for (var vertCount = 0; vertCount <numVertices; vertCount++) {
                    
                    //loop through each vertex in the face
                    for( var faceVertexCounter = 0; faceVertexCounter < numVertices; faceVertexCounter++ ) {
                        vertexIndex = face[faceIndices[faceVertexCounter]];
                        vertex = geometry.vertices[vertexIndex];
                        
                        //if(!face.vertexColors){ //don't perform calculations for a vertex that has already been colored by a previous calculation
                        if(true){ //don't perform calculations for a vertex that has already been colored by a previous calculation
                            //loop for iteration on each vertex
                            for (iterationCounter = 0; iterationCounter < Math.round(numIterations); iterationCounter++) {
                                //vertexIndex = face[faceIndices[faceVertexCounter]];
                                //vertex = geometry.vertices[vertexIndex];
                                //vertex = vertices[vertCount];
                                var closestBaseColor = "";
                                var fastestTime = Infinity;
                
                                //loop through all the red bases
                                for (var x = 0; x < MyPolyPointProto.redBases.length; x++) {
                                    //calculate the great circle distance between the vertex and the base
                                    var distance = Math.acos(MyPolyPointProto.redBases[x].mesh.position.normalize().dot(vertex.normalize()));
                                    distance = distance * earthRadius;
                                    var speed = boxMullerNormalRandom(Number(MyPolyPointProto.redBases[x].speedAvg), 
                                        Number(MyPolyPointProto.redBases[x].speedStdDev));
                                        if(!speed){
                                            console.log("no speed");
                                        }
                                    redSpeedsAcum = redSpeedsAcum + speed + ",";
                                    var time = distance / speed;
                                    if (time < fastestTime) {
                                        fastestTime = time;
                                        closestBaseColor = "red";
                                    }
                                }
                                //loop through all the blue bases
                                for (var x = 0; x < MyPolyPointProto.blueBases.length; x++) {
                                    //calculate the great circle distance between the vertex and the base
                                    var distance = Math.acos(MyPolyPointProto.blueBases[x].mesh.position.normalize().dot(vertex.normalize()));
                                    distance = distance * earthRadius;
                                    var speed = boxMullerNormalRandom(MyPolyPointProto.blueBases[x].speedAvg, 
                                        MyPolyPointProto.blueBases[x].speedStdDev);
                                        if(!speed){
                                            console.log("no speed");
                                        }
                                    blueSpeedsAcum = blueSpeedsAcum + speed + ",";
                                    var time = blueForceDelay + distance / speed;
                                    if (time < fastestTime) {
                                        fastestTime = time;
                                        closestBaseColor = "blue";
                                    }
                                }
    
                                color = new THREE.Color(0xffffff);
                                //change the vertex color based on which color is closest
                                if (closestBaseColor === "red") {
                                    redVertexCounter++;
                                    //faceVertices.push("red");
                                }
                                if (closestBaseColor === "blue") {
                                    blueVertexCounter++;
                                    //faceVertices.push("blue");
                                }
    
    //                            console.log("vertex: " 
    //                                + vertCount + ", iteration: " + iterationCounter);
                            }//end each iteration
                            //console.log("iteration " + iterationCounter);
                            
                            //color the vertex
                            var redPercentage = redVertexCounter / numIterations;
                            var bluePercentage = blueVertexCounter / numIterations;
                            
                            var finalColor = {};
                            finalColor.r = redPercentage * red.r + bluePercentage * blue.r;
                            finalColor.g = redPercentage * red.g + bluePercentage * blue.g;
                            finalColor.b = redPercentage * red.b + bluePercentage * blue.b;
    //                        console.log(faceVertexCounter + " : Percentage =" + redPercentage +"-" + bluePercentage 
    //                            + " : Color =" + finalColor.r + ", " + finalColor.g + ", "
    //                            + finalColor.b);
    //                        vertColors[vertCount] =
    //                            new THREE.Color(finalColor.r, finalColor.g, finalColor.b);
                            
                            totRedVertexCounter += redVertexCounter;
                            totBlueVertexCounter += blueVertexCounter;
                            //reset the vertex counter
                            redVertexCounter = 0;
                            blueVertexCounter = 0;
                           
                            //faceResults[faceCounter].push(faceVertices);
                            face.vertexColors[faceVertexCounter] = new THREE.Color(finalColor.r, finalColor.g, finalColor.b);
                        }
                    }//end each vertex
                    totalFacesCompleted++;
                    params.update(totalFacesCompleted/totalFaces); 
                    
                     
                }//each face 
                
            }//each border
            //calculate the colors for each vertex
           
           
                
            //tell three to update colors
            for (var k = 0; k < MyPolygonProto.polygons.length; k++) {
                //shader test 
                //MyPolygonProto.polygons[k].polyMesh.material.color.setHex(0x00FFFF);
                //test to see if we can switch materials
//                MyPolygonProto.polygons[k].polyMesh.material = new THREE.MeshLambertMaterial({
//                    color: 0x00FFFF, 
//                    transparent: true,
//                    opacity: 0.75,
//                    wireframe: false,
//                    side: THREE.DoubleSide,
//                    vertexColors: THREE.VertexColors
//                }),
                //create the attributes for the shader
//                var attributes = {
//                  vertAtrColor: {
//                    type: 'v3v', // a float
//                    value: [] // an empty array
//                  },
//                  
//                };
//                attributes.needsUpdate = true;
//                
//                var values = attributes.vertAtrColor.value;
//                
//                for(var i=0; i<vertColors.length; i++){
//                    values.push(new THREE.Vector3(1,.7,.7));
//                }

                   var mat = new THREE.MeshBasicMaterial({
                       side: THREE.DoubleSide,
                       vertexColors: THREE.VertexColors 
                   });
                   MyPolygonProto.polygons[k].polyMesh.material = mat;
//                 MyPolygonProto.polygons[k].polyMesh.material = new THREE.ShaderMaterial( {
////                     attributes: attributes,
//                     vertexShader: document.getElementById( 'boundaryPolygonVertexShaderAfterCalc' ).textContent,
//                     fragmentShader: document.getElementById( 'boundaryPolygonFragmentShaderAfterCalc' ).textContent,
//                     vertexColors: THREE.VertexColors,
//                     side: THREE.DoubleSide
//                     
//                 });
                MyPolygonProto.polygons[k].polyMesh.geometry.colorsNeedUpdate = true;
            }
    
            //update stats
            var totalVertices = totRedVertexCounter + totBlueVertexCounter;
            document.getElementById("redStats").innerHTML = "Red Coverage: " + 
                Math.round((totRedVertexCounter / totalVertices) * 100) + "%";
            document.getElementById("blueStats").innerHTML = "Blue Coverage: " + 
                Math.round((totBlueVertexCounter / totalVertices) * 100) + "%";

            //we're finished so remove the progress bar
            bolRenderOverlay=false;
            scene.remove(params.pgBar);
            params.pgBar = undefined;
        }
        var curTime = (new Date()).getTime();
        console.log("Calculations completed in " + ms2Time(curTime - startTime));
    }
    else {
        alert("Set up a boundary first");
    }
    params.onComplete();
}

function createProgressBar(){
    var geom = new THREE.PlaneGeometry(4, .5);
    var mat = new THREE.MeshBasicMaterial();
    progressBarMesh = new THREE.Mesh(geom, mat);
    progressBarMesh.position.z = 1;
    scene.add(progressBarMesh);
}

function removeProgressBar(){
    scene.remove(progressBarMesh);
}