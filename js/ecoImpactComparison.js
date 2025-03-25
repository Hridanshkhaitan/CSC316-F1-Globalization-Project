class EcoVis {
    constructor(parentElement, data) {
      this.parentElement = parentElement;
      this.data = data;
      this.useLogScale = false;
      this.colorBy = "Country";

  
      this.initVis();
    }
  
    initVis() {
        console.log("yup");
        let vis = this;
      
        vis.margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const container = document.getElementById(vis.parentElement);
        const bounds = container.getBoundingClientRect();

        vis.width = bounds.width - vis.margin.left - vis.margin.right -30;
        vis.height = bounds.height - vis.margin.top - vis.margin.bottom;

      
        vis.svg = d3.select(`#${vis.parentElement}`)
          .append("svg")
          .attr("width", vis.width + vis.margin.left + vis.margin.right)
          .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
          .append("g")
          .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);
      
        vis.xScale = d3.scaleLinear()
          .range([0, vis.width]);

    
        vis.rScale = d3.scaleSqrt()
          .range([4, 20]);
        
        vis.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        const countries = [...new Set(vis.data.map(d => d.Country))];
        vis.colorScale.domain(countries);
      
        vis.xAxis = d3.axisBottom(vis.xScale);
      
        vis.svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${vis.height / 2})`);

        vis.tooltip = d3.select("body").append("div")
          .attr("class", "eco-tooltip")
          .style("position", "absolute")
          .style("padding", "8px")
          .style("background", "rgba(0,0,0,0.7)")
          .style("color", "white")
          .style("border-radius", "4px")
          .style("pointer-events", "none")
          .style("font-size", "12px")
          .style("display", "none");
        
        vis.svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "black");

        vis.svg.append("line")
            .attr("class", "x-axis-arrow")
            .attr("x1", 0)
            .attr("x2", vis.width)
            .attr("y1", vis.height / 2)
            .attr("y2", vis.height / 2)
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#arrowhead)");

        vis.svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", vis.width)
            .attr("y", vis.height / 2 + 40)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text("Estimated Economic Impact ($M)");
          

      
        vis.wrangleData();
      }
      
  
      wrangleData() {
        let vis = this;
        vis.displayData = vis.data; 
        vis.updateVis();
      }
      
  
      updateVis() {
        let vis = this;
      
        const impactAccessor = d => d["Estimated Economic Impact ($ Millions)"];
        const impactExtent = d3.extent(vis.displayData, impactAccessor);
      
        // Set xScale based on toggle
        if (vis.useLogScale) {
          vis.xScale = d3.scaleLog()
            .range([0, vis.width])
            .domain([Math.max(1, impactExtent[0]), impactExtent[1]]);
        } else {
          vis.xScale = d3.scaleLinear()
            .range([0, vis.width])
            .domain([0, impactExtent[1]]);
        }

        const colorKey = vis.colorBy;
        const colorDomain = [...new Set(vis.displayData.map(d => d[colorKey]))];
        vis.colorScale.domain(colorDomain);

        vis.xAxis.scale(vis.xScale);
      
        // Update radius scale
        vis.rScale.domain(impactExtent);
      
        // Update x-axis
        vis.svg.select(".x-axis")
          .transition()
          .duration(500)
          .call(vis.xAxis);
      
        // Data binding
        const circles = vis.svg.selectAll(".race-circle")
          .data(vis.displayData, d => d["Race Name"]);
      
        // Enter
        const circlesEnter = circles.enter()
          .append("circle")
          .attr("class", "race-circle")
          .attr("cy", vis.height / 2)
          .attr("r", d => vis.rScale(impactAccessor(d)))
          .attr("fill", d => vis.colorScale(d[colorKey]))
          .attr("stroke", "#333")
          .attr("stroke-width", 1)
          .attr("opacity", 0.85)
          .on("mouseover", (event, d) => {
            vis.tooltip
              .style("display", "block")
              .html(
                `<strong>${d["Race Name"]}</strong><br>
                Country: ${d.Country}<br>
                Impact: $${d["Estimated Economic Impact ($ Millions)"]}M<br>
                Year: ${d.Year}`
              );
          })
          .on("mousemove", (event) => {
            vis.tooltip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseleave", () => {
            vis.tooltip.style("display", "none");
          });
      
        // Enter + Update
        circlesEnter.merge(circles)
            .transition()
            .duration(500)
            .attr("cx", d => vis.xScale(impactAccessor(d)))
            .attr("fill", d => vis.colorScale(d[colorKey]));

      
        // Exit
        circles.exit().remove();
      }
      
      
  }
  