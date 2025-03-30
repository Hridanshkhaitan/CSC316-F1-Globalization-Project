let Circ = true;
let nodes = [];


function start() {
    d3.csv("data/las_vegas_gp_impact.csv").then(data => {
        // Process data
        data.forEach(d => {
            d["Revenue (in million $)"] = +d["Revenue (in million $)"] / 10;
        });

        nodes = data.map(d => ({
            ...d,
            radius: calculateRadius(d["Revenue (in million $)"])
        }));

        // Create circle view
        createCircleView();

        // Set up toggle button
        setupToggleButton();

    });
}

// Calculate circle radius based on revenue
function calculateRadius(revenue) {
    const sizeScale = d3.scaleSqrt()
        .domain([0, 1500])
        .range([15, 200]);

    return sizeScale(revenue);
}

function setupToggleButton() {
    d3.select("#toggleEconomicView")
        .on("click", function() {
            if (Circ) {
                Circ = false;
                this.textContent = "Switch to Circles";
                showBarChart(nodes);
            } else {
                Circ = true;
                this.textContent = "Switch to Bar Chart";
                clearBarChartView();
                createCircleView();
            }
        });
}
document.addEventListener("DOMContentLoaded", function() {
    start();
});

function createCircleView() {

    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const container = document.getElementById("economicBreakdown");
    const chartContainer = container.getBoundingClientRect();
    const width = chartContainer.width - margin.left - margin.right;
    let height = 800;


    const svg = d3.select("#economicBreakdown")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");



    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select("#economicBreakdown")
        .append("div")
        .attr("class", "gp-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("z-index", 1000);

    // Youtube videos & ChatGPT helped with this making this sort of clumped circles thing
    const simulation = d3.forceSimulation(nodes)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.radius + 5).strength(0.8))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .on("tick", ticked);


    const bubbles = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => d.radius)
        .attr("fill", d => colorScale(d.Sector))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.Sector}</strong><br>
                    Impact: $${d["Revenue (in million $)"]}M
                `);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", (event.pageX - 400) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
            d3.select(this).attr("stroke-width", 2);
        });

    // Text Labels
    const labels = svg.selectAll("text.text-label")
        .data(nodes)
        .enter().append("text")
        .attr("class", "text-label")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "10px")
        .style("pointer-events", "none");

    // Make circle text appear in the circle
    function ticked() {
        bubbles.attr("cx", d => Math.max(d.radius, Math.min(width - d.radius, d.x)))
            .attr("cy", d => Math.max(d.radius, Math.min(height - d.radius, d.y)));


        labels.each(function (d) {
            const textElement = d3.select(this);


            textElement.selectAll("tspan").remove();
            textElement.text("");

            if (d.radius < 25) {
                textElement.style("display", "none");
                return;
            } else {
                textElement.style("display", "block");
            }

            const words = d.Sector.split(" ");
            const lineHeight = 12;
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                let testLine = currentLine + " " + words[i];

                if (testLine.length > 15) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            lines.forEach((line, i) => {
                textElement.append("tspan")
                    .text(line)
                    .attr("x", Math.max(d.radius, Math.min(width - d.radius, d.x)))
                    .attr("y", Math.max(d.radius, Math.min(height - d.radius, d.y + i * lineHeight)));
                // textElement.attr("text-anchor", "middle");
            });
        });

    }

}
