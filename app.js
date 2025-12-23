const addCardsToHTMLSection = (cardsArr, numCards = cardsArr.length) => {
  // empty the section
  $("#popular-cards-section").empty();

  // add the cards to the section
  for (let i = 0; i < numCards; i++) {
    const card = cardsArr[i];
    const cardElement = document.createElement("div");
    cardElement.innerHTML = `
            <img src="${card.card_image}" alt="${`${card.card_name} img`}">
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
