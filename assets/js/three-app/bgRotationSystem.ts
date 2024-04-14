import * as THREE from 'three'
import { resourceLoaded } from './ressourceLoadController';

export function bgRotationSystem(scene: any): any {

    function getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }



    // Geometry
    let cubeGeometry = new THREE.PlaneGeometry(6, 8, 320, 320); // Adjust the size as needed


    // Définir le point central autour duquel placer les cubes
    const centerPoint = new THREE.Vector3(0, 0, 0); // Centre de la scène

    // Définir le rayon autour du point central
    const radius = 10;

    // Nombre de cubes à placer
    const numberOfCubes = 5;

    // Angle entre chaque cube
    const angleIncrement = (2 * Math.PI) / numberOfCubes;
    const cubeGroup = new THREE.Group();


    const clock = new THREE.Clock;



// Déclaration du vertex shader
const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    varying float vWave;
    uniform vec2 iResolution;





    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : stegu
    //     Lastmod : 20201014 (stegu)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //               https://github.com/stegu/webgl-noise
    //

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+10.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }

    // demo code:
    float color(vec3 xyz) { return snoise(xyz); }
    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 p = (fragCoord.xy/iResolution.y) * 2.0 - 1.0;

        float z_squared = 1.0 - length(p.xy);
        if (z_squared < 0.0) { fragColor = vec4(0, 0, 0, 1); return; }
        vec3 xyz = vec3(p, -sqrt(z_squared));

        float n = color(xyz * 4.0);

        fragColor.xyz = mix(0.0, 0.5 + 0.5 * n, smoothstep(0.0, 0.003, z_squared)) * vec3(1, 1, 1);

    }













    void main() {
        vUv = uv;

        vec3 pos = position;
        float noiseFreq = 0.4; //amp
        float noiseAmp = 0.16;
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise(noisePos) * noiseAmp;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
      }
`;

// Déclaration du fragment shader
const fragmentShader = `
    varying vec2 vUv;
    varying float vWave;
    uniform sampler2D uTexture;

    void main() {
        float wave = vWave * 0.2;
        vec3 texture = texture2D(uTexture, vUv + wave).rgb;
        gl_FragColor = vec4(texture, 1.);
    }

`;

const img_list = [
    new THREE.TextureLoader().load('/assets/images/experience/pictures/000_1.jpg', function (){ resourceLoaded(); }),
    new THREE.TextureLoader().load('/assets/images/experience/pictures/000_2.jpg', function (){ resourceLoaded(); }),
    new THREE.TextureLoader().load('/assets/images/experience/pictures/6-min.jpg', function (){ resourceLoaded(); }),
    new THREE.TextureLoader().load('/assets/images/experience/pictures/IMG_0681.jpg', function (){ resourceLoaded(); }),
    new THREE.TextureLoader().load('/assets/images/experience/pictures/Quentin-3.jpg', function (){ resourceLoaded(); })
]

// Création du matériau avec les shaders personnalisés
const customMaterial0 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.1 }, // Exemple de uniforme pour le temps
        uTexture: { value: img_list[0] } // Supposons que vous avez déjà une texture chargée
    }
});

const customMaterial1 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.1 }, // Exemple de uniforme pour le temps
        uTexture: { value: img_list[1] } // Supposons que vous avez déjà une texture chargée
    }
});

const customMaterial2 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.1 }, // Exemple de uniforme pour le temps
        uTexture: { value: img_list[2] } // Supposons que vous avez déjà une texture chargée
    }
});

const customMaterial3 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.1 }, // Exemple de uniforme pour le temps
        uTexture: { value: img_list[3] } // Supposons que vous avez déjà une texture chargée
    }
});

const customMaterial4 = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.1 }, // Exemple de uniforme pour le temps
        uTexture: { value: img_list[4] } // Supposons que vous avez déjà une texture chargée
    }
});

const materialArray = [
    customMaterial0,
    customMaterial1,
    customMaterial2,
    customMaterial3,
    customMaterial4
]



    // Parcourir les cubes et les placer autour du point central
    for (let i = 0; i < numberOfCubes; i++) {
        // Calculer l'angle actuel
        const angle = i * angleIncrement;

        // Calculer les coordonnées x et z du cube en fonction de l'angle et du rayon
        const x = centerPoint.x + radius * Math.cos(angle);
        const z = centerPoint.z + radius * Math.sin(angle);

        // Créer le cube
        const cube = new THREE.Mesh(cubeGeometry, materialArray[i]);

        // Positionner le cube aux coordonnées calculées
        cube.position.set(x, centerPoint.y, z);

        // Ajouter le cube à la scène
        scene.add(cube);

        cubeGroup.add(cube);
    }


    //GROUPS + ROTATIONS

    // Ajouter le groupe à la scène
    scene.add(cubeGroup);

    // Fonction d'animation pour faire tourner le groupe de cubes autour du point central
    function animate() {
        requestAnimationFrame(animate);

            // Faire tourner le groupe de cubes autour du point central
            cubeGroup.rotation.y += 0.003; // Vitesse de rotation
            let ik = 0;

            cubeGroup.children.forEach((cube: any) => {

                const cubeAmp = getRandomNumber(0.001,0.01);

                cube.rotation.x += cubeAmp ; // Applique la rotation en radians
                cube.rotation.y += cubeAmp ;
                cube.rotation.z += cubeAmp;

                materialArray[ik].uniforms.uTime.value = clock.getElapsedTime();
                materialArray[ik].uniforms.uTexture.value = img_list[ik];
                ik++;

            });

    }
    animate();










    return { };
}