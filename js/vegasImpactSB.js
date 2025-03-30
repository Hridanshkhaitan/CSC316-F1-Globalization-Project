// Global variable
let economicImpactChart;

// Load data
d3.csv("data/vegasSB.csv")
    .then(function(data) {
        data.forEach(d => {
            d.value = +d.value;
        });

        // Initialize the page
        initEconomicImpactChart(data);
    })

function initEconomicImpactChart(data) {

    // Create an instance
    economicImpactChart = new EconomicImpactChart("economicImpactSB", data);
}

class EconomicImpactChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [...data];

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Define margins
        vis.margin = { top: 40, right: 120, bottom: 60, left: 120 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width -
            vis.margin.left - vis.margin.right;
        vis.height = 400;

        // Create SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);


        // Initialize axes
        vis.xAxis = vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${vis.height})`);

        vis.yAxis = vis.svg.append("g")
            .attr("class", "y-axis");

        // X-axis label (values)
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 40)
            .attr("class", "axis-label")
            .style("text-anchor", "middle")
            .text("Economic Impact (Billions $)");

        // Call wrangle data
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData.sort((a, b) => b.value - a.value);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Define scales
        vis.x = d3.scaleLinear()
            .domain([0, d3.max(vis.displayData, d => d.value) ])
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .domain(vis.displayData.map(d => d.event))
            .range([0, vis.height])
            .padding(0.3);

        // Call axes
        vis.xAxis.call(d3.axisBottom(vis.x)
            .ticks(3)
            .tickFormat(d => '$' + d + 'B'));

        vis.yAxis.call(d3.axisLeft(vis.y));

        vis.svg.selectAll(".y-axis text")
            .style("font-size", "14px")
            .style("fill", "white");

        // Select all bars
        let bars = vis.svg.selectAll(".impact-bar")
            .data(vis.displayData);

        // Add new bars
        let barsEnter = bars.enter()
            .append("rect")
            .attr("class", "impact-bar");

        // Update all bars
        bars = barsEnter.merge(bars)
            .attr("x", 0)
            .attr("y", d => vis.y(d.event))
            .attr("height", vis.y.bandwidth())
            .attr("fill", d => d.color)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("width", d => vis.x(d.value));


        // Remove
        bars.exit().remove();

        // Bar Labels
        let valueLabels = vis.svg.selectAll(".value-label")
            .data(vis.displayData);

        let valueLabelsEnter = valueLabels.enter()
            .append("text")
            .attr("class", "value-label");

        valueLabels = valueLabelsEnter.merge(valueLabels)
            .attr("x", d => vis.x(d.value) + 10)
            .attr("y", d => vis.y(d.event) + vis.y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-weight", "bold")
            .text(d => `$${d.value}B`);

        // Remove
        valueLabels.exit().remove();

    }
}