
var starCount = 0;
var planetCount = 0;

var addRandomPlanet = function(){
  randomCoors = [Math.floor(Math.random() * 100-48),  Math.floor(Math.random() * 100-48), Math.floor(Math.random() * 100-48)];
  randomProps = [Math.random()*15-8,20,20];
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
