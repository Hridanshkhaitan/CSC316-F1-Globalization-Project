class IconVis {
    constructor(parentElement, detailElement, data) {
        this.parentElement = parentElement;
        this.detailElement = detailElement;
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
        vis.height = 400;

        // Create SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // A color scale (example from red-yellow-green)
        vis.colorScale = d3.scaleSequential(d3.interpolateRdYlGn);

        // Continue to wrangleData
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Define grid parameters:
        const ncol = 4;
        const gap = 20;
        const iconHeight = 40;
        const iconWidth = (vis.width - (ncol - 1) * gap) / ncol;

        // For coloring, base it on hostingFee
        const maxFee = d3.max(vis.displayData, d => d.hostingFee);
        vis.colorScale.domain([maxFee, 0]);

        // Data binding for icons (rectangles)
        let icons = vis.svg.selectAll(".icon-rect").data(vis.displayData, d => d.id);

        // Enter new icons
        let iconsEnter = icons.enter()
            .append("rect")
            .attr("class", "icon-rect")
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                vis.showDetails(d);
            });

        // Merge and update icons with a grid layout
        iconsEnter.merge(icons)
            .transition()
            .duration(1000)
            .attr("x", (d, i) => (i % ncol) * (iconWidth + gap))
            .attr("y", (d, i) => Math.floor(i / ncol) * (iconHeight + gap))
            .attr("width", iconWidth)
            .attr("height", iconHeight)
            .attr("rx", iconHeight / 2)
            .attr("fill", d => vis.colorScale(d.hostingFee));

        icons.exit().remove();

        // Data binding for labels (race names)
        let labels = vis.svg.selectAll(".icon-label").data(vis.displayData, d => d.id);

        let labelsEnter = labels.enter()
            .append("text")
            .attr("class", "icon-label")
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("pointer-events", "none")
            .text(d => d.name);

        labelsEnter.merge(labels)
            .transition()
            .duration(1000)
            .attr("x", (d, i) => (i % ncol) * (iconWidth + gap) + iconWidth / 2)
            .attr("y", (d, i) => Math.floor(i / ncol) * (iconHeight + gap) + iconHeight / 2 + 5);

        labels.exit().remove();
    }

    sortBy(key) {
        let vis = this;
        vis.displayData.sort((a, b) => a[key] - b[key]);
        vis.updateVis();
    }

    showDetails(d) {
        let detailDiv = document.getElementById(this.detailElement);
        detailDiv.innerHTML = `
            <h3>${d.name}</h3>
            <img src="${d.trackImage}" alt="${d.name} Track" style="max-width:300px; display:block; margin-bottom:10px;">
            <p><strong>Hosting Fee:</strong> ${d.hostingFee}</p>
            <p><strong>Ticket Price:</strong> ${d.ticketPrice}</p>
            <p><strong>Revenue:</strong> ${d.revenue}</p>
            <p><strong>Fun Fact:</strong> ${d.funFact}</p>
        `;
    }
}
