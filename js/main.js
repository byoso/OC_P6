
// Initialize some variables
let domain_name = "http://localhost:8000/"

// variables for right and left slide buttons
let margins = {};
let sizes = {};
let userAgent = navigator.userAgent
if(userAgent.includes("Firefox")){
    film_size = 212;
}else {
    film_size = 216;
}
let fims_slide = 4;//change it to change the sliding rules


// all you need is to define some categories
const categories = [
    the_only_best = {
        "uri": "api/v1/titles/?sort_by=-imdb_score",
        "title":  "Le meilleur film",
        "space_name": "space_best",
        "nbre": 1,
        "honnor": true
    },
    bests = {
        "uri": "api/v1/titles/?sort_by=-imdb_score",
        "title":  "Films les mieux notés",
        "space_name": "space_bests",
        "nbre": 7,
        "honnor": false
    },
    westerns = {
        "uri": "api/v1/titles/?genre=Western&sort_by=-imdb_score",
        "title":  "Westerns",
        "space_name": "space_westerns",
        "nbre": 7,
        "honnor": false
    },
    // sci_fi_best = {
    //     "uri": "api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score",
    //     "title":  "Semaine de la SF",
    //     "space_name": "space_best_sci_fi",
    //     "nbre": 1,
    //     "honnor": true
    // },
    sci_fis = {
        "uri": "api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score",
        "title":  "Sci-Fi",
        "space_name": "space_sci_fi",
        "nbre": 7,
        "honnor": false
    },
    // comedies = {
    //     "uri": "api/v1/titles/?genre=Comedy&sort_by=-imdb_score",
    //     "title":  "Comedies",
    //     "space_name": "space_comedies",
    //     "nbre": 7,
    //     "honnor": false
    // },
    action = {
        "uri": "api/v1/titles/?genre=Action&sort_by=-imdb_score",
        "title":  "Action",
        "space_name": "space_action",
        "nbre": 7,
        "honnor": false
    },
    
]

// build the html page
for (cat of categories){
    buildCategory(cat.uri, cat.title, cat.space_name, cat.nbre, cat.honnor)
}


function buildCategory(uri, title, space_name, nbre, honnor=false) {
    let elems = []
    let new_cat = document.createElement("section");
    if (honnor){
        new_cat.innerHTML = `
        <h1 class="cat-title">${title}</h1>
        <div id="${space_name}"></div>
        `
    }else {
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
    }
    margins[space_name] = 0
    sizes[space_name] = nbre
    let categories = document.getElementById("categories")
    categories.appendChild(new_cat)
    let url = domain_name + uri;
    getData(url, space_name, nbre, honnor, elems)
};

function getData(url, space_name, nbre, honnor, elems){
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){
        let data = json
        let next = data.next
        elems = [].concat(elems, data.results);
        if ((next) && (elems.length < nbre)){
            getData(next, space_name, nbre, honnor, elems)
        }else {
            buildSpace(space_name, nbre, honnor, elems)
        }
            
    })
    .catch(function(error){
        console.log("error: ",error)
    })
};

function buildSpace(space_name, nbre, honnor, elems){
    elems = elems.slice(0,nbre)
    if (honnor){
        buildHonnor(elems, space_name)
    }else{
        builder(elems, space_name)
    }
};


function builder(elems, space_name){
    for(let elem of elems){
        let dom_elem = document.createElement("div");
        dom_elem.className = "film"
        dom_elem.innerHTML = `
        <button onclick="modalBuilder(${elem.id})">
            <img src="${elem.image_url}" alt="img-${elem.title}">
        </button>

        `
        ;
        var space = document.getElementById(space_name)
        space.appendChild(dom_elem);
    }
};

function buildHonnor(elems, space_name){
    for(let elem of elems){
        let dom_elem = document.getElementById(space_name);
        dom_elem.classList.add('best')
        dom_elem.innerHTML = `
        <div  class="best_film">
            <div class="best_box">
                <h2>${elem.title}</h2>
                <button class="play">Play</button>
            </div>
            <div class="best_box">
                <img onclick="modalBuilder(${elem.id})" class="best_image" src="${elem.image_url}" alt="img-${elem.title}">
            </div>
        </div>
        `
        ;
    }
}


function modalBuilder(film_id){
    // rebuild the modal for the requested film
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
    .catch(function(error){
        console.log("error: ",error)
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


// Right and left buttons

function slideRight(id){
    var space = document.getElementById(id)
    if (margins[id] > -film_size*(sizes[id]-fims_slide)){
        margins[id] -= film_size*fims_slide;
        space.style.marginLeft = `${margins[id]}px`
        space.classList.remove("left");
        space.classList.add("right");

    }
}

function slideLeft(id){
    var space = document.getElementById(id)
    if (margins[id] <= -film_size*fims_slide){
        margins[id] += film_size*fims_slide;
        space.style.marginLeft = `${margins[id]}px`
        space.classList.remove("right")
        space.classList.add("left");
    }
}
