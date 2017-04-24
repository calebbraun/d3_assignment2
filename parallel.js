/* parallel.js
 *
 * By Caleb Braun and Max Rohde
 * 4/24/2017
 */

w = 1000;
h = 400;
xOffset = 30;  // Space for x-axis labels
yOffset = 35;  // Space for y-axis labels
margin = 0;    // Margin around visualization

var headers =
[
  "num_o_ring_distress",
  "launch_temp",
  "leak_check_pressure",
  "tufte_metric"
];

var axisTitles = {
    "num_o_ring_distress": "Number Distressed O-Rings",
    "launch_temp": "Launch Temperature (F)",
    "leak_check_pressure": "Leak Check Pressure (psi)",
    "tufte_metric": "Tufte Damage Metric"
};

yScales = [];

d3.csv("challenger.csv", function(csvData) {
  var svg1 = d3.select('#svg1').attr('width', w).attr('height', h);

  // Build the axes
  for (var i = 0; i < headers.length; i++) {
      yScale = d3.scale.linear()
                .domain([d3.min(csvData, function(d) { return parseFloat(d[headers[i]]); })-1,
                         d3.max(csvData, function(d) { return parseFloat(d[headers[i]]); })+1])
                .range([h - xOffset - margin, margin]); // Notice this is backwards!
      yAxis = d3.svg.axis()
  	  		.scale(yScale)
  	  		.orient('left')
  	  		.ticks(5);
      yAxisG = svg1.append('g')
  	  		.attr('class', 'axis')
  	  		.attr('transform', 'translate(' + (i / headers.length) * w + ',0)')
  	  		.call(yAxis);
      yLabel = svg1.append('text')
  	  		.attr('class','label')
  	  		.attr('x', yOffset/2)
  	  		.attr('y', h/2-20)
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90,' + String(i / headers.length) * w + ',0)')
  	  		.text(axisTitles[headers[i]]);

      yScales.push(yScale);

      // svg1.append('text')
      //     .attr('x', (i / headers.length) * w)
      //     .attr('y', h)
      //     .text(axisTitles[headers[i]]);
      // svg1.append('line')
      //     .attr('stroke', 'black')
      //     .attr('stroke-width', 2)
      //     .attr('x1', (i / headers.length) * w)
      //     .attr('y1', 0)
      //     .attr('x2', (i / headers.length) * w)
      //     .attr('y2', h);
  }

  var path = svg1.selectAll('path').data(csvData);

  path.enter()
      .append('svg:path')
      .attr('d', generatePath)
      .attr('fill', 'none')
      .attr('stroke', 'black');

  console.log(yScales);

});

function generatePath(d) {
  //d="M150 0 L75 200 L225 200
  var pathString = "";
  for (var i = 0; i < headers.length; i++) {
    pathString += (i == 0) ? "M" : "L";
    pathString += (i / headers.length) * w + " " + yScales[i](d[headers[i]]) + " ";
  }
  return pathString
}
