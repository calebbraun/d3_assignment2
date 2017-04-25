/* assignment2.js
 *
 * By Caleb Braun and Max Rohde
 * 4/24/2017
 */


w = 250;
h = 150;
xOffset = 30;		// Space for x-axis labels
yOffset = 35;		// Space for y-axis labels
margin = 0;		// Margin around visualization

var axisTitles = { "num_o_ring_distress" : "Number Distressed O-Rings",
                    "launch_temp" : "Launch Temperature (F)",
                    "leak_check_pressure" : "Leak Check Pressure (psi)",
                    "tufte_metric" : "Tufte Damage Metric"
};

d3.csv("challenger.csv", function(csvData) {
    var headers = ["num_o_ring_distress", "launch_temp", "leak_check_pressure", "tufte_metric"]

    for (var i = 0; i < headers.length; i++) {
        d3.select('#scatterWrapper').append('tr').attr('id', 'row' + i);
        for (var j = 0; j < headers.length; j++) {
            createScatterPlot([i,j], headers[i], headers[j], "flight_index", csvData);
        }
    }
});

// Location is an object with an x and y
function createScatterPlot(location, header1, header2, index, data) {
    // This will define scales that convert values
    // from our data domain into screen coordinates.
    xScale = d3.scale.linear()
                .domain([d3.min(data, function(d) { return parseFloat(d[header1]); })-1,
                         d3.max(data, function(d) { return parseFloat(d[header1]); })+1])
                .range([yOffset + margin, w - margin]);
    yScale = d3.scale.linear()
                .domain([d3.min(data, function(d) { return parseFloat(d[header2]); })-1,
                         d3.max(data, function(d) { return parseFloat(d[header2]); })+1])
                .range([h - xOffset - margin, margin]); // Notice this is backwards!

    // Next, we will create an SVG element to contain our visualization.
    svg = d3.select('#row' + location[0]).append('th').append('svg:svg')
                .attr('width', w)
                .attr('height', h)

    // Build axes! (These are kind of annoying, actually...)
    xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(5);
    xAxisG = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + (h - xOffset) + ')')
                .call(xAxis);
    xLabel = svg.append('text')
                .attr('class','label')
                .attr('x', w/2 - 40)
                .attr('y', h)
                .text(axisTitles[header1]);

    yAxis = d3.svg.axis()
    			.scale(yScale)
    			.orient('left')
    			.ticks(5);
    yAxisG = svg.append('g')
    			.attr('class', 'axis')
    			.attr('transform', 'translate(' + yOffset + ',0)')
    			.call(yAxis);

    yLabel = svg.append('text')
    			.attr('class','label')
    			.attr('x', yOffset/2)
    			.attr('y', h/2-22)
                .style('text-anchor', 'middle')
                .attr('transform', 'rotate(-90,' + String(yOffset/2) + ',' + String(h/2-10) + ')')
    			.text(axisTitles[header2]);


    var circle = svg.selectAll('circle')
        .data(data);

    circle.enter()
        .append('svg:circle')
        .attr('cx', function(d) { return xScale(d[header1]); })
        .attr('cy', function(d) { return yScale(d[header2]); })
        .attr('r', 3)
        .attr('id', function(d) { return 'circ' + d[index]; })
        .style('fill', '#000000')
        .on('mouseover', function(d) {
            d3.selectAll('#circ' + d[index])
                .attr('r',6)
                .style('fill', '#8C3DF5');
        })
        .on('mouseout', function(d) {
            d3.selectAll('#circ' + d[index])
                .attr('r',3)
                .style('fill', '#000000');
        })
        .on('click', function(d) {
            d3.selectAll('#circ' + d[index])
                .style('fill', function()
                    {return (this.style.fill == 'red') ? 'black' : 'red'; });
        })
        .append('svg:title')
        .text(function(d) { return 'Flight Index ' + d[index]; });

}
