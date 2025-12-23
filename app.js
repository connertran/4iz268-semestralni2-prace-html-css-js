const fetchCards = async () => {
  try {
    const response = await axios.get(
      "https://optcgapi.com/api/sets/card/OP01-001/"
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};
