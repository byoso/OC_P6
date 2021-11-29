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
console.log("space best : "+space_bests)


let best = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_best, best_num)
let bests = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_bests, bests_num)
let westerns = getData(server_domain+"api/v1/titles/?genre=Western&sort_by=-imdb_score", space_western, western_num)
let sci_fis = getData(server_domain+"api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score", space_sci_fi, sci_fi_num)
let comedies = getData(server_domain+"api/v1/titles/?genre=Comedy&sort_by=-imdb_score", space_comedy, comedy_num)


function getData(url, space, nbre) {
    let elems = []
    fetch(url)
    .then(function(response) {
        console.log(`response : ${response}`);
        return response;
    })
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        let data = json
        let next = data.next
        console.log(next)
        elems = data.results
        console.log(elems)
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
        console.log(elem);
        let dom_elem = document.createElement("button");
        dom_elem.id = `filmId${elem_id}`
        films_elems.push(elem.id)
        dom_elems.push(dom_elem)
        dom_elem.className = "film"
        dom_elem.innerHTML =
        `
        <img src="${elem.image_url}" alt="cover">

                <!-- The Modal -->
        <div id="modalId${elem_id}" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span id="closeId${elem_id}" class="close">&times;</span>
            <div class="modal-film">
                <div class="modal-left">
                    <h2>${elem.title}</h2>
                    <img src="${elem.image_url}" alt="cover">
                </div>
                <div class="modal-right">
                    <ul>
                        <li>Genre : ${elem.genres}</li>
                        <li>Date de sortie : ${elem.year}</li>
                        <li>Rated : ${elem.votes}***</li>
                        <li>Score Imdb : ${elem.imdb_score}</li>
                        <li>Réalisateur(s) : ${elem.directors}</li>
                        <li>Acteurs : ${elem.actors}</li>
                        <li>Durée : ***</li>
                        <li>Pays d'origine : ***</li>
                        <li>Résultat au box office : ***</li>
                        <li>
                            <p>Résumé </p>
                            <p>${elem.description}***</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        
        `
        ;
        space.appendChild(dom_elem);
        pageLoaded()
        // modalSetting(elem, elem_id)
    }
};

function modalSetting(elem, elem_id){
    // Get the modal
    var modal = document.getElementById(`modalId${elem_id}`);
    // Get the button that opens the modal
    var btn = document.getElementById(`filmId${elem_id}`);
    // Get the <span> element that closes the modal
    var span = document.getElementById(`closeId${elem_id}`);
    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }
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
};


function modalBuilder(film_id){
    console.log("build modal for ", film_id)
}

function pageLoaded(){
    if (films_elems.length < total_elems){
        console.log("loading...")
    }else {
        console.log("loaded")
        for(let i=0; films_elems[i];i++){
            dom_elems[i].onclick = function(){
                modalBuilder(films_elems[i])
            }
        }
    }
};