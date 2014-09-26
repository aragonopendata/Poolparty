'use strict';

(function() {
  var units = 'Votos';

  var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  var width = 1100 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var formatNumber = d3.format(',.0f'), // zero decimal places
    format = function(d) {
      return formatNumber(d) + ' ' + units;
    };

  var color = d3.scale.ordinal()
      .range(['#8DD3C7', '#FB8072', '#80B1D3', '#FDB462', '#FFFFB3', '#BEBADA', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F']);


  // append the svg canvas to the page
  var svg2 = d3.select('.votes').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

  // Set the sankey diagram properties
  var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(4)
    .size([width, height]);

  var path = sankey.link();

  // load the data
  d3.csv('/assets/em_votos_jaca.csv', function(error, data) {

    //set up graph in same style as original example but empty
    var graph = {
      'nodes': [],
      'links': []
    };

    data.forEach(function(d) {
      graph.nodes.push({
        'name': d.source
      });
      graph.nodes.push({
        'name': d.target
      });
      graph.links.push({
        'source': d.source,
        'target': d.target,
        'value': +d.value
      });
    });

    // return only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest()
      .key(function(d) {
        return d.name;
      })
      .map(graph.nodes));

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function(d, i) {
      graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
      graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    //now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function(d, i) {
      graph.nodes[i] = {
        'name': d
      };
    });

    sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

    // add in the links
    var link = svg2.append('g').selectAll('.link')
      .data(graph.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', path)
      .style('stroke-width', function(d) {
        return Math.max(1, d.dy);
      })
      .sort(function(a, b) {
        return b.dy - a.dy;
      });

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr('transform',
        'translate(' + (
          d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        ) + ',' + (
          d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ')');
      sankey.relayout();
      link.attr('d', path);
    }


    // // add the link titles
    //   link.append('title')
    //         .text(function(d) {
    //             return d.source.name + ' → ' + 
    //                 d.target.name + '\n' + format(d.value); });

    // add in the nodes
    var node = svg2.append('g').selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .call(d3.behavior.drag()
        .origin(function(d) {
          return d;
        })
        .on('dragstart', function() {
          this.parentNode.appendChild(this);
        })
        .on('drag', dragmove));

    // add the rectangles for the nodes
    node.append('rect')
      .attr('height', function(d) {
        return d.dy;
      })
      .attr('width', sankey.nodeWidth())
      .style('fill', function(d) {
        return d.color || color(d.name.replace(/ .*/, ''));
      })
      .style('stroke', function(d) {
        return d3.rgb(d.color).darker(1);
      })
      .append('title')
      .text(function(d) {
        return d.name + '\n' + format(d.value);
      });

    // add in the title for the nodes
    node.append('text')
      .attr('x', -6)
      .attr('y', function(d) {
        return d.dy / 2;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(function(d) {
        return d.name;
      })
      .filter(function(d) {
        return d.dy > 150;
      })
      .attr('y', sankey.nodeWidth() / 2)
      .attr('transform', 'rotate(-90)')
      .filter(function(d) {
        return d.x < width / 2 && d.x > 0;
      })
      .attr('x', 6 + sankey.nodeWidth())
      .attr('text-anchor', 'start');


  });
})();
