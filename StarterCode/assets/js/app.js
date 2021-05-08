var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//C:\Users\Administrator\Documents\D3-Challenge\StarterCode\assets\data\data.csv
// Import Data
d3.csv("assets/data/data.csv").then(function(Data_set) {
console.log (Data_set)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    Data_set.forEach(function(data) {
      data.age = +data.age;
      data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // =============================
    console.log (d3.max(Data_set, d => d.age))
    console.log (d3.min(Data_set, d => d.age))
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data_set, d => d.age)-1, d3.max(Data_set, d => d.age)+2.1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(Data_set, d => d.poverty)-1, d3.max(Data_set, d => d.poverty)+2.1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data_set)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "Aquamarine")
    .attr("opacity", ".5");

    //Add abbrebiations
    chartGroup.selectAll()
    .data(Data_set)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.poverty))
    .text (d => d.abbr)
    .attr("font-size", "9px")
    .style("fill", "black")
    .attr("opacity", ".5")
    .classed("stateText",true);


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip= d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>age: ${d.age}<br>poverty: ${d.poverty}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("poverty");
  }).catch(function(error) {
    console.log(error);
  });
