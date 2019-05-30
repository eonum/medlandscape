import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { numberFormat, calculateCircleColor } from './../../utils.mjs';
import * as d3 from "d3";
import './BoxPlot.css'

/**
* BoxPlot is the entity we use to calculate and draw a boxplot from data given as props
*/
class BoxPlot extends Component {

	componentDidUpdate(){
		// draw a chart if the variable information has been loaded via api-call
		if (this.props.hasLoaded && this.props.objects.length !== 0)
			{
				this.drawChart();
			}
	}

	/**
	 * Returns the values stored in a this.props.objects canton/hospital
	 * @param  {Object} item The object to extract the values from
	 * @return {number} The selected entry in the item.values object
	 */
	returnData = (item) => {
		let varName = this.props.selectedVariable.name;
		let values = item.attributes[varName];
		let data = (values[this.props.year]);

		return {value: data, hospital: item};
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
		return filteredArr.map((item) => this.returnData(item));
	}

	/**
	 * Draws a BoxPlot
	 */
	drawChart() {
		let radius = 4;
		let height = 480;
		let width = 600;
		let margin = {top:10,bottom:30,left:40,right:10};

		d3.select("#boxplot svg").remove();

		let data = this.makeDataArray();

		// array only with values (selected variable)
		let valueArr = data.map((d) => d.value).sort(d3.ascending);

		// calculate the quartiles
		let quartiles = [
			d3.quantile(valueArr,0.25),
			d3.quantile(valueArr,0.5),
			d3.quantile(valueArr,0.75)
		];
		let iqr = (quartiles[2]-quartiles[0]) * 1.5;


		// calculate min and max and mark all outliers
		let max = Number.MIN_VALUE;
		let min = Number.MAX_VALUE;

		let box_data = d3.nest()
			.key(function(d) {
				let type = (d.value < quartiles[0] - iqr || d.value > quartiles[2] + iqr) ?
					"outlier" : "normal";

				if(type === "normal" && (d.value < min || d.value > max)){
					max = Math.max(max,d.value);
					min = Math.min(min,d.value);
				}
				return type;
             })
			 .map(data);

		// add empty array if no outliers
		if(!box_data["$outlier"])
			box_data["$outlier"] = [];


		let yscale = d3.scaleLinear()
			.domain(d3.extent(data.map((d) => d.value)))
			.nice()
			.range([height-margin.top-margin.bottom,0]);


		let tickFormat = function(n){return n.toLocaleString()};


		// generate chart
		let svg = d3.select("#boxplot").append("svg")
			.attr("width", width + 100)
            .attr("height", height);


		// append tooltip. opacity is set to 0: we don't see it by default.
     	d3.select("#boxplot")
		    .append("div")
		    .style("opacity", 0)
		    .attr("class", "tooltip")
		// add popup
		this.addPopup();

     	// function that changes  tooltip when the user hovers over a point.
     	// opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    	var mouseover = function(d) {
       		d3.select("#boxplot .tooltip").style("opacity", 1)
				.text(d.hospital.name);
		}

    	var mousemove = function(d) {
       		d3.select("#boxplot .tooltip")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
    	}

		// close popup if you click outside
		var func = function(e) {
			d3.select("#boxplot .popup")
				.style("display", "none");
			document.removeEventListener("click", func);
		}

		var mouseclick = function(d) {
       		d3.select("#boxplot .popup")
				.style("display", "block")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px")
			d3.select("#boxplot .popupName")
				.text(d.hospital.name);
			d3.select("#boxplot .popupAddress")
				.html("<dd>" + d.hospital.street + ",</dd>" + d.hospital.city);
			d3.select("#boxplot .popupVariable")
				.text(numberFormat(d.value));

			// prevent that the click event closes the popup
			d3.event.stopPropagation();
			document.addEventListener("click", func);
    	}

     	// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    	var mouseleave = function(d) {
       		d3.select("#boxplot .tooltip").transition()
        		.duration(200)
        		.style("opacity", 0)
    	}

		svg.append("g").append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("color", "white")
			.style("opacity", 0)
			.on('dblclick', () => {this.implode_boxplot(width, yscale, quartiles, min, max);});


		let container = svg.append("g")
			.attr("transform", "translate(" + (margin.left + 40) + "," + margin.top + ")");

		let yAxis = d3.axisLeft(yscale).tickFormat(tickFormat);

		container.append("g")
			.attr("class", "d3-exploding-boxplot y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin.top-d3.mean(yscale.range()))
            .attr("dy", ".71em")
            .attr("y",-margin.left+5)
            .style("text-anchor", "middle")
            .text("ylab test");

		container = container.insert("g",".axis");

		let boxContent = container.append("g")
			.attr('class','d3-exploding-boxplot boxcontent');

		//create jitter
		boxContent.append("g")
				.attr("class", "d3-exploding-boxplot outliers-points")
				.selectAll(".point")
				.data(box_data["$outlier"])
				.enter()
					.append("circle")
					.call((s) => { // init + draw jitter
						s.attr("class", "d3-exploding-boxplot point")
							.attr("r", radius)
							.style("fill", (d) => {return calculateCircleColor(d.hospital, this.props.year)})
							.attr("cx", function(d){
								return Math.floor(Math.random() * width * 0.8);
							})
							.attr("cy",function(d){
								return yscale(d.value)
							})
							.on("mouseover", mouseover)
							.on("mousemove", mousemove)
							.on("mouseleave", mouseleave)
							.on("click", mouseclick);
					});
		let box = boxContent.append("g")
			.attr("class", "d3-exploding-boxplot normal-points")
			.append("g")
				.attr("class", "d3-exploding-boxplot box")
				.on("click", (d) => {
					this.explode_boxplot(width, radius, yscale, quartiles, box_data, mouseover, mousemove, mouseleave, mouseclick);
				});

		//box
		box.append("rect").attr("class", "d3-exploding-boxplot box")
		//median line
		box.append("line").attr("class", "d3-exploding-boxplot median line")
			.on("mouseover", () => {return mouseover({hospital:{name:this.props.t('boxPlot.median')}})})
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
		//min line
		box.append("line").attr("class","d3-exploding-boxplot min line hline")
			.on("mouseover", () => {return mouseover({hospital:{name:this.props.t('boxPlot.minimum')}})})
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
		//min vline
		box.append("line").attr("class","d3-exploding-boxplot line min vline");
		//max line
		box.append("line").attr("class","d3-exploding-boxplot max line hline")
			.on("mouseover", () => {return mouseover({hospital:{name:this.props.t('boxPlot.maximum')}})})
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
		//max vline
		box.append("line").attr("class","d3-exploding-boxplot line max vline");


		this.drawBox(width, yscale, quartiles, min, max);
	}

	/**
	* explodes the boxplot according to the given parameters (hides the boxplot box and draws points)
	*/
	explode_boxplot(width, radius, yscale, quartiles, box_data, mouseover, mousemove, mouseleave, mouseclick){
		var trans = d3.select("#boxplot").select("g.box").transition()
				.ease(d3.easeBackIn)
				.duration(300);
		// hide boxplot box
		trans.select('rect.box')
					.attr('x',width*0.5)
					.attr('width',0)
					.attr('y',yscale(quartiles[1]))
					.attr('height',0)
		//median line
		trans.selectAll('line')
					.attr('x1',width*0.5)
					.attr('x2',width*0.5)
					.attr('y1',yscale(quartiles[1]))
					.attr('y2',yscale(quartiles[1]))
		// add the points
		d3.select("#boxplot").selectAll('.normal-points')
				.selectAll('.point')
				.data(box_data["$normal"])
				.enter()
					.append('circle')
					.attr('cx',width*0.5)
					.attr('cy',yscale(quartiles[1]))
					.call((s) => {
						s.attr('class','d3-exploding-boxplot point')
							.attr('r',radius)
							.style("fill", (d) => {return calculateCircleColor(d.hospital, this.props.year)})
							.on("mouseover", mouseover)
							.on("mousemove", mousemove)
							.on("mouseleave", mouseleave)
							.on("click", mouseclick);
					})
					.transition()
					.ease(d3.easeBackOut)
					.delay(function(){
						return 300+100*Math.random()
					})
					.duration(function(){
						return 300+300*Math.random()
					})
					.call(function(s){
						s.attr('cx',function(d){
							return Math.floor(Math.random() * width * 0.8);
						})
						.attr('cy',function(d){
							return yscale(d.value);
						})
					});
	}

	/**
	* draws the boxplot box (according to the given parameters)
	*/
	drawBox(width, yscale, quartiles, min, max) {
		let box = d3.select("#boxplot").selectAll("g.box")
			.transition()
				.ease(d3.easeBackOut)
				.duration(300)
				.delay(200);

		box.select('rect.box')
			.attr('x',width * 0.1)
			.attr('width', width * 0.8)
			.attr('y',yscale(quartiles[2]))
			.attr('height', function(d){
				return yscale(quartiles[0])-yscale(quartiles[2])
			});
		//median line
		box.select('line.median')
			.attr('x1',width * 0.1).attr('x2',width*0.9)
			.attr('y1',yscale(quartiles[1]))
			.attr('y2',yscale(quartiles[1]));
		//min line
		box.select('line.min.hline')
			.attr('x1',width*0.25)
			.attr('x2',width*0.75)
			.attr('y1',yscale(Math.min(min,quartiles[0])))
			.attr('y2',yscale(Math.min(min,quartiles[0])));
		//min vline
		box.select('line.min.vline')
			.attr('x1',width*0.5)
			.attr('x2',width*0.5)
			.attr('y1',yscale(Math.min(min,quartiles[0])))
			.attr('y2',yscale(quartiles[0]));
		//max line
		box.select('line.max.hline')
			.attr('x1',width*0.25)
			.attr('x2',width*0.75)
			.attr('y1',yscale(Math.max(max,quartiles[2])))
			.attr('y2',yscale(Math.max(max,quartiles[2])));
		//max vline
		box.select('line.max.vline')
			.attr('x1',width*0.5)
			.attr('x2',width*0.5)
			.attr('y1',yscale(quartiles[2]))
			.attr('y2',yscale(Math.max(max,quartiles[2])));
	}

	/**
	* hides the points and adds the boxplot box again
	*/
	implode_boxplot(width, yscale, quartiles, min, max) {
		d3.select("#boxplot").selectAll(".normal-points")
			.selectAll('circle')
			.transition()
				.ease(d3.easeBackOut)
				.duration(function(){
						return 300+300*Math.random()
				})
				.attr(width*0.5)
				.attr('cy',yscale(quartiles[1]))
				.remove();


		let trans = d3.select("#boxPlot").select('.boxcontent')
			.transition()
				.ease(d3.easeBackOut)
				.duration(300)
				.delay(200);

		trans.select('rect.box')
			.attr('x',0)
			.attr('width',width)
			.attr('y',yscale(quartiles[2]))
			.attr('height', function(d){
				return yscale(quartiles[0])-yscale(quartiles[2])
			})
		this.drawBox(width, yscale, quartiles, min, max);
	}

	/**
	* adds the popup div to the DOM
	*/
	addPopup = () =>{
		d3.select("#boxplot .popup").remove();

		var popup = d3.select("#boxplot")
			.append("div")
			.style("display", "none")
			.attr("class", "popup");

		var table = popup
			.append("table");

		var firstRow = table
			.append("tr");
		firstRow
			.append("td")
			.text(this.props.t("popup.hospital"));
		firstRow
			.append("td")
			.attr("class", "popupName");

		var secondRow = table
			.append("tr");
		secondRow
			.append("td")
			.text(this.props.t("popup.address"));
		secondRow
			.append("td")
			.attr("class", "popupAddress");

		var thirdRow = table
			.append("tr");
		thirdRow
			.append("td")
			.text(this.props.selectedVariable.text);
		thirdRow
			.append("td")
			.attr("class", "popupVariable");
	}

	/**
	 * create exploding boxplot and info header
	 * @return {JSX}
	 */
	render() {
		const { t, selectedVariable } = this.props;
		let varText = t('mapView.variables');
		if (Object.keys(selectedVariable).length > 0) {
			varText += ": " + selectedVariable.text;
		} else {
			varText = t('mapInfo.noVariable');
		}

		return (
			<div>
				<div className="central-panel-header">
					<h1>{t('graphView.boxPlotTitle')}</h1>
					<p className="varText">{varText}</p>
				</div>
        		<div id="boxplot"></div>
			</div>
        )
	}
}

/**
 * PropTypes:
 *
 * objects: list of hospitals with data
 * selectedVariable:  selected variable
 * year: selected year
 * hasLoaded: bool that will be true if the data is loaded
 */

BoxPlot.propTypes = {
	objects: PropTypes.array.isRequired,
    selectedVariable: PropTypes.object.isRequired,
    year: PropTypes.string.isRequired,
    hasLoaded:PropTypes.bool.isRequired
}

const LocalizedBoxPlot = withTranslation()(BoxPlot);
export default LocalizedBoxPlot;
