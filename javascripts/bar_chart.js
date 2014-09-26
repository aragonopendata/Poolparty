// // Set the dimensions for both
// 	var margin = 50;
// 	var width = 800;
// 	var	height = 400;	

var margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Set the scale
var xScale = d3.scale.ordinal()
				.rangeRoundBands([0, width + margin.left + margin.right], 0.1); // Range for the bands plus, percentage of each band dedicated to be space.

var yScale = d3.scale.linear()
				.range([0, height]);	

var bar_color = d3.scale.ordinal()
				.range(['#8DD3C7', '#FDB462', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F']);		


// Create the SVG
var svgBar = d3.select(".bar")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

// Creamos una etiqueta DIV que utilizaremos a modo de tooltip.
var tooltip = d3.select(".bar")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("z-index", "20")
				.style("top", "30px")
                .style("left", "500px")
                .html("<p>Nº empresas total: 432</p>");		
	



// Load the data
		
var actividades_jaca = [];


d3.csv("actividades_jaca.csv", function (error, data) {
	data.forEach(function (d) {
		d.value = +d.value;
	});  


	actividades_jaca = data;

	// Draw the elements
	
	drawBars(actividades_jaca);

});





// The function to draw the positive bars

function drawBars (data) {

	xScale.domain(d3.range(actividades_jaca.length));
	yScale.domain([d3.max(actividades_jaca, function (d) {return +d.value;}),0]);

	bar_color.domain(d3.range(function(d) {return d.act_descripcion;}));	


	var myBars = svgBar.selectAll("svgBar").data(actividades_jaca);

	myBars.enter()
		.append("rect")
		.attr("class", "addon")
		.attr("x", function (d,i) {return xScale(i); })
		.attr("y", function (d) {return height - d.value;})
		.attr("width", xScale.rangeBand())
		.attr("height", function (d) {console.log(d.value); return d.value;})
		.attr("fill", function (d) {return color(d.act_descripcion);})
		.on("mouseover", function (d, i) {
            

                d3.select(this)
                  .style("stroke-width", 0.5)
                  .style("stroke", "red");
                tooltip.html( "<p>Actividad: " + d.act_descripcion + "<br> Nº empresas: " + d.value + "</p>" );
                    })
        .on("mouseout", function (d) {
        	d3.select(this)
        		.style("stroke-width", 0);
        	tooltip.html("Nº empresas total: 432")
        });


};
