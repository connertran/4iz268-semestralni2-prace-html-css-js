const displayLikedCards = async () => {
  try {
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
displayLikedCards();
