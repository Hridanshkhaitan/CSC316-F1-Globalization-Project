// Global variable
let valuations;

// Load data
d3.csv("data/valuations.csv")
    .then(function(data) {
        // Convert numeric columns from strings to numbers
        data.forEach(d => {
            d.valuation2019 = +d.valuation2019;
            d.valuation2023 = +d.valuation2023;
            d.valuationChange = +d.valuationChange;
            d.revenue2019 = +d.revenue2019;
            d.revenue2023 = +d.revenue2023;
            d.revenueChange = +d.revenueChange;
        });

        // Initialize the page with the loaded data
        initVisual3(data);
    })

function initVisual3(data) {

    // Create instances
    valuations = new Valuations("valuation-graph", data);
}
