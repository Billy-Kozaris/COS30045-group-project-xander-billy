

function showChart(type) {
	d3.select("#chartspace").selectAll("*").remove(); //DELETE PREVIOUS CHART. will probably interfere with retaining chart info but that can be fixed later i suppose.

	if (type === "1") {

		drawChart1("#chartspace");
	} else if (type === "2") {

		drawChart2("#chartspace");
	}
}

function init() {
	showChart("1"); //just default to one if we're doing function init. not sure yet honestly.
}

//window.onload = init; //not sure yet. could interfere with storytelling.