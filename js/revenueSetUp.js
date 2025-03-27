d3.csv("data/updated_grand_prix_revenue.csv").then(data => {
    new RevenueVis("visual6", data);

    document.getElementById("revenue-info-button").addEventListener("click", () => {
        const msg = document.getElementById("revenue-info-message");
        const isVisible = msg.style.visibility === "visible";
      
        msg.style.visibility = isVisible ? "hidden" : "visible";
        msg.style.opacity = isVisible ? "0" : "1";
      });
      
  });
  
  