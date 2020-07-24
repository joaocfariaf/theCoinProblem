// Our Javascript will go here. 

//Cria cena, camera e renderer. Define controles e posição da camera
var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 
  75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
var renderer = new THREE.WebGLRenderer( {
  canvas:document.getElementById("mycanvas"),
  alpha:true,
  antialias:true
}); 
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = 30;
camera.position.y = 0;

//Adiciona luz
var dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0x404040));

//////////////////////////////////////////////////////

// Obtendo textura a partir de uma imagem da web (definindo wrapping)
var texture = new THREE.TextureLoader().load( "https://media.istockphoto.com/photos/white-color-frosted-glass-texture-background-picture-id696307908?k=6&m=696307908&s=612x612&w=0&h=Bwtr8etrC6DnrQP0pbCP7v14aOO5fw46kCHxvL74CMw=" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 0.5, 2 );

var material = new THREE.MeshLambertMaterial( { color: 0x00ffff, wireframe: false, map:texture } ); 

// // Importando objeto construído no blender
var cube2;

const objLoader = new THREE.OBJLoader();
objLoader.setPath('./blender-files/');

const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('./blender-files/');

objLoader.load('cube.obj', (object) => {
    object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = material;
        }
    } );
    cube2 = object;

    scene.add(object);
    object.position.set(-15,15,0)
});

// // GLSL \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
const vShader = `
varying vec3 vNormal;

void main() {
  //set the vNormal value with
  // the attribute value passed
  // in by Three.js
  vNormal = normal;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);

}
`
const fShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}
`
// shader uniforms
const uniforms = {
  u_mouse: { value: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
    u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
  u_time: { value: 0.0 },
  u_color: { value: new THREE.Color(0xFF0000) }
}


// Objeto com Shader
var cube3 

objLoader.load('cube.obj', (object) => {
    object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = new THREE.ShaderMaterial({
                              vertexShader: vShader,
                              fragmentShader: fShader,
                              uniforms
                            });;
        }
    } );
    cube3 = object;
    scene.add(object);
    object.position.set(15,15,0)
});

//////////////////////////////////////////////////////


//Cria grupo da balança
var s = new THREE.Group();

//Cria base da balança
base_ratio = 3;
base_height = 0.5;
var base_geo = new THREE.CylinderGeometry(base_ratio,base_ratio,base_height,100); 
var s_mat = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 1});
s_mat.side = THREE.DoubleSide;
var base = new THREE.Mesh(base_geo, s_mat); 
s.add(base);

//Cria haste da balança
var rod = new THREE.Group();
rod_height = 10;
rod_ratio = 0.5;
var rod_middle_geo = new THREE.CylinderGeometry(rod_ratio,rod_ratio,rod_height,100);
var rod_top_geo = new THREE.SphereGeometry(rod_ratio,100,100,0, 2*Math.PI,0,Math.PI);
var rod_middle = new THREE.Mesh(rod_middle_geo, s_mat);
var rod_top = new THREE.Mesh(rod_top_geo, s_mat);
rod_top.position.y = rod_height/2;
rod.add(rod_top);
rod.add(rod_middle);
rod.position.y = rod_height/2;
s.add(rod);

//Cria braço da balança: divido em braço e pratos
var weight = new THREE.Group();

//Cria o braço e coloca em weight
var arm = new THREE.Group();
arm_length = 12;
arm_ratio = 0.1;
var arm_middle_geo = new THREE.CylinderGeometry(arm_ratio,arm_ratio,arm_length,100);
var arm_top_geo = new THREE.SphereGeometry(arm_ratio,100,100);
var arm_middle = new THREE.Mesh(arm_middle_geo,s_mat);
var arm_top = new THREE.Mesh(arm_top_geo,s_mat);
arm_middle.rotation.z = 0.5*Math.PI;
arm.add(arm_middle);
for (var i = 0; i < 3; i+=2){
  m = arm_top.clone();
  m.position.x = (i-1)*arm_length/2;
  arm.add(m);
}
weight.add(arm);

//Cria os grupos dos pratos: prato + cordas
var right_plate = new THREE.Group();

//Cria as cordas
rope_length = 6;
plate_ratio = 3;
rr = 0.05;

var rope_geo = new THREE.CylinderGeometry(rr,rr,rope_length,100);
var right_rope = new THREE.Mesh(rope_geo,s_mat);
right_rope.rotation.z = Math.PI/6;
right_rope.position.y = -rope_length*Math.sin(Math.PI/3)/2;
right_rope.position.x = -arm_length/2+plate_ratio/2;
right_plate.add(right_rope);
var left_rope = new THREE.Mesh(rope_geo,s_mat);
left_rope.rotation.z = 5*Math.PI/6;
left_rope.position.y = -rope_length*Math.sin(Math.PI/3)/2;
left_rope.position.x = -arm_length/2-plate_ratio/2;4
right_plate.add(left_rope);

//Cria o prato
alpha = Math.PI/3;
sphere_ratio = 2*plate_ratio;

var plate_geo = new THREE.SphereGeometry(sphere_ratio,100,100,0,2*Math.PI,0,alpha/2);
var plate = new THREE.Mesh(plate_geo,s_mat);
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

  if (cube2) {
    cube2.rotation.x += 0.01;
    cube2.rotation.z += 0.01;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
} 

animate();

