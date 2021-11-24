
const space_best = document.getElementById("space_best");
let space_bests = document.getElementById("space_bests");
let space_comedy = document.getElementById("space_comedy");
let space_western = document.getElementById("space_western");
let space_sci_fi = document.getElementById("space_sci_fi");
console.log("space best : "+space_bests)


// getData("http://localhost:8000/api/v1/titles/", space_western)
getData("http://localhost:8000/api/v1/titles/?genre=Western&sort_by=-imdb_score", space_western)
getData("http://localhost:8000/api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score", space_sci_fi)
getData("http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score", space_comedy)



function builder(elems, space){
    for(let elem of elems){
        console.log(elem);
        let dom_elem = document.createElement('p');
        dom_elem.textContent = `${elem.title} - ${elem.imdb_score}`;
        space.appendChild(dom_elem);
    }
};

function getData(url, space) {
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
        let elems = json.results
        builder(elems, space)
    });
};

