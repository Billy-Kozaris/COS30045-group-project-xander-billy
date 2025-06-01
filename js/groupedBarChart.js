function init (){

    let countryBar = "AUS";

    //listen for when the select for this chart is changed
    document.getElementById("countries_bar").addEventListener("change", function(event) {
        country = event.target.value; // Update country code
        updateChart(country); // Call function to update visualization
    });
    
    var margin = {top: 10, right: 30, bottom: 30, left: 60}
    let YOLFColor = d3.color("steelblue")
    let LEColor = d3.color("aquamarine")

    width = 1000
    height = 250

    // Create SVG container
    var gBarChart = d3.select("#gBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append X-axis group
    gBarChart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")  // Align to bottom
        .style("font-size", "12px");
    
    // Append Y-axis group
    gBarChart.append("g")
        .attr("class", "y-axis")
        .style("font-size", "12px");
        
    //left y Axis Label
    gBarChart.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)") // Rotate to align with Y-axis
        .attr("x", -h / 2)
        .attr("y", -margin.left + 15) // Offset correctly
        .text("Years of Life Lost (Total)")
        .style("font-size", "18px");

    // Right Y-axis Label 
    gBarChart.append("text")
    .attr("class", "y-label-right")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2) 
    .attr("y", width + margin.right - 5) 
    .text("Life Expectancy (Years)")
    .style("font-size", "18px");

    gBarLegend = d3.select("#gBarLegend")
        .append("svg")
        .attr("width", 200)
        .attr("height", 75)
        gBarLegend.append("circle").attr("cx",50).attr("cy",25).attr("r", 6).style("fill", YOLFColor)
        gBarLegend.append("circle").attr("cx",50).attr("cy",50).attr("r", 6).style("fill", LEColor)
        gBarLegend.append("text").attr("x", 60).attr("y", 25).text("Years of Life Lost").style("font-size", "15px").attr("alignment-baseline","middle")
        gBarLegend.append("text").attr("x", 60).attr("y", 50).text("Life Expectancy").style("font-size", "15px").attr("alignment-baseline","middle")



    function updateChart(countryBar) {
    Promise.all([
        d3.csv("csv/OECD_years_of_life_lost.csv").then(data => data.filter(d => d.DEATH_CAUSE == "_T")),
        d3.csv("csv/OECD_life_expectancy_1960-2023.csv")
    ]).then(function([yearsOfLifeLostRaw, lifeExpectancyRaw]) {
        let dataMerged = [];

        yearsOfLifeLostRaw.forEach(yolf => {
            if (yolf.REF_AREA.trim() === countryBar && yolf.TIME_PERIOD % 5 === 0) {
                let le = lifeExpectancyRaw.find(d => d.CODE === countryBar && d.TIME_PERIOD === yolf.TIME_PERIOD);
                if (le) {
                    dataMerged.push({ year: +yolf.TIME_PERIOD, category: "YOLF", value: +yolf.OBS_VALUE });
                    dataMerged.push({ year: +yolf.TIME_PERIOD, category: "LE", value: +le.VALUE });
                }
            }
        });

        // ScaleBand for X (Years)
        var xScale = d3.scaleBand()
            .domain([...new Set(dataMerged.map(d => d.year))])
            .range([25, width - 25])
            .padding(0.1);

        // ScaleBand for Subgroups (YOLF & LE)
        var xSubgroup = d3.scaleBand()
            .domain(["YOLF", "LE"])
            .range([0, xScale.bandwidth()])
            .padding(0.05);

        // Linear scale for Y-axis 
        var yScaleYOLF = d3.scaleLinear()
            .domain([0, d3.max(dataMerged.filter(d => d.category === "YOLF"), d => d.value)])
            .range([height, 0]);

        // Linear scale for Y-axis 
        var yScaleLE = d3.scaleLinear()
            .domain([d3.min(dataMerged.filter(d => d.category === "LE"), d => d.value) - 5, 
                     d3.max(dataMerged.filter(d => d.category === "LE"), d => d.value) + 5])
            .range([height, 0]);

        // Update left x-axis
        gBarChart.select(".x-axis")
            .transition().duration(1000)
            .call(d3.axisBottom(xScale));

        // Update left Y-axis 
        gBarChart.select(".y-axis")
            .attr("transform", "translate(25, 0)")
            .transition().duration(1000)
            .call(d3.axisLeft(yScaleYOLF).ticks(5));

        // Add right Y-axis 
        gBarChart.select(".y-axis-right").remove(); 
        gBarChart.append("g")
            .attr("class", "y-axis-right")
            .attr("transform", `translate(${width - 25}, 0)`)
            .call(d3.axisRight(yScaleLE).ticks(5));

        // Remove old bars
        gBarChart.selectAll("rect").remove();

        // Bind data for grouped bars
        let bars = gBarChart.selectAll("rect")
            .data(dataMerged, d => `${d.year}-${d.category}`)
            .join("rect")
            .attr("x", d => xScale(d.year) + xSubgroup(d.category))
            .attr("width", xSubgroup.bandwidth())
            .attr("fill", d => d.category === "YOLF" ? YOLFColor : LEColor)
            .attr("y", height)
            .attr("height", 0)
            .transition().duration(1000)
            .attr("y", d => d.category === "YOLF" ? yScaleYOLF(d.value) : yScaleLE(d.value))
            .attr("height", d => d.category === "YOLF" ? height - yScaleYOLF(d.value) : height - yScaleLE(d.value));
    });
}


    updateChart(countryBar);
}

window.addEventListener("load", init);