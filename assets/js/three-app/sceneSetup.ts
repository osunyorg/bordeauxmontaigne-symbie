import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { SetAmbientLighting } from './LightHelper';
import { setSkySphere } from './skyhelper';


export interface SceneSetupResult {
    scene: any;
    sizes: { width: number; height: number };
    canvas: any;
    matcapTexture:any;
}

const imagePath = '/assets/images/experience/sky.hdr';

export function setupScene(): SceneSetupResult {
    // Ajoutez ici la configuration de la scène

    // Canvas
    const canvas = document.querySelector('canvas')

    // Window Size

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const sizes = {
        width: windowWidth,
        height: windowHeight
    }

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load('/assets/images/experience/textures/1.png')
    matcapTexture.colorSpace = THREE.SRGBColorSpace

    // Lights
	SetAmbientLighting(scene);

    // Sky Sphere
	setSkySphere(scene, imagePath);

    // Return the scene and sizes
    return { scene, sizes, canvas, matcapTexture };
}

export function createGLTFModel( url : string, position : any, rotation : any, scale : any) {
    // Instantiate a loader
    const gltfLoader = new GLTFLoader();
    // Use a promise to handle the asynchronous loading
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        url,
        (gltf : any) => {
          gltf.scene.scale.set(...scale);
          gltf.scene.position.set(...position);
          gltf.scene.rotation.set(...rotation);
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }