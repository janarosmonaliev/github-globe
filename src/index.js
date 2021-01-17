import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene } from "three";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
// import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
import countries from "./files/globe-data.json";
import EarthDarkSkin from "./files/earth-dark.jpg";
var renderer, camera, scene, controls;
var Globe;

init();
initGlobe();
animate();

// SECTION Initializing core elements
function init() {
  // Initialize renderer
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new Scene();
  scene.add(new AmbientLight(0xbbbbbb, 0.4));
  scene.background = new Color(0x040d21);
  // scene.add(new DirectionalLight(0xffffff, 0.8));

  // Initialize camera, light
  camera = new PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  var directionalLight = new DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 600, 300);
  scene.add(directionalLight);
  // camera.add(directionalLight);
  camera.position.z = 300;

  // Initialize controls
  controls = new TrackballControls(camera, renderer.domElement);
  controls.dynamicDampingFactor = 0.1;
  controls.noPan = true;
  controls.minDistance = 300;
  controls.maxDistance = 500;
  controls.rotateSpeed = 1.5;
  controls.zoomSpeed = 0.5;

  window.addEventListener("resize", onWindowResize, false);
}
function initGlobe() {
  // Initialize the Globe
  Globe = new ThreeGlobe()
    // .globeImageUrl(EarthDarkSkin)
    .hexPolygonsData(countries.features)
    .hexPolygonCurvatureResolution(9)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .hexPolygonColor(
      () => "#ecfff8"
      // `#${Math.round(Math.random() * Math.pow(2, 24))
      //   .toString(16)
      //   .padStart(6, "0")}`
    );

  Globe.globeMaterial().color = new Color(0x7400b8);
  scene.add(Globe);
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
