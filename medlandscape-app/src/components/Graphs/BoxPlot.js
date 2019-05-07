import React, { Component } from 'react'
import * as d3 from "d3";

class BoxPlot extends Component {

	componentDidMount(){
		if (this.props.hasLoaded)
			this.drawChart();
	}

	/**
	 * Draws a BoxPlot
	 */
	drawChart() {
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 30, bottom: 30, left: 40},
		  width = 400 - margin.left - margin.right,
		  height = 400 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#boxplot")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// create dummy data
		let data = this.makeDataArray();
		let minVal = Math.min(...data);
		let maxVal = Math.max(...data);

		// Compute summary statistics used for the box:
		var data_sorted = data.sort(d3.ascending)
		var q1 = d3.quantile(data_sorted, .25)
		var median = d3.quantile(data_sorted, .5)
		var q3 = d3.quantile(data_sorted, .75)
		var interQuantileRange = q3 - q1
		var min = q1 - 1.5 * interQuantileRange
		var max = q1 + 1.5 * interQuantileRange

		// Show the Y scale
		var y = d3.scaleLinear()
			.domain([minVal,maxVal])
			.range([height, 0])
		svg.call(d3.axisLeft(y))

		// a few features for the box
		var center = 200
		var width = 100

		// Show the main vertical line
		svg.append("line")
			.attr("x1", center)
			.attr("x2", center)
			.attr("y1", y(min) )
			.attr("y2", y(max) )
			.attr("stroke", "black")

		// Show the box
		svg.append("rect")
			.attr("x", center - width/2)
			.attr("y", y(q3) )
			.attr("height", (y(q1)-y(q3)) )
			.attr("width", width )
			.attr("stroke", "black")
			.style("fill", "#69b3a2")

		// show median, min and max horizontal lines
		svg.selectAll("toto")
			.data([min, median, max])
			.enter()
			.append("line")
			.attr("x1", center-width/2)
			.attr("x2", center+width/2)
			.attr("y1", function(d){ return(y(d))} )
			.attr("y2", function(d){ return(y(d))} )
			.attr("stroke", "black")
	}

	/**
	 * Returns the values stored in a this.props.objects canton/hospital
	 * @param  {Canton || Hospital Object} item The object to extract the values from
	 * @return {int || float} The selected entry in the item.values object
	 */
	returnData = (item) => {
		let varName = this.props.variableInfo.name;
		let values = item.attributes[varName];
		let data = (values[this.props.year]);
		return data;
	}

	/**
	 * Returns an Array where all defined values for given year are stored
	 * This needed to sort the values and draw the boxplot
	 * @return {array} dataArray
	 */
	makeDataArray = () => {
		let dataArray = [];
		this.props.objects.map((obj) => {
			let data = this.returnData(obj);
			if (data) // sort out undefined values for given year
				dataArray.push(data);
		})
		return dataArray;
	}

	render() {
		return (
        	<div id="boxplot"></div>
        )
	}
}

export default BoxPlot;
