var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load( "../assets/othertexture/bgsky.jpg");
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
controls = new THREE.OrbitControls(camera,renderer.domElement);

var light = new THREE.AmbientLight( 0x404040,6.7 ); // soft white light
light.position.set(0, 10,0)
scene.add( light );

function starCreate(){
  var x = (Math.random()*100 - 50)*10;
  var y = (Math.random()*100 - 50)*11;
  var z = (Math.random()*100 - 50)*10;
  var g = new THREE.SphereGeometry(.5,7,7);
  var m = new THREE.MeshLambertMaterial({color:0xFFFFFF});
  var star = new THREE.Mesh(g, m);

  star.position.set(x,y,z)
  scene.add(star);

  starCount++;
};

function initialize(){
    document.getElementById('title').style.display = 'none';
    document.body.appendChild( renderer.domElement );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.position.z = 10;
    camera.position.y = 1.5;

        camera.lookAt(0,0,0);
        controls.movementSpeed = 25;

          planetCreate([0,0,0],[4.5,25,25]);

       starInterval = setInterval(function(){
         starCreate()

      $("#inner-bar").width((starCount/1000)*100 + '%');
        if (starCount < 300) {
          $("#loading-text").html("Comencing Gravity")
          $("#sub__inner-bar").width((starCount/300)*100 + '%');
        }
        else if (starCount >= 300 && starCount < 500) {//300-500 / 300
          $("#loading-text").html("Writing laws of physics.")
          $("#sub__inner-bar").width( (((starCount+300)/800))*100 + '%');
        }
        else if (starCount >= 500 && starCount < 800) {//500-800 / 800
          $("#loading-text").html("Generating stars..")
          $("#sub__inner-bar").width( (((starCount-100)/1000))*100 + '%');
        }
        else if (starCount >= 800 && starCount < 1000) {//800 - 1000
          $("#loading-text").html("Loading Textures...")
          $("#sub__inner-bar").width( (starCount/1000)*100 + '%');
        }
        else if(starCount >= 1000){
          clearInterval(starInterval);
          $("#loading").fadeOut()
          $("#sub__inner-bar").width( (((starCount+300)/800))*100 + '%');
        }
       },1);


    animate()
}

function planetCreate(position,options){
  cX = position[0],cY = position[1],cZ = position[2];
  var ring=false;
  var moon=false;

  var texture = new THREE.TextureLoader().load( "../assets/planettexture/"+planetTextures[Math.floor(Math.random()*planetTextures.length-1)] );
  var geometry = new THREE.SphereGeometry(options[0],options[1],options[2]);//4.5,25,25
  var material = new THREE.MeshLambertMaterial({map:texture});
  var planet = new THREE.Mesh(geometry, material);
  if (Math.random()>=0.5) {//determines if planet has ring
    var geometry = new THREE.RingGeometry(options[0]*2,options[0]*2.5,35);
    var texture = new THREE.TextureLoader().load("../assets/othertexture/"+ringTextures[Math.floor(Math.random()*ringTextures.length-1)])
    var material = new THREE.MeshLambertMaterial({map: texture,side: THREE.DoubleSide});
    ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.random()*300 - 50;
    ring.rotation.y = (Math.random()*300 - 50)*-1;

    ring.position.set(cX,cY,cZ);
    scene.add(ring);
  }

  if (Math.random()>=0.5) {//determines if planet has moon
    var texture = new THREE.TextureLoader().load( "../assets/moontexture/"+moonTextures[Math.floor(Math.random()*moonTextures.length-1)] );
    var geometry = new THREE.SphereGeometry(Math.random()+Math.random(), 17, 17);
    var material = new THREE.MeshBasicMaterial({map:texture});
    moon = new THREE.Mesh(geometry, material);

    moon.position.set(cX,cY,cZ);
    scene.add(moon);
  }
  planet.position.set(cX,cY,cZ);
  scene.add(planet);

  camera.position.z = cZ + 10;
  camera.position.y = cY + 10;
  camera.position.x = cX + 10;
  controls.target.set(cX,cY,cZ);
  controls.update();

  angle = planet.scale.y;

  planetname=planetNameP1[Math.floor(Math.random()*planetNameP1.length)]+'-'+planetNameP2[Math.floor(Math.random()*planetNameP2.length)]+'-'+planetNameP3[Math.floor(Math.random()*planetNameP3.length)];

    var loader = new THREE.FontLoader();

    loader.load( '../helvetiker_regular.typeface.json', function ( font ) {

      var textGeo = new THREE.TextGeometry( planetname, {
        font: font,
        size: angle,
        height: .1
      } );

      var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

      var tag = new THREE.Mesh( textGeo, textMaterial );
      tag.position.set( cX-angle*2, cY+angle*5, cZ );

      scene.add( tag );

    } );

    setInterval(function(){
      angle+=0.0001;
      if (moon) {
      moon.position.x = 12*Math.cos(angle);
      moon.position.y = 12*Math.sin(angle);
      moon.position.z = 12*Math.sin(angle);
      moon.rotation.y += 0.0005;
      moon.rotation.x += 0.00067;
      }

      if (ring) {
        ring.rotation.y += 0.0005;
        ring.rotation.x += 0.00015;
      }

      planet.rotation.y += 0.000085;
    },10)

  planetCount++;
};


function update() {
};

function animate() {

  requestAnimationFrame( animate );
  controls.update();
  update();
  renderer.render( scene, camera );

};

window.addEventListener( 'resize',function onWindowResize( event ) {
				SCREEN_HEIGHT = window.innerHeight;
				SCREEN_WIDTH  = window.innerWidth;
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();
}, false );
