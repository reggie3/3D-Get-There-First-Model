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
    var baseListDiv;
    var baseClass;
    var id;



    if(side.indexOf("red")> -1){
        side="red";
        baseListDiv = redBaseListDiv;
        baseClass = "redBase";
        this.redId = MyPolyPointProto.redId;
        MyPolyPointProto.redId++;
        id = this.redId;

    }
    else if(side.indexOf("blue")> -1){
        side="blue";
        baseListDiv = blueBaseListDiv;
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

    var div = document.createElement('div');
    div.id = id;
    div.className = 'base row ' + baseClass;
    this.pointName = side + " base " + (id+1);
    div.innerHTML = this.pointName + " - Speed: " + this.speed + "kph";

    div.addEventListener('click', baseClicked, false);
    div.addEventListener('mouseover', baseMouseOver, false);
    baseListDiv.appendChild(div);

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
    speed : 30,         //fastest travel speed in kph
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
        var baseListDiv;
        var baseClass;
        var id;

        newBase.mesh = mesh;

        if(side === "red"){
            newBase.redId = this.redId;
            this.redId++;
            id = newBase.redId;
            newBase.pointName = "red base " + newBase.redId;
            this.redBases.push(newBase);
            baseListDiv = redBaseListDiv;
            baseClass = "redBase";
        }
        else{
            newBase.blueId = this.blueId;
            this.blueId++;
            id = newBase.blueId;
            newBase.pointName = "blue base " + newBase.blueId;
            this.blueBases.push(newBase);
            baseListDiv = blueBaseListDiv;
            baseClass = "blueBase";
        }

        var div = document.createElement('div');
        div.id = id;
        div.className = 'base row ' + baseClass;
        this.pointName = side + " base " + (id+1);
        div.innerHTML = this.pointName + " - Speed: " + this.speed + "kph";

        div.addEventListener('click', baseClicked, false);
        div.addEventListener('mouseover', baseMouseOver, false);
        div.addEventListener('mouseout', baseMouseOut, false);
        baseListDiv.appendChild(div);
        scene.add(newBase.mesh);
    }

};
MyPolyPoint.prototype = MyPolyPointProto;
MyPolyBase.prototype = MyPolyPointProto;
