class RevenueVis {
    constructor(parentElement, data) {
      this.parentElement = parentElement;
      this.data = data;
      this.initVis();
    }
  
    initVis() {
      let vis = this;
  
      vis.margin = { top: 30, right: 60, bottom: 40, left: 60 };
      const container = document.getElementById(vis.parentElement);
      const bounds = container.getBoundingClientRect();
  
      vis.width = bounds.width - vis.margin.left - vis.margin.right;
      vis.height = bounds.height - vis.margin.top - vis.margin.bottom;
  
      vis.svg = d3.select(`#${vis.parentElement}`)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);
  
      vis.xScale = d3.scaleLinear().range([0, vis.width]);
      vis.yScale = d3.scaleLinear().range([vis.height, 0]);
  
      vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.format("d"));
      vis.yAxis = d3.axisLeft(vis.yScale);
  
      vis.svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${vis.height})`);
      vis.svg.append("g").attr("class", "y-axis");
  
      vis.svg.append("text")
        .attr("x", vis.width / 2)
        .attr("y", vis.height + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .style("fill", "white")
        .text("Year");
  
      vis.svg.append("text")
        .attr("x", -vis.height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "14px")
        .style("fill", "white")
        .text("Revenue ($ Millions)");
  
      vis.wrangleData();
    }
  
    wrangleData() {
      let vis = this;


      vis.displayData = vis.data
        .map(d => ({
          year: +d["Year"],
          revenue: +d["Fy"]
        }))
        .filter(d => !isNaN(d.year) && !isNaN(d.revenue));
  
      vis.updateVis();
    }
  
    updateVis() {
      let vis = this;
  
      const xExtent = d3.extent(vis.displayData, d => d.year);
      const yMax = d3.max(vis.displayData, d => d.revenue);

      vis.xScale.domain(xExtent);
      vis.yScale.domain([0, yMax]);

      vis.xAxis = d3.axisBottom(vis.xScale)
        .tickFormat(d3.format("d"))
        .tickValues(vis.displayData.map(d => d.year));

  
      vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);
      vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);
  
      vis.svg.selectAll(".x-axis path, .x-axis line, .y-axis path, .y-axis line")
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    
      vis.svg.selectAll(".x-axis text, .y-axis text")
        .attr("fill", "white")
        .attr("font-size", "13px");
    

      const line = d3.line()
        .x(d => vis.xScale(d.year))
        .y(d => vis.yScale(d.revenue));
  
      const path = vis.svg.selectAll(".revenue-line").data([vis.displayData]);
  
      path.enter()
        .append("path")
        .attr("class", "revenue-line")
        .merge(path)
        .transition()
        .duration(500)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 4);

    
    vis.svg.append("line")
      .attr("x1", vis.xScale(2019.5))
      .attr("x2", vis.xScale(2019.5))
      .attr("y1", vis.yScale(0) - 30)       
      .attr("y2", vis.yScale(1400))    
      .attr("stroke", "white")
      .attr("stroke-dasharray", "3,3");

    vis.svg.append("text")
      .attr("x", vis.xScale(2019.5))
      .attr("y", vis.yScale(0) - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("fill", "white")
      .text("COVID-19 Pandemic");

    vis.svg.append("line")
      .attr("x1", vis.xScale(2022.5))
      .attr("x2", vis.xScale(2022.5))
      .attr("y1", vis.yScale(3600))         
      .attr("y2", vis.yScale(3200))     
      .attr("stroke", "white")
      .attr("stroke-dasharray", "3,3");

    vis.svg.append("text")
      .attr("x", vis.xScale(2022.5))
      .attr("y", vis.yScale(3600) - 6)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("fill", "white")
      .text("Reintroduction of Las Vegas GP");

    vis.svg.selectAll("#revenue-info-button").remove();
    vis.svg.selectAll("#revenue-info-text").remove();



    const infoX = vis.xScale(2022.5);
    const infoY = vis.yScale(2900);


    vis.svg.append("circle")
      .attr("cx", infoX)
      .attr("cy", infoY)
      .attr("r", 12)
      .attr("fill", "white");

    vis.svg.append("circle")
      .attr("id", "revenue-info-button")
      .attr("cx", infoX)
      .attr("cy", infoY)
      .attr("r", 10)
      .attr("fill", "#e63946")
      .attr("cursor", "pointer");

    vis.svg.append("text")
      .attr("id", "revenue-info-text")
      .attr("x", infoX)
      .attr("y", infoY + 3)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .attr("pointer-events", "none")
      .text("!");
        
      
      
    path.exit().remove();
    }
  }
  