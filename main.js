let camera, scene, renderer, raycaster;
let container, stats;
let INTERSECTED;
let pickableObjs;
let plane1, plane2, plane3, plane4, plane5;
const pointer = new THREE.Vector2();

init();
animate();

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  let floorMat;
  let mesh1, mesh2;
  let planeGeo1, planeGeo2, planeGeo3, planeGeo4, planeGeo5;


  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 200);
  camera.position.set(- 6, 1.6, 5.4);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);

  floorMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.5
  });

  const ambLight = new THREE.AmbientLight(0xe0e0e0, .5); // soft white light
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0xe0e0e0, 1);
  dirLight.position.set(0, 3, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = .5;
  dirLight.shadow.camera.far = 500;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = - Math.PI / 2.0;
  scene.add(floorMesh);

  const planeTex1 = new THREE.TextureLoader().load('textures/icon1.jpg');
  const planeTex2 = new THREE.TextureLoader().load('textures/icon2.jpg');
  const planeTex3 = new THREE.TextureLoader().load('textures/icon3.jpg');
  const planeTex4 = new THREE.TextureLoader().load('textures/icon4.jpg');
  const planeTex5 = new THREE.TextureLoader().load('textures/icon5.jpg');

  const planeMat1 = new THREE.MeshStandardMaterial({ map: planeTex1 });
  const planeMat2 = new THREE.MeshStandardMaterial({ map: planeTex2 });
  const planeMat3 = new THREE.MeshStandardMaterial({ map: planeTex3 });
  const planeMat4 = new THREE.MeshStandardMaterial({ map: planeTex4 });
  const planeMat5 = new THREE.MeshStandardMaterial({ map: planeTex5 });


  planeGeo1 = new THREE.PlaneGeometry(1, 1);
  plane1 = new THREE.Mesh(planeGeo1, planeMat1);
  plane1.receiveShadow = true;
  plane1.castShadow = true;
  plane1.position.set(1.5, 1.5, 1);
  plane1.lookAt(camera.position);
  scene.add(plane1);

  planeGeo2 = new THREE.PlaneGeometry(1, 1);
  plane2 = new THREE.Mesh(planeGeo2, planeMat2);
  plane2.receiveShadow = true;
  plane1.castShadow = true;
  plane2.position.set(1.5, 1.5, -4);
  plane2.lookAt(camera.position);
  scene.add(plane2);

  planeGeo3 = new THREE.PlaneGeometry(1, 1);
  plane3 = new THREE.Mesh(planeGeo3, planeMat3);
  plane3.receiveShadow = true;
  plane1.castShadow = true;
  plane3.position.set(-4, 1.5, 1);
  plane3.lookAt(camera.position);
  scene.add(plane3);

  planeGeo4 = new THREE.PlaneGeometry(1, 1);
  plane4 = new THREE.Mesh(planeGeo4, planeMat4);
  plane4.receiveShadow = true;
  plane1.castShadow = true;
  plane4.position.set(-5.5, 1.5, -1.5);
  plane4.lookAt(camera.position);
  scene.add(plane4);

  planeGeo5 = new THREE.PlaneGeometry(1, 1);
  plane5 = new THREE.Mesh(planeGeo5, planeMat5);
  plane5.receiveShadow = true;
  plane1.castShadow = true;
  plane5.position.set(-4, 1.5, -4);
  plane5.lookAt(camera.position);
  scene.add(plane5);


  // new THREE.RGBELoader()
  //   .setPath( 'textures/' )
  //   .load( 'royal_esplanade_1k.hdr', function ( texture ) {

  //     texture.mapping = THREE.EquirectangularReflectionMapping;

  //     scene.background = texture;
  //     scene.environment = texture;

  //     render();

  // model

  const loader = new THREE.GLTFLoader().setPath('models/');
  loader.load('bldg2.gltf', function (gltf) {

    mesh1 = gltf.scene.children[0];
    mesh2 = gltf.scene.children[1];
    scene.add(gltf.scene);
    mesh1.position.set(-5, -.6, 1);
    mesh2.position.set(-5, -.6, 1);
    mesh1.scale.set(5, 5, 5);
    mesh2.scale.set(5, 5, 5);

    render();

  });

  //} );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .75;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', animate); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.target.set(-1.5, 0.5, -1.5);
  controls.autoRotate = true;
  controls.update();

  raycaster = new THREE.Raycaster();

  //stats = new Stats();
  //container.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown(event) {

}

function animate() {
  requestAnimationFrame(animate);
  render();
  //stats.update;
}

function render() {

  renderer.render(scene, camera);

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(scene.children, true);

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      let type = intersects[0].object.name.slice(0, 5);
      if (type === "plane") {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0x0000ff);
      }
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }

  /*  plane1.lookAt(camera.position);
    plane2.lookAt(camera.position);
    plane3.lookAt(camera.position);
    plane4.lookAt(camera.position);
    plane5.lookAt(camera.position);*/

  console.log(camera.position);
}