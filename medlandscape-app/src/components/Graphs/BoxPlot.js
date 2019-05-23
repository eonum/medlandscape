import React, { Component } from 'react'
import * as d3 from "d3";

/**
* BoxPlot is the entity we use to calculate and draw a boxplot from data given as props
*/
class BoxPlot extends Component {

	componentDidMount(){
		// draw a chart if the variable information has been loaded via api-call
		if (this.props.hasLoaded)
			this.drawChart();
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
		// sort out undefined values for given year
		return this.props.objects.filter((obj) => {
			return (this.returnData(obj) !== undefined && obj.name !== "Ganze Schweiz");
		})
	}

	/**
	 * Draws a BoxPlot
	 */
	drawChart() {
		d3.select("#boxplotsvg").remove();
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
		data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9];
		let minVal = Math.min(...data);
		let maxVal = Math.max(...data);


		// Compute summary statistics used for the box:
		var data_sorted = data.sort(d3.ascending)
		var q1 = d3.quantile(data_sorted, .25)
		var median = d3.quantile(data_sorted, .5)
		var q3 = d3.quantile(data_sorted, .75)
		//var interQuantileRange = q3 - q1
		var min = minVal //q1 - 1.5 * interQuantileRange
		var max = maxVal //q1 + 1.5 * interQuantileRange


		// Show the Y scale
		var y = d3.scaleLinear()
			.domain([minVal - 0.5 * median,maxVal +0.5 * median ])
			.range([height, 0])
		svg.call(d3.axisLeft(y).ticks(20, "s"))

		// a few features for the box
		var center = 200
		var width2 = 100


		var tooltip = d3.select("#boxplot")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")

		var mouseover = function(d) {
			d3.select("#boxplot .tooltip").style("opacity", 1)
			.text("Median: " + median);
		}

		var mousemove = function(d) {
			d3.select("#boxplot .tooltip")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		}

		var mouseleave = function(d) {
			d3.select("#boxplot .tooltip").transition()
				.duration(200)
				.style("opacity", 0)
		}


		// Show the main vertical line
		svg.append("line")
			.attr("x1", center)
			.attr("x2", center)
			.attr("y1", y(min) )
			.attr("y2", y(max) )
			.attr("stroke", "black")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)

		// Show the box
		svg.append("rect")
			.attr("x", center - width2/2)
			.attr("y", y(q3) )
			.attr("height", (y(q1)-y(q3)) )
			.attr("width", width2 )
			.attr("stroke", "black")
			.style("fill", "#69b3a2")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)

		// show median, min and max horizontal lines
		svg.selectAll("toto")
			.data([min, median, max])
			.enter()
			.append("line")
			.attr("x1", center-width2/2)
			.attr("x2", center+width2/2)
			.attr("y1", function(d){ return(y(d))} )
			.attr("y2", function(d){ return(y(d))} )
			.attr("stroke", "black")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
	}

	render() {
		return (
        	<div id="boxplot"></div>
        )
	}
}

export default BoxPlot;
