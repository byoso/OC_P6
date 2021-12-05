
let domain_name = "http://localhost:8000/"
let best_num = 1
let bests_num = 7
let western_num = 7
let sci_fi_num = 7
let comedy_num = 7
let margins = {}
let sizes = {}

const space_best = document.getElementById("space_best");
const space_cat01 = document.getElementById("space_cat01");
const space_cat02 = document.getElementById("space_cat02");
const space_cat03 = document.getElementById("space_cat03");
const space_cat04 = document.getElementById("space_cat04");


// let best = buildCategory(domain_name+"api/v1/titles/?sort_by=-imdb_score", space_best, best_num, true)
// let bests = buildCategory("api/v1/titles/?sort_by=-imdb_score", "Films les mieux notés", "bests", 7)

categories = [
    // ["api/v1/titles/?sort_by=-imdb_score", "Films les mieux notés", "bests", 7],
    bests = {
        "uri": "api/v1/titles/?sort_by=-imdb_score",
        "title":  "Films les mieux notés",
        "space_name": "bests",
        "nbre": 7,
        "first": false
    }
]

for (cat of categories){
    buildCategory(cat.uri, cat.title, cat.space_name, cat.nbre, cat.first)
}


function buildCategory(uri, title, space_name, nbre, first=false) {
    let elems = []
    let new_cat = document.createElement("div");
    new_cat.innerHTML = `    
    <h1 class="cat-title">${title}</h1>
    <div class="category">
        <div>
            <button class="slide-button slide-button--left" onclick="slideLeft('${space_name}')"><</button>
        </div>
        <div class="slider">
            <div id="${space_name}" class="category">
        </div>

        </div>
        <div>
            <button class="slide-button slide-button--right" onclick="slideRight('${space_name}')">></button>
        </div>

    </div>
    
    `
    margins[space_name] = 0
    sizes[space_name] = nbre
    let categories = document.getElementById("categories")
    categories.appendChild(new_cat)
    let url = domain_name + uri;
    getData(url, space_name, nbre, first, elems)
};

function getData(url, space_name, nbre, first, elems){
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){
        let data = json
        let next = data.next
        elems = [].concat(elems, data.results);
        if ((next) && (elems.length < nbre)){
            getData(next, space_name, nbre, first, elems)
        }else {
            buildSpace(url, space_name, nbre, first, elems)
        }
            
    }
)};

function buildSpace(url, space_name, nbre, first, elems){
    elems = elems.slice(0,nbre)
    if (first){
        buildFirst(elems, space_name)
    }else{
        builder(elems, space_name)
    }
};


function builder(elems, space_name){
    for(let elem of elems){
        let dom_elem = document.createElement("div");
        dom_elem.className = "film"
        dom_elem.innerHTML = `
        <button>
            <img src="${elem.image_url}" alt="cover">
        </button>

        `
        ;
        var space = document.getElementById(space_name)
        space.appendChild(dom_elem);
        clickModal(dom_elem, elem.id)
    }
};

function buildFirst(elems, space){
    for(let elem of elems){
        let dom_elem = document.createElement("div");
        dom_elem.classList.add('best')
        dom_elem.innerHTML = `
        <div  class="best_film">
            <div class="best_box">
                <h2>${elem.title}</h2>
                <button class="play">Play</button>
            </div>
            <div class="best_box">
                <img class="best_image" src="${elem.image_url}" alt="cover">
            </div>
        </div>
        `
        ;
        space.appendChild(dom_elem);
    }
}


function clickModal(dom_elem, id){
    // the dom element calls the modal on click
    console.log("clickModal - clickable")
    dom_elem.onclick = function(){
        modalBuilder(id)
    }
};


function modalBuilder(film_id){
    // rebuild the modal for the requested film
    console.log("build modal for ", film_id);
    fetch(domain_name+"api/v1/titles/"+film_id)
    .then(function(response) {
        return response;
    })
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        let elem = json;
        let dom_modal = document.getElementById("modalWindow")
        dom_modal.style.display = "block";

        modalSetting(elem)
    })
};


function modalSetting(elem){
    // Get the modal
    var modal = document.getElementById("modalWindow");
    // Get the <span> element that closes the modal
    var span = document.getElementById("closeModal");
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    var modal_left = document.getElementById("modalLeft")
    var modal_right = document.getElementById("modalRight")

    modal_left.innerHTML = `
    <h2>${elem.original_title}</h2>
    <img src="${elem.image_url}" alt="cover">
    `
    modal_right.innerHTML = `
    <ul>
        <li>Genre : ${elem.genres}</li>
        <li>Date de sortie : ${elem.date_published}</li>
        <li>Catégorie de public : ${elem.rated}</li>
        <li>Score imdb : ${elem.imdb_score}</li>
        <li>Réalisateur(s) : ${elem.directors}</li>
        <li>Acteur(s) : ${elem.actors}</li>
        <li>Durée : ${elem.duration} minutes</li>
        <li>Pays d'origine : ${elem.countries}</li>
        <li>Résultat au box office : ${elem.worldwide_gross_income} $</li>
        <br>
        <li>Résumé :</li>
        <li>${elem.long_description}</li>
    </ul>
    `
};


function slideRight(id){
    console.log("click right ",id)
    var space = document.getElementById(id)
    if (margins[id] > -216*(sizes[id]-4)){
        margins[id] -= 216*4;
        space.style.marginLeft = `${margins[id]}px`
        space.classList.remove("left");
        space.classList.add("right");

    }
}

function slideLeft(id){
    var space = document.getElementById(id)
    if (margins[id] <= -216*4){
        margins[id] += 216*4;
        space.style.marginLeft = `${margins[id]}px`
        space.classList.remove("right")
        space.classList.add("left");
    }
}
