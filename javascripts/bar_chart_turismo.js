// // Set the dimensions for both
// 	var margin = 50;
// 	var width = 800;
// 	var	height = 400;	

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var width2 = 100;

// Set the scale
var yScale = d3.scale.ordinal()
				.rangeRoundBands([0, height + margin.top + margin.bottom], 0.3); // Range for the bands plus, percentage of each band dedicated to be space.

var xScale = d3.scale.linear()
				.range([0, width - margin.left * 1.8]);	

var xScale2 = d3.scale.linear()
				.range([0, width2-margin.left * 1.8]);	

var bar_color = d3.scale.ordinal()
				.range(['#8DD3C7', '#FDB462', '#BEBADA', '#FB8072', '#80B1D3', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F']);	

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("right");


// Create the SVG
var svgBar = d3.select(".bar")
			.append("svg")
			.attr("width", width2)
			.attr("height", height + margin.top + margin.bottom);
// Create the SVG
var svgBar2 = d3.select(".bar")
			.append("svg")
			.attr("width", width)
			.attr("height", height + margin.top + margin.bottom)
			.attr("margin.left", margin.left);

// Creamos una etiqueta DIV que utilizaremos a modo de tooltip.
var tooltip = d3.select(".bar")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("z-index", "20")
				.style("top", "30px")
                .style("left", "500px")
                .html("<p>Nº total plazas: *432*</p>");		
	



// Load the data
		
var turismo_jaca = [];


d3.csv("turismo_jaca.csv", function (error, data) {
	data.forEach(function (d) {
		d.plazas = +d.plazas;
		d.establecimientos = +d.establecimientos;
	});  


	turismo_jaca = data;

	// Draw the elements
	
	drawBars(turismo_jaca);

});





// The function to draw the positive bars

function drawBars (data) {


	yScale.domain(data.map(function(d) { return d.tipo; }));
	xScale.domain([0, d3.max(turismo_jaca, function (d) {return +d.plazas;})]);

	xScale2.domain([0, d3.max(turismo_jaca, function (d) {return +d.establecimientos;})]);

console.log(d3.max(turismo_jaca, function (d) {return +d.establecimientos;}))
	bar_color.domain(d3.range(function(d) {return d.tipo;}));	

svgBar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("y", 6)
      //.attr("dy", ".71em")
      .style("text-anchor", "end");


	var myBars2 = svgBar2.selectAll("svgBar2").data(turismo_jaca);

	myBars2.enter()
		.append("rect")
		.attr("class", "addon")
		.attr("y", function (d) {return yScale(d.tipo); })
		.attr("x", 10)
		.attr("height", yScale.rangeBand())
		.attr("width", function (d) {return xScale(d.plazas);})
		.attr("fill", function (d) {return bar_color(d.tipo);})
		.on("mouseover", function (d, i) {
                d3.select(this)
                  .style("stroke-width", 0.5)
                  .style("stroke", "red");
                tooltip.html( "<p>" + d.tipo + "<br> Plazas: " + d.plazas + "</p>" );
                    })
        .on("mouseout", function (d) {
        	d3.select(this)
        		.style("stroke-width", 0);
        	tooltip.html("Nº empresas total: 432")
        });


    var myBars = svgBar.selectAll("svgBar").data(turismo_jaca);

	myBars.enter()
		.append("rect")
		.attr("class", "addon")
		.attr("y", function (d) {return yScale(d.tipo); })
		.attr("x", margin.left * 1.8)
		.attr("height", yScale.rangeBand())
		.attr("width", function (d) {return xScale2(d.establecimientos);})
		.attr("fill", function (d) {return d3.hsl(bar_color(d.tipo)).brighter(.5);})
		.on("mouseover", function (d, i) {
                d3.select(this)
                  .style("stroke-width", 0.5)
                  .style("stroke", "red");
                tooltip.html( "<p>" + d.tipo + "<br> Nº establecimientos: " + d.establecimientos + "</p>" );
                    })
        .on("mouseout", function (d) {
        	d3.select(this)
        		.style("stroke-width", 0);
        	tooltip.html("Nº empresas total: 432")
        });


};
