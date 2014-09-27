'use strict';

var activitiesBarChart = {
  csvFile: null,
  graphSelector: '.activities',

  draw: function() {
    var margin = {
        top: 20,
        right: 120,
        bottom: 35,
        left: 50
      },
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
    var svgBar = d3.select(this.graphSelector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .call(d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', function() {
        svgBar.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      }));

    var tooltipTitle = svgBar
      .append('text')
      .attr({
        'x': (width + margin.left + margin.right) / 2,
        'y': height + margin.top + 10
      })
      .attr({
        'text-anchor': 'middle'
      })
      .style({
        'font-size': '20px',
        'font-weight': 'bold',
        'fill': '#aaa'
      })
      .text('Número de empresas');


    // Load the data
    var actividades_jaca = [];
    var totalActividades = 0;
    var tooltipTotal = null;


    d3.csv(this.csvFile, function(error, data) {
      data.forEach(function(d) {
        d.value = +d.value;
      });

      totalActividades = d3.sum(data, function(d) {
        return d.value;
      });


      actividades_jaca = data;

      // Draw the elements

      drawBars(actividades_jaca);

      // Print total activities
      tooltipTotal = svgBar
        .append('text')
        .attr({
          'x': (width + margin.left + margin.right) / 2,
          'y': height + margin.top + 34
        })
        .attr({
          'text-anchor': 'middle'
        })
        .style({
          'font-size': '24px',
          'font-weight': 'bold',
          'fill': '#aaa'
        })
        .text(totalActividades);
    });


    // The function to draw the positive bars

    function drawBars() {

      xScale.domain(d3.range(actividades_jaca.length));
      yScale.domain([d3.max(actividades_jaca, function(d) {
        return +d.value;
      }), 0]);

      bar_color.domain(d3.range(function(d) {
        return d.act_descripcion;
      }));
      var myBars = svgBar.selectAll('svgBar').data(actividades_jaca);

      myBars.enter()
        .append('rect')
        .attr('class', 'addon')
        .attr('x', function(d, i) {
          return xScale(i);
        })
        .attr('y', function(d) {
          return height - d.value;
        })
        .attr('width', xScale.rangeBand())
        .attr('height', function(d) {
          return d.value;
        })
        .attr('fill', function(d) {
          return bar_color(d.act_descripcion);
        })
        .on('mouseover', function(d) {
          d3.select(this)
            .style('stroke-width', 0.5)
            .style('stroke', 'red');
          tooltipTitle.html(d.act_descripcion);
          tooltipTotal.html(d.value);
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('stroke-width', 0);
          tooltipTitle.html('Número de empresas');
          tooltipTotal.html(totalActividades);
        });
    }
  }

};
