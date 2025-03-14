// Global variable
let myIconVis;

// Load data
d3.csv("data/icon-data.csv")
    .then(function(data) {
        data.forEach(d => {
            d.hostingFee = +d.hostingFee;
            d.ticketPrice = +d.ticketPrice;

        });

        // Initialize the page
        initMainPage(data);
    })

function initMainPage(data) {
    console.log("F1 data loaded:", data);

    // Create an instance of IconVis
    myIconVis = new IconVis("icon-place", "popup-place", data);
}

function sortBy(key) {
    myIconVis.sortBy(key);
}
