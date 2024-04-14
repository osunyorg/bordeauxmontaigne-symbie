import * as THREE from 'three';

export const SetAmbientLighting = (scene : any) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Color: white, Intensity: 0.5
      scene.add(ambientLight);
  }