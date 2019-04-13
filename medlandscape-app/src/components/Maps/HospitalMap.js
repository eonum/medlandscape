import React, { Component } from "react";
import { CircleMarker, Popup, LayerGroup } from 'react-leaflet'

class HospitalMap extends Component {

    /**
     * Calculates and returns a rgb color
     * @return {String} The rgb color as a string.
     */
	calculateCircleColor = () =>{
		return "rgb(255, 5, 0)";
	}

	/*return normed circle radii*/
    /**
     * Computes the Radius for a hospital point.
     * @param  {Hospital Object} item The hospital
     * @return {int} size of the radius
     */
	getNormedRadius = (item) => {
		const max = this.props.maxAndMin.max;
		const min = this.props.maxAndMin.min;
		const mean = this.props.maxAndMin.mean;
		const std = this.props.maxAndMin.std;
		const standardVal = ((this.props.returnData(item)-mean)/std);

		const a = ((this.props.returnData(item) - Math.abs(min)) * 10 / max);
		console.log(a);

		return (Math.pow(a / Math.PI, 0.5));
	}

	/**
	* Defines what happens if you hover over a hospital with your mouse
	* @param {Object} item = the hospital you are hovering over
	* @param {Object} e = the circlemarker object you are hovering over
	*/
	onMouseOver = (item, e) => {
		e.target.bindPopup("<dd>" + item.name + "</dd>" + "<dd>" + item.street + "</dd>" + "<dd>" + item.city + "</dd>", {closeButton: false});
		e.target.openPopup();
		console.log(item);
 	}

    /**
     * Creates circles to represent hospitals on a Map
     */
	render() {
		return (
				<LayerGroup>
					{
						this.props.data.map((item) => (
      				<CircleMarker
      					key = {this.props.data.indexOf(item)}
								center={{lon: item.longitude, lat: item.latitude}}
								color = {this.calculateCircleColor()}
								opacity = "0.8"
								weight = "3" // defining how big the outer line of circle is
								radius={this.getNormedRadius(item)} // norming function is here
								onMouseOver = {this.onMouseOver.bind(this, item)}
								>
								<Popup>
									{this.props.returnData(item)}
								</Popup>
							</CircleMarker>
          	))
					}
				</LayerGroup>
		)
	}
}
export default HospitalMap;
