import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene, Object3D } from "three";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
  Fog,
  AxesHelper,
  DirectionalLightHelper,
  CameraHelper,
  PointLight,
  SphereGeometry,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createGlowMesh } from "three-glow-mesh";
import countries from "./files/globe-data-min.json";
import EarthDarkSkin from "./files/earth-dark.jpg";
var renderer, camera, scene, controls;
var angle = 0;
var Globe;
var maxRelativeCases = 0;

// SECTION Syncronous Init with Promises
getData().then(() => {
  init();
  initGlobe();
  onWindowResize();
  animate();
});

// Fetch surrounded with a Promise
function getData() {
  // Fetch data
  var options = {
    method: "GET",
  };
  return new Promise(function (resolve, reject) {
    fetch("https://corona.lmao.ninja/v2/countries?yesterday&sort", options)
      .then((response) => response.json())
      .then((json) => {
        // merge data
        prepareData(json).then(() => {
          resolve();
        });
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

// Merge data with Promises
function prepareData(covidData) {
  return new Promise(function (resolve, reject) {
    for (let country of covidData) {
      // Track relative max cases per million
      if (country.activePerOneMillion > maxRelativeCases) {
        maxRelativeCases = country.activePerOneMillion;
      }
      // Add field(s) to the main source
      for (let entry of countries.features) {
        if (entry.properties["ISO_A3"] === country.countryInfo.iso3) {
          entry.properties["ACTIVE_PER_MILLION"] = country.activePerOneMillion;
        }
      }
    }
    resolve();
  });
}

// SECTION Initializing core elements
function init() {
  // Initialize renderer
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadow = true;
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
  camera.castShadow = true;
  camera.updateProjectionMatrix();

  var dLight = new DirectionalLight(0xffffff, 0.5);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new DirectionalLight(0xebebeb, 0.2);
  dLight1.position.set(-200, 100, 800);
  camera.add(dLight1);

  var dLight2 = new PointLight(0xebebeb, 0.2);
  dLight2.position.set(200, 100, 800);
  camera.add(dLight2);

  camera.position.z = 400;
  scene.add(camera);

  // Additional effects
  scene.fog = new Fog(0x535ef3, 400, 2000);

  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // var helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // var helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);

  // Initialize controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 800;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  window.addEventListener("resize", onWindowResize, false);
}

// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new ThreeGlobe({ animateIn: false })
    // .globeImageUrl(EarthDarkSkin)
    .polygonsData(
      countries.features.filter((e) => e.properties.ISO_A2 !== "AQ")
    )
    .showAtmosphere(false)
    .polygonAltitude(0.01)
    .polygonStrokeColor(() => "#333333")
    .polygonCapColor((feature) => {
      if (feature.properties["ACTIVE_PER_MILLION"] === undefined)
        return "#cccccc";
      var hue =
        90 -
        Math.pow(
          feature.properties["ACTIVE_PER_MILLION"] / maxRelativeCases,
          1 / 3
        ) *
          90;
      return "hsl(" + hue + ", 100%, 50%)";
    });

  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new Color(0xf7f7f7);
  globeMaterial.emissive = new Color(0xffffff);
  globeMaterial.emissiveIntensity = 0.0;
  globeMaterial.shininess = 0.0;
  // NOTE Cool stuff
  // globeMaterial.wireframe = true;

  // Initialize glow
  var options = {
    backside: true,
    // color: "#3a228a",
    color: "#9d0208",
    size: 100 * 0.25,
    power: 6,
    coefficient: 0.3,
  };
  var glowMesh = createGlowMesh(new SphereGeometry(100, 75, 75), options);
  Globe.add(glowMesh);
  scene.add(Globe);

  // TODO Make country polygons receive light, shadow;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // camera.position.x = 400 * Math.cos(angle);
  // camera.position.z = 400 * Math.sin(angle);
  // angle += 0.001;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
