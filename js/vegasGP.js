let Circ = true;
let nodes = [];


function start() {
    d3.csv("data/las_vegas_gp_impact.csv").then(data => {
    if (!data || data.length === 0) {
        console.error("CSV did not load correctly or is empty.");
        return;
    }

    // numbers are 10x in csv so that they are all integers
    data.forEach(d => {
        d["Revenue (in million $)"] = +d["Revenue (in million $)"] / 10;
    });

    const VERTICAL_SHIFT = -210;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartContainer = document.getElementById("chart");

    if (!chartContainer) {
        console.error("Chart container not found.");
        return;
    }

    const width = window.innerWidth - margin.left - margin.right;
    let height = window.innerHeight * 2; 

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");

    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d["Revenue (in million $)"])])
        .range([12, 240]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    
    nodes = data.map(d => ({
        ...d,
        radius: sizeScale(d["Revenue (in million $)"])
    }));

    // Youtube videos & ChatGPT helped with this making this sort of clumped circles thing
    const simulation = d3.forceSimulation(nodes)
        .force("center", d3.forceCenter(width / 2, height / 2 + VERTICAL_SHIFT))
        .force("collide", d3.forceCollide().radius(d => d.radius + 5).strength(1)) 
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .on("tick", ticked);

    const tooltip = d3.select("#section7")
        .append("div")
        .attr("class", "gp-tooltip");
    

    const bubbles = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => d.radius)
        .attr("fill", d => colorScale(d.Sector))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.Sector}</strong><br>
                    Revenue: $${d["Revenue (in million $)"]}M
                `);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("stroke-width", 2);
        });

        const labels = svg.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "text-label"); 
    

        // Make circle text appear in the circle 
        function ticked() {
            bubbles.attr("cx", d => d.x).attr("cy", d => d.y + VERTICAL_SHIFT);
        
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
                const lineHeight = 14;
                const radius = d.radius * 0.6;
                let yOffset = -(words.length - 1) * lineHeight / 2;
        
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
                        .attr("x", d.x)
                        .attr("y", d.y  + i * lineHeight + VERTICAL_SHIFT)
                        textElement.attr("text-anchor", "middle");
                });
            });
        
            adjustSVGHeight();
        }
        
        
    function adjustSVGHeight() {
        const maxY = d3.max(nodes, d => d.y + d.radius + VERTICAL_SHIFT);
        svg.attr("height", Math.max(window.innerHeight, maxY + 50));
    }

});
}

document.getElementById("toggleChart").addEventListener("click", function () {

    if (!Circ) {
        Circ = true;
        console.log("We have called this thing");
        this.textContent = "Switch to Bar Chart";
        clearBarChart();
        d3.select("#chart").html("");

        d3.selectAll("#section7 .gp-tooltip").remove();

        d3.select("#chart").attr("data-view", null);
        

        start();
    } else {
        Circ = false;
        showBarChart(nodes);
        this.textContent = "Switch to Circles";
        d3.select("#chart").attr("data-view", "bars");
    }
});

start()