class IconVis {
    constructor(parentElement, detailElement, data) {
        this.parentElement = parentElement;
        this.detailElement = detailElement;
        this.data = data;

        this.displayData = [...data];
        this.currentSorter = "hostingFee"

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
        vis.height = 800;

        // Create SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        //color scale
        vis.colorScale = d3.scaleSequential(d3.interpolateYlOrRd);

        // Continue to wrangleData
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //Grid parameters:
        const ncol = 4;
        const gap = 10;
        const iconDiameter = 110;
        const radius = iconDiameter / 2;

        // Colouring Icons
        const maxFee = d3.max(vis.displayData, d => d[vis.currentSorter]);
        vis.colorScale.domain([0, maxFee]);

        vis.displayData.sort((a, b) => a[vis.currentSorter] - b[vis.currentSorter]);


        // Data binding
        let icons = vis.svg.selectAll(".icon-circle").data(vis.displayData, d => d.id);

        // Enter
        let iconsEnter = icons.enter()
            .append("circle")
            .attr("class", "icon-circle")
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                vis.showDetails(d);
            });

        // Merge and update circles
        iconsEnter.merge(icons)
            .transition()
            .duration(1000)
            .attr("cx", (d, i) => (i % ncol) * (iconDiameter + gap) + radius)
            .attr("cy", (d, i) => Math.floor(i / ncol) * (iconDiameter + gap) + radius)
            .attr("r", radius)
            .attr("fill", d => vis.colorScale(d[vis.currentSorter]));

        icons.exit().remove();

        // Data binding for labels (race names)
        let labels = vis.svg.selectAll(".icon-label").data(vis.displayData, d => d.id);

        let labelsEnter = labels.enter()
            .append("text")
            .attr("class", "icon-label")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("pointer-events", "none")
            .text(d => d.ref);

        labelsEnter.merge(labels)
            .transition()
            .duration(1000)
            // Center the label inside the circle
            .attr("x", (d, i) => (i % ncol) * (iconDiameter + gap) + radius)
            .attr("y", (d, i) => Math.floor(i / ncol) * (iconDiameter + gap) + radius + 5);

        labels.exit().remove();
    }

    sortBy(key) {
        let vis = this;
        vis.currentSorter = key;
        vis.updateVis();
    }

    showDetails(d) {
        let detailDiv = document.getElementById(this.detailElement);
        detailDiv.innerHTML = `
        <img src="${d.trackImage}" alt="${d.name} Track" style="max-width:300px; display:block; margin-bottom:10px;">
        <h2>${d.name}</h2>
        <p><strong>Hosting Fee:</strong> $${d.hostingFee} million</p>
        <p><strong>Ticket Price:</strong> $${d.ticketPrice}</p>
        <p><strong>Revenue:</strong> ${d.revenue}</p>
        <p><strong>Fun Fact:</strong> ${d.funFact}</p>
    `;
    }

}
