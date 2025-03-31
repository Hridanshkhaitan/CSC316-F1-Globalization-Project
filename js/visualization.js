// Set margins and dimensions
const margin = { top: 40, right: 40, bottom: 120, left: 120 };
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

let svg, track, pathElement, trackGroup;
let data = [];
let selectedDrivers = [];
const customLabels = ["Terrence Allder", "David Atanasov", "Hridansh Khaitan"];

function initVis() {
  svg = d3.select("#monaco-viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.select("#monaco-viz")
    .append("button")
    .attr("id", "add-drivers")
    .text("Show all Drivers")
    .on("click", () => {
      data.forEach(driver => driver.circle.transition().duration(300).style("opacity", 1));
    });

  fetchTrack();
}

function fetchTrack() {
  fetch('data/RaceCircuitMonaco.svg')
    .then(response => response.text())
    .then(svgData => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      const trackPath = svgDoc.querySelector("path").getAttribute("d");

      const scaleFactor = 2.2;
      const translateX = (width / 3.1) / scaleFactor;
      const translateY = (height / 3.7) / scaleFactor;

      trackGroup = svg.append("g")
        .attr("transform", `translate(${translateX},${translateY}) scale(${scaleFactor})`);

      track = trackGroup.append("path")
        .attr("d", trackPath)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4);

      pathElement = track.node();
      wrangleData();
    });
}

function wrangleData() {
  d3.csv("data/2024_Monaco_GP_Fastest_Laps.csv").then(csvData => {
    const uniqueDrivers = Array.from(new Set(csvData.map(d => d["DRIVER"])));
    selectedDrivers = d3.shuffle(uniqueDrivers).slice(0, 3);

    data = csvData
      .filter(driver => selectedDrivers.includes(driver["DRIVER"]))
      .map((driver, index) => {
        const avgSpeed = +driver["AVG SPEED"];
        const startOffset = (index * 0.25) * pathElement.getTotalLength();
        const circle = trackGroup.append("circle")
          .attr("r", 10)
          .attr("fill", driverColors[driver["DRIVER"]]);

        const line = trackGroup.append("line")
          .attr("stroke", "gray")
          .attr("stroke-width", 2);

          const titles = ["Terrence Allder", "David Atanasov", "Hridansh Khaitan"];
          const subtitles = [
            "Math Specialist + CS minor",
            "Whatever you study",
            "Whatever you study"
          ];
          
          const labelTitle = trackGroup.append("text")
            .text(titles[index])
            .attr("font-size", "18px")
            .attr("fill", "white")
            .attr("font-weight", "bold");
          
          const labelSubtitle = trackGroup.append("text")
            .text(subtitles[index])
            .attr("font-size", "14px")
            .attr("fill", "#DDDDDD");
          
          return { ...driver, avgSpeed, startOffset, circle, line, labelTitle, labelSubtitle };
          
      });

    updateVis();
  });
}

function updateVis() {
  d3.timer(elapsed => {
    data.forEach(driver => {
      const speedFactor = driver.avgSpeed / 162;
      const distance = (driver.startOffset + elapsed * speedFactor * 0.05) % pathElement.getTotalLength();
      const point = pathElement.getPointAtLength(distance);

      driver.circle.attr("cx", point.x).attr("cy", point.y);

      driver.line
        .attr("x1", point.x)
        .attr("y1", point.y)
        .attr("x2", point.x + 60)
        .attr("y2", point.y - 40);

      driver.labelTitle
        .attr("x", point.x + 66)
        .attr("y", point.y - 42);
      
      driver.labelSubtitle
        .attr("x", point.x + 66)
        .attr("y", point.y - 24);
      
    });
  });
}

initVis();
