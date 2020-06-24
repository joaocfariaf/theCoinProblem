var cube2 
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight('#ffffff', 0.9);
light.position.set(-20, 0, 100);
scene.add(light);

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

// var texture = new THREE.TextureLoader().load( "https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" );
var texture = new THREE.TextureLoader().load( "https://lh3.googleusercontent.com/proxy/G-sluSmuY-HXoCyIL4tyY1618xGSUIgrVps7H8ILzb_XRCztmvcDADSHYN7lOnjbbaFwOlMni-Bk5QUaNAbSB4Pyc3ZEBQFvBEI8_WZSW57hPrFCR7tF71NdxBmNqLTVlU2LRsyjH6i9JI1JG4DJIFw" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 0.5, 2 );

var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
var material = new THREE.MeshLambertMaterial( { color: 0x00ffff, wireframe: false, map:texture } ); 

objLoader.load('cube.obj', (object) => {
    object.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = material;
        }
    } );
    cube2 = object;
    scene.add(object);
});

function render() {
    if (cube2) {
        cube2.rotation.x += 0.01;
        cube2.rotation.y += 0.01;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();