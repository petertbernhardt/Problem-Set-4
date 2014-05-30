// Peter Bernhardt

window.onload = function() {
	var countries = document.getElementById("countries");
	countries.onchange = function changeData() {
		// delete the current graph
		var elem = document.getElementsByTagName("svg")[0];
		elem.parentNode.removeChild(elem);
		// set variables
		var country = countries.options[countries.selectedIndex].text;
		document.getElementById("header").innerHTML = country;
		var popMin;
		var popMax;
		if (country == "Iceland") {
			popMin = 250000;
			popMax = 350000;
		} else if (country == "Japan") {
			popMin = 124000000;
			popMax = 128900000;
		} else if (country == "Paraguay") {
			popMin = 4600000;
			popMax = 6700000;
		}
		var margin = {top: 80, right: 80, bottom: 80, left: 80},
			width = 800 - margin.left - margin.right,
			height = 600 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .01);

		var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
		y1 = d3.scale.linear().domain([popMin, popMax]).range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		// create left yAxis
		var yAxisLeft = d3.svg.axis().scale(y0).ticks(5).orient("left");
		// create right yAxis
		var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");

		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("class", "graph")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var file;
		if (country == "Iceland") {
			file = "data.tsv";
		} else if (country == "Japan") {
			file = "japan.tsv";
		} else if (country == "Paraguay") {
			file = "paraguay.tsv";
		}
		
		d3.tsv(file, type, function(error, data) {
		  x.domain(data.map(function(d) { return d.year; }));
		  y0.domain([0, d3.max(data, function(d) { return d.gni; })]);
		  
		  svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

		  svg.append("g")
		.attr("class", "y axis axisLeft")
		.attr("transform", "translate(0,0)")
		.call(yAxisLeft)
		.append("text")
		.attr("y", 6)
		.attr("dy", "-2em")
		.style("text-anchor", "end")
		.style("text-anchor", "end")
		.text("GNI");

		  svg.append("g")
		.attr("class", "y axis axisRight")
		.attr("transform", "translate(" + (width) + ",0)")
		.call(yAxisRight)
		.append("text")
		.attr("y", 6)
		.attr("dy", "-2em")
		.attr("dx", "2em")
		.style("text-anchor", "end")
		.text("Population");

		  bars = svg.selectAll(".bar").data(data).enter();

		  bars.append("rect")
			  .attr("class", "bar1")
			  .attr("x", function(d) { return x(d.year); })
			  .attr("width", x.rangeBand()/2)
			  .attr("y", function(d) { return y0(d.gni); })
		.attr("height", function(d,i,j) { return height - y0(d.gni); });

		  bars.append("rect")
			  .attr("class", "bar2")
			  .attr("x", function(d) { return x(d.year) + x.rangeBand()/2; })
			  .attr("width", x.rangeBand() / 2)
			  .attr("y", function(d) { return y1(d.population); })
		.attr("height", function(d,i,j) { return height - y1(d.population); });

		});

		function type(d) {
		  d.gni = +d.gni;
		  return d;
		}
	};
};