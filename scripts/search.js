// Методы, которые могут пригодиться:
// starWars.searchCharacters(query), 
// starWars.searchPlanets(query), 
// starWars.searchSpecies(query).
// starWars.getCharactersById(id), 
// starWars.getPlanetsById(id), 
// starWars.getSpeciesById(id)

// Тут ваш код.


let plugImg = document.createElement('img');
plugImg.src = 'images/plug.jpg';
plugImg.alt = 'error-image';
plugImg.className = 'plug';

let input = document.getElementById('inp');
let btnSearch = document.getElementById('byQueryBtn');
let resultContainer = document.getElementById('result-container');
let messageTitle = document.getElementById('messageTitle');
let content = document.getElementById('content');
let spinner = document.querySelector('.spinner');
let btnDelete = document.querySelector('.delete');
let searchBlock = document.getElementById('byQueryBlock');
let options = ['people', 'planets', 'species'];
let select = document.createElement('select');
select.id = 'select';
searchBlock.prepend(select);

let orText = document.createElement('p');
orText.textContent = 'OR';
orText.className = 'orText';
let requireContainer = document.querySelector('.section .column');
let orBlock = document.createElement('div');
orBlock.className = 'search';
requireContainer.append(orText, orBlock);

let selectID = document.createElement('select');
selectID.id = 'selectID';
selectID.className = 'select'
let inputID = document.createElement('input');
inputID.id = 'inputID';
inputID.className = 'inputID';
inputID.placeholder = 'search...'
let buttonID = document.createElement('button');
buttonID.id = 'buttonID';
buttonID.className = 'buttonID';
buttonID.textContent = 'Get by id'

orBlock.append(selectID, inputID, buttonID);

for (let i = 0; i < options.length; i++) {
    let option = document.createElement('option');
    option.text = options[i];
    if (i === 0) {
        option.selected = true;
    }
    selectID.appendChild(option);
}

for (let i = 0; i < options.length; i++) {
    let option = document.createElement('option');
    option.text = options[i];
    if (i === 0) {
        option.selected = true;
    }
    select.appendChild(option);
}

btnDelete.addEventListener('click', function () {
    resultContainer.style.visibility = 'hidden';
})

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        btnSearch.click();
    }
});

inputID.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        buttonID.click();
    }
});

btnSearch.addEventListener('click', function () {
    let query = input.value;
    if (query.trim() == '') {
        resultContainer.style.visibility = 'hidden';
        return;
    }

    content.innerHTML = '';
    content.appendChild(plugImg);
    messageTitle.textContent = query;
    spinner.style.visibility = 'visible';
    let searchType = select.value;


    switch (searchType) {
        case 'people':
            starWars.searchCharacters(query)
                .then(characters => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    characters.results.forEach(character => {
                        let characterInfo = Object.entries(character);
                        let promises = [];

                        characterInfo.forEach(([key, value]) => {
                            if (key === 'homeworld') {
                                const planetId = value.split('/').filter(Boolean).pop();
                                let planetPromise = starWars.getPlanetsById(planetId)
                                    .then(planet => {
                                        return planet.name;
                                    })
                                    .catch(error => {
                                        console.error('searchPlanets error: ', error);
                                    });
                                promises.push(planetPromise);
                            } else {
                                if (content.contains(plugImg)) {
                                    content.removeChild(plugImg);
                                }
                                content.innerHTML += `${key}: ${value}<br>`;
                            }
                        });

                        Promise.all(promises)
                            .then(planetNames => {
                                planetNames.forEach((planetName) => {
                                    content.innerHTML += `Homeworld: ${planetName}<br>`;
                                });
                            });
                    });
                })
                .catch(error => {
                    console.error('searchCharacters error: ', error);
                    spinner.style.visibility = 'hidden';
                });
            break;
        case 'planets':
            starWars.searchPlanets(query)
                .then(planets => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    let planetsInfo = Object.entries(planets.results);
                    planetsInfo.forEach(([key, value]) => {
                        if (value instanceof Object) {
                            if (content.contains(plugImg)) {
                                content.removeChild(plugImg);
                            }
                            for (let key in value) {
                                content.innerHTML += `${key}: ${value[key]}<br>`
                            }
                        }
                    })
                })
                .catch(error => {
                    console.error('searchPlanets error: ', error);
                    spinner.style.visibility = 'hidden';
                });
            break;
        case 'species':
            starWars.searchSpecies(query)
                .then(species => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    let speciesInfo = Object.entries(species.results);
                    speciesInfo.forEach(([key, value]) => {
                        if (value instanceof Object) {
                            if (content.contains(plugImg)) {
                                content.removeChild(plugImg);
                            }
                            for (let key in value) {
                                content.innerHTML += `${key}: ${value[key]}<br>`
                            }
                        }
                    })
                })
                .catch(error => {
                    console.error('searchSpecies error: ', error);
                    spinner.style.visibility = 'hidden';
                });
            break;
    }
})


buttonID.addEventListener('click', function () {
    let id = inputID.value;
    if (id.trim() == '') {
        resultContainer.style.visibility = 'hidden';
        return;
    }

    content.innerHTML = '';
    messageTitle.textContent = id;
    spinner.style.visibility = 'visible';
    let searchType = selectID.value;

    switch (searchType) {
        case 'people':
            starWars.getCharactersById(id)
                .then(peopleId => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    let peopleInfo = Object.entries(peopleId);
                    peopleInfo.forEach(([key, value]) => {
                        if (key == 'detail' || value == 'not found') {
                            content.append(plugImg);
                        }
                        content.innerHTML += `${key}: ${value}<br>`;
                    })
                })
                .catch(error => {
                    console.error('getCharactersById error: ', error);
                    spinner.style.visibility = 'hidden';
                });
            break;
        case 'planets':
            starWars.getPlanetsById(id)
                .then(planetsId => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    let planetsInfo = Object.entries(planetsId);
                    planetsInfo.forEach(([key, value]) => {
                        if (key == 'detail' || value == 'not found') {
                            content.append(plugImg);
                        }
                        content.innerHTML += `${key}: ${value}<br>`;
                    })
                })
                .catch(error => {
                    console.error('getPlanetsById error: ', error);
                    spinner.style.visibility = 'hidden';

                });
            break;
        case 'species':
            starWars.getSpeciesById(id)
                .then(speciesId => {
                    spinner.style.visibility = 'hidden';
                    resultContainer.style.visibility = 'visible';
                    let speciesInfo = Object.entries(speciesId);
                    speciesInfo.forEach(([key, value]) => {
                        if (key == 'detail' || value == 'not found') {
                            content.append(plugImg);
                        }
                        content.innerHTML += `${key}: ${value}<br>`;
                    })
                })
                .catch(error => {
                    console.error('getSpeciesById error: ', error);
                    spinner.style.visibility = 'hidden';
                });
            break;
    }
})



// btnDelete.addEventListener('click', function() {
//     info.style.visibility = 'hidden';
// })

// search.addEventListener('click', () => {
//     let query = input.value;
//     spinner.style.visibility = 'visible';

// starWars.searchCharacters(query)
//     .then(characters => {
//         let charRes = characters.results;
//         if (charRes.length > 0) {
//             let el = charRes[0];
//             info.style.visibility = 'visible';
//             messageTitle.textContent = el.name;
//             content.innerHTML = `
//             name: ${el.name} <br>
//             height: ${el.height} <br>
//             mass: ${el.mass} <br>
//             eye color: ${el.eye_color} <br>
//             hair color: ${el.hair_color} <br>
//             skin color: ${el.skin_color} <br>
//             gender: ${el.gender} <br>
//             birth year: ${el.birth_year} <br>
//             created: ${el.created} <br>
//             edited: ${el.edited} <br>
//             films: ${el.films} <br>
//             homeworld: ${el.homeworld} <br>
//             species: ${el.species} <br>
//             starships: ${el.starships} <br>
//             vehicles: ${el.vehicles} <br>
//             `;
//         }

//             spinner.style.visibility = 'hidden';

//             if (query.length < 1) {
//                 return info.style.visibility = 'hidden';
//             }
//         })
// .catch(error => {
//     console.error('searchCharacters error: ', error);
//     spinner.style.visibility = 'hidden';
// });
// });





// starWars.searchPlanets(query)
//     .then(planets => {
//         console.log(planets.results);

//     })
//     .catch(error => {
//         console.error('searchPlanets error: ', error);
//     });

// starWars.searchSpecies(query)
//     .then(query => {
//         console.log(query.results);
//     })
//     .catch(error => {
//         console.error('searchSpecies error: ', error);
//     })





