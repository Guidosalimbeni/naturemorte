import * as THREE from "three";
// Import the necessary modules for loading models
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Dark grey background

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjust the cube to act as a stage
const geometry = new THREE.BoxGeometry(3, 0.1, 3); // Make the cube wider and flatter
const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color
const cube = new THREE.Mesh(geometry, material);
cube.position.y = -0.5; // Lower the cube to act like a stage
scene.add(cube);

camera.position.z = 5;

// This function is no longer needed if you don't want animation
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();

// Function to load and add a 3D object
function loadModel(url) {
  const loader = new GLTFLoader();
  loader.load(url, function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0.5, 0); // Adjust this as necessary
    scene.add(model);
    render(); // Render the scene with the model
  });
}

// Call this function when a file is uploaded
loadModel("/Users/guidosalimbeni/Documents/naturemorte/naturemorte/a.gltf");

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      // Assuming the GLTFLoader is configured to handle blobs
      const url = URL.createObjectURL(file);
      loadModel(url);
    }
  });

function render() {
  renderer.render(scene, camera);
}
render();
