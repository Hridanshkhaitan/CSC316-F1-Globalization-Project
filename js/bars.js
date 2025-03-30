function showBarChart(data) {
    console.log("triggered", data);

    const margin = { top: 50, right: 20, bottom: 100, left: 60 };
    const container = document.getElementById("economicBreakdown");
    const containerRect = container.getBoundingClientRect();


    const width = containerRect.width - margin.left - margin.right;
    const height = 800;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Clear previous content
    d3.select("#economicBreakdown").selectAll("svg").remove();
    d3.select("#economicBreakdown").selectAll(".gp-tooltip").remove();


    const svg = d3.select("#economicBreakdown")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");

    // Create tooltip
    const tooltip = d3.select("#economicBreakdown")
        .append("div")
        .attr("class", "gp-tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("z-index", 1000);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Sector))
        .range([margin.left, width + margin.left])
        .padding(0.2);

    const yScale = d3.scaleLog()
        .domain([
            Math.max(0.1, d3.min(data, d => d["Revenue (in million $)"])),
            d3.max(data, d => d["Revenue (in million $)"])
        ])
        .range([height - 100, 100]);

    const yAxis = d3.axisLeft(yScale)
        .tickValues([1, 10, 100, 1000])
        .tickFormat(d3.format("~s"))
        .tickSize(-width);

// make axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#444")
            .attr("stroke-dasharray", "2,2"))
        .call(g => g.selectAll("text")
            .attr("fill", "#ccc")
            .style("font-size", "12px"))
        .call(g => g.select(".domain").remove());



    // Create bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Sector))
        .attr("y", height - margin.bottom)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", d => colorScale(d.Sector))
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.Sector}</strong><br>
                    Impact: $${d["Revenue (in million $)"]}M
                `);
            d3.select(this).attr("opacity", 0.8);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX -410) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("opacity", 1);
        })
        .transition()
        .duration(1000)
        .attr("y", d => yScale(Math.max(0.1, d["Revenue (in million $)"])))
        .attr("height", d => height - margin.bottom - yScale(Math.max(0.1, d["Revenue (in million $)"])));

// Labels
    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.Sector) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(Math.max(0.1, d["Revenue (in million $)"])) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#ccc")

        .text(d => `$${d["Revenue (in million $)"]}M`);


// x axis
    const xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .style("fill", "#ccc")
        .style("font-size", "10px");
}

function clearBarChartView() {
    d3.select("#economicBreakdown").selectAll("svg").remove();
    d3.select("#economicBreakdown").selectAll(".gp-tooltip").remove();
}
