import {
  fetchCardDataByImage,
  fetchIndividualCard,
  likeCardLocalStorage,
  dislikeCardLocalStorage,
  checkIfCardIsLiked,
} from "./app.js";

const selectedDeckName = localStorage.getItem("selectedDeckName");

const handleLikeCard = async (card_image_id, card_image) => {
  try {
    await likeCardLocalStorage(card_image_id, card_image);
    displayDeckCards();
  } catch (error) {
    console.error("Error liking card:", error);
  }
};

const handleUnlikeCard = async (card_image_id, card_image) => {
  try {
    await dislikeCardLocalStorage(card_image_id, card_image);
    displayDeckCards();
  } catch (error) {
    console.error("Error unliking card:", error);
  }
};

const removeCardFromDeck = (deckName, card_image_id, card_image) => {
  try {
    const decks = JSON.parse(localStorage.getItem("decks")) || [];
    let deckIndex = -1;

    for (let i = 0; i < decks.length; i++) {
      if (decks[i].name === deckName) {
        deckIndex = i;
        break;
      }
    }

    if (deckIndex === -1) {
      console.error("Deck not found:", deckName);
      return;
    }

    const newCards = [];
    for (let i = 0; i < decks[deckIndex].cards.length; i++) {
      const card = decks[deckIndex].cards[i];
      if (
        !(
          card.card_image_id === card_image_id && card.card_image === card_image
        )
      ) {
        newCards.push(card);
      }
    }
    decks[deckIndex].cards = newCards;

    localStorage.setItem("decks", JSON.stringify(decks));

    displayDeckCards();
  } catch (error) {
    console.error("Error removing card from deck:", error);
  }
};

const displayDeckCards = async () => {
  try {
    if (!selectedDeckName) {
      console.error("No deck name found");
      return;
    }

    $("#deck-title").text(selectedDeckName);

    const decks = JSON.parse(localStorage.getItem("decks")) || [];
    let deck = null;
    for (let i = 0; i < decks.length; i++) {
      if (decks[i].name === selectedDeckName) {
        deck = decks[i];
        break;
      }
    }

    if (!deck || !deck.cards || deck.cards.length === 0) {
      $("#deck-cards-section").addClass("no-cards").html(`
        <p>This deck is empty.</p>
        `);
      return;
    }

    $("#deck-cards-section").empty();
    // show all cards in the deck
    for (let i = 0; i < deck.cards.length; i++) {
      const cardData = deck.cards[i];
      try {
        const card = await fetchCardDataByImage(
          cardData.card_image_id,
          cardData.card_image
        );

        // liked card check
        const isLiked = checkIfCardIsLiked(card.card_image_id, card.card_image);
        const likeFunction = isLiked ? "handleUnlikeCard" : "handleLikeCard";
        const likeButtonText = isLiked ? "Unlike Card" : "Like Card";

        // Add card element to HTML
        const $cardElement = $("<div></div>");
        $cardElement.html(`
          <div class="deck-card-container">
            <img src="${card.card_image}" alt="${card.card_name} img">
            <div class="deck-card-btns">
              <button class="deck-card-btn" onclick="fetchIndividualCard('${card.card_image_id}', '${card.card_image}')">View Card</button>
              <button class="deck-card-btn" onclick="${likeFunction}('${card.card_image_id}', '${card.card_image}')">${likeButtonText}</button>
              <button class="deck-card-btn remove" onclick="removeCardFromDeck('${selectedDeckName}', '${card.card_image_id}', '${card.card_image}')">Remove from Deck</button>
            </div>
          </div>
        `);
        $("#deck-cards-section").append($cardElement);
      } catch (error) {
        console.error(`Error fetching card ${cardData.card_image_id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error displaying deck cards:", error);
  }
};

// global function -> inline onclick
window.removeCardFromDeck = removeCardFromDeck;
window.handleLikeCard = handleLikeCard;
window.handleUnlikeCard = handleUnlikeCard;

// show all cards in the deck when the page first loads
displayDeckCards();
