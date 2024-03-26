import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GA } from "./decision_engine.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const aspectRatio = 297 / 210; // A4 landscape
camera.aspect = aspectRatio;
camera.updateProjectionMatrix();
const renderer = new THREE.WebGLRenderer();
const width = 400;
const height = width / aspectRatio;
renderer.setSize(width, height);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const stageGeometry = new THREE.BoxGeometry(6, 0.2, 3);
const stageMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff" });

const stage = new THREE.Mesh(stageGeometry, stageMaterial);
stage.position.y = -0.5;
stage.receiveShadow = true;
scene.add(stage);

camera.position.z = 5;
camera.position.y = 0.2;

const objects = [];

function loadModel(url) {
  const loader = new OBJLoader();
  loader.load(url, function (object) {
    const material = new THREE.MeshPhongMaterial({ color: "#f0efe6" });
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.position.set(0, -0.5, 1);
    scene.add(object);
    objects.push(object);
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

document
  .getElementById("optimizeBtn")
  .addEventListener("click", startOptimization);
const canvasContainer = document.querySelector(".canvas-container");
canvasContainer.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-3, 2, 3);
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.darkness = 0.5;

scene.add(light);

const ambientLight = new THREE.AmbientLight("#dedcce", 0.5); // Soft light with background color
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, "#838572", 0.5);
scene.add(hemiLight);

function render() {
  renderer.render(scene, camera);
}
render();

function captureWebGLPixelData() {
  const width = renderer.domElement.width;
  const height = renderer.domElement.height;
  const pixels = new Uint8Array(width * height * 4); // 4 components per pixel
  renderer
    .getContext()
    .readPixels(
      0,
      0,
      width,
      height,
      renderer.getContext().RGBA,
      renderer.getContext().UNSIGNED_BYTE,
      pixels
    );
  return { data: pixels, width, height };
}

async function startOptimization() {
  const currentObjects = objects.map((obj) => {
    return {
      x: obj.position.x,
      y: obj.position.y,
      z: obj.position.z,
      rotation: obj.rotation.y,
    };
  });

  const geneLength = currentObjects.length;
  GA.initializePopulation(geneLength);

  render();

  const imageData = captureWebGLPixelData();

  const numberOfGenerations = 300; /////////////////////////////
  for (let i = 0; i < numberOfGenerations; i++) {
    render();
    await GA.calculateFitness(imageData, currentObjects);

    const currentFitnessScore = GA.getCurrentFitnessScore();
    document.getElementById(
      "fitnessScoreContainer"
    ).innerText = `Fitness Score: ${currentFitnessScore}`;

    let tempSolution = GA.findBestIndividual();
    for (let i = 0; i < objects.length; i++) {
      objects[i].position.x = tempSolution[i].x;
      objects[i].position.y = tempSolution[i].y;
      objects[i].position.z = tempSolution[i].z;
      objects[i].rotation.y = tempSolution[i].rotation;
    }
    render();
    const nextimgData = captureWebGLPixelData();
    await GA.generateNextGeneration(nextimgData, currentObjects);
  }

  const bestSolution = GA.findBestIndividual();

  for (let i = 0; i < objects.length; i++) {
    objects[i].position.x = bestSolution[i].x;
    objects[i].position.y = bestSolution[i].y;
    objects[i].position.z = bestSolution[i].z;
    objects[i].rotation.y = bestSolution[i].rotation;
  }

  render();
  GA.printFinalScore();
}
