/**
 * Created by Reginald on 4/25/2015.
 */
//star field surrounding everything

function SolarSystemCenter(scene, callback){
    var solarSystemCenter;
    solarSystemCenter = new THREE.Object3D();
    scene.add(solarSystemCenter);
    callback(solarSystemCenter);
}

function StarField(parent) {
    var fieldTexture;
    var that=this;
    fieldTexture = THREE.ImageUtils.loadTexture('./images/stars.jpg', {},function(){
        that.material = new THREE.MeshBasicMaterial({map:fieldTexture,
            side: THREE.BackSide});
        that.geometry = new THREE.SphereGeometry(that.starFieldRadius, 32, 32);
        that.mesh = new THREE.Mesh(that.geometry, that.material);
        parent.add(that.mesh);
        that.mesh.name = "stars";
    });
}



//Sun surrounding everything
function Sun(parent) {
    var fieldTexture, geometry, pointLight;
    var that = this;
    fieldTexture = THREE.ImageUtils.loadTexture('./images/sunMap.jpg', {},function(){
        that.material = new THREE.MeshBasicMaterial({map:fieldTexture,
            side: THREE.BackSide});
        geometry = new THREE.SphereGeometry(5, 32, 32);
        that.mesh = new THREE.Mesh(geometry, that.material);
        pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
        that.mesh.add(pointLight);
        parent.add(that.mesh);
        that.mesh.name = "sun";
    });
}


//the globe object
function Earth(parent, loader, callback){
    var wireframe = false;
    var that=this;

    this.onGeometry = function (geom, mats) {
        that.geometry = geom;
        if(!wireframe){
            that.mesh = new THREE.Mesh(that.geometry, new THREE.MeshFaceMaterial(mats));
        }
        else{
            that.mesh = new  THREE.Mesh(geom, new THREE.MeshBasicMaterial({
             color: 0x00FF00,
            transparent: true,
            opacity:.5,
            specular: 0xFFFFFF,
            wireframe: true, wireframeLinewidth: 1}));
        }

        //for testing shaders
        /*globeMesh = new  THREE.Mesh(globeGeometry, new THREE.ShaderMaterial( {
         vertexShader: document.getElementById( 'testVertexShader' ).textContent,
         fragmentShader: document.getElementById( 'testFragmentShader' ).textContent
         } )
         );*/

        /*globeMesh.geometry.buffersNeedUpdate = true;
         globeMesh.geometry.uvsNeedUpdate = true;*/
        that.mesh.name = "earth";
        //that.mesh.position.set(10, 0, 0);
        parent.add(that.mesh);



        console.log("globe loaded");
        callback();
    };
    loader.load("./models/globe/globe2WithUVs.js", this.onGeometry);
    /*THREEx.Planets.baseURL = "";
     console.log(THREEx.Planets.baseURL);
     var mesh    = THREEx.Planets.createEarth();
     scene.add(mesh);*/
}

var SpaceObjectProto = {
    starFieldRadius: 80,
    material: undefined,
    mesh: undefined,
    geometry: undefined,
    sun: undefined,
    earth: undefined,
    starField : undefined,
    solarSystemCenter: undefined,
    intitialize: function(scene, loader, callback){
        var that = this;
        this.solarSystemCenter = new SolarSystemCenter(scene, function(center){
            that.starField = new StarField(center);
            that.sun = new Sun(center);
            // load the earth
            that.earth = new Earth(center, loader, callback);

        });
    }
};

Earth.prototype = SpaceObjectProto;
SolarSystemCenter.prototype = SpaceObjectProto;
StarField.prototype = SpaceObjectProto;
Sun.prototype = SpaceObjectProto;