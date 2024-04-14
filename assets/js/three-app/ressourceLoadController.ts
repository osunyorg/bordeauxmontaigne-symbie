let ressourcesCount = 7;
let ressourcesLoaded = 0;
let percentage = 0;

let load = document.getElementById('preloader');
let bar = document.getElementById('bar');
//const gifElement = document.getElementById('preloader-image');

export function addRessource() {
    //ressourcesCount++;
  }
  
  // Fonction pour vérifier si toutes les ressources sont chargées
  function checkIfSceneLoaded() {
    if (ressourcesLoaded === ressourcesCount && ressourcesLoaded != 0 && ressourcesCount != 0) {
        // Toutes les ressources sont chargées, déclencher un événement
        setTimeout(sceneLoadedEvent, 500);
    }
}

// Fonction de gestionnaire d'événement pour les ressources chargées
export function resourceLoaded() {
    ressourcesLoaded++;
    percentage = (ressourcesLoaded / ressourcesCount) * 100;
    if(bar) { bar.style.width = percentage+"%"; }
    console.log("new ressource loaded: "+ressourcesLoaded);
    checkIfSceneLoaded();
}

// Fonction à appeler lorsque la scène est entièrement chargée
function sceneLoadedEvent() {
    // Ici, vous pouvez déclencher d'autres actions ou démarrer des fonctionnalités
    console.log('La scène est entièrement chargée ! Count:'+ressourcesCount+" - Loaded:"+ressourcesLoaded);
    if (load) { load.style.opacity = "0"; }
}