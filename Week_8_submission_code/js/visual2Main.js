// Global variable
let keyMarkets;
let viewershipInfo;

// Load data
d3.csv("data/DTS_Impact.csv")
    .then(function(data1) {
        data1.forEach(d => {
            d.percentage = +d.percentage;
        });

        // Initialize the page
        initVisual2(data1);
    })

function initVisual2(data1) {
    console.log("Data loaded:", data1);

    // Create instances
    keyMarkets = new KeyMarkets("key-markets", data1);
}
