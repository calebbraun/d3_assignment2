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
  "RH",
  "wind",
  "area",
  "temp"
];

var axisTitles = {
    "RH": "Humidity",
    "wind": "Wind Speed (kph)",
    "area": "Area Burned (ha)",
    "temp": "Temperature (C)"
};

yScales = [];

d3.csv("forestfires.csv", function(csvData) {
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
  	  		.attr('transform', 'translate(' + (i / (headers.length-1)) * w + ',0)')
  	  		.call(yAxis);
      yLabel = svg1.append('text')
  	  		.attr('class','label')
  	  		.attr('x', yOffset/2)
  	  		.attr('y', h/2-20)
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90,' + String(i / (headers.length-1)) * w + ',0)')
  	  		.text(axisTitles[headers[i]]);

      yScales.push(yScale);
  }

  var path = svg1.selectAll('path').data(csvData);

  path.enter()
      .append('svg:path')
      .attr('d', generatePath)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .on('mouseover', function() {
          d3.select(this).attr({
              "stroke": "deepskyblue",
              "stroke-width": 4
          });
      })
      .on('mouseout', function() {
          d3.select(this).attr({
              "stroke": "black",
              "stroke-width": 1
          });
      });
});

function generatePath(d) {
  var pathString = "";
  for (var i = 0; i < headers.length; i++) {
    pathString += (i == 0) ? "M" : "L";
    pathString += (i / (headers.length-1)) * w + " " + yScales[i](d[headers[i]]) + " ";
  }
  return pathString
}
