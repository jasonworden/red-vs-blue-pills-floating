// Based off official Three.js canvas interactive particles demo

var container, stats;
var camera, scene, renderer;

//removed interactivity:
// var raycaster;

var mouse;

var clock = new THREE.Clock();

var PI2 = Math.PI * 2;
var PARTICLE_COUNT = 50;
var PILL_BODY_HEIGHT = 40;
var PILL_RADIUS = 15;
var PILL_SEGMENTS = 32;

var programFill = function(context) {

  context.beginPath();
  context.arc(0, 0, 0.5, 0, PI2, true);
  context.fill();

};

var programStroke = function(context) {

  context.lineWidth = 0.025;
  context.beginPath();
  context.arc(0, 0, 0.5, 0, PI2, true);
  context.stroke();

};

var INTERSECTED;

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 5, 10000);
  camera.position.set(0, 300, 500);

  scene = new THREE.Scene();

  // add lighting
	// scene.fog = new THREE.Fog( 0xAAAAAA, 3000, 5000 );
	scene.add( new THREE.AmbientLight( 0x666666 ) );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );
	light.position.set( 200, 500, 500 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
	light.position.set( -200, -100, -400 );
	scene.add( light );

  var materialRed = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 95
  });
  var materialBlue = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 40,
    aoMapIntensity: .1
  });
  var materials = [materialRed, materialBlue];
  var cylinderGeometryHalfHeight = new THREE.CylinderGeometry(PILL_RADIUS, PILL_RADIUS, PILL_BODY_HEIGHT/2, PILL_SEGMENTS);
  var cylinderGeometry = new THREE.CylinderGeometry(PILL_RADIUS, PILL_RADIUS, PILL_BODY_HEIGHT, PILL_SEGMENTS);
  var sphereGeometry = new THREE.SphereGeometry(PILL_RADIUS, PILL_SEGMENTS, PILL_SEGMENTS);
  var particle, cylinder, sphere, material, scaleFactor;

  //create half-half colored pills
  for (var i = 0; i < PARTICLE_COUNT/2; ++i) {
    particle = new THREE.Object3D();

    for(var j = 0; j < 2; ++j) {
      material = materials[j];

      cylinder = new THREE.Mesh(cylinderGeometryHalfHeight, material);
      cylinder.translateY( j==0 ? PILL_BODY_HEIGHT/4 : -PILL_BODY_HEIGHT/4 );
      particle.add(cylinder);

      sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.translateY( j==0 ? PILL_BODY_HEIGHT/2 : -PILL_BODY_HEIGHT/2 );
      particle.add(sphere);
    }

    particle.position.x = Math.random() * 800 - 400;
    particle.position.y = Math.random() * 800 - 400;
    particle.position.z = Math.random() * 800 - 400;

    scaleFactor = Math.random() * 2 + 1;
    particle.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(particle);
  }

  //create whole colored pills
  var materialIndex;
  for (var i = 0; i < PARTICLE_COUNT/2; ++i) {
    material = materials[i % 2];
    particle = new THREE.Object3D();

    cylinder = new THREE.Mesh(cylinderGeometry, material);
    particle.add(cylinder);

    for(var j = 0; j < 2; ++j) {
      sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.translateY( j==0 ? PILL_BODY_HEIGHT/2 : -PILL_BODY_HEIGHT/2 );
      particle.add(sphere);
    }

    particle.position.x = Math.random() * 800 - 400;
    particle.position.y = Math.random() * 800 - 400;
    particle.position.z = Math.random() * 800 - 400;

    scaleFactor = Math.random() * 2 + 1;
    particle.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(particle);
  }

  //

  // raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer({antialias: true});
  // renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  document.addEventListener('mousemove', onDocumentMouseMove, false);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

//

function animate() {

  requestAnimationFrame(animate);

  render();
  stats.update();

}

var radius = 600;
var theta = 0;
var theta_delta_per_sec = 15;

function render() {
  var delta = clock.getDelta();
  console.log(delta);

  // rotate camera

  theta += delta * theta_delta_per_sec;

  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
  camera.lookAt(scene.position);

  camera.updateMatrixWorld();

  // find intersections

  // raycaster.setFromCamera(mouse, camera);
  //
  // var intersects = raycaster.intersectObjects(scene.children);
  //
  // if (intersects.length > 0) {
  //
  //   if (INTERSECTED != intersects[0].object) {
  //
  //     if (INTERSECTED) INTERSECTED.material.program = programStroke;
  //
  //     INTERSECTED = intersects[0].object;
  //     INTERSECTED.material.program = programFill;
  //
  //   }
  //
  // } else {
  //
  //   if (INTERSECTED) INTERSECTED.material.program = programStroke;
  //
  //   INTERSECTED = null;
  //
  // }

  renderer.render(scene, camera);

}
