

let camera, scene, renderer;

init();
render();

function init() {

  const container = document.createElement( 'div' );
  document.body.appendChild( container );

  let floorMat;
  let mesh1;
  let mesh2;

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
  camera.position.set( - 3.6, 0.6, 5.4 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfe3dd );

  floorMat = new THREE.MeshStandardMaterial( {
          color: 0x888888,
          roughness: 0.5,
          metalness: 0.5
        } );

  const ambLight = new THREE.AmbientLight( 0x404040, .5 ); // soft white light
  scene.add( ambLight );

  const dirLight = new THREE.DirectionalLight( 0x55505a, 1 );
  dirLight.position.set( 0, 3, 0 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;

  dirLight.shadow.camera.right = 1;
  dirLight.shadow.camera.left = - 1;
  dirLight.shadow.camera.top  = 1;
  dirLight.shadow.camera.bottom = - 1;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add( dirLight );

  const floorGeometry = new THREE.PlaneGeometry( 20, 20 );
  const floorMesh = new THREE.Mesh( floorGeometry, floorMat );
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = - Math.PI / 2.0;
  scene.add( floorMesh );


  // new THREE.RGBELoader()
  //   .setPath( 'textures/' )
  //   .load( 'royal_esplanade_1k.hdr', function ( texture ) {

  //     texture.mapping = THREE.EquirectangularReflectionMapping;

  //     scene.background = texture;
  //     scene.environment = texture;

  //     render();

  //     // model

      const loader = new THREE.GLTFLoader().setPath( 'models/' );
      loader.load( 'bldg2.gltf', function ( gltf ) {

        mesh1 = gltf.scene.children[0];
        mesh2 = gltf.scene.children[1];
        scene.add( gltf.scene );
        mesh1.position.set(-5,-.6,1);
        mesh2.position.set(-5,-.6,1);
        mesh1.scale.set(5, 5, 5);
        mesh2.scale.set(5, 5, 5);

        render();

      } );

    // } );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;

  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set( 0, 0, - 0.2 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

//

function render() {

  renderer.render( scene, camera );
  console.log(camera.position);

}