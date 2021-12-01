
let server_domain = "http://localhost:8000/"
let elem_id = 0
let films_elems = []
let dom_elems = []
let best_num = 1
let bests_num = 7
let western_num = 7
let sci_fi_num = 7
let comedy_num = 7
let total_elems = best_num+bests_num+western_num+sci_fi_num+comedy_num
console.log('total elems : ', total_elems)


const space_best = document.getElementById("space_best");
const space_bests = document.getElementById("space_bests");
const space_comedy = document.getElementById("space_comedy");
const space_western = document.getElementById("space_western");
const space_sci_fi = document.getElementById("space_sci_fi");


let best = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_best, best_num)
let bests = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_bests, bests_num)
let westerns = getData(server_domain+"api/v1/titles/?genre=Western&sort_by=-imdb_score", space_western, western_num)
let sci_fis = getData(server_domain+"api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score", space_sci_fi, sci_fi_num)
let comedies = getData(server_domain+"api/v1/titles/?genre=Comedy&sort_by=-imdb_score", space_comedy, comedy_num)


function getData(url, space, nbre) {
    let elems = []
    fetch(url)
    .then(function(response) {
        // console.log(`response : ${response}`);
        return response;
    })
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        let data = json
        let next = data.next
        // console.log(next)
        elems = data.results
        // console.log(elems)
        if (next){
            fetch(next)
            .then(function(response){
                return response.json()
            })
            .then(function(json){
                elems = [].concat(elems, json.results)
                elems = elems.slice(0,nbre)
                return elems
            })
            .then(function(elems){
                builder(elems, space)
            })
        };
    })
};


function builder(elems, space){
    for(let elem of elems){
        elem_id ++
        // console.log(elem);
        let dom_elem = document.createElement("div");
        dom_elem.id = `filmId${elem_id}`
        films_elems.push(elem.id)
        dom_elems.push(dom_elem)
        dom_elem.className = "film"
        dom_elem.innerHTML = `
        <button>
            <img src="${elem.image_url}" alt="cover">
        </button>

        `
        ;
        space.appendChild(dom_elem);
        pageLoaded()
    }
};


function pageLoaded(){
    if (films_elems.length < total_elems){
        // console.log("loading...")
    }else {
        // console.log("loaded")
        for(let i=0; films_elems[i];i++){
            dom_elems[i].onclick = function(){
                modalBuilder(films_elems[i])
            }
        }
    }
}


function modalBuilder(film_id){
    console.log("build modal for ", film_id);
    fetch(server_domain+"api/v1/titles/"+film_id)
    .then(function(response) {
        // console.log(`response : ${response}`);
        return response;
    })
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        let elem = json;
        // console.log(elem)
        let dom_modal = document.getElementById("modalWindow")
        dom_modal.style.display = "block";

        modalSetting(elem)
    })
};


function modalSetting(elem){
    // Get the modal
    var modal = document.getElementById("modalWindow");
    // Get the button that opens the modal
    // var btn = document.getElementById(`filmId${elem_id}`);
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

// carousels


