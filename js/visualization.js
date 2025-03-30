// Set margins and dimensions
const margin = { top: 20, right: 20, bottom: 60, left: 220 };
const width = window.innerWidth - margin.left - margin.right;
const height = window.innerHeight - margin.top - margin.bottom;

const driverColors = {
  "Lewis Hamilton": "#00D2BE",
  "Max Verstappen": "#0600EF",
  "Zhou Guanyu": "#9B0000",
  "Yuki Tsunoda": "#1E41FF",
  "Carlos Sainz": "#DC0000",
  "Charles Leclerc": "#FF3333",
  "George Russell": "#66E0C2",
  "Logan Sargeant": "#005AFF",
  "Pierre Gasly": "#0090FF",
  "Lando Norris": "#FF8700",
  "Oscar Piastri": "#FFA500",
  "Valtteri Bottas": "#670000",
  "Lance Stroll": "#006F62",
  "Alexander Albon": "#0032FF",
  "Daniel Ricciardo": "#002FA7",
  "Fernando Alonso": "#004225"
};

const driverImages = {
  "Lewis Hamilton": "hamilton.avif",
  "Max Verstappen": "verstappen.avif",
  "Zhou Guanyu": "zhou.avif",
  "Yuki Tsunoda": "tsunoda.avif",
  "Carlos Sainz": "sainz.avif",
  "Charles Leclerc": "leclerc.avif",
  "George Russell": "russell.avif",
  "Logan Sargeant": "sargeant.jpg",
  "Pierre Gasly": "gasly.avif",
  "Lando Norris": "norris.avif",
  "Oscar Piastri": "piastri.avif",
  "Valtteri Bottas": "bottas.avif",
  "Lance Stroll": "stroll.avif",
  "Alexander Albon": "albon.avif",
  "Daniel Ricciardo": "ricciardo.png",
  "Fernando Alonso": "alonso.avif"
};

let activeDriver = null;

let data = [];

d3.select("#monaco-viz")
  .append("button")
  .attr("id", "add-drivers")
  .text("Show all Drivers")
  .on("click", () => {
    data.forEach(driver => {
      driver.circle.transition().duration(300).style("opacity", 1);
    });
    driverInfo.html("");
    activeDriver = null;
  });


const driverInfo = d3.select("#monaco-viz")
  .append("div")
  .attr("id", "driver-info");

const svg = d3.select("#monaco-viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.select("#monaco-viz").on("click", () => {
  driverInfo.html("");
  if (activeDriver) activeDriver.circle.attr("r", 5);
  activeDriver = null;
});

fetch('data/RaceCircuitMonaco.svg')
  .then(response => response.text())
  .then(svgData => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
    const trackPath = svgDoc.querySelector("path").getAttribute("d");

    const scaleFactor = 1.5;
    const translateX = (width / 3.1) / scaleFactor;
    const translateY = (height / 3.7) / scaleFactor;

    const trackGroup = svg.append("g")
      .attr("transform", `translate(${translateX},${translateY}) scale(${scaleFactor})`);

    const track = trackGroup.append("path")
      .attr("d", trackPath)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    d3.csv("data/2024_Monaco_GP_Fastest_Laps.csv").then(csvData => {
      data = csvData;
      const pathElement = track.node();
      const pathLength = pathElement.getTotalLength();

      data.forEach((driver, index) => {
        driver.avgSpeed = +driver["AVG SPEED"];
        driver.startOffset = (index / data.length) * pathLength;
        driver.circle = trackGroup.append("circle")
          .attr("r", 5)
          .attr("fill", driverColors[driver["DRIVER"]])
          .on("mouseover", () => {
            if (activeDriver && activeDriver !== driver) {
              activeDriver.circle.attr("r", 5);
            }
            activeDriver = driver;
            driver.circle.attr("r", 8);
            driverInfo.html(`
              <img src="data/driverImages/${driverImages[driver["DRIVER"]]}" alt="${driver["DRIVER"]}" style="width:100%; margin-bottom:10px;">
              <div class="driver-name">${driver["DRIVER"]}</div>
              <div class="driver-speed">Avg Speed: ${driver.avgSpeed} km/h</div>
              <button id='hide-driver'>Hide Driver</button>
            `);
            d3.select("#hide-driver").on("click", () => {
              driver.circle.transition().duration(300).style("opacity", 0);
              driverInfo.html("");
            });
          });
      });

      d3.timer(elapsed => {
        data.forEach(driver => {
          const speedFactor = driver.avgSpeed / 162;
          const distance = (driver.startOffset + elapsed * speedFactor * 0.05) % pathLength;
          const point = pathElement.getPointAtLength(distance);

          driver.circle
            .attr("cx", point.x)
            .attr("cy", point.y);
        });
      });
    });
  });
