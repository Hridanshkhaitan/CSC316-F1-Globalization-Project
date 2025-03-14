// Global variable
let keyMarkets;
let viewershipInfo;

// Load data
d3.csv("data/DTS_Impact.csv")
    .then(function(data) {
        data.forEach(d => {
            d.percentage = +d.percentage;
        });

        // Initialize the page
        initMainPage(data);
    })

function initMainPage(data) {
    console.log("Data loaded:", data);

    // Create instances
    keyMarkets = new KeyMarkets("key-markets", data);
}
