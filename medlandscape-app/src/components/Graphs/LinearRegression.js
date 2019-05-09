import React, { Component } from 'react'
import * as d3 from "d3";
import './LinearRegression.css'
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import { withTranslation } from 'react-i18next';

class LinearRegression extends Component {

	state = {
        xVariable : undefined,
        yVariable : undefined,
		language: this.props.i18n.language,
	};

	componentDidUpdate(){
		// check if response is there and draw chart if so
		if(this.props.tableDataLoaded)
			this.drawChart();
	}

	/**
	* Returns the values stored in a this.props.objects canton/hospital
	* @param  {Canton || Hospital Object} item The object to extract the values from
	* @return {Object} with x: Data for the xVariable and y: Data for the yVariable
	*/
   returnData = (item) => {
	   let xVarName = this.state.xVariable.name;
	   let yVarName = this.state.yVariable.name;
	   let xValues = item.attributes[xVarName];
	   let yValues = item.attributes[yVarName];
	   let xData = xValues[this.props.year];
	   let yData = yValues[this.props.year];
	   return {
		   x: xData,
		   y: yData,
	   };
   }

   /**
	* Returns an Object with arrays containing all Values of the chosen variables
	* @return {Object} with x: all data values for the xVariable and y: all data values for the yVariable
	*/
   makeDataArrays = () => {
	   let xArray = [];
	   let yArray = [];
	   this.props.hospitals.map((obj) => {
		   let data = this.returnData(obj);
		   if (data.x && data.y){ // sort out undefined values for given year
				xArray.push(data.x);
				yArray.push(data.y);
		   }
	   })
	   return {
		   x: xArray,
		   y: yArray,
	   };
   }

	/**
	 * Draws a Scatterplot with a regression line
	 */
	drawChart() {
		//remove old svg
		d3.select("#linearregressionsvg").remove();

		var w = 960;
		var h = 500;
		var padding = 30;

		//create data points
		var dataset = this.createChartdata();

		// function for creation of regression line
		var newline = d3.line()
			.x(function(d) {
				return xScale(d.x);
			})
			.y(function(d) {
				return yScale(d.yhat);
			});

		// Define Scales
		var xScale = d3.scaleLinear()
			.domain([0,d3.max(dataset, function(d){
				return d.x;
			})])
			.range([padding,w - padding*2]);
		var yScale = d3.scaleLinear()
			.domain([
				d3.min(dataset, function(d){
					return(d.y);
				}),
				d3.max(dataset, function(d){
			  		return d.y;
				})
			]) //y range is reversed because svg
			.range([h-padding, padding]);

		// Define Axis
		var xAxis = d3.axisBottom()
			.scale(xScale);

		var yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(5);

		// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
     	// Its opacity is set to 0: we don't see it by default.
     	var tooltip = d3.select("#linearregression")
		    .append("div")
		    .style("opacity", 0)
		    .attr("class", "tooltip")
		    .style("background-color", "white")
		    .style("border", "solid")
		    .style("border-width", "1px")
		    .style("border-radius", "5px")
		    .style("padding", "10px")

     	// function that changes  tooltip when the user hovers over a point.
     	// opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    	var mouseover = function(d) {
       		tooltip.style("opacity", 1)
		}

    	var mousemove = function(d) {
       		tooltip.html("tooltip")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
    	}

     	// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    	var mouseleave = function(d) {
       		tooltip.transition()
        		.duration(200)
        		.style("opacity", 0)
    	}

		// create svg
		var svg = d3.select("#linearregression")
			.append("svg")
			.attr("id","linearregressionsvg")
			.attr("width",w)
			.attr("height", h);

		// cut off datapoints that are outside the axis
		svg.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", padding)
			.attr("y", padding)
			.attr("width", w-padding * 3)
			.attr("height", h-padding *2);

		// append data points
		svg.append("g")
			.attr("id", "circles")
			.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", function(d){
				return xScale(d.x);
			})
			.attr("cy", function(d){
				return yScale(d.y);
			})
			.attr("r", 3.5)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);

		// append regression line
		svg.append("path")
			.datum(dataset)
			.attr("clip-path", "url(#chart-area)")
			.attr("class", "line")
			.attr("d", newline);

		// append Axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h-padding) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);

		// call this to set back and prepare for reupdate
		this.props.tableDataGenerated();
	}

	createChartdata = () => {
		let dataArrays = this.makeDataArrays();
		var x = dataArrays.x;
		var y = dataArrays.y;
		var n = x.length;

		// create x and y sums
		let xSum = 0;
		let ySum = 0;
		for (var i = 0; i < n; i++) {
			xSum += x[i]
			ySum += y[i]
		}

		// calculate mean x and y
		let xMean = xSum / n;
		let yMean = ySum / n;

		// calculate coefficients
		var xvariance = 0;
		var yvariance = 0;
		var term1 = 0;
		var term2 = 0;
		for (i = 0; i < x.length; i++) {
			xvariance = x[i] - xMean;
			yvariance = y[i] - yMean;
			term1 += xvariance * yvariance;
			term2 += xvariance * xvariance;
			}
		var b1 = term1 / term2;
		var b0 = yMean - (b1 * xMean);

		// perform regression
		let yhat = [];

		// fit line using coeffs
		for (i = 0; i < x.length; i++) {
			yhat.push(b0 + (x[i] * b1));
		}

		// create actual data objects
		var data = [];
		for (i = 0; i < y.length; i++) {
			data.push({
				"yhat": yhat[i],
				"y": y[i],
				"x": x[i]
			})
		}
		return data;
	}

	/**
    * defining behaviour on dropdown click
	* write the selected variable to state and update chart on X axis
    */
    selectXAxis = (item) => {
		this.setState({
			xVariable : item,
		}, () => {
			this.updateChart();
		});
	}

	/**
    * defining behaviour on dropdown click
	* write the selected variable to state and update chart on Y axis
    */
    selectYAxis = (item) => {
		this.setState({
			yVariable : item,
		}, () => {
			this.updateChart();
		});
	}

	/**
	* check if both x and y variable have been selected
	* update selected variables in state if so
	*/
	updateChart() {
		if(this.state.xVariable && this.state.yVariable)
			this.props.requestData([this.state.xVariable,this.state.yVariable]);
	}

	componentWillUpdate(){
		// if the language is changed,set back variables and remove chart
		if (this.props.i18n.language !== this.state.language){
			this.setState({
				language : this.props.i18n.language,
				xVariable: undefined,
				yVariable: undefined,
			});
			d3.select("#linearregressionsvg").remove();
		}
	}

	/**
	 * Creates zwo dropdowns and scatterplot with regression line
	 * @return {JSX}
	 */
	render() {
        return (
        	<div>
				<div id="linearregression"></div>
				<DropdownMenu id="xAxis"
                    listItems={this.props.variables}
                    selectItem={this.selectXAxis}
                    selectedItem={this.state.xVariable}
                    defaultText={this.props.t('dropDowns.variablesFallback')}
                />
				<DropdownMenu id="yAxis"
                    listItems={this.props.variables}
                    selectItem={this.selectYAxis}
                    selectedItem={this.state.yVariable}
                    defaultText={this.props.t('dropDowns.variablesFallback')}
                />
			</div>

        )
	}
}

const LocalizedLinearRegression = withTranslation()(LinearRegression);
export default LocalizedLinearRegression;
