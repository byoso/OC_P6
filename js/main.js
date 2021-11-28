let server_domain = "http://localhost:8000/"

const space_best = document.getElementById("space_best");
const space_bests = document.getElementById("space_bests");
const space_comedy = document.getElementById("space_comedy");
const space_western = document.getElementById("space_western");
const space_sci_fi = document.getElementById("space_sci_fi");
console.log("space best : "+space_bests)


let best = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_best, 1)
let bests = getData(server_domain+"api/v1/titles/?sort_by=-imdb_score", space_bests, 7)
let westerns = getData(server_domain+"api/v1/titles/?genre=Western&sort_by=-imdb_score", space_western, 7)
let sci_fis = getData(server_domain+"api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score", space_sci_fi, 7)
let comedies = getData(server_domain+"api/v1/titles/?genre=Comedy&sort_by=-imdb_score", space_comedy, 7)


function builder(elems, space){
    for(let elem of elems){
        console.log(elem);
        let dom_elem = document.createElement("div");
        dom_elem.className = "film"
        dom_elem.innerHTML =
        `<h3>${elem.title}</h3> - ${elem.imdb_score}`
        ;
        space.appendChild(dom_elem);
    }
};

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

