import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene } from "three";
import { PerspectiveCamera, AmbientLight, DirectionalLight } from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import countries from "./files/globe-data.json";

var renderer, camera, scene, controls;
var Globe;

init();
animate();

function init() {
  //   Initialize the Globe
  Globe = new ThreeGlobe()
    .globeImageUrl(
      "https://unpkg.com/three-globe@2.11.1/example/img/earth-dark.jpg"
    )
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .hexPolygonColor(
      () =>
        `#${Math.round(Math.random() * Math.pow(2, 24))
          .toString(16)
          .padStart(6, "0")}`
    );

  // Initialize the scene, renderer, etc.
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new Scene();
  scene.add(Globe);
  scene.add(new AmbientLight(0xbbbbbb));
  scene.add(new DirectionalLight(0xffffff, 0.6));

  // Setup camera
  camera = new PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  camera.position.z = 500;

  // Add camera controls
  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 101;
  controls.rotateSpeed = 5;
  controls.zoomSpeed = 0.8;

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
