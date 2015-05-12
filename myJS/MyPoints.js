/**
 * Created by Reginald on 4/25/2015.
 */


//the user placed markers that define the polygons vertices
function MyPolyPoint(scene, v3Location){
    this.markerId = MyPolyPointProto.markerId;
    MyPolyPointProto.markerId++;
    var geometry = new THREE.SphereGeometry(.05, 12, 12);

    var material = new THREE.MeshLambertMaterial( { color: 0xFFA500 } );
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.scale.set(0.1,0.1,0.1);
    this.mesh.position.set(v3Location.x ,
        v3Location.y ,
        v3Location.z  );

    this.polyPoints.push(this);

    this.bounds = new THREE.BoundingBoxHelper(this.mesh, 0xff0000);
    this.bounds.update();
    scene.add(this.mesh);
    //scene.add(this.bounds);

    this.mesh.name = "marker";
    this.mesh.myMarkerId = this.id;
}



//the user placed markers that define the base locations
function MyPolyBase(scene, v3Location, side){

    var geometry;
    var material;
    var baseListTable;
    var baseClass;
    var id;



    if(side.indexOf("red")> -1){
        side="red";
        baseListTable = redBaseListTable;
        baseClass = "redBase";
        this.redId = MyPolyPointProto.redId;
        MyPolyPointProto.redId++;
        id = this.redId;

    }
    else if(side.indexOf("blue")> -1){
        side="blue";
        baseListTable = blueBaseListTable;
        baseClass = "blueBase";
        this.blueId = MyPolyPointProto.blueId;
        MyPolyPointProto.blueId++;
        id = this.blueId;

    }

    if(side === "red"){
        this.redId = MyPolyPointProto.redId;

        geometry =  new THREE.SphereGeometry(this.sphereRadius, 10,10);
        material = new THREE.MeshPhongMaterial( { color: this.redColor } );
        this.pointLight = new THREE.PointLight(this.redColor, 1, 100);
    }
    else if (side === "blue"){
        this.blueId = MyPolyPointProto.blueId;

        geometry =  new THREE.SphereGeometry(this.sphereRadius,10,10);
        material = new THREE.MeshPhongMaterial( { color: this.blueColor } );
        this.pointLight = new THREE.PointLight(this.redColor, 1, 100);
    }

    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.scale.set(0.1,0.1,0.1);
    this.mesh.position.set(v3Location.x ,
        v3Location.y ,
        v3Location.z  );

    if(side === "red") {
        this.redBases.push(this);
        this.mesh.name = "redBase";
    }
    else if(side === "blue"){
        this.blueBases.push(this);
        this.mesh.name = "blueBase";
    }
    else{
        this.mesh.name = "marker";
        this.mesh.myMarkerId = this.id;
    }

    this.bounds = new THREE.BoundingBoxHelper(this.mesh, 0xff0000);
    this.bounds.update();
    this.mesh.add(this.pointLight);
    scene.add(this.mesh);
    //scene.add(this.bounds);
    this.addBaseToList(baseClass, side, baseListTable, id);

    

}

var MyPolyPointProto = {
    sphereRadius:.05,
    blueColor: 0x00E5EE,
    redColor : 0xcd0000,
    pointLight: undefined,
    polyPoints: [],
    redBases: [],
    blueBases:[],
    pointName: "No Name",
    state: "active",  //active or inactive, an active poly can be clicked
    markerId: 0,
    redId: 0,
    blueId: 0,
    mesh: undefined,
    clickable: true,
    bounds: undefined,
    speedAvg : 30,         //fastest travel speed in kph
    speedStdDev : 10,
    myMeshType: undefined,

    delete : function(){
        scene.remove(this.mesh);
        scene.remove(this.bounds);
        this.clickable = false;
    },
    deleteBases : function(side){
        if(side.toLowerCase().indexOf("red")> -1) {
            for (var i = 0; i < this.redBases.length; i++) {
                scene.remove(this.redBases[i].mesh);
                this.clickable = false;
            }
            this.redBases=[];
            this.redId = 0;

        }
        else if(side.toLowerCase().indexOf("blue")> -1) {
            for (var i = 0; i < this.blueBases.length; i++) {
                scene.remove(this.blueBases[i].mesh);
                this.clickable = false;
            }
            this.blueBases=[];
            this.blueId = 0;
        }

    },
    deleteAll : function(){
        for (var i = 0; i < this.polyPoints.length; i++) {
            scene.remove(this.polyPoints[i].mesh);
            this.clickable = false
        }
        for (var i = 0; i < this.blueBases.length; i++) {
            scene.remove(this.blueBases[i].mesh);
            this.clickable = false
        }
        for (var i = 0; i < this.redBases.length; i++) {
            scene.remove(this.redBases[i].mesh);
            this.clickable = false
        }
        this.redBases=[];
        this.blueBases=[];
        this.polyPoints=[];
        this.redId=0;
        this.blueId=0;
        this.markerId=0;
    },
    createFromMesh : function(mesh, side){
        function CreateNewBase(){};
        CreateNewBase.prototype = MyPolyPointProto;

        var newBase = new CreateNewBase();
        var baseListTable;
        var baseClass;
        var id;

        newBase.mesh = mesh;

        if(side === "red"){
            newBase.redId = this.redId;
            this.redId++;
            id = newBase.redId;
            newBase.pointName = "red base " + newBase.redId;
            this.redBases.push(newBase);
            baseListTable = redBaseListTable;
            baseClass = "redBase";
        }
        else{
            newBase.blueId = this.blueId;
            this.blueId++;
            id = newBase.blueId;
            newBase.pointName = "blue base " + newBase.blueId;
            this.blueBases.push(newBase);
            baseListTable = blueBaseListTable;
            baseClass = "blueBase";
        }
        this.addBaseToList(baseClass, side, baseListTable, id);
//        var div = document.createElement('div');
//        div.id = id;
//        div.className = 'base row ' + baseClass;
//        this.pointName = side + " base " + (id+1);
//        div.innerHTML = this.pointName + " - Speed: " + this.speedAvg + "kph";
//
//        div.addEventListener('click', baseClicked, false);
//        div.addEventListener('mouseover', baseMouseOver, false);
//        div.addEventListener('mouseout', baseMouseOut, false);
//        baseListDiv.appendChild(div);
        scene.add(newBase.mesh);
    },
    
    addBaseToList(baseClass, side, baseListTable, id){
        this.pointName = side + " base " + (id+1);
        var tableRow = document.createElement('tr');
        tableRow.className = baseClass;
        tableRow.id = baseClass + "_row_" + (id);
        
        var tableData1 = document.createElement('td');
        tableData1.id = baseClass + "_baseName_" + (id);
        tableData1.addEventListener('click', changeBaseNameClicked, false);
        
        var tableData2 = document.createElement('td');
        tableData2.id = baseClass + "_speedMean_" + (id);
        tableData2.addEventListener('click', changeBaseSpeedAvgClicked, false);
        
        var tableData3 = document.createElement('td');
        tableData3.id = baseClass + "_speedStdDev_" + (id);
        tableData3.addEventListener('click', changeBaseSpeedStdDevClicked, false);
        
            
        var tableData4 = document.createElement('td');
        tableData4.className = "glyphicon glyphicon-remove-sign";
        tableData4.id = baseClass + "_deleteBase_" + (id);
        tableData4.addEventListener('click', deleteBaseClicked, false);
        
    
        tableRow.appendChild(tableData1);
        tableRow.appendChild(tableData2);
        tableRow.appendChild(tableData3);
        tableRow.appendChild(tableData4);
        
        tableData1.innerHTML = this.pointName; 
        tableData2.innerHTML = this.speedAvg + " kph";
        tableData3.innerHTML = this.speedStdDev + " kph" ;
    
        tableRow.addEventListener('mouseover', baseMouseOver, false);
        baseListTable.appendChild(tableRow);
    }

};
MyPolyPoint.prototype = MyPolyPointProto;
MyPolyBase.prototype = MyPolyPointProto;
