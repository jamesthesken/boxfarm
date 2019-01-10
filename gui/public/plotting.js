var trace = {
	  x: [1, 2, 3, 4, 5, 6, 7, 8],
	  y: [6, 6.3, 6.2, 6, 6.5, null, 6.2, 6.2],
	  mode: 'lines',
	  connectgaps: true
	};

	var data = [trace];

	var layout = {
	  title: 'Nutrient Tank: pH',
	  showlegend: false
	};

	Plotly.newPlot("graph1", data, layout, {respnsive: true});
