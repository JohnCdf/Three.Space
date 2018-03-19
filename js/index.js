/*
WELCOME TO SPACE.THREE
.          +            /--------------------\
+                       | STOP THIS PLANET!! |
   +           .       |  I WANNA GET OFF!  |
.    OOOOOOOOOOOO/OOO0 / \--------------------/
  O..***......./**..//.OO         .   +
OO.....*******.***./.......OO
OO......**********...........OO        +      .    .
OO.........****...*............OO
O............**.................O      +    .
O...........*******.............O                +
O..........*********............O
OO.........********............OO        .     .
OO.........*****.............OO    +               +
 O........***.............OO               +
+   OO.......**...........OO      .
.     OOOOOOOOOOOOOOOO                             +

*/
var planetCount = 0;
var stars = [];

var starField;
var starsGeometry;
var addRandomPlanet = function(){
  randomCoors = [Math.floor(Math.random() * 100-50)*10,  Math.floor(Math.random() * 100-50)*10, Math.floor(Math.random() * 100-50)*10];
  randomProps = [(Math.random()*15)+2,20,20];
  planetCreate(randomCoors,randomProps);//creates a planet with random coordinates and properties
}

var save = function(){
  var FOV = Number($("#fov").val());
  var near = Number($("#near").val());
  var far = Number($("#far").val());

  camera.fov = FOV;
  camera.near = near;
  camera.far = far;
  camera.position.z = 10;
  camera.position.y = 1.5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.updateProjectionMatrix();
}

function starCreate(){
  // List of all the materials used in the meshes you want to combine
  var x = (Math.random()*200 - 50)*10;
  var y = (Math.random()*200 - 50)*11;
  var z = (Math.random()*200 - 50)*10;
  var g = new THREE.SphereGeometry(.5,7,7);
  var m = new THREE.MeshLambertMaterial({color:0xFFFFFF});
  var star = new THREE.Mesh(g, m);

  star.position.set(x,y,z)
  stars.push(star)
};

function initialize(){
    $("#title").fadeOut()
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    $("#quote").text(quote.q);
    $("#cite").text(quote.c);
    document.body.appendChild( renderer.domElement );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.z = 10;
    camera.position.y = 1.5;

          planetCreate([0,0,0],[4.5,25,25]);//first planet in the center
          //sky sphere
          var starGeometry = new THREE.SphereGeometry(10000, 50, 50);
          var starMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("../assets/othertexture/bgsky.jpg"),
            side: THREE.DoubleSide,
            shininess: 0
          });
          //canvas background
          starField = new THREE.Mesh(starGeometry, starMaterial);
          scene.add(starField);

          /*******STAR CREATION*******/
          /*      line 86 - 136      */
          /*
            Generating stars involves going through three stages,
            going from individual meshes to a single mesh, so
            we dont deal with a thousand separate stars.

            In stage 1, we will set an interval to create a thousand stars,
            using the starCreate() function. This functions will generate a
            mesh (star geometry) in a random position.

            In stage 2, the stars are pushed into an array as an object
            with an index

            In the final stage, each star gets merged into a single geometry
            and, viola! It's placed into the scene

          */
          /*---Note---
            Instead of using loops,
            timeIntervals are utilised.
            This is so the loops dont run before
            everything else (They are prioritised!).
          */
          var i =0;
          var meshes = [];
          var totalGeometry = new THREE.Geometry();

      currentLoop = setInterval(function(){//stage1
         starCreate()
         starCount = stars.length
         $("#inner-bar").width((starCount/1000)*100 + '%');
          $("#loading-text").html("Creating Stars.")
          i++;
          if(i == 1000){
            clearInterval(currentLoop)
            i=0;
            nextLoop()
          }
       },1)

       function nextLoop(){//stage2

            $("#loading-text").html("Linking Stars..")

         currentLoop = setInterval(function(){
           $("#inner-bar").width((i/1000)*100 + '%');
           meshes.push({mesh: stars[i], materialIndex: i})
           i++;
           if(i == 1000){
             clearInterval(currentLoop)
             i=0;
             lastLoop()
           }
         },1)

       }

       function lastLoop (){//stage 3
         currentLoop=setInterval(function(){
           $("#inner-bar").width((i/1000)*100 + '%');
            $("#loading-text").html("Merging Sky...")
             meshes[i].mesh.updateMatrix();
             totalGeometry.merge(meshes[i].mesh.geometry, meshes[i].mesh.matrix, meshes[i].materialIndex);
             if (i==meshes.length-1) {
               starsGeometry = new THREE.Mesh(totalGeometry, new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
               scene.add(starsGeometry);
                $("#loading").fadeOut()
                i=0
                clearInterval(currentLoop)

             }

             i++
         },1)
       }


                           animate()

}
function planetCreate(position,options){
  /* PLANET CREATOR
  *   .                  .              .        .   *          .
.         .                     .       .           .      .        .
   o                             .                   .
    .              .                  .           .
     0     .
            .          .                 ,                ,    ,
.          \          .                         .
 .      \   ,
.          o     .                 .                   .            .
.         \                 ,             .                .
          #\##\#      .                              .        .
        #  #O##\###                .                        .
.        #*#  #\##\###                       .                     ,
   .   ##*#  #\##\##               .                     .
 .      ##*#  #o##\#         .                             ,       .
     .     *#  #\#     .                    .             .          ,
                 \          .                         .
____^/\___^--____/\____O______________/\/\---/\___________---______________
/\^   ^  ^    ^                  ^^ ^  '\ ^          ^       ---
    --           -            --  -      -         ---  __       ^
--  __                      ___--  ^  ^                         --  __
(saturn as seen from one of its moons)
*/
  cX = position[0],cY = position[1],cZ = position[2];
  var ring=false;
  var moon=false;
  var tag;//3D planet name
  var pretext = planetTextures[Math.floor(Math.random()*planetTextures.length)];
  console.log(pretext)
  var texture = new THREE.TextureLoader().load( "../assets/planettexture/"+pretext );
  var geometry = new THREE.SphereGeometry(options[0],options[1],options[2]);//4.5,25,25
  var material = new THREE.MeshLambertMaterial({map:texture});
  var planet = new THREE.Mesh(geometry, material);

  if (Math.random()>=0.5) {//determines if planet has ring
    var geometry = new THREE.RingGeometry(options[0]*2,options[0]*2.5,35);
    var texture = new THREE.TextureLoader().load("../assets/othertexture/"+ringTextures[Math.floor(Math.random()*ringTextures.length)])
    var material = new THREE.MeshLambertMaterial({map: texture,side: THREE.DoubleSide});
    ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.random()*300 - 50;
    ring.rotation.y = (Math.random()*300 - 50)*-1;

    ring.position.set(cX,cY,cZ);
    scene.add(ring);
  }

  if (Math.random()>=0.5) {//determines if planet has moon
    var texture = new THREE.TextureLoader().load( "../assets/moontexture/"+moonTextures[Math.floor(Math.random()*moonTextures.length)] );
    var geometry = new THREE.SphereGeometry(Math.random()+Math.random(), 17, 17);
    var material = new THREE.MeshBasicMaterial({map:texture});
    moon = new THREE.Mesh(geometry, material);

    moon.position.set(cX,cY,cZ);
    scene.add(moon);
  }
  planet.position.set(cX,cY,cZ);
  scene.add(planet);

  camera.position.z = cZ + options[0]+10;/*resets the camera*/
  camera.position.y = cY + 10;           /*to the new planet*/
  camera.position.x = cX + 10;
  controls.target.set(cX,cY,cZ);
  controls.update();

  angle = planet.scale.y;
  planetname=planetNameP1[Math.floor(Math.random()*planetNameP1.length)]+'-'+planetNameP2[Math.floor(Math.random()*planetNameP2.length)]+'-'+planetNameP3[Math.floor(Math.random()*planetNameP3.length)];
  if (Math.random()*1000> 990) {planetname+=" (With Life)"}//10 in 10000 planets has life

var loader = new THREE.FontLoader()
    loader.load( '../helvetiker_regular.typeface.json', function ( font ) {

      var textGeo = new THREE.TextGeometry( planetname, {
        font: font,
        size: options[0]/2,
        height: .1
      } );

      var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

      tag = new THREE.Mesh( textGeo, textMaterial );
      tag.position.set( cX-(options[0]*1.5), cY+(options[0]*1.5), cZ );

      scene.add( tag );

    } );

    setInterval(function(){
      angle+=0.00001;
      if (moon) {
      moon.position.x = 12*Math.cos(angle);
      moon.position.y = 12*Math.sin(angle);
      moon.position.z = 12*Math.sin(angle);
      moon.rotation.y += 0.000009;
      moon.rotation.x += 0.00001;
      }

      if (ring) {
        ring.rotation.z += 0.00002;
        ring.rotation.x += Math.random()*0.00011;
        ring.rotation.y += Math.random()*0.00005;
      }

      planet.rotation.y += 0.000085;

    },10)

  planetCount++;
};
