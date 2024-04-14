import * as THREE from 'three';

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { addRessource, resourceLoaded } from './ressourceLoadController'
export const setSkySphere = ( scene : any , imagePath : string) => {
  addRessource();
   let hdrTexture = new RGBELoader().load(imagePath, function () { resourceLoaded(); })
   let skySphereGeometry = new THREE.SphereGeometry(300, 60, 60);
   let skySphereMaterial = new THREE.MeshPhongMaterial({
     map: hdrTexture
   });
   
   skySphereMaterial.side = THREE.BackSide;
   let skySphereMesh = new THREE.Mesh(skySphereGeometry, skySphereMaterial);
   scene.add(skySphereMesh);
 }