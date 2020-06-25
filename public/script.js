// GLSL \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

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


var cube2 
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight('#ffffff', 0.9);
light.position.set(-20, 0, 100);
scene.add(light);

// set clock
const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const objLoader = new THREE.OBJLoader();
objLoader.setPath('/blender-files/');

const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/blender-files/');

// // var texture = new THREE.TextureLoader().load( "https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" );
// var texture = new THREE.TextureLoader().load( 'https://images.pexels.com/photos/207300/pexels-photo-207300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' );
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 0.5, 2 );

var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 

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
    cube2 = object;
    scene.add(object);
});

// const material = new THREE.ShaderMaterial({
//   vertexShader: vShader,
//   fragmentShader: fShader,
//   uniforms
// });

// mesh
// const cube = new THREE.Mesh(geometry, material);
// scene.add( cube ); // add to scene

function render() {
  if (cube2) {
      cube2.rotation.x += 0.01;        
      cube2.rotation.y += 0.01;
  }

  // update time uniform
  uniforms.u_time.value = clock.getElapsedTime();
  // animation loop
  requestAnimationFrame( render );
  renderer.render( scene, camera );

}

render();




// // var texture = new THREE.TextureLoader().load( 'https://images.pexels.com/photos/207300/pexels-photo-207300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' );





// // camera
// let aspect = window.innerWidth / window.innerHeight;
// const camera = new THREE.PerspectiveCamera( 15, aspect, 1, 1000 );
// camera.position.z = 10;

// // renderer
// const renderer = new THREE.WebGLRenderer({
//   alpha: true,
//   antialias: true,
// });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);









// // EVENT LISTENERS \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
// // mousemove
// document.addEventListener('mousemove', (e) =>{
//    uniforms.u_mouse.value.x = e.clientX;
//    uniforms.u_mouse.value.y = e.clientY;
//  })




// // window resize
// function onWindowResize( event ) {
//   const aspectRatio = window.innerWidth/window.innerHeight;
//   let width, height;
//   if (aspectRatio>=1){
//     width = 1;
//     height = (window.innerHeight/window.innerWidth) * width;
//   }else{
//     width = aspectRatio;
//     height = 1;
//   }
//   camera.left = -width;
//   camera.right = width;
//   camera.top = height;
//   camera.bottom = -height;
//   camera.updateProjectionMatrix();
//   renderer.setSize( window.innerWidth, window.innerHeight );

//   if (uniforms.u_resolution !== undefined){
//     uniforms.u_resolution.value.x = window.innerWidth;
//     uniforms.u_resolution.value.y = window.innerHeight;
//   }
// }


