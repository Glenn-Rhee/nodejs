async function getAllPizzas() {
    try {
        const url = "https://pizza-and-desserts.p.rapidapi.com/pizzas";
        const options = {
            method: "GET",
            headers: {
                'X-RapidAPI-Key': '4cba541e3bmsh8cb4734c2fa47b7p1759e8jsn7456e76b7da2',
                'X-RapidAPI-Host': 'pizza-and-desserts.p.rapidapi.com'
            }
        }
        const result = await fetch(url, options);
        const data = await result.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { getAllPizzas };
