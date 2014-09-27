var margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.pop); });

var svg = d3.select(".padron").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Creamos una etiqueta DIV que utilizaremos a modo de tooltip.
var tooltip_padron = d3.select(".padron")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("z-index", "20")
                .style("top", (height + 30) +"px")
                .style("left", "500px")
                .html("<p>45983<br>Población total</p>");   


d3.csv("poblacion_paro_jaca.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  console.log(data);
  var padron = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, pop: +d[name]};
      })
    };
  });
  padron = padron.filter(function (d) {return d.name !== "cod" && d.name !== "mun";});
  
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0,
    // d3.min(padron, function(c) { return d3.min(c.values, function(v) { return v.pop; }); }),
    d3.max(padron, function(c) { return d3.max(c.values, function(v) { return v.pop; }); })
  ]);
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate(" + width + ",0)")
      .attr("text-anchor", "end")
      .attr("dy", "-.71em")
      .text("Año");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Población");

  var city = svg.selectAll(".city")
      .data(padron)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.pop) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("dx", ".35em")
      .text(function(d) { return d.name; });

  var point = city.append("g")
      .attr("class", "line-point");

  point.selectAll('circle')
      .data(function(d) { return d.values})
      .enter().append('circle')
      .attr("cx", function(d) { return x(d.date) })
      .attr("cy", function(d) { return y(d.pop) })
      .attr("r", 3.5)
      .style("fill", function(d) { return color(this.parentNode.__data__.name); })
      .on("mouseover", function (d, i) {
                d3.select(this)
                  .style("stroke-width", 0.5)
                  .style("stroke", "red");
                tooltip_padron.html( "<p>Población año: " + d.date + "<br>" + d.pop + "</p>" );
                    })
        .on("mouseout", function (d) {
          d3.select(this)
            .style("stroke-width", 0);
          tooltip.html("Nº empresas total: 432")
        });

});