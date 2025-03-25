d3.csv("data/tVisData.csv").then(data => {
    data.forEach(d => {
      d["Estimated Economic Impact ($ Millions)"] = +d["Estimated Economic Impact ($ Millions)"];
      d.Year = +d.Year;
    });
    
    const continentMap = {
        "United States": "North America",
        "Canada": "North America",
        "Mexico": "North America",
        "Australia": "Oceania",
        "United Kingdom": "Europe",
        "Netherlands": "Europe",
        "Italy": "Europe",
        "Belgium": "Europe",
        "Monaco": "Europe",
        "Spain": "Europe"
      };
      
    data.forEach(d => {
        d["Estimated Economic Impact ($ Millions)"] = +d["Estimated Economic Impact ($ Millions)"];
        d.Year = +d.Year;
        d.Continent = continentMap[d.Country];
      });
      
    const ecoVis = new EcoVis("visual5", data);

    document.getElementById("toggle-scale").addEventListener("click", () => {
        ecoVis.useLogScale = !ecoVis.useLogScale;
        ecoVis.updateVis();
      });

    document.getElementById("toggle-color").addEventListener("click", () => {
        console.log("change");
        ecoVis.colorBy = ecoVis.colorBy === "Country" ? "Continent" : "Country";
        ecoVis.updateVis();
      });
      
    document.getElementById("info-button").addEventListener("click", () => {
        const msg = document.getElementById("info-message");
        const isVisible = msg.style.visibility === "visible";
      
        msg.style.visibility = isVisible ? "hidden" : "visible";
        msg.style.opacity = isVisible ? "0" : "1";
      });
           
  });

  