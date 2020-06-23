
// Our Javascript will go here. 

//Cria cena, camera e renderer. Define controles e posição da camera
var scene = new Scene(); 
var camera = new PerspectiveCamera( 
  75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
var renderer = new WebGLRenderer( {
  canvas:document.getElementById("mycanvas"),
  alpha:true,
  antialias:true
}); 
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 30;
camera.position.y = 0;

//Adiciona luz
var dirLight = new DirectionalLight(0xffffff);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);
scene.add(new AmbientLight(0x404040));

//Cria grupo da balança
var s = new Group();

//Cria base da balança
base_ratio = 3;
base_height = 0.5;
var base_geo = new CylinderGeometry(base_ratio,base_ratio,base_height,100); 
var s_mat = new MeshStandardMaterial({roughness: 0.5, metalness: 1});
s_mat.side = DoubleSide;
var base = new Mesh(base_geo, s_mat); 
s.add(base);

//Cria haste da balança
var rod = new Group();
rod_height = 10;
rod_ratio = 0.5;
var rod_middle_geo = new CylinderGeometry(rod_ratio,rod_ratio,rod_height,100);
var rod_top_geo = new SphereGeometry(rod_ratio,100,100,0, 2*Math.PI,0,Math.PI);
var rod_middle = new Mesh(rod_middle_geo, s_mat);
var rod_top = new Mesh(rod_top_geo, s_mat);
rod_top.position.y = rod_height/2;
rod.add(rod_top);
rod.add(rod_middle);
rod.position.y = rod_height/2;
s.add(rod);

//Cria braço da balança: divido em braço e pratos
var weight = new Group();

//Cria o braço e coloca em weight
var arm = new Group();
arm_length = 12;
arm_ratio = 0.1;
var arm_middle_geo = new CylinderGeometry(arm_ratio,arm_ratio,arm_length,100);
var arm_top_geo = new SphereGeometry(arm_ratio,100,100);
var arm_middle = new Mesh(arm_middle_geo,s_mat);
var arm_top = new Mesh(arm_top_geo,s_mat);
arm_middle.rotation.z = 0.5*Math.PI;
arm.add(arm_middle);
for (var i = 0; i < 3; i+=2){
  m = arm_top.clone();
  m.position.x = (i-1)*arm_length/2;
  arm.add(m);
}
weight.add(arm);

//Cria os grupos dos pratos: prato + cordas
var right_plate = new Group();

//Cria as cordas
rope_length = 6;
plate_ratio = 3;
rr = 0.05;

var rope_geo = new CylinderGeometry(rr,rr,rope_length,100);
var right_rope = new Mesh(rope_geo,s_mat);
right_rope.rotation.z = Math.PI/6;
right_rope.position.y = -rope_length*Math.sin(Math.PI/3)/2;
right_rope.position.x = -arm_length/2+plate_ratio/2;
right_plate.add(right_rope);
var left_rope = new Mesh(rope_geo,s_mat);
left_rope.rotation.z = 5*Math.PI/6;
left_rope.position.y = -rope_length*Math.sin(Math.PI/3)/2;
left_rope.position.x = -arm_length/2-plate_ratio/2;4
right_plate.add(left_rope);

//Cria o prato
alpha = Math.PI/3;
sphere_ratio = 2*plate_ratio;

var plate_geo = new SphereGeometry(sphere_ratio,100,100,0,2*Math.PI,0,alpha/2);
var plate = new Mesh(plate_geo,s_mat);
plate.rotation.x = Math.PI;
plate.position.x = -arm_length/2;
right_plate.add(plate);

//Cria uma cópia
var left_plate = right_plate.clone();
left_plate.position.x = arm_length;

weight.add(left_plate);
weight.add(right_plate);

weight.position.y = rod_height - rod_height/10;

s.add(weight);

scene.add(s);
var k = 0;
var count = 0;

function animate() { 
  controls.update();
  if (count == 0){
    arm.rotation.z += 0.01;
    right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
    right_plate.position.y -= (arm_length/2)*Math.sin(0.01);
    left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
    left_plate.position.y += (arm_length/2)*Math.sin(0.01);
    k++;
    if (k==30) count=1;
  }
  if (count == 1){
    arm.rotation.z -= 0.01;
    right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
    right_plate.position.y += (arm_length/2)*Math.sin(0.01);
    left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
    left_plate.position.y -= (arm_length/2)*Math.sin(0.01);
    k--;
    if (k==-30) count=0;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
} 

animate();

