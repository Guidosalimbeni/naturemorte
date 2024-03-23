import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#838572");

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Set the aspect ratio to match A4 landscape
const aspectRatio = 297 / 210; // A4 landscape
camera.aspect = aspectRatio;
camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer();
// For a production environment, consider dynamically adjusting based on the viewport or using CSS.
const width = 400; // Arbitrary width, adjust as needed
const height = width / aspectRatio;
renderer.setSize(width, height);
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Default is THREE.PCFShadowMap

document.body.appendChild(renderer.domElement);

const stageGeometry = new THREE.BoxGeometry(6, 0.2, 3);
const stageMaterial = new THREE.MeshPhongMaterial({ color: "#ebdfb9" }); // White-grey material

const stage = new THREE.Mesh(stageGeometry, stageMaterial);
stage.position.y = -0.5;
stage.receiveShadow = true; // Enable shadow receiving
scene.add(stage);

camera.position.z = 2.1;

const objects = []; // Array to hold uploaded models

function loadModel(url) {
  const loader = new OBJLoader();
  loader.load(url, function (object) {
    const material = new THREE.MeshPhongMaterial({ color: "#f0efe6" }); // White-grey material
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Objects can receive shadows as well
      }
    });
    object.position.set(0, -0.5, 1); // Default position
    scene.add(object);
    objects.push(object); // Add to objects array for tracking
    render();
  });
}

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const files = event.target.files;
    for (const file of files) {
      const url = URL.createObjectURL(file);
      loadModel(url);
    }
  });

function adjustObjectPositionAndRotation() {
  // Placeholder for AI_artist function
  // This function will iterate over 'objects' and adjust each object based on AI_artist's output
}

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-3, 2, 3);
light.castShadow = true; // Enable shadow casting for the light
light.shadow.mapSize.width = 512; // Default is 512; higher values mean better shadow quality
light.shadow.mapSize.height = 512; // Default is 512
light.shadow.camera.near = 0.5; // Default is 0.5
light.shadow.camera.far = 500; // Default is 500
light.shadow.darkness = 0.5; // Adjust the darkness of the shadow [Deprecated in r128]

scene.add(light);

const ambientLight = new THREE.AmbientLight("#dedcce", 0.5); // Soft light with background color
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, "#838572", 0.5);
scene.add(hemiLight);

function render() {
  renderer.render(scene, camera);
}
render();

window.objects = objects; // Make it accessible globally for debugging
