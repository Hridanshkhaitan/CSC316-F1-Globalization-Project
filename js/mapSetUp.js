Promise.all([
    d3.csv("data/fanData.csv"),
    d3.json("data/world.geojson")
]).then(([rawData, geoData]) => {
    console.log("Here");
    const years = ["2005", "2010", "2015", "2021"];
    const data = rawData.map(d => {
        const entry = { country: d.country };
        years.forEach(year => {
            const value = d[year];
            entry[year] = (value === "NA" || value === "") ? null : +value;
        });
        return entry; 
    });
    
    const fanMap = new FanMap("#visual10", data, geoData);

    const yearOptions = ["2005", "2010", "2015", "2021"];

    d3.select("#yearSlider").on("input", function () {
    const index = +this.value;
    const selectedYear = yearOptions[index];
    d3.select("#yearLabel").text(selectedYear);
    fanMap.selectedYear = selectedYear;
    fanMap.wrangleData();
});

    
});
