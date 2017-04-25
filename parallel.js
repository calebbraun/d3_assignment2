/* parallel.js
 *
 * By Caleb Braun and Max Rohde
 * 4/24/2017
 */

w = 1000;
h = 500;
xOffset = 30;  // Space for x-axis labels
yOffset = 35;  // Space for y-axis labels
margin = 20;    // Margin around visualization

var headers = [ "area", "RH", "temp", "wind" ];
var axisTitles = {
    "RH": "Relative Humidity (%)",
    "wind": "Wind Speed (kph)",
    "area": "Area Burned (ha)",
    "temp": "Temperature (C)"
};
yScales = [];

// Main function building the visualization
d3.csv("forestfires.csv", function(csvData) {
  var svg1 = d3.select('#svg1').attr('width', w).attr('height', h);

  // Build the scales
  for (var i = 0; i < headers.length; i++) {
      yScale = d3.scale.linear()
                .domain([d3.min(csvData, function(d) { return parseFloat(d[headers[i]]); })-1,
                         d3.max(csvData, function(d) { return parseFloat(d[headers[i]]); })+1])
                .range([h - xOffset - margin, margin]); // Notice this is backwards!
      yScales.push(yScale);
  }

  var path = svg1.selectAll('path').data(csvData);

  path.enter()
      .append('svg:path')
      .attr('d', generatePath)
      .attr('fill', 'none')
      .attr('stroke', 'lightgrey')
      .on('mouseover', function() {
          d3.select(this).attr({
              "stroke": "darkorange",
              "stroke-width": 4
          });
      })
      .on('mouseout', function() {
          d3.select(this).attr({
              "stroke": "lightgrey",
              "stroke-width": 1
          });
      })
      .append('svg:title')
      .text(function(d) { return 'Initial spread index: ' + d["ISI"]; });

  for (var i = 0; i < headers.length; i++) {
      yAxis = d3.svg.axis()
          .scale(yScales[i])
          .orient('left')
          .ticks(5);
      yAxisG = svg1.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + translate(i) + ',0)')
          .call(yAxis);
      yLabel = svg1.append('text')
          .attr('class','label')
          .attr('x', yOffset/2)
          .attr('y', 0)
          .attr('transform', 'translate(' + String(translate(i) - margin) + ',0)')
          .style('text-anchor', 'middle')
          .text(axisTitles[headers[i]]);
      if (i == 0) { yLabel.attr('transform', 'translate(15,0)') };

      svg1.append('line')
        .attr('x1', translate(i))
        .attr('y1', margin)
        .attr('x2', translate(i))
        .attr('y2', h - 2 * margin)
        .style('stroke-width', 2)
        .style('stroke', 'black');
  }
});


function translate(i) {
    return (i / (headers.length-1)) * 0.95 * w + margin;
}


function generatePath(d) {
  var pathString = "";
  for (var i = 0; i < headers.length; i++) {
    pathString += (i == 0) ? "M" : "L";
    pathString += translate(i) + " " + yScales[i](d[headers[i]]) + " ";
  }
  return pathString
}
