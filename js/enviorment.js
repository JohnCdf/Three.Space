var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
scene.fog=new THREE.Fog(0xFFFFFF, 2, 50000 )
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
controls = new THREE.OrbitControls(camera,renderer.domElement);
var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
light.position.set(0, 10,0)
scene.add( light );
var xSpeed = 0;
var zSpeed = 0;
function update() {
  if (!starsGeometry||!starField) {
    return
  }
  starField.rotation.y += 0.000016;
  starsGeometry.rotation.y -= 0.000016;
};

function animate() {

  requestAnimationFrame( animate );
  controls.update();
  update();
  renderer.render( scene, camera );

};
$("body").ready(function(){
       if(window.innerHeight>=window.innerWidth){
          $("#rotatescreen").show();
        }
})
window.addEventListener( 'resize',function onWindowResize( event ) {
				SCREEN_HEIGHT = window.innerHeight;
        SCREEN_WIDTH  = window.innerWidth;
        
        if(SCREEN_HEIGHT>=SCREEN_WIDTH){
          $("#rotatescreen").show();
        } else {$("#rotatescreen").hide();}
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();
}, false );
