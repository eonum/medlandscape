import React, { Component } from 'react'
import exploding_boxplot from 'd3_exploding_boxplot'
import './BoxPlot.css'
import * as d3 from "d3";

/**
* BoxPlot is the entity we use to calculate and draw a boxplot from data given as props
*/
class BoxPlot extends Component {

	componentDidUpdate(){
		// draw a chart if the variable information has been loaded via api-call
		if (this.props.hasLoaded)
			{
				this.drawChart();
			}
	}

	/**
	 * Returns the values stored in a this.props.objects canton/hospital
	 * @param  {Canton || Hospital Object} item The object to extract the values from
	 * @return {int || float} The selected entry in the item.values object
	 */
	returnData = (item) => {
		let varName = this.props.selectedVariable.name;
		let values = item.attributes[varName];
		let data = (values[this.props.year]);
		
		return {v: data, g: "box1", t: item.name};
	}

	/**
	 * Returns an Array where all defined values for given year are stored
	 * This needed to sort the values and draw the boxplot
	 * @return {array} dataArray
	 */
	makeDataArray = () => {
		// sort out undefined values for given year
		let filteredArr = this.props.objects.filter((obj) => {
			return (this.returnData(obj) !== undefined && obj.name !== "Ganze Schweiz");
		});
		
		console.log(filteredArr);
		
		return filteredArr.map((item) => this.returnData(item));
	}

	/**
	 * Draws a BoxPlot
	 */
	drawChart() {
		d3.select("#boxplot svg").remove();
		
		let data = this.makeDataArray();
		
		let chart = exploding_boxplot(data,
            {y: "v", group: "g", color: "g", label: "t"});

		//call chart on a div
		chart("#boxplot");
		
		//move the boxplot a bit, such that the scale is visible even for big numbers
		d3.selectAll("#boxplot svg > g")
			.attr("transform", "translate(100,40)");
		//make the svg a bit bigger
		d3.selectAll("#boxplot svg")
			.attr("height", "570");
	}

	render() {
		return (
        	<div id="boxplot"></div>
        )
	}
}

export default BoxPlot;
