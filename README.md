# P6


This is the front part of a web service that allows the user to browse fims and get some informations about it.

The JS part is conceived to be easy to adapt to whatever the clients could want to change. Each category is a JS object, one just have to add, remove or modify this objects like this:
```JS
let categories = [
    westerns = {
        "uri": "api/v1/titles/?genre=Western&sort_by=-imdb_score",// api uri to get datas
        "title":  "Westerns",// category title to display
        "space_name": "space_westerns",// used as id in the html
        "nbre": 7, // number of films to display
        "honnor": false,// if it is an 'honored' category, then also set nbre to 1
    },
]

```
