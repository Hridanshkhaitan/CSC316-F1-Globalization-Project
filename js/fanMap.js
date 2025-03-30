class FanMap {
    constructor(_parentElement, _data, _geoData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.geoData = _geoData;

        this.initVis();
    }

    initVis() {
        console.log(data);
        console.log("googledigoop");
        const vis = this;
    
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = 960 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
    
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);
    
        vis.projection = d3.geoMercator()
            .scale(130)
            .translate([vis.width / 2, vis.height / 1.5]);
    
        vis.path = d3.geoPath().projection(vis.projection);
    
        vis.svg.selectAll("path")
            .data(vis.geoData.features)
            .enter()
            .append("path")
            .attr("d", vis.path)
            .attr("fill", "white")
            .attr("stroke", "#333");

        vis.selectedYear = "2005";

        vis.colorScale = d3.scaleLinear()
            .domain([0, 8, 15, 100])
            .range(["blue", "green", "yellow", "red"]);


    const legendWidth = 40;
    const legendHeight = 200;

    const legendSvg = d3.select("#legendContainer")
        .append("svg")
        .attr("width", legendWidth + 50)
        .attr("height", legendHeight + 30);

    const defs = legendSvg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "legendGradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    gradient.selectAll("stop")
        .data([
            { offset: "0%", color: "blue" },
            { offset: "8%", color: "green" },
            { offset: "15%", color: "yellow" },
            { offset: "100%", color: "red" }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    legendSvg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legendGradient)");

    const legendScale = d3.scaleLinear()
        .domain([0, 100])
        .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
        .tickValues([0, 8, 15, 100])
        .tickFormat(d => d + "%");

    legendSvg.append("g")
        .attr("transform", `translate(${10 + legendWidth}, 10)`)
        .call(legendAxis);

            
        vis.wrangleData();
            
    }
    

    wrangleData() {
        const vis = this;

        vis.displayData = vis.data;
    
        vis.updateVis();
    }
    

    updateVis() {
        const vis = this;
    
        vis.dataByCountry = {};
        vis.displayData.forEach(d => {
            vis.dataByCountry[d.country] = d;
        });
    
        vis.svg.selectAll("path")
            .transition()
            .duration(500)
            .attr("fill", d => {
                const countryName = d.properties.name;
                const countryData = vis.dataByCountry[countryName];
            
                if (!countryData) {
                    console.log("No match in CSV for:", countryName);
                    return "grey";
                }
            
                const value = countryData[vis.selectedYear];
                
                if (value === null) {
                    console.log(`Missing value for ${countryName} in ${vis.selectedYear}`);
                    return "white";
                }
            
                return vis.colorScale(value);
            });
            
    }
    
    
}
