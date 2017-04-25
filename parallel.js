/* parallel.js
 *
 * By Caleb Braun and Max Rohde
 * 4/24/2017
 */

w = 1000;
h = 500;
xOffset = 30;  // Space for x-axis labels
yOffset = 35;  // Space for y-axis labels
margin = 20;

// Constants for drawing the vis
var headers = [ "area", "RH", "temp", "wind" ];
var axisTitles = {
    "RH": "Relative Humidity (%)",
    "wind": "Wind Speed (kph)",
    "area": "Area Burned (ha)",
    "temp": "Temperature (C)"
};
var monthNames = {  "feb" : "February",
                    "mar" : "March",
                    "apr" : "April",
                    "jun" : "June",
                    "jul" : "July",
                    "aug" : "August",
                    "sep" : "September",
                    "oct" : "October",
                    "nov" : "November",
                    "dec" : "December" };
yScales = [];

// Main function building the visualization
d3.csv("forestfires.csv", function(csvData) {
  var svg1 = d3.select('#svg1').attr('width', w).attr('height', h);

  // Build the scales
  for (var i = 0; i < headers.length; i++) {
      yScale = d3.scale.linear()
                .domain([d3.min(csvData, function(d) { return parseFloat(d[headers[i]]); })-1,
                         d3.max(csvData, function(d) { return parseFloat(d[headers[i]]); })+1])
                .range([h - xOffset - margin, margin]);
      yScales.push(yScale);
  }

  // Add a path item for each line of data
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
      .text(function(d) { return monthNames[d["month"]]; });

  // Build the axes last so that they are on top
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

      // The first label needs to shift to the right a little
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


// Given an index, returns the translation amount to draw the item
function translate(i) {
    return (i / (headers.length-1)) * 0.95 * w + margin;
}

// Given a row of data from the csv, creates a path going to each axis
function generatePath(d) {
  var pathString = "";
  for (var i = 0; i < headers.length; i++) {
    pathString += (i == 0) ? "M" : "L";
    pathString += translate(i) + " " + yScales[i](d[headers[i]]) + " ";
  }
  return pathString
}
