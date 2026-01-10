import {
  likeCardLocalStorage,
  dislikeCardLocalStorage,
  checkIfCardIsLiked,
} from "./app.js";

// avoid error if user isn't redirected from homepage, meaning no card object in the local storage, use default card object
const defaultCard = {
  inventory_price: 0.8,
  market_price: 0.81,
  card_name: "Roronoa Zoro (001)",
  set_name: "Romance Dawn",
  card_text: "[DON!! x1] [Your Turn] All of your Characters gain +1000 power.",
  set_id: "OP-01",
  rarity: "L",
  card_set_id: "OP01-001",
  card_color: "Red",
  card_type: "Leader",
  life: "5",
  card_cost: "NULL",
  card_power: "5000",
  sub_types: "Straw Hat Crew Supernovas",
  counter_amount: 0,
  attribute: "Slash",
  date_scraped: "2025-11-12",
  card_image_id: "OP01-001",
  card_image: "https://www.optcgapi.com/media/static/Card_Images/OP01-001.jpg",
};

const individualCard = JSON.parse(localStorage.getItem("individualCard"));

const handleLikeDislikeCard = async (card_image_id, card_image) => {
  try {
    const isLiked = checkIfCardIsLiked(card_image_id, card_image);
    if (isLiked) {
      await dislikeCardLocalStorage(card_image_id, card_image);
    } else {
      await likeCardLocalStorage(card_image_id, card_image);
    }

    const currentCard =
      JSON.parse(localStorage.getItem("individualCard")) || individualCard;
    // "refresh" page
    displayCardInfo(currentCard);
  } catch (error) {
    console.error("Error handling like/dislike:", error);
  }
};

const getAllDecks = () => {
  try {
    return JSON.parse(localStorage.getItem("decks")) || [];
  } catch (error) {
    console.error("Error getting decks:", error);
    return [];
  }
};

const addCardToDeck = (deckName, card_image_id, card_image) => {
  try {
    const decks = getAllDecks();
    let deckIndex = -1;

    for (let i = 0; i < decks.length; i++) {
      if (decks[i].name === deckName) {
        deckIndex = i;
        break;
      }
    }

    if (deckIndex === -1) {
      console.error("Can't find this deck in the local storage", deckName);
      return;
    }

    let cardExists = false;
    for (let i = 0; i < decks[deckIndex].cards.length; i++) {
      const card = decks[deckIndex].cards[i];
      if (
        card.card_image_id === card_image_id &&
        card.card_image === card_image
      ) {
        cardExists = true;
        break;
      }
    }

    if (!cardExists) {
      decks[deckIndex].cards.push({ card_image_id, card_image });
      localStorage.setItem("decks", JSON.stringify(decks));
      alert(`Card added to ${deckName}!`);
    } else {
      alert(`Card already exists in ${deckName}!`);
    }
  } catch (error) {
    console.error("Error adding card to deck:", error);
  }
};

const handleDeckSelection = (deckName, card_image_id, card_image) => {
  if (!deckName) return;

  if (deckName === "add-more-decks") {
    localStorage.setItem("showDeckSection", "true");
    window.location.href = "profile.html";
  } else {
    addCardToDeck(deckName, card_image_id, card_image);
    const $selectElement = $("#deck-select");
    if ($selectElement) {
      $selectElement.val("");
    }
  }
};

const displayCardInfo = (individualCard) => {
  $("#individual-card-section").empty();
  if (!individualCard || individualCard?.card_name === undefined) {
    individualCard = defaultCard;
  }

  const isLiked = checkIfCardIsLiked(
    individualCard.card_image_id,
    individualCard.card_image
  );
  const likeButtonText = isLiked ? "Unlike Card" : "Like Card";

  // add all decks to the dropdown (add to deck...)
  const decks = getAllDecks();
  let deckOptions = "";
  for (let i = 0; i < decks.length; i++) {
    deckOptions += `<option value="${decks[i].name}">${decks[i].name}</option>`;
  }
  deckOptions += `<option value="add-more-decks">Add More Decks</option>`;

  const cardInfo = `
    <div class="card-header">
      <p>${individualCard.card_image_id} | ${individualCard.rarity} | ${individualCard.card_color}</p>
      <h1>${individualCard.card_name}</h1>
    </div>
    
    <div class="card-content">
      <div class="card-image-container">
        <img src="${individualCard.card_image}" alt="${individualCard.card_name} img">
      </div>
      
      <div class="card-details">
        <div class="detail-row">
          <span class="detail-label">Type</span>
          <span class="detail-value">${individualCard.card_type}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Cost</span>
          <span class="detail-value">${individualCard.card_cost}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Life</span>
          <span class="detail-value">${individualCard.life}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Power</span>
          <span class="detail-value">${individualCard.card_power}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Attribute</span>
          <span class="detail-value">${individualCard.attribute}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sub Types</span>
          <span class="detail-value">${individualCard.sub_types}</span>
        </div>
        
        <div class="effect-section">
          <h3>Effect</h3>
          <div class="effect-text">${individualCard.card_text}</div>
        </div>
        
        <div class="card-actions">
          <button onclick="handleLikeDislikeCard('${individualCard.card_image_id}', '${individualCard.card_image}')">${likeButtonText}</button>
          <div class="deck-select-container">
            <label for="deck-select">Add to Deck</label>
            <select id="deck-select" onchange="handleDeckSelection(this.value, '${individualCard.card_image_id}', '${individualCard.card_image}')">
              <option value="">Select a deck...</option>
              ${deckOptions}
            </select>
          </div>
        </div>
      </div>
    </div>
    `;
  $("#individual-card-section").append(cardInfo);
};

// global function -> inline onclick
window.handleLikeDislikeCard = handleLikeDislikeCard;
window.handleDeckSelection = handleDeckSelection;

displayCardInfo(individualCard);
