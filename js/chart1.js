function drawChart1(contId) {
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


    d3.csv("csv/OECD_life_expectancy_1960-2023.csv").then(data => {
        data.forEach(d => {
            d.year = +d.TIME_PERIOD;
            d.value = +d.VALUE;
        });

        var contArr = Array.from(new Set(data.map(d => d.COUNTRY))); 
        var yearArr = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

        var x = d3.scaleBand().range([0, width]).domain(yearArr).padding(0.05);      //creace scaleband for x axis (years)
        var y = d3.scaleBand().range([0, height]).domain(contArr).padding(0.05); //ditto, but for y axis (countries)

		var gradient = d3.scaleLinear()
			.domain(d3.extent(data, d => d.value))
			.range(["#E4DFD8", "#442266"]); // colours that work for a kind of monochrome look to account for differnt monitor settings.
											// could maybe be better but it seems to work fine.
											// different ones shall be chosen for next vis.


	svg.append("g")
		.selectAll()
		.data(data)
		.enter()
		
		.append("rect")
		.attr("x", d => x(d.year))     //set position by year
		.attr("y", d => y(d.COUNTRY))  //and country
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
				.attr("y", y(d.COUNTRY) - 1.5)
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
				.attr("y", y(d.COUNTRY))
				.attr("width", x.bandwidth())
				.attr("height", y.bandwidth())
				.attr("rx", 2) 			//round the corners of each cell
				.attr("ry", 2) 			//ditto
				.style("fill", gradient(d.value)); //revert to original colour
				
			tooltip.transition().duration(100).style("opacity", 0); //reset tooltip opacity
			
		})
		
		
		.on("click", function(event, d) {
			tooltip.transition().duration(100).style("opacity", 0.8); //set opacity to 0.8. visible, but not distractingly bright
			tooltip.html("The average life<br>expetcancy (years) for <br>" + d.COUNTRY + " in " + d.year + " was: " + d.value) //pulls data and displays from strings
				.style("left", (event.pageX + 10) + "px")
				.style("top", (event.pageY - 30) + "px");
		});


		svg.append("g")
			.attr("transform", "translate(0, " + height + ")")
			.call(d3.axisBottom(x).tickValues(yearArr.filter(y => y % 10 === 0))); //show every tenth year. can be adjusted as needed but decades is a nice measure

		svg.append("g")
			.call(d3.axisLeft(y));
				
		svg.append("text") //title
			.attr("x", 0)
			.attr("y", -50)
			.attr("text-anchor", "start")
			.style("font-size", "25px")
			.text("Average Life Expectancy by Country Per Year");

		svg.append("text")
			.attr("x", 0)
			.attr("y", -26)
			.attr("text-anchor", "start")
			.style("font-size", "14px")
			.text("The averaged life expectancy of multiple countries between 1960 and 2023*, averaged to one decimal point. Click highlighted cell to expand details.");
			
		svg.append("text")
			.attr("x", 0)
			.attr("y", -10)
			.attr("text-anchor", "start")
			.style("font-size", "12px")
			.text("*Empty cells represent years without recorded data.");
		
		
		
		
		var legendWidth = 550; //width of legend
		var legendHeight = 8;  //height
		var legendValues = [30, 40, 50, 60, 70, 80, 90]; //values for legend. intervals of 10
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
			.attr("x", (d, i) => i * (legendWidth / legendValues.length) + 35)
			.attr("y", 10)
			.style("font-size", "12px")
			.text(d => d.toFixed(0));	
	});
		
		
		
		
}