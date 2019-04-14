import React, { Component } from "react";
import { GeoJSON, Popup, LayerGroup } from 'react-leaflet'
import cantons from './cantons/cantons.json';
import Legend from './Legend.js'

class CantonMap extends Component {

	constructor(props){
		super(props);
		this.state = {
			colorScheme: ''
		};
	}

  /**
   * Definines color of each canton
   * @param  {Canton Object} item (The canton to style)
   * @return {Object} style of the canton.
  */
	getCantonStyle = (item) => {
		const value = this.props.returnData(item);
		const color = this.returnColor(value);
		const cantonStyle = {
			"dashArray": 3, // makes outline of cantons appear dashed (higher value = more distance between dashes)
			"color": "rgb("+color+")", // outline color
    		"fillColor": "rgb("+color+")",
    		"weight": 3,  // defining how big the outline of canton is
    		"opacity": 0.4, // outline opacity
    		"fillOpacity": 0.6
			};
		return cantonStyle;
	}

	/**
	 * Assigns a color to a given value
	 * @param  {Number} value of a variable)
	 * @return {String} rgb color as string.
 	*/
	returnColor = (value) => {
		const classColors = this.returnColorClasses()[this.state.colorScheme];
		const boundaries = this.returnBoundaries();
		for (let i = 0; i < classColors.length && i < boundaries.length; i++){
			const upperBoundary = boundaries[i].upper;
			const lowerBoundary = boundaries[i].lower;
			if (i == 0 && value <= upperBoundary){ // check for values below rounded lower boundary
				return classColors[0];}
			if (value <= upperBoundary && value > lowerBoundary)
				return classColors[i];
			if (i == classColors.length -1 && value > upperBoundary) //check for values above rounded upper boundary
				return classColors[classColors.length-1];
		}
	}

	/**
	 * calculates rounding factor, used to round boundaries to a nice looking number
	 * @param  {Number} boundary that has to be rounded
	 * @param  {Number} classSize coming with the boundary
	 * @return {Number} maxRoundingFactor biggest rounding factor that can be used for the given boundary.
 	*/
	returnRoundFactor = (boundary, classSize) => {
	let maxRoundingFactor = 1, y = 100000000000000000;
	while (y > 1){ // doesnt let maxRoundingFactor become less than 1 (-> wouldn't work correctly with math.round)
		if (classSize > y){
			maxRoundingFactor = y/10;
			break;
		}
		y/=10
	}
	return maxRoundingFactor;
	}

	/**
	 * Calculates nice rounded boundaries for the color classes
	 * @param  {Number} value of a variable)
	 * @return {String} rgb color as string.
	*/
	returnBoundaries = () => {
		const min = this.props.maxAndMin.min;
		const max = this.props.maxAndMin.max;
		const numberOfClasses = this.returnColorClasses()[this.state.colorScheme].length;
		const range = max - min;
		const classSize = range / numberOfClasses;
		// defining boundaries
		let boundaries = [];
		for (let i = 0; i < numberOfClasses; i++){
			let upperBoundary = max - classSize * i;
			let lowerBoundary = max - classSize * (i + 1);
			const uBroundFactor = this.returnRoundFactor(upperBoundary, classSize);
			const lBroundFactor = this.returnRoundFactor(upperBoundary, classSize);
			//different rounding for small class sizes
			if (classSize < 5){
				upperBoundary = upperBoundary.toFixed(1);
				lowerBoundary = lowerBoundary.toFixed(1);
			}
			else {
				upperBoundary = Math.round((upperBoundary) / uBroundFactor) * uBroundFactor;
				lowerBoundary = Math.round((lowerBoundary) / lBroundFactor) * lBroundFactor;
			}
			// put boundaries into array the right way (unshift adds to the front of array)
			boundaries.unshift({
				upper: upperBoundary,
				lower: lowerBoundary
			})
		}
		return boundaries;
	}

	/**
	* Sets state for color scheme
	* color schemes can be mapped to variables in future (with componentWillReceiveProps())
	*/
	componentWillMount(){
		const colorClassesArray = this.returnColorClasses();
		const random = Math.floor((Math.random() * colorClassesArray.length));
		this.setState({
			colorScheme: random,
		});
	}

	/**
 	* Defines canton color classes
	* If you add or remove colors in the returned array, the Legend.js will adapt dynamically
 	* @return {2D Array} color classes arrays consistiing of rgb colors as strings.
  	*/
	returnColorClasses = () => {
		const greenToRed8Classes = ["85, 181, 22", "135, 200, 54", "177, 213, 15", "232, 234, 29", "234, 224, 2", "245, 175, 1", "239, 118, 14", "255, 50, 12"];
		const redToGreen8Classes = greenToRed8Classes.slice().reverse();
		const blue8Classes = ["235, 240, 255", "186, 210, 235", "142, 190, 218", "90, 158, 204", "53, 126, 185", "28, 91, 166", "11, 50, 129", "51, 50, 120"];
		const red8Classes = ["253, 238, 186", "249, 227, 151", "248 ,  199 ,  122", "244,  174,  90", "246,  133,  82" , "235 ,  93,  80", "204,  73,  80",  "165,  50,  50"]
		const red5Classes = ["250, 215, 33", "255, 177, 28", "255, 115, 19", "171, 28, 0", "140, 0, 0"];
		const colorClassesArray = [greenToRed8Classes, blue8Classes, red8Classes, redToGreen8Classes];
		return colorClassesArray;
	}

	/**
	* Defines what happens if you hover over a canton with your mouse
	* @param {Object} item = the canton you are hovering over
	* @param {Object} e = the geoJSON object you are hovering over
	*/
	onMouseOver = (item, e) => {
		// if hovering should highlight a canton (use onMouseOut to reset style. resetting style hasent worked yet sadly)
		/*e.target.setStyle({
			color: '#000',
			opacity: 1
		});*/
		e.layer.bindPopup(item.text + " (" + item.name + ")", {closeButton: false});
		e.layer.openPopup();
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
								ref="geojson"
								key = {this.props.data.indexOf(item)}
								data = {cantons[item.name]}
								style = {this.getCantonStyle(item)}
								onMouseOver = {this.onMouseOver.bind(this, item)}
								>
								<Popup>
									{this.props.returnData(item)}
								</Popup>
							</GeoJSON>
						))
					}
					<Legend maxAndMin={this.props.maxAndMin} classColors={this.returnColorClasses()[this.state.colorScheme]} boundaries={this.returnBoundaries()}/>
				</LayerGroup>
		)
	}
}
export default CantonMap;
