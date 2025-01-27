var container;
var camera, controls, scene, renderer;
var SHAPE_POINTS;

shape_viewer_init();
shape_viewer_animate();

function update_shape_geometry(shape_geometry) {
    scene.remove(SHAPE_POINTS);
    var psMat = new THREE.PointsMaterial();
    psMat.vertexColors = true;
    psMat.size = 0.01;
    SHAPE_POINTS = new THREE.Points(shape_geometry, psMat);
    scene.add(SHAPE_POINTS);
}

function shape_viewer_init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    /* Camera */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;

    /* Scene */
    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    var psMat = new THREE.PointsMaterial();
    psMat.vertexColors = true;
    psMat.size = 0.01;
    SHAPE_POINTS = new THREE.Points( new THREE.Geometry(), psMat);
    scene.add(SHAPE_POINTS);

    /* Renderer */
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
    container.appendChild(renderer.domElement);

    /* Controls */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    /* Events */
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function shape_viewer_animate() {
    requestAnimationFrame(shape_viewer_animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

