import {
  fetchCardDataByImage,
  dislikeCardLocalStorage,
  fetchIndividualCard,
} from "./app.js";

const displayLikedCards = async () => {
  try {
    $("#deck-section").hide();
    $("#liked-cards-section").show();
    $("#liked-cards-container").empty();
    const likedCards = JSON.parse(localStorage.getItem("likedCards")) || [];
    for (let i = 0; i < likedCards.length; i++) {
      const card = await fetchCardDataByImage(
        likedCards[i].card_image_id,
        likedCards[i].card_image
      );
      const $cardElement = $("<div></div>");
      $cardElement.html(`
        <div class="card-container">
          <img src="${card.card_image}" alt="${card.card_name} img">
          <div class="card-btns">
            <button class="card-btn" onclick="fetchIndividualCard('${card.card_image_id}', '${card.card_image}')">View Card</button>
            <button class="card-btn" onclick="dislikeCardLocalStorage('${card.card_image_id}', '${card.card_image}')">Unlike Card</button>
          </div>
        </div>
      `);
      $("#liked-cards-container").append($cardElement);
    }
  } catch (error) {
    console.error("Error displaying liked cards:", error);
  }
};

const displayDecks = () => {
  try {
    $("#deck-container").empty();
    const decks = JSON.parse(localStorage.getItem("decks")) || [];
    for (let i = 0; i < decks.length; i++) {
      const deck = decks[i];
      const $deckElement = $('<div class="individual-deck-div"></div>');
      $deckElement.html(`
        <h3>${deck.name}</h3>
        <button class="card-btn" onclick="viewDeck('${deck.name}')">View Deck</button>
        <button class="card-btn" onclick="deleteDeck('${deck.name}')">Delete Deck</button>
      `);
      $("#deck-container").append($deckElement);
    }
  } catch (error) {
    console.error("Error displaying decks:", error);
  }
};

const toggleToDeck = () => {
  $("#deck-section").show();
  $("#liked-cards-section").hide();
  displayDecks();
};

const toggleToLikedCards = () => {
  $("#deck-section").hide();
  $("#liked-cards-section").show();
  displayLikedCards();
};

// check for redirection from other pages
const showDeckSection = localStorage.getItem("showDeckSection");
if (showDeckSection === "true") {
  localStorage.removeItem("showDeckSection");
  toggleToDeck();
} else {
  displayLikedCards();
}

$("#add-deck-form").on("submit", addDeck);
function addDeck(event) {
  event.preventDefault();
  const deckName = $("#deck-name-input").val();
  const deck = {
    name: deckName,
    cards: [],
  };
  const decks = JSON.parse(localStorage.getItem("decks")) || [];
  decks.push(deck);
  localStorage.setItem("decks", JSON.stringify(decks));
  $("#deck-name-input").val("");
  displayDecks();
}

const viewDeck = (deckName) => {
  localStorage.setItem("selectedDeckName", deckName);
  window.location.href = "IndividualDeck.html";
};

const deleteDeck = (deckName) => {
  const decks = JSON.parse(localStorage.getItem("decks")) || [];
  const newDecks = decks.filter((deck) => deck.name !== deckName);
  localStorage.setItem("decks", JSON.stringify(newDecks));
  displayDecks();
};

// global function -> inline onclick
window.toggleToDeck = toggleToDeck;
window.toggleToLikedCards = toggleToLikedCards;
window.displayLikedCards = displayLikedCards;
window.deleteDeck = deleteDeck;
window.viewDeck = viewDeck;
