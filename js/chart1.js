function drawChart1(contName) {
    var muhdataset = [77, 23, 20, 21, 55, 51, 99, 33, 34, 64];
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var w = 500;
    var h = 500;
    var outerRadius = w / 2;
    var innerRadius = 50;

    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var pie = d3.pie();

    var svg = d3.select(contName)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var arcs = svg.selectAll("g.arc")
        .data(pie(muhdataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", function(d, i) {
            return arc(d, i);
        });

    arcs.append("text")
        .text(function(d) { 
            return d.value; 
        })
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        });
}
