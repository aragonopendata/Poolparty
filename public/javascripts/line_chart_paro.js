'use strict';

var unemploymentLinesChart = {
  csvFile: null,
  graphSelector: '.unemployment',

  draw: function() {

    var margin = {
      top: 20,
      right: 15,
      bottom: 30,
      left: 55
    };

    var width = 550 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(['#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F']);	

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

    var svg = d3.select(this.graphSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = svg
      .append('text')
      .attr({'text-anchor': 'middle'})
      .attr({'x': (width + margin.right)/2, 'y': height - margin.top - 30})
      .style({'font-size': '26px', 'font-weight': 'bold', 'fill': '#aaa'});

    function setTooltipTotal(tooltip, data){
      var unemploymentTotal = data.filter(function(d) {
        return d.name === 'Paro';
      })[0]; // NOTE: Returns an array with one value

      var lastYear  = data.filter(function(d) {
        return d.name === 'Paro';
      })[0].values[unemploymentTotal.values.length - 1].date.getFullYear();

      tooltip.html('Paro en ' + lastYear + ': ' + unemploymentTotal.values[unemploymentTotal.values.length - 1].pop);
    }

    d3.csv(this.csvFile, function(error, data) {
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      data.forEach(function(d) {
        d.date = parseDate(d.date);
      });
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
          .attr("class", "city")
        .attr('data-legend-color', function(d) {
          return color(d.name);
        });

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

      var point = city.append("g")
          .attr("class", "line-point");

      point.selectAll('circle')
          .data(function(d) { return d.values})
          .enter().append('circle')
          .attr("cx", function(d) { return x(d.date) })
          .attr("cy", function(d) { return y(d.pop) })
          .attr('r', 6)
          .style("fill", function(d) { return color(this.parentNode.__data__.name); })
          .on("mouseover", function (d, i) {
            d3.select(this)
              .style("stroke-width", 0.5)
              .style("stroke", "red");
            tooltip.text(this.parentNode.__data__.name + ' en ' + d.date.getFullYear() + ': ' + d.pop);
          })
          .on("mouseout", function (d) {
            d3.select(this)
              .style("stroke-width", 0);
            setTooltipTotal(tooltip, padron);
          });
          setTooltipTotal(tooltip, padron);

      /* Legend */
      city.attr('data-legend',function(d) { return d.name;});

      svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(400,190)')
        .style('font-size', '12px')
        .call(d3.legend);
      /* end legend */
    });
  }
};
