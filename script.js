function init()
{
	var i = 0;
	var tube = [];
	var scene = new THREE.Scene(); 

	// const loader = new THREE.TextureLoader();
	// const bgTexture = loader.load('https://www.jungnapratica.com.br/wp-content/uploads/2017/01/stars-wallpapers-HD3.jpg');
	// scene.background = bgTexture;

	// <!--ângulo de abertura da câmera, aspect ration, near e far-->
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(10, 10, 10);
	camera.lookAt(scene.position)

	// <!--Renderer-->
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xeeeeee, 1); //<!--cor e transparência-->
	renderer.setSize(window.innerWidth, window.innerHeight); //<!-- área do browser "preenchida" -->
	
	// <!-- criando um cubo -->
	var geometry = new THREE.BoxGeometry(1, 1, 1); //<!-- quadrilátero com largura, altura e profundidade determinadas -->
	var material = new THREE.MeshBasicMaterial({ color: 0x00ffff }); //<!-- material definindo a cor do cubo -->
	var cube1 = new THREE.Mesh(geometry, material); //<!-- Mesh é uma malha que contém uma geometria e um material, sendo passível de ser inserida na cena -->
	scene.add(cube1); //<!-- cubo é inserido na cena -->

	// <!-- criando um cubo -->
	var geometry = new THREE.BoxGeometry(1, 1, 1); //<!-- quadrilátero com largura, altura e profundidade determinadas -->
	var material = new THREE.MeshBasicMaterial({ color: 0x00ffff }); //<!-- material definindo a cor do cubo -->
	var cube2 = new THREE.Mesh(geometry, material); //<!-- Mesh é uma malha que contém uma geometria e um material, sendo passível de ser inserida na cena -->
	scene.add(cube2); //<!-- cubo é inserido na cena -->
	
	// <!-- criando uma esfera -->
	var geoEsfera = new THREE.SphereGeometry(1, 20, 20);
	var matEsfera = new THREE.MeshBasicMaterial({color: 0x00ee00, wireframe: false});
	var esfera = new THREE.Mesh(geoEsfera, matEsfera);
	esfera.position.set(0, 0, 0);
	scene.add(esfera);
	
	document.body.appendChild(renderer.domElement); //<!-- adiciona o renderer ao documento HTML -->

	// praFrenteCubo1 = true;
	// praFrenteEsfera = true;
	// praFrenteCubo2 = true;

	document.addEventListener('mousedown', onDocMouseDown);
	document.addEventListener('mousemove', onDocMouseMove);
	
	var controls = new function () 
	{
		this.rotationSpeed 		= 0.05;
		// this.translationSpeed 	= 0.05;
		this.InfluenceFactor 	= 1;
		this.showRay 			= true;
	};
	
	var gui = new dat.GUI(
		{autoplace: false, width: 600}
	);
	gui.add(controls, 'rotationSpeed', 0, 0.5);
	// gui.add(controls, 'translationSpeed', 0, 0.5);
	gui.add(controls, 'InfluenceFactor', 1, 10);

	// cube1.position.z = 5
	var t = 0;
	function animate() {
	// <!-- fala para o navegador que deseja-se realizar uma animação e pede que o navegador chame uma função específica para atualizar um quadro de animação-->
		requestAnimationFrame( animate );

		cube1.rotation.y += controls.rotationSpeed;
		cube2.rotation.y += controls.rotationSpeed;

		t += 0.01;
		cube1.position.z = 5*Math.cos(controls.InfluenceFactor*t);
		cube1.position.x = 5*Math.sin(controls.InfluenceFactor*t);

		cube2.position.z = 7*Math.cos(controls.InfluenceFactor*t);
		cube2.position.x = 7*Math.sin(controls.InfluenceFactor*t);

		

		renderer.render( scene, camera );
	};
	
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
		var intersects = raycaster.intersectObjects([cube1, cube2, esfera]);
		
		//se o vetor não for vazio, houve interseção do raio com algum objeto
		if(intersects.length > 0)
		{
			//houve uma colisão, torne o objeto clicado transparente
			if(intersects[0].object.material.transparent  == true){
				intersects[0].object.material.transparent = false
			}
			else{
				intersects[0].object.material.transparent  = true;
				intersects[0].object.material.opacity 	   = 0.1; 
			}
		}
	}
	
	function onDocMouseMove(event)
	{
		if(controls.showRay)
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