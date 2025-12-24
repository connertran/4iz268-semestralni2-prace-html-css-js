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

const displayCardInfo = (individualCard) => {
  $("#individual-card-section").empty();
  if (!individualCard || individualCard?.card_name === undefined) {
    individualCard = defaultCard;
  }
  const cardInfo = `
    <h2>${individualCard.card_name}</h2>
    <img src="${individualCard.card_image}" alt="${individualCard.card_name} img">
    
    `;
  $("#individual-card-section").append(cardInfo);
};

displayCardInfo(individualCard);
