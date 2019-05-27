import React, { Component } from 'react'
import * as d3 from "d3";
import './LinearRegression.css'
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import { withTranslation } from 'react-i18next';
import { numberFormat, pearsonCorrelation } from './../../utils.mjs';

/**
* LinearRegression is the entity we use to calculate and draw a scatterplot with a regression line.
* The rendered JSX also consists of two dropdowns where variables can be selected to display a scatterplot.
* The currently selected variables and language are stored in the state.
* Width, heigth and passing of the chart are also stored in the state.
*/
class LinearRegression extends Component {

	state = {
        xVariable : undefined,
        yVariable : undefined,
		language: this.props.i18n.language,
		w : 700,
		h : 400,
		padding : 30,
		correlation: '',
	};

	componentDidMount(){
		this.drawEmptyChart();
	}

	componentWillUpdate(){
		// if the language is changed,set back variables and remove chart
		if (this.props.i18n.language !== this.state.language){
			this.setState({
				language : this.props.i18n.language,
				xVariable: undefined,
				yVariable: undefined,
			});
			this.drawEmptyChart();
		}
	}

	componentDidUpdate(prevProps){
		// check if response is there and draw chart if so
		if (this.props.tableDataLoaded && !prevProps.tableDataLoaded) {
			console.log("vars have been selected");
			this.drawChart();
		}
		if (this.props.year !== prevProps.year && this.props.hospitals.length > 0) {
			console.log("years have changed");
			this.drawChart();
		}
		if (this.props.hospitals !== prevProps.hospitals && this.props.hasLoaded) {
			console.log("hospitals have been filtered");
			this.drawChart();
		}
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
	   let objArray = [];
	   this.props.hospitals.map((obj) => {
		   let data = this.returnData(obj);
		   if (data.x && data.y && obj.name !== "Ganze Schweiz"){ // sort out undefined values for given year & "ganze schweiz"
				xArray.push(data.x);
				yArray.push(data.y);
				objArray.push(obj);
		   }
	   })
	   return {
		   x: xArray,
		   y: yArray,
		   obj: objArray, //pointer to the hospital
	   };
   }

	/**
	 * Draws a Scatterplot with a regression line
	 */
	drawChart = () => {
		//remove old svg
		this.removeChart();

		// get width, heigth and padding
		const {w, h, padding} = this.state;

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
			.domain([
				d3.min(dataset, function(d){
					return(d.x);
				}),
				d3.max(dataset, function(d){
					return d.x;
				})
			])
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
		// Add a tooltip div. Here we define the general feature of the tooltip: stuff that do not depend on the data point.
     	// Its opacity is set to 0: we don't see it by default.
     	var tooltip = d3.select("#linearregression")
		    .append("div")
		    .style("opacity", 0)
		    .attr("class", "tooltip")

		// add popup
		this.addPopup();

     	// function that changes  tooltip when the user hovers over a point.
     	// opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    	var mouseover = function(d) {
       		d3.select("#linearregression .tooltip").style("opacity", 1)
				.text(d.obj.name);
		}

    	var mousemove = function(d) {
       		d3.select("#linearregression .tooltip")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
    	}

		// close popup if you click outside
		var func = function(e) {
			d3.select("#popup")
				.style("display", "none");
			document.removeEventListener("click", func);
		}

		var mouseclick = function(d) {
       		d3.select("#popup")
				.style("display", "block")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px")
			d3.select("#popupName")
				.text(d.obj.name);
			d3.select("#popupAddress")
				.html("<dd>" + d.obj.street + ",</dd>" + d.obj.city);
			d3.select("#popupXVariable")
				.text(numberFormat(d.x));
			d3.select("#popupYVariable")
				.text(numberFormat(d.y));

			// prevent that the click event closes the popup
			d3.event.stopPropagation();
			document.addEventListener("click", func);
    	}

     	// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    	var mouseleave = function(d) {
       		d3.select("#linearregression .tooltip").transition()
        		.duration(200)
        		.style("opacity", 0)
    	}

		// create svg
		var svg = this.createSvg();

		// append regression line
		svg.append("path")
			.datum(dataset)
			.attr("clip-path", "url(#chart-area)")
			.attr("class", "line")
			.attr("d", newline);

		// add legend
		this.addLegend(svg);

		// append data points
		svg.append("g")
			.attr("id", "circles")
			.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset, function(d){return d;})
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
			.style("cursor", "pointer")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
			.on("click", mouseclick);

		// define and append axes
		this.appendAxes(svg, xScale, yScale);

		// call this to set back and prepare for reupdate
		this.props.tableDataGenerated();
	}

	/**
	* creates the dataset from arrays of data for x and y values
	* @return {Object} dataset that will be visualized
	*/
	createChartdata = () => {
		let dataArrays = this.makeDataArrays();
		var x = dataArrays.x;
		var y = dataArrays.y;
		var obj = dataArrays.obj;
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
		for (i = 0; i < y.length && i < x.length; i++) {
			data.push({
				yhat: yhat[i],
				y: y[i],
				x: x[i],
				obj: obj[i],
			})
		}
		return data;
	}

	/**
	 * Draws an empty scatterplot (only axes without any text)
	 */
	drawEmptyChart = () => {
		this.removeChart();
		const {w, h, padding} = this.state;
		// Define Scales
		var xScale = d3.scaleLinear()
			.domain([undefined, undefined])
			.range([padding,w - padding*2]);
		var yScale = d3.scaleLinear()
			.domain([undefined, undefined])
			.range([h-padding, padding]);

		var svg = this.createSvg();
		this.appendAxes(svg, xScale, yScale);
	}

	/**
	* create svg
	* @return {svg}
	*/
	createSvg = () =>{
		const {w, h, padding} = this.state;
		var svg = d3.select("#linearregression")
			.append("svg")
			.attr("id","linearregressionsvg")
			.attr("width",w)
			.attr("height", h);
		return svg;
	}

	/**
	* append axes to a svg
	* @param {svg}
	* @param {xScale} xScale to append to svg
	* @param {xScale} yScale to append to svg
	*/
	appendAxes = (svg, xScale, yScale) => {
		const {w, h, padding} = this.state;
		//define axes
		var xAxis = d3.axisBottom()
			.scale(xScale)
			.ticks(7, "s");

		var yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(7, "s");

		//append axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h-padding) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);
	}

	/**
	* adding Legend
	* @param {svg}
	*/
	addLegend = (svg) => {
		const {w, h, padding} = this.state;
		// define legend
		let l_offset_h = 310;
		let l_offset_w = 220;
		var legend = svg.selectAll(".legend")
			.data(["A"]) //one hard coded datepoint added
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		// draw legend colored rectangles
		legend.append("rect")
			.attr("x", w - l_offset_w)
			.attr("y", h - l_offset_h)
			.attr("width", 12)
			.attr("height", 12)

		// draw legend text
		let text = this.props.t('graphView.regressionLine');
		let textOffset = 16;
		legend.append("text")
			.attr("x", w - l_offset_w + textOffset)
			.attr("y", h - l_offset_h + 7)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(text);

		let arrs = this.makeDataArrays();
		let r = pearsonCorrelation(arrs.x, arrs.y);
		legend.append("text")
			.attr("x", w - l_offset_w + textOffset)
			.attr("y", h - l_offset_h + 23)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(this.props.t('graphView.correlation') + ": " + r);
	}

	/**
	* adding Popup
	*/
	addPopup = () =>{
		var popup = d3.select("#linearregression")
			.append("div")
			.style("display", "none")
			.attr("id", "popup");

		var table = popup
			.append("table");

		var firstRow = table
			.append("tr");
		firstRow
			.append("td")
			.text(this.props.t("popup.hospital"));
		firstRow
			.append("td")
			.attr("id", "popupName");

		var secondRow = table
			.append("tr");
		secondRow
			.append("td")
			.text(this.props.t("popup.address"));
		secondRow
			.append("td")
			.attr("id", "popupAddress");

		var thirdRow = table
			.append("tr");
		thirdRow
			.append("td")
			.text(this.state.xVariable.text);
		thirdRow
			.append("td")
			.attr("id", "popupXVariable");

		var fourthRow = table
			.append("tr");
		fourthRow
			.append("td")
			.text(this.state.yVariable.text);
		fourthRow
			.append("td")
			.attr("id", "popupYVariable");
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
	updateChart = () => {
		if(this.state.xVariable && this.state.yVariable) {
			this.props.setVariable(this.state.xVariable);
			this.props.requestData([this.state.xVariable,this.state.yVariable]);
		}
	}

	/**
	* remove drawn chart
	*/
	removeChart = () => {
		d3.select("#linearregressionsvg").remove();
		d3.select("#popup").remove();
		d3.select("#linearregression .tooltip").remove();
	}

	/**
	 * Creates zwo dropdowns and scatterplot with regression line
	 * @return {JSX}
	 */
	render() {
		let variables = this.props.variables.filter((variable)=>{
			return(variable.variable_type !== "enum" && variable.variable_type !== "string")
		});
		return (
        	<div>
				<div className="yAxisBtn">
					<p>Y-Achse:</p>
					<DropdownMenu id="yAxis"
		                listItems={variables}
		                selectItem={this.selectYAxis}
		                selectedItem={this.state.yVariable}
		                defaultText={this.props.t('dropDowns.variablesFallback')}
		            />
				</div>
				<div id="linearregression"></div>
				<div className="xAxisBtn">
					<p>X-Achse:</p>
					<DropdownMenu id="xAxis"
						listItems={variables}
						selectItem={this.selectXAxis}
						selectedItem={this.state.xVariable}
						defaultText={this.props.t('dropDowns.variablesFallback')}
					/>
				</div>
			</div>
        )
	}
}

const LocalizedLinearRegression = withTranslation()(LinearRegression);
export default LocalizedLinearRegression;
