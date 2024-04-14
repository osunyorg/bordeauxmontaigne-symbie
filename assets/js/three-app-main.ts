import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupRenderer } from './three-app/setupRenderer'
import { setupScene, SceneSetupResult , createGLTFModel} from './three-app/sceneSetup';
import { bgRotationSystem } from './three-app/bgRotationSystem';
import { addRessource, resourceLoaded } from './three-app/ressourceLoadController';
import { loader } from './three-app/loaderLogic';

// Renderer
const renderer = setupRenderer();

// Set up the scene
const { scene, sizes, canvas }: SceneSetupResult = setupScene();

let magazine :any ;
// Load custom texture

loader();

// const mouse = new THREE.Vector2()

// Function to load the model and add it to the scene
async function loadAndAddModel() {
    try {
        return await createGLTFModel(
            '/assets/images/experience/magazine.glb',
            [0, 0,0],
            [Math.PI / 2, 0, 0],
            [9,9,9]
        );

    } catch (error) {
        console.error("Failed to load the model", error);
        return null; // or handle the error as appropriate
    }
}
// Immediately invoked async function expression to load the model
const magazinePromise = (async () => {
    addRessource();
    return await loadAndAddModel();
})();

// Later in your code, when you need to use the magazine model
magazinePromise.then((createdMagazine: any) => {
    if (createdMagazine) {
        // Use magazine here, after it's been loaded
        scene.add(createdMagazine.scene);
        magazine = createdMagazine.scene;
        console.log("Magazine loaded successfully", magazine);
        resourceLoaded();

    }
}).catch(error => {
    console.error("Error loading magazine:", error);
    resourceLoaded();
});

bgRotationSystem(scene);


// -------    Camera & Controls start   ----------

// Define camera variables
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
camera.position.set(0, 0, 5); // Initial position relative to the target
scene.add(camera);

const controls = new OrbitControls( camera, canvas );
controls.enableZoom = false;
controls.rotateSpeed  = .8;
controls.update();

// -------    Camera & Controls end   ----------

// Update renderer size
renderer.setSize(sizes.width-1, sizes.height-1)


// Mettez à jour la taille du canvas en fonction de la nouvelle taille de la fenêtre
canvas.style.width = document.documentElement.clientWidth-1 + 'px';
canvas.style.height = document.documentElement.clientHeight-1 + 'px';
// Mettez à jour la taille de rendu de Three.js
renderer.setSize(document.documentElement.clientWidth-1, document.documentElement.clientHeight-1);
camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
camera.updateProjectionMatrix();


// Écoutez l'événement de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    // Mettez à jour la taille du canvas en fonction de la nouvelle taille de la fenêtre
    canvas.style.width = document.documentElement.clientWidth-1 + 'px';
    canvas.style.height = document.documentElement.clientHeight-1 + 'px';
    // Mettez à jour la taille de rendu de Three.js
    renderer.setSize(document.documentElement.clientWidth-1, document.documentElement.clientHeight-1);
    camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    camera.updateProjectionMatrix();
});


// Define mouse variables
let prevMouseX: number | null = null;
let prevMouseY: number | null = null;


// Set initial mouse position and mesh location when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Once the DOM is loaded
    // Set initial mouse and cube position to the center of the screen
    prevMouseX = 0;
    prevMouseY = 0;
});

document.addEventListener('load', () => {
    console.log("load");
});

// Update mouse coordinates on mouse move
document.addEventListener('mousemove', (event) => {
    // Capture initial mouse position if it hasn't been captured yet
    if (!prevMouseX || !prevMouseY) {
        prevMouseX = (event.clientY / window.innerWidth) * 2 - 1;
        prevMouseY = (event.clientX / window.innerHeight) * 2 + 1;

        return; // Exit the event listener to avoid further processing
    }

    // Normalize mouse coordinates to the range [-1, 1]
    const mouseX = (event.clientY / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientX / window.innerHeight) * 2 + 1;
    // Calculate the change in mouse position
    const deltaX = mouseX - prevMouseX;
    const deltaY = mouseY - prevMouseY;

    // Update previous mouse position
    prevMouseX = mouseX;
    prevMouseY = mouseY;

    // Move camera around the target based on mouse movement
    moveCamera(deltaX, deltaY);

    // Rotate the cube based on mouse movement
    rotateMagazine(deltaX, deltaY);
});

function moveCamera(deltaX: number, deltaY: number) {
    // Define movement speed
    const movementSpeed = 0.1;

    // Calculate new position relative to the target
    const newPosition = camera.position.clone();

    // Rotate camera around the target (horizontal movement)
    newPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), - deltaY * movementSpeed);

    // Move camera up or down (vertical movement)
    newPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), - deltaX * movementSpeed);

    // Set the new camera position
    camera.position.copy(newPosition);

    // Make the camera always look at the target
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}


function rotateMagazine(deltaX: number, deltaY: number) {
    // Define rotation speed for the cube
    const rotationSpeed = 0.15;

    if(magazine){

        // Rotate the cube based on mouse movement
        magazine.rotation.z -= deltaY * rotationSpeed;
        magazine.rotation.x += deltaX * rotationSpeed;

    }
}

// Rotate particles group
// function rotateParticles() {
//     particles.rotation.y += 0.001;
// }

// Clock
// const clock = new THREE.Clock();

const tick = () => {
    // rotateParticles();
    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
