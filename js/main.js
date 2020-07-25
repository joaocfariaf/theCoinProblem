// Our Javascript will go here. 
function init()
  {
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

  // Cria um estilo de moeda para adicionar
  var texture = new THREE.TextureLoader().load( "https://media.istockphoto.com/photos/white-color-frosted-glass-texture-background-picture-id696307908?k=6&m=696307908&s=612x612&w=0&h=Bwtr8etrC6DnrQP0pbCP7v14aOO5fw46kCHxvL74CMw=" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 0.5, 2 );
  var texture2 = new THREE.TextureLoader().load("texture.jpg");
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set( 0.5, 2 );
  // // Importando objeto construído no blender
/*  const objLoader = new THREE.OBJLoader();
  objLoader.setPath('./blender-files/');
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('./blender-files/'); */
  // shader uniforms
  var shader = THREE.BlendShader;
  var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  uniforms[ "tDiffuse1" ].value = texture;
  uniforms[ "tDiffuse2" ].value = texture2;
  var blend_material = new THREE.ShaderMaterial({
                                      uniforms: uniforms,
                                      vertexShader: shader.vertexShader,
                                      fragmentShader: shader.fragmentShader
                                    });;
  // Objeto com Shader 
  /*
  var icosaedro; 
  objLoader.load('cube.obj', (object) => {
      object.traverse( function( child ) {
          if ( child instanceof THREE.Mesh ) {
              child.material = materialMisturado;
          }
      } );
      icosaedro = object;
      scene.add(object);
      object.position.set(15,15,0)
  });
  */
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

  var stadard_coin_weight = 5;
  var coin_geometry = new THREE.CylinderGeometry( 2, 2, .5, 100);
  var coins = [];
  var coins_weight = [];
  var cont = 0;
  for (cont = 0; cont < 3; cont++) { 
    var coin = new THREE.Mesh(coin_geometry, blend_material);
    coin.position.set(5*cont-5, -10, 0);
    coins.push(coin);
    coins_weight.push(stadard_coin_weight);
    scene.add(coin);
  }

  document.addEventListener('mousedown', onDocMouseDown);
  document.addEventListener('mousemove', onDocMouseMove);

    /////////////////////////////////////////
    var aux;
    var controles = new function () 
    {
      this.weight1 = 5;
      this.weight2 = 5;
      this.weight3 = 5;
    };
    
    var gui = new dat.GUI(
      {autoplace: false, width: 600}
    );

    gui.add(controles, 'weight1', 1, 10);
    gui.add(controles, 'weight2', 1, 10);
    gui.add(controles, 'weight3', 1, 10);

    /////////////////////////////////////////
  var leftCoin;  var leftWeight = 0;
  var rightCoin; var rightWeight = 0;
  var leftPlateFree = new Boolean(true); var rightPlateFree = new Boolean(true);

  function updateBalance () {
    if (leftWeight < rightWeight){
      while(k<=30000){
          // for(var intern = 0; intern < 99999; intern++);
          arm.rotation.z += 0.00001;
          right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
          right_plate.position.y -= (arm_length/2)*Math.sin(0.00001);
          // rightCoin.position.y -= (arm_length/2)*Math.sin(0.01);
          left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
          left_plate.position.y += (arm_length/2)*Math.sin(0.00001);
          // leftCoin.position.y += (arm_length/2)*Math.sin(0.01);
          k++;
      }
      count=1;
    }
    else if (leftWeight > rightWeight){
      while (k >= -30000){
        // for(var intern = 0; intern < 999999; intern++);
        arm.rotation.z -= 0.00001;
        right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
        right_plate.position.y += (arm_length/2)*Math.sin(0.00001);
        // rightCoin.position.y += (arm_length/2)*Math.sin(0.01);
        left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
        left_plate.position.y -= (arm_length/2)*Math.sin(0.00001);
        // leftCoin.position.y -= (arm_length/2)*Math.sin(0.01);
        k--;
      }
      count=-1;
    } 
    else {
      if (count == 1){
        while (k > 0){
          // for(var intern = 0; intern < 999999; intern++);
          arm.rotation.z -= 0.00001;
          right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
          right_plate.position.y += (arm_length/2)*Math.sin(0.00001);
          // rightCoin.position.y += (arm_length/2)*Math.sin(0.01);
          left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
          left_plate.position.y -= (arm_length/2)*Math.sin(0.00001);
          // leftCoin.position.y -= (arm_length/2)*Math.sin(0.01);
          k--;
        }
      }
      else if (count == -1){
        while(k < 0){
          // for(var intern = 0; intern < 999999; intern++);
          arm.rotation.z += 0.00001;
          right_plate.position.x = (arm_length/2)*(1-Math.cos(arm.rotation.z));
          right_plate.position.y -= (arm_length/2)*Math.sin(0.00001);
          // rightCoin.position.y -= (arm_length/2)*Math.sin(0.01);
          left_plate.position.x = (arm_length/2)*(1+Math.cos(arm.rotation.z));
          left_plate.position.y += (arm_length/2)*Math.sin(0.00001);
          // leftCoin.position.y += (arm_length/2)*Math.sin(0.01);
          k++;
        }
      }
      count = 0;
    }
  }
  

  function animate() { 
    controls.update();
    coins_weight[0] = controles.weight1;
    coins_weight[1] = controles.weight2;
    coins_weight[2] = controles.weight3;
    updateBalance();

    /* if (icosaedro) {
      icosaedro.rotation.x += 0.01;
      icosaedro.rotation.z += 0.01;
    }*/

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  } 

  animate();

  function onDocMouseDown(event)
    {
      var xDoMouse = event.clientX;
      var yDoMouse = event.clientY;
      
      //normalizar x e y do mouse
      xDoMouse = (xDoMouse / window.innerWidth) * 2 - 1;
      yDoMouse = -(yDoMouse / window.innerHeight) * 2 + 1;
      
      var vectorClick = new THREE.Vector3(xDoMouse, yDoMouse, 1);
      
      //converte de coordenadas de tela normalizada (-1 a +1) para coordenadas de mundo
      vectorClick = vectorClick.unproject(camera);
              
      //raycasting: traça um raio de um ponto a outro, verificando se colide
      //com algum objeto
      var raycaster = new THREE.Raycaster(camera.position, vectorClick.sub(camera.position).normalize());
      
      //chamar a função que "testa" se o raio colidiu com algum
      //objeto
      var intersects ;
      // raycaster.intersectObjects(coins);
      

      for(aux = 0; aux < 3; aux++){
        intersects = raycaster.intersectObjects([coins[aux]]);
      //se o vetor não for vazio, houve interseção do raio com algum objeto
      if(intersects.length > 0)
      {
        //houve uma colisão
        if (leftCoin == intersects[0].object) {
          intersects[0].object.position.y = -10;
          intersects[0].object.position.x = 5*aux-5;
          leftCoin = null;
          leftWeight = 0;
          leftPlateFree = true;
        }
        else if (rightCoin == intersects[0].object) {
          intersects[0].object.position.y = -10;
          intersects[0].object.position.x = 5*aux-5;
          rightCoin = null;
          rightWeight = 0;
          rightPlateFree = true;
        } 
        else if(leftPlateFree  == true){
          intersects[0].object.position.x = (arm_length/2);
          intersects[0].object.position.y = sphere_ratio*Math.sqrt(2)/2;
          leftCoin = intersects[0].object;
          leftPlateFree = false;
          /*for(aux = 0; aux < coins.length(); aux++){
            if(coins[aux] == intersects[0].object)
              break;
          }*/
          leftWeight = coins_weight[aux];
        }         
        else if (rightPlateFree  == true){
          intersects[0].object.position.x = (-arm_length/2);
          intersects[0].object.position.y = sphere_ratio*Math.sqrt(2)/2; 
          rightCoin = intersects[0].object;
          rightPlateFree = false;
          /*for(aux = 0; aux < coins.length(); aux++){
            if(coins[aux] == intersects[0].object)
              break;
          }*/
          rightWeight = coins_weight[aux];
        }  
        //updateBalance ();
        break;
      }
    }
    }
    
    function onDocMouseMove(event)
    {
      if(controles.showRay)
      {
        var xDoMouse = event.clientX;
        var yDoMouse = event.clientY;
        
        //normalizar x e y do mouse
        xDoMouse = (xDoMouse / window.innerWidth) * 2 - 1;
        yDoMouse = -(yDoMouse / window.innerHeight) * 2 + 1;
        
        var vectorClick = new THREE.Vector3(xDoMouse, yDoMouse, 1);
        
        //converte de coordenadas de tela normalizada (-1 a +1) para coordenadas de mundo
        vectorClick = vectorClick.unproject(camera);
                
              
      }
    }

    function onMouseMove( e ) {

      mouse.x = e.clientX;
      mouse.y = e.clientY;

    }
}

window.onload = init;
