class Valuations {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [...data];

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Define margins
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width =
            document.getElementById(vis.parentElement).getBoundingClientRect().width -
            vis.margin.left -
            vis.margin.right;
        vis.height = 600;

        console.log(vis.parentElement, "HELLO");

        // Create SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // Create a tooltip
        vis.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip-visual3")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        // Transform data for stacked chart
        vis.groupedData = vis.data.map(d => {
            return {
                team: d.team,
                teamIcon: d.icons,
                valuation: {"2023": d.valuation2023, "2019": d.valuation2019, "change": d.valuationChange },
                revenue: {"2023": d.revenue2023, "2019": d.revenue2019, "change": d.revenueChange },
            };
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;


        function getColor(measure, year) {
            // Valuation bars
            if (measure === "valuation" && year === "2019") return "#3498db"; // Blue
            if (measure === "valuation" && year === "2023") return "#2980b9"; // Darker Blue

            // Revenue bars
            if (measure === "revenue" && year === "2019") return "#e74c3c"; // Red
            if (measure === "revenue" && year === "2023") return "#CD2D1E"; // Darker Red
        }

        const measures = ["valuation", "revenue"];
        const years = ["2023", "2019"];

        // Scales
        vis.x0 = d3.scaleBand()
            .domain(vis.groupedData.map(d => d.team))
            .range([45, vis.width])
            .padding(0.2);

        vis.x1 = d3.scaleBand()
            .domain(measures)
            .range([0, vis.x0.bandwidth()])
            .padding(0.1);

        vis.y = d3.scaleLinear()
            .domain([0, 4000])
            .range([vis.height - 50, 0]);

        // Axes
        vis.xAxis = d3.axisBottom(vis.x0);
        vis.yAxis = d3.axisLeft(vis.y);

        // Append x-axis
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${vis.height - 50})`)
            .call(vis.xAxis);

        // Add logo of each team
        vis.xAxisGroup.selectAll(".tick")
            .each(function(teamName) {
                let teamData = vis.groupedData.find(d => d.team === teamName);
                let iconGroup = d3.select(this)
                    .append("g");

                // Icon
                iconGroup.append("image")
                    .attr("href", teamData.teamIcon)
                    .attr("width", 27)
                    .attr("height", 27)
                    .attr("x", -14)
                    .attr("y", 22);

                // Circle background
                iconGroup.append("rect")
                    .attr("width", 26)
                    .attr("height", 26)
                    .attr("x", -13)
                    .attr("y", 22)
                    .style("stroke", "#666");
            });

        // Append y-axis
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(50,0)")
            .call(vis.yAxis);

        // Y-axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -vis.height / 2)
            .style("text-anchor", "middle")
            .style("fill", "#e0e0e0")
            .text("Value ($M)");

        // Groups for each team
        let teamGroups = vis.svg.selectAll(".teamGroup")
            .data(vis.groupedData)
            .enter()
            .append("g")
            .attr("class", "teamGroup")
            .attr("transform", d => `translate(${vis.x0(d.team)}, 0)`);

        teamGroups.each(function(d) {
            let teamGroup = d3.select(this);
            measures.forEach(function(measure) {
                // Append a group for this measure
                let measureGroup = teamGroup.append("g")
                    .attr("class", measure)
                    .attr("transform", `translate(${vis.x1(measure)}, 0)`);

                let stackData = years.map(year => ({
                    year: year,
                    value: d[measure][year]
                }));

                // Stack the segments
                measureGroup.selectAll("rect")
                    .data(stackData)
                    .enter()
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", function(d) {
                        return vis.y(d.value);
                    })
                    .attr("width", vis.x1.bandwidth())
                    .attr("height", function(d) {
                        return vis.height - vis.y(d.value) - 50;
                    })
                    .attr("fill", d => getColor(measure, d.year))
                    // Tooltip
                    .on("mouseover", function() {
                        let teamData = measureGroup.selectAll("rect").data();
                        let diff = teamData[0].value - teamData[1].value;
                        const measureLabel = (measure === "valuation") ? "Valuation" : "Revenue";

                        const percentChange = d[measure]["change"];
                        const changeColor = "#4caf50";

                        // Build HTML
                        vis.tooltip.html(`
                          <div>
                            <img src="${d.teamIcon}" width="30" height="30"/>
                            <strong>${d.team}</strong>
                          </div>
                          <div><strong>${measureLabel} 2023:</strong> $${teamData[0].value}M</div>
                          <div><strong>${measureLabel} 2019:</strong> $${teamData[1].value}M</div>
                          <div><strong>Change:</strong> <span style="color:${changeColor}">$${diff}M (${percentChange}%)</span></div>
                        `);

                        // Show tooltip
                        vis.tooltip
                            .style("opacity", 1);
                    })
                    .on("mousemove", function(event) {
                        vis.tooltip
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY + 10) + "px");
                    })
                    .on("mouseout", function() {
                        vis.tooltip
                            .style("opacity", 0);
                    });
            });
        });

        // Legend
        const legendItems = [
            { label: "Valuation 2019", color: "#3498db" },
            { label: "Valuation 2023", color: "#2980b9" },
            { label: "Revenue 2019",  color: "#e74c3c" },
            { label: "Revenue 2023",  color: "#CD2D1E" }
        ];

        vis.legend = vis.svg.selectAll(".legend")
            .data(legendItems)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        vis.legend.append("rect")
            .attr("x", vis.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", d => d.color);

        vis.legend.append("text")
            .attr("x", vis.width - 24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .text(d => d.label);
    }
}
