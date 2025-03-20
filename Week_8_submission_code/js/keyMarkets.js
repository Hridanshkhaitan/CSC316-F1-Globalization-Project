class KeyMarkets {
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
        vis.height = 800;

        // Create SVG drawing area
        vis.svg = d3
            .select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = vis.displayData.slice(0, 3);

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        // Height of cards
        const maxValue = d3.max(vis.displayData, d => d.percentage);
        vis.heightScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([80, 220]);

        // Card dimensions
        const cardWidth = 280;
        const cardSpacing = 20;
        const rowSpacing = 20;
        const headerOffset = 50;

        // Text above cards
        let headerGroup = vis.svg.selectAll(".header-group").data([null]);
        let headerGroupEnter = headerGroup.enter()
            .append("g")
            .attr("class", "header-group")
            .merge(headerGroup);

        // First line
        headerGroupEnter.append("text")
            .style("font-size", "20px")
            .style("font-weight", "700")
            .text("WHERE DID DRIVE TO SURVIVE HAVE THE MOST IMPACT?");

        // Second line
        headerGroupEnter.append("text")
            .attr("y", 35)
            .style("font-size", "16px")
            .style("font-weight", "400")
            // .style("font-family", "Arial, sans-serif")
            .text("GEOGRAPHICAL LOCATION OF NEW FANS");

        // Card dimensions
        let row1Height = vis.heightScale(vis.displayData[0].percentage);
        let row2Y = headerOffset + row1Height + rowSpacing;
        let totalRow2Width = cardWidth * 2 + cardSpacing;
        let row2XStart = (vis.width - totalRow2Width) / 2;


        let cards = vis.svg.selectAll(".market-card")
            .data(vis.displayData, d => d.country);
        // ENTER
        let cardsEnter = cards.enter()
            .append("g")
            .attr("class", "market-card")
            .style("cursor", "pointer")

        // Append card background rectangle
        cardsEnter.append("rect")
            .attr("class", "card-bg")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", "#F7F5F0")
            .attr("stroke", "#ccc");


        // Country Text
        cardsEnter.append("text")
            .attr("class", "card-country")
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("font-weight", "700")
            .attr("fill", "#333");

        // Fan Percentage Text
        cardsEnter.append("text")
            .attr("class", "card-fans")
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "#e74c3c");

        // ENTER
        let cardsMerge = cardsEnter.merge(cards);

        // Position each card based on its index
        cardsMerge.transition()
            // .duration(800)
            .attr("transform", (d, i) => {
                if (i === 0) {
                    return `translate(${(vis.width - cardWidth) / 2}, ${headerOffset + 20})`;
                } else if (i === 1) {
                    return `translate(${row2XStart - 15}, ${row2Y + 20})`;
                } else {
                    return `translate(${row2XStart - 15 + cardWidth + cardSpacing}, ${row2Y + 25})`;
                }
            });

        // UPDATE
        cardsMerge.select(".card-bg")
            .transition()
            // .duration(800)
            .attr("width", cardWidth)
            .attr("height", d => vis.heightScale(d.percentage));

        // UPDATE text
        cardsMerge.select(".card-country")
            .text(d => d.country)
            .transition()
            // .duration(800)
            .attr("x", cardWidth / 2)
            .attr("y", d => vis.heightScale(d.percentage) * 0.4);

        cardsMerge.select(".card-fans")
            .text(d => `${d.percentage}%`)
            .transition()
            .duration(800)
            .attr("x", cardWidth / 2)
            .attr("y", d => vis.heightScale(d.percentage) * 0.6);

        // EXIT
        cards.exit().remove();
    }
}
