import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene } from "three";
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
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new Scene();
  scene.add(new AmbientLight(0xbbbbbb, 0.3));
  scene.background = new Color(0x040d21);
  // scene.add(new DirectionalLight(0xffffff, 0.8));

  // Initialize camera, light
  camera = new PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
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
  controls = new TrackballControls(camera, renderer.domElement);
  controls.dynamicDampingFactor = 0.05;
  controls.noPan = true;
  controls.minDistance = 300;
  controls.maxDistance = 800;
  controls.rotateSpeed = 1.5;
  controls.zoomSpeed = 0.5;

  window.addEventListener("resize", onWindowResize, false);
}

// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new ThreeGlobe()
    // .globeImageUrl(EarthDarkSkin)
    .hexPolygonsData(countries.features)
    // .hexPolygonCurvatureResolution(9)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(false)
    .hexPolygonColor((feature) => {
      var index =
        0.5 + (feature.properties["ACTIVE_PER_MILLION"] * 2) / maxRelativeCases;
      console.log(index);
      index = index ? index : 0;
      return "#rgba(255,255,255," + index + ")";
    });

  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new Color(0x3a228a);
  globeMaterial.emissive = new Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;
  // NOTE Cool stuff
  // globeMaterial.wireframe = true;

  // Initialize glow
  var options = {
    backside: true,
    color: "#3a228a",
    size: 100 * 0.25,
    power: 6,
    coefficient: 0.3,
  };
  var glowMesh = createGlowMesh(new SphereGeometry(100, 75, 75), options);
  Globe.add(glowMesh);
  scene.add(Globe);
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
