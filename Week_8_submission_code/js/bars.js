function showBarChart(data) {
    console.log("triggered", data);

    const svg = d3.select("#chart svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    const margin = { left: 100, right: 100, bottom: 50, top: 50 }; 

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Sector))
        .range([margin.left + 100, width - margin.right - 100])
        .padding(0.2);


    const yScale = d3.scaleLog()
        .domain([Math.max(0.1, d3.min(data, d => d["Revenue (in million $)"])), d3.max(data, d => d["Revenue (in million $)"])])
        .range([height - 100, 100]);

    const yAxis = d3.axisLeft(yScale)
        .tickValues([1, 10, 100, 1000, 10000, 100000]) 
        .tickFormat(d3.format("~s"))
        .tickSize(0);
    
// make axis
    svg.selectAll(".y-axis").remove();
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left + 80},0)`)
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "12px");
    


    svg.selectAll("text:not(.y-axis text)")
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();

    // Transition circles into bars
    svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", d => xScale(d.Sector) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d["Revenue (in million $)"]))
        .attr("r", 0)
        .remove();

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.Sector))
        .attr("y", height - 100)
        .attr("width", xScale.bandwidth() * 0.6)
        .attr("height", 0)
        .attr("fill", d => colorScale(d.Sector))
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d["Revenue (in million $)"])) 
        .attr("height", d => Math.max(5, height - 100 - yScale(d["Revenue (in million $)"]))); 


    const lastRevenue = data[data.length - 1]["Revenue (in million $)"];
    const lastBarHeight = Math.max(5, height - 100 - yScale(lastRevenue));
    const lastBarY = yScale(lastRevenue); 

// Fill in empty space that is caused by log(0.3)<0
    svg.selectAll(".duplicate-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "duplicate-bar")
        .attr("x", d => xScale(d.Sector))
        .attr("y", lastBarY) 
        .attr("width", xScale.bandwidth() * 0.6)
        .attr("height", lastBarHeight)
        .attr("fill", d => colorScale(d.Sector)); 

// Labels
    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.Sector) + xScale.bandwidth() / 2)
        .attr("y", height - 105)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => `$${d["Revenue (in million $)"]}M`)
        .transition()
        .duration(1000)
        .attr("y", d => Math.max(20, yScale(d["Revenue (in million $)"]) - 5));


// x axis
    const xAxis = d3.axisBottom(xScale);


    svg.selectAll(".x-axis").remove();
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${margin.left - 120}, ${height - 95})`) 
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px")
        .style("text-anchor", "end") 
        .attr("transform", "rotate(-10)")
        .attr("dx", "60px") 
        .attr("dy", "10px");
}
