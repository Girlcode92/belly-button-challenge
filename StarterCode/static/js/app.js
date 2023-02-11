// Construct URL for json retrieval
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function buildMetadata(sample) {
	d3.json(url).then((data) => {
		let metadata = data.metadata;
		// Filter the data for the object with the desired sample number
		let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
		let result = resultArray[0];
		
		// Use d3 to select the panel with id of `#sample-metadata`, clear existing metadata

		d3.select("#sample-metadata").html("");
		
		// Inside the loop, use d3 to append new tags for each key-value in the metadata.
		
		 for (key in result){
		  // This line of code takes the d3 selection and appends text to it
      d3.select("#sample-metadata").append("h5").text(`${key}: ${result[key]}`);

		};
		
	});
};

// Create a function to build the charts
function buildCharts(sample) {
	d3.json(url).then((data) => {
		let samples = data.samples;
		let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
		let result = resultArray[0];
		
		let otu_ids = result.otu_ids;
		let otu_labels = result.otu_labels;
		let sample_values = result.sample_values;
		
		// Build a Bubble Chart
    let bubbleChart = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels,
      mode: "markers",
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Portland'
      }
  };

  // Set up the layout
  var layout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID (Microbial Species Identification Number)"},
      yaxis: {title: "Amount Present in Culture"}
  };

  // Call Plotly to plot the bubble chart on the page
  Plotly.newPlot("bubble", [bubbleChart], layout);
		
		
		
	// Build a Bar Chart
  let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()
  let xvalues = sample_values.slice(0,10).reverse()
  let labelValues = otu_labels.slice(0,10).reverse()

  let barChart = {
    y: yvalues,
    x: xvalues,
    text: labelValues,
    type: "bar",
    orientation: "h",
    marker: {
      color: 'rgba(255, 184, 41, 0.8)'}
    };

  // Layout set up
  var layout = {
    title: "Top 10 Belly Button Bacteria"
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", [barChart], layout)
  })
};

// Build a gauge chart
// Note you have to access the metadata data now instead of sample data

function buildGaugeChart(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];


    // Create variable and turn into float 
    var frequency = parseFloat(result.wfreq);

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: frequency,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "004666" },
          steps: [
            { range: [0, 2], color: "#ffffd4"} ,
            { range: [2, 4], color: "#fed98e" },
            { range: [4, 6], color: "#fe9929" },
            { range: [6, 8], color: "#d95f0e" },
            { range: [8, 10], color:"#993404"}
          ],
        }
      }
    ];

    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darklavender", family: "Tahoma" }
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
};



// Create a function that initializes the dashboard 
function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(url).then((data) => {
    let sampleNames = data.names;

	// Use a for loop to append to the 'selector' object 
    for (let i = 0; i < sampleNames.length; i++){
      // append to the selector object
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);

    };

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGaugeChart(firstSample);
  });
};

// See the optionChanged() function referenced in line 25 of index.html

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGaugeChart(newSample);
};

// Initialize the dashboard
init();