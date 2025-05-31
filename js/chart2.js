function drawChart2(contId) {
    var w = 1300; //width. making this one lengthwise
    var h = 700;  //height should probably be smaller due to contents
    var margin = { top: 125, right: 100, bottom: 100, left: 160 }; //jpading. made left a bit bigger to accomodate China's label
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;



    var svg = d3.select(contId)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("g") 
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tooltip = d3.select("body").append("div")
		.style("opacity", 0) //makes it invisible till later
		.attr("class", "tooltip")
		.style("position", "absolute")
		.style("background", "white")
		.style("border", "2px solid #000000")
		.style("padding", "5px")
		.style("pointer-events", "none");


    d3.csv("csv/OECD_years_of_life_lost.csv").then(data => {

        var nuovaData = data.filter(d => d.DEATH_CAUSE === "_T"); //only total cause of death

        nuovaData.forEach(d => {
            d.year = +d.TIME_PERIOD;
            d.value = +d.OBS_VALUE;
        });

        var contArr = Array.from(new Set(nuovaData.map(d => d["Reference area"])));
        var yearArr = Array.from(new Set(nuovaData.map(d => d.year))).sort((a, b) => a - b);

        var x = d3.scaleBand().range([0, width]).domain(yearArr).padding(0.05);
        var y = d3.scaleBand().range([0, height]).domain(contArr).padding(0.05);

		var gradient = d3.scaleLinear()
			.domain(d3.extent(data, d => d.value))
			.range(["#1c2b3b", "#92f79d"]); // colours that work for a kind of monochrome look to account for differnt monitor settings.
											// could maybe be better but it seems to work fine.
											// different ones shall be chosen for next vis.
											

	svg.append("g")
		.selectAll()
		.data(nuovaData)
		.enter()
			
		.append("rect")
		.attr("x", d => x(d.year))     //set position by year
		.attr("y", d => y(d["Reference area"]))  //and country
		.attr("width", x.bandwidth())
		.attr("height", y.bandwidth())
		.attr("rx", 2) 			//round the corners of each cell
		.attr("ry", 2) 			//ditto
		.style("fill", d => gradient(d.value)) //fill with colour based on the value
		.style("transition", "all 0.2s ease") //transition. simple and quick.
		
		.on("mouseover", function(event, d) {
			d3.select(this)
			
				.raise() //keeps cell at the top
				
				.transition()
				.duration(100)
				.attr("x", x(d.year) - 3)
				.attr("y", y(d["Reference area"]) - 1.5)
				.attr("width", x.bandwidth() + 4) //    increase height
				.attr("height", y.bandwidth() + 4) ///  same with width
				.attr("rx", 3) 						//round the edges further
				.attr("ry", 3) 						//ditto
				.style("fill", "#FF4444");			//bright red colour to reall highlight the focused cell
		})
		
		.on("mouseout", function(event, d) {
			d3.select(this)
				.transition()
				.duration(100)
				.attr("x", x(d.year))
				.attr("y", y(d["Reference area"]))
				.attr("width", x.bandwidth())
				.attr("height", y.bandwidth())
				.style("fill", gradient(d.value))
				.attr("rx", 2) 			//round the corners of each cell
				.attr("ry", 2); 			//ditto

			tooltip.transition().duration(100).style("opacity", 0);
			
            })


		.on("click", function(event, d) {
			tooltip.transition().duration(100).style("opacity", 0.8); //set opacity to 0.8. visible, but not distractingly bright
			tooltip.html("Total potential years<br>of life lost for<br>" + d["Reference area"] + " in " + d.year + " was: " + d.value) //pulls data and displays from strings
				.style("left", (event.pageX + 10) + "px")
				.style("top", (event.pageY - 30) + "px");
		});


		svg.append("g")
			.attr("transform", "translate(0, " + height + ")")
			.call(d3.axisBottom(x).tickValues(yearArr.filter(y => y % 10 === 0))); //show every tenth year. can be adjusted as needed but decades is a nice measure

		svg.append("g")
			.call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "start")
            .style("font-size", "25px")
            .text("Potential Years of Life Lost (PYLL) per Country by Year");

        svg.append("text")
            .attr("x", 0)
            .attr("y", -26)
            .attr("text-anchor", "start")
            .style("font-size", "14px")
			.text("The total PYLL of multiple countries between 1960 and 2022*. Click highlighted cell to expand details.");

		svg.append("text")
			.attr("x", 0)
			.attr("y", -10)
			.attr("text-anchor", "start")
			.style("font-size", "12px")
			.text("*Empty cells represent years without recorded data.");
		
		
		
		
		var legendWidth = 550; //width of legend
		var legendHeight = 8;  //height
		var legendValues = [10000, 20000, 30000, 40000, 50000]; //values for legend. intervals of 10
        var legendAdd = svg.append("g")
			.attr("transform", "translate(0," + (height + 40) + ")");



		legendAdd.selectAll("rect")
			.data(legendValues)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * (legendWidth / legendValues.length))
			.attr("y", -legendHeight)
			.attr("width", legendWidth / legendValues.length)
			.attr("height", legendHeight)
			.style("fill", d => gradient(d));

		legendAdd.selectAll("text")
			.data(legendValues)
			.enter()
			.append("text")
			.attr("x", (d, i) => i * (legendWidth / legendValues.length) + 40)
			.attr("y", 10)
			.style("font-size", "10px")
			.text(d => d.toFixed(0));	
    });
		
		
		
		
}