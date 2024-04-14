export function loader() {
    let phrases = [
        "Chargement en cours",
        "Nous préparons tout",
        "Encore un petit instant",
        "C'est sur, c'est long aujourd'hui",
        "On y est presque"
    ];

    let txt = document.getElementById("loadertxt");

    let dots = "";

    let sentence = 0;

    
    function updateSentence(sentence:any,dots:any){
        if(txt){
            txt.innerText = phrases[sentence]+""+dots;
        }
    }

    function threeDots(){
        dots = "...";
        updateSentence(sentence,dots);
        setTimeout(oneDot, 300);
    }
    function twoDots(){
        dots = "..";
        updateSentence(sentence,dots);
        setTimeout(threeDots, 300);
    }
    function oneDot(){
        dots = ".";
        updateSentence(sentence,dots);
        setTimeout(twoDots, 300);
    }

    oneDot();
    
    
    // function fadeout(){
    //     preloader.style.opacity = 0;
    // }
    
    function switchSentence(){
        if(txt){
            updateSentence(sentence,dots);
            sentence++;
            if(sentence >= phrases.length){
                sentence = 0;
            }
            setTimeout(switchSentence, 5000)
        }
    }
    setTimeout(switchSentence, 5000)
    
  }
  