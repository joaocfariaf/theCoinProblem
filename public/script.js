// Onheto com textura importada
var cube2 

// Cena
const scene = new THREE.Scene();

// Iluminação
const light = new THREE.DirectionalLight('#ffffff', 0.9);
light.position.set(0, 5, 10);
scene.add(light);

// Câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 14;
camera.position.x = 0;
camera.position.y = 5;

// Renderização
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Obtendo textura a partir de uma imagem da web (definindo wrapping)
var texture = new THREE.TextureLoader().load( "https://media.istockphoto.com/photos/white-color-frosted-glass-texture-background-picture-id696307908?k=6&m=696307908&s=612x612&w=0&h=Bwtr8etrC6DnrQP0pbCP7v14aOO5fw46kCHxvL74CMw=" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 0.5, 2 );

var material = new THREE.MeshLambertMaterial( { color: 0x00ffff, wireframe: false, map:texture } ); 

// // Importando objeto construído no blender
const objLoader = new THREE.OBJLoader();
objLoader.setPath('/blender-files/');

const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/blender-files/');

objLoader.load('cube.obj', (object) => {
    object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = material;
        }
    } );
    cube2 = object;

    scene.add(object);
    object.position.set(0,9,0)
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
    // object.position.set(0,0)
});

// Adicionando movimento 
function render() {
  if (cube2) {
      cube2.rotation.x += 0.01;
      cube2.rotation.z += 0.01;
  }

  if (cube3) {
    cube3.rotation.x += 0.01;
    cube3.rotation.z += 0.01;
  }


  requestAnimationFrame(render);
  renderer.render(scene, camera);
}


render();
