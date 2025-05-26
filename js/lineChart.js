function init(){

    let country = "AUS"; // Default country code
    
    document.getElementById("countries").addEventListener("change", function(event) {
        country = event.target.value; // Update country code
        updateChart(country); // Call function to update visualization
    });

    var margin = {top: 10, right: 30, bottom: 30, left: 60}

    w = 500
    h = 250

    //create the SVG area for the chart to go inside of
    var svg = d3.select("#LineChart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //Define the Axis' and Area initially to allow for transition
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .attr("stroke-width", 0)
        .style("font-size", "12px");
    svg.append("g")
        .attr("class", "y-axis")
        .attr("stroke-width", 0)
        .style("font-size", "12px");
    svg.append("path")
        .attr("class", "area-path")
        .attr("fill", "lightblue")
        .attr("stroke", "#88bff3")
        .attr("stroke-width", 1);
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)") // Rotate to align with Y-axis
        .attr("x", -h / 2)
        .attr("y", -margin.left + 20) // Offset correctly
        .text("Life Expectancy")
        .style("font-size", "20px");





    function updateChart(country) {
        d3.csv("csv/OECD_life_expectancy_1960-2023.csv").then(function(data) {
            var parsedData = data.map(d => ({
                date: +d.TIME_PERIOD,
                value: +d.VALUE,
                code: d.CODE
            }));
            //select only the data matching the country selected
            var filteredData = parsedData.filter(d => d.code === country);
            //Linear scale for X axis
            var x = d3.scaleLinear()
                .domain(d3.extent(filteredData, d => d.date))
                .range([0, w]);
            //Linear scale for Y axis
            var y = d3.scaleLinear()
                .domain([d3.min(filteredData, d => d.value) - 2, d3.max(filteredData, d => d.value)])
                .range([h, 0]);

            //Update x-axis smoothly
            svg.select(".x-axis")
                .transition().duration(1000)
                .call(d3.axisBottom(x).tickFormat(d3.format("d"))
                    .ticks(5));

            //Update y-axis smoothly
            svg.select(".y-axis")
                .transition().duration(1000)
                .call(d3.axisLeft(y)
                    .ticks(5));

            //Bind data and update the area
            var area = d3.area()
                .x(d => x(d.date))
                .y0(h) 
                .y1(d => y(d.value));
            //Draw the area from the filtered data
            svg.select(".area-path")
                .datum(filteredData)
                .transition().duration(1000)
                .attr("d", area);

        });
    }
    //Call updateChart on initialization otherwise nothing will draw until an option is selected
    updateChart(country); 
}

    



window.onload = init;