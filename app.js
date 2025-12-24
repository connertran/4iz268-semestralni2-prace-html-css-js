const addCardsToHTMLSection = (cardsArr, numCards = cardsArr.length) => {
  // empty the section
  $("#popular-cards-section").empty();

  // add the cards to the section
  for (let i = 0; i < numCards; i++) {
    const card = cardsArr[i];
    const cardElement = document.createElement("div");
    const isLiked = checkIfCardIsLiked(card.card_image_id, card.card_image);
    const likeFunction = isLiked
      ? "dislikeCardLocalStorage"
      : "likeCardLocalStorage";
    const likeButtonText = isLiked ? "Unlike Card" : "Like Card";
    cardElement.innerHTML = `
    <div class="card-container">
            <img src="${
              card.card_image
            }" alt="${`${card.card_name} img`}" onclick="fetchIndividualCard('${
      card.card_image_id
    }', '${card.card_image}')">
    <div class="card-btns">
      <button class="card-btn" onclick="fetchIndividualCard('${
        card.card_image_id
      }', '${card.card_image}')">View Card</button>
      <button class="card-btn" onclick="${likeFunction}('${
      card.card_image_id
    }', '${card.card_image}')">${likeButtonText}</button>
      
    </div>
      </div>
    `;
    $("#popular-cards-section").append(cardElement);
  }
};

const fetchPopularCards = async () => {
  try {
    const popularCardsSetURL = "https://www.optcgapi.com/api/sets/OP-07/";
    const response = await axios.get(popularCardsSetURL);

    addCardsToHTMLSection(response.data, 20);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};

//fetch 20 popular cards when the homepage loads
fetchPopularCards();

const searchSpecificCard = async (event) => {
  try {
    // no default form reload
    event.preventDefault();
    const card_set_id = $("#search-card-input").val();
    const specificCardSetURL = `https://www.optcgapi.com/api/sets/card/${card_set_id}/`;
    const response = await axios.get(specificCardSetURL);
    const cardsArr = response.data;
    addCardsToHTMLSection(cardsArr);
    $("#search-card-input").val("");
  } catch (error) {
    alert("We couldn't find the card you're looking for.");
    console.error("Error searching for card:", error);
  }
};

// user's search submisstion homepage
$("#search-form").on("submit", searchSpecificCard);

const showSpecificCardInfo = async () => {
  try {
  } catch (error) {
    console.error("Error searching for card:", error);
  }
};

// Fetch card data from API
const fetchCardDataByImage = async (card_image_id, card_image) => {
  try {
    const individualCardURL = `https://www.optcgapi.com/api/sets/card/${card_image_id}/`;
    const response = await axios.get(individualCardURL);
    const cards = response.data;

    // Response is an array of cards. Find the specific card by matching card_image
    let individualCard = null;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].card_image === card_image) {
        individualCard = cards[i];
        break;
      }
    }
    if (!individualCard) {
      throw new Error("Card not found based on the image URL.");
    }
    return individualCard;
  } catch (error) {
    alert(
      "We are sorry, the OP-TCG API is currently having problems with this card. Please try a different card."
    );
    console.error("Error fetching card data:", error);
    throw error;
  }
};

// Fetch card data, localStorage, redirect to individual card page
const fetchIndividualCard = async (card_image_id, card_image) => {
  try {
    const individualCard = await fetchCardDataByImage(
      card_image_id,
      card_image
    );

    // Save to local storage, so the individual card page can access it
    localStorage.setItem("individualCard", JSON.stringify(individualCard));

    // Redirect user to the individual card page
    window.location.href = "IndividualCard.html";
  } catch (error) {
    console.error("Error fetching individual card:", error);
  }
};

const likeCardLocalStorage = async (card_image_id, card_image) => {
  try {
    const savingObj = { card_image_id, card_image };
    const likedCards = JSON.parse(localStorage.getItem("likedCards")) || [];
    likedCards.push(savingObj);
    localStorage.setItem("likedCards", JSON.stringify(likedCards));
    // Refresh the cards to see updated liked button
    fetchPopularCards();
  } catch (e) {
    console.error("Error liking card:", e);
  }
};

const dislikeCardLocalStorage = async (card_image_id, card_image) => {
  try {
    const likedCards = JSON.parse(localStorage.getItem("likedCards")) || [];
    if (likedCards.length === 0) return;

    const newLikedCards = likedCards.filter(
      (card) =>
        card.card_image_id !== card_image_id && card.card_image !== card_image
    );

    localStorage.setItem("likedCards", JSON.stringify(newLikedCards));
    // Refresh the cards to see updated liked button
    fetchPopularCards();
    // Refresh liked page in profile.html
    displayLikedCards();
  } catch (e) {
    console.error("Error disliking card:", e);
  }
};

const checkIfCardIsLiked = (card_image_id, card_image) => {
  try {
    const likedCards = JSON.parse(localStorage.getItem("likedCards")) || [];
    if (likedCards.length === 0) return false;
    for (let i = 0; i < likedCards.length; i++) {
      if (
        likedCards[i].card_image_id === card_image_id &&
        likedCards[i].card_image === card_image
      ) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if card is liked:", error);
    return false;
  }
};

export {
  likeCardLocalStorage,
  dislikeCardLocalStorage,
  checkIfCardIsLiked,
  fetchCardDataByImage,
  fetchIndividualCard,
};

// make functions globally -> incline onclick
window.likeCardLocalStorage = likeCardLocalStorage;
window.dislikeCardLocalStorage = dislikeCardLocalStorage;
window.fetchIndividualCard = fetchIndividualCard;
window.checkIfCardIsLiked = checkIfCardIsLiked;
