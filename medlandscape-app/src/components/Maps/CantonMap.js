import React, { Component } from "react";
import { GeoJSON, Popup, LayerGroup } from 'react-leaflet'
import cantons from './cantons/cantons.json';
import Legend from './Legend.js'

class CantonMap extends Component {

  /**
   * Definines color of each canton
   * @param  {Canton Object} item (The canton to style)
   * @return {Object} style of the canton.
  */
	getCantonStyle = (item) => {
		const value = this.props.returnData(item);
		const normedVal = this.normValue(value);
		let color = this.returnColor(normedVal);
		var cantonStyle = {
				"color": "rgb("+color+")", // outline color
    		"fillColor": "rgb("+color+")",
    		"weight": 1,  // defining how big the outline of canton is
    		"opacity": 0.4, // outline opacity
    		"fillOpacity": 0.5
			};
		return cantonStyle;
	}

	/**
	 * Norming a value to a number from 0 (lowest value) to 1 (highest value)
	 * @param  {Number} normedVal (normed Value of a variable)
	 * @return {String} rgb color as string.
	*/
	normValue = (value) => {
		const min = this.props.maxAndMin.min;
		const max = this.props.maxAndMin.max;
		return (value - min) / (max - min);
	}

	/**
	 * Assigns a color to a given normed value
	 * @param  {Number} normedVal (normed Value of a variable)
	 * @return {String} rgb color as string.
 	*/
	returnColor = (normedVal) => {
		// array classColors contains the colors for the classes
		const classColors = this.returnColorArray();
		// defining color upon classing
		let numberOfClasses = classColors.length;
		for (let i = 0; i < numberOfClasses; i++){
			if (normedVal == 0)
				return classColors[0];
			if (normedVal <= (i+1)/numberOfClasses && normedVal > (i)/numberOfClasses)
		 		return classColors[i];
		 }
	 }

	 /**
 	 * Definines canton color classes
	 * If you add or remove colors here, the Legend.js will adapt dynamically
 	 * @return {Array} rgb colors as strings.
  	*/
	returnColorArray = () => {
		const classes = ["250, 215, 33", "255, 177, 28", "255, 115, 19", "171, 28, 0", "127, 36, 0"];
		return classes;
	}
  /**
  	* Draws cantons on the Map
 	*/
	render() {
		return (
				<LayerGroup>
					{
						this.props.data.map((item) => (
							<GeoJSON
								key = {this.props.data.indexOf(item)}
								data = {cantons[item.name]}
								style = {this.getCantonStyle(item)}
								>
								<Popup>
									{this.props.returnData(item)}
								</Popup>
							</GeoJSON>
						))
					}
					<Legend maxAndMin={this.props.maxAndMin} classColors={this.returnColorArray()}/>
				</LayerGroup>
		)
	}
}
export default CantonMap;
