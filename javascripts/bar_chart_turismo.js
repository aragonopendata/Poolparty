'use strict';

var tourismBarChart = {
  csvFile: null,
  graphSelector: null,

  draw: function() {

    var margin = {
        top: 10,
        right: 20,
        bottom: 60,
        left: 50
      },
      width = 500 - margin.left - margin.right,
      height = 433 - margin.top - margin.bottom;

    var width2 = 100;

    // Set the scale
    var yScale = d3.scale.ordinal()
      .rangeRoundBands([0, height + margin.top], 0.3); // Range for the bands plus, percentage of each band dedicated to be space.

    var xScale = d3.scale.linear()
      .range([0, width - margin.left * 1.8]);

    var xScale2 = d3.scale.linear()
      .range([0, width2 - margin.left * 1.8]);

    var bar_color = d3.scale.ordinal()
      .range(['#8DD3C7', '#FDB462', '#BEBADA', '#FB8072', '#80B1D3', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F']);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('right');

    // Create the SVG
    var svgBar = d3.select(this.graphSelector)
      .append('svg')
      .attr('width', width2)
      .attr('height', height + margin.top + margin.bottom);

    // Create the SVG
    var svgBar2 = d3.select(this.graphSelector)
      .append('svg')
      .attr('width', width)
      .attr('height', height + margin.top + margin.bottom)
      .attr('margin.left', margin.left);

    // Creamos una etiqueta DIV que utilizaremos a modo de tooltip.
    var tooltip = {
      title: svgBar2
        .append('text')
        .attr({
          'x': 200,
          'y': height + margin.top
        })
        .attr({
          'text-anchor': 'middle'
        })
        .style({
          'font-size': '20px',
          'font-weight': 'bold',
          'fill': '#aaa'
        }),
      value: svgBar2
        .append('text')
        .attr({
          'x': 200,
          'y': height + margin.top + 24
        })
        .attr({
          'text-anchor': 'middle'
        })
        .style({
          'font-size': '24px',
          'font-weight': 'bold',
          'fill': '#aaa'
        }),
    };

    function setTooltipTotal(tooltip, data) {
      var total = d3.sum(data, function(d) {
        return d.plazas;
      });
      setTooltipValues(tooltip, 'Número de plazas', total);
    }

    function setTooltipValues(tooltip, title, value) {
      tooltip.title.text(title);
      tooltip.value.text(value);
    }

    d3.csv(this.csvFile, function(error, data) {
      data.forEach(function(d) {
        d.plazas = +d.plazas;
        d.establecimientos = +d.establecimientos;
      });

      // Draw the elements
      drawBars(data);

      setTooltipTotal(tooltip, data);
    });

    // The function to draw the positive bars

    function drawBars(data) {

      yScale.domain(data.map(function(d) {
        return d.tipo;
      }));
      xScale.domain([0, d3.max(data, function(d) {
        return +d.plazas;
      })]);

      xScale2.domain([0, d3.max(data, function(d) {
        return +d.establecimientos;
      })]);

      bar_color.domain(d3.range(function(d) {
        return d.tipo;
      }));

      svgBar.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .style('stroke-width', 0)
        .append('text')
        .style('text-anchor', 'end');

      var myBars2 = svgBar2.selectAll('svgBar2').data(data);

      myBars2.enter()
        .append('rect')
        .attr('class', 'addon')
        .attr('y', function(d) {
          return yScale(d.tipo);
        })
        .attr('x', 10)
        .attr('height', yScale.rangeBand())
        .attr('width', function(d) {
          return xScale(d.plazas);
        })
        .attr('fill', function(d) {
          return bar_color(d.tipo);
        })
        .on('mouseover', function(d) {
          d3.select(this)
            .style('stroke-width', 0.5)
            .style('stroke', 'red');
          setTooltipValues(tooltip, 'Plazas en ' + d.tipo.toLowerCase(), d.plazas);
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('stroke-width', 0);
          setTooltipTotal(tooltip, data);
        });

      var myBars = svgBar.selectAll('svgBar').data(data);

      myBars.enter()
        .append('rect')
        .attr('class', 'addon')
        .attr('y', function(d) {
          return yScale(d.tipo);
        })
        .attr('x', margin.left * 1.8)
        .attr('height', yScale.rangeBand())
        .attr('width', function(d) {
          return xScale2(d.establecimientos);
        })
        .attr('fill', function(d) {
          return d3.hsl(bar_color(d.tipo)).brighter(0.5);
        })
        .on('mouseover', function(d) {
          d3.select(this)
            .style('stroke-width', 0.5)
            .style('stroke', 'red');
          setTooltipValues(tooltip, 'Número de ' + d.tipo.toLowerCase(), d.establecimientos);
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('stroke-width', 0);
          setTooltipTotal(tooltip, data);
        });
    }
  }
};
