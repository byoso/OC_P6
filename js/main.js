let server_domain = "http://localhost:8000/"


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


const space_best = document.getElementById("space_best");
let space_bests = document.getElementById("space_bests");
let space_comedy = document.getElementById("space_comedy");
let space_western = document.getElementById("space_western");
let space_sci_fi = document.getElementById("space_sci_fi");
console.log("space best : "+space_bests)


getData(server_domain+"api/v1/titles/?genre=Western&sort_by=-imdb_score", space_western)
getData(server_domain+"api/v1/titles/?genre=Sci-fi&sort_by=-imdb_score", space_sci_fi)
getData(server_domain+"api/v1/titles/?genre=Comedy&sort_by=-imdb_score", space_comedy)



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
        console.log(`response : ${response}`);
        return response.json();
    })
    .then(function(json) {
        console.log(`json : ${json}`);
        let elems = json.results
        builder(elems, space)
    });
};

