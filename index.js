/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import games from "./games.js";
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  for (let i = 0; i < games.length; i++) {
    const gameCard = document.createElement("div");

    gameCard.classList.add("game-card");

    gameCard.innerHTML = `
      <h3>${games[i].name}</h3>
      <img class="game-img" src="${games[i].img}" alt="${games[i].name}" />
      <p>Description: ${games[i].description}</p>
      <p>Number of backers: ${games[i].backers}</p>
    `;

    gamesContainer.appendChild(gameCard);
  }
}

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((acc, game) => {
  return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerText = totalContributions.toLocaleString("en-US");

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
let totalPledged = GAMES_JSON.reduce((acc, game) => {
  return acc + game.pledged;
}, 0);

raisedCard.innerText = `$${totalPledged.toLocaleString("en-US")}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const numberOfGames = GAMES_JSON.length;
gamesCard.innerText = numberOfGames;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  let underFundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(underFundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  let fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);

  // use the function we previously created to add funded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const underFundedGamesNum = GAMES_JSON.filter(
  (game) => game.pledged < game.goal
).length;

// create a string that explains the number of unfunded games using the ternary operator
const totalGameNum = GAMES_JSON.length;
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

const underFundedExplanation = `We've raised a total of $${totalRaised.toLocaleString(
  "en-US"
)} across ${totalGameNum > 1 ? `${totalGameNum} games` : `1 game`}. ${
  underFundedGamesNum > 1
    ? `There are currently ${underFundedGamesNum} unfunded games.`
    : `There is currently 1 unfunded game.`
}`;

// create a new DOM element containing the template string and append it to the description container
const unFundedParagraph = document.createElement("p");
unFundedParagraph.innerHTML = underFundedExplanation;
descriptionContainer.appendChild(unFundedParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
var [firstGame, secondGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topFundedGame = document.createElement("p");
topFundedGame.innerHTML = firstGame.name;
firstGameContainer.appendChild(topFundedGame);

// do the same for the runner up item
const secondFundedGame = document.createElement("p");
secondFundedGame.innerHTML = secondGame.name;
secondGameContainer.appendChild(secondFundedGame);

/************************************************************************************/

function gameSearch() {
  var searchedGame = document.getElementById("searchInput").value.toLowerCase();
  var searchResults = GAMES_JSON.filter((game) =>
    game.name.toLowerCase().includes(searchedGame)
  );

  deleteChildElements(gamesContainer);

  addGamesToPage(searchResults);
}

document.getElementById("searchButton").addEventListener("click", gameSearch);
