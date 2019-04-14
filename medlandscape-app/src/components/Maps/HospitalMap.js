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
        const data = this.props.returnData(item);
        const biggestRadius = 50;

		const a = ((data + Math.abs(min)) / (max + Math.abs(min))) * Math.pow(biggestRadius, 2) * Math.PI;
        let radius = Math.sqrt(a / Math.PI);
        if (data === max) {
            console.log(item.name + ", max: " + max + ", min: " + min + ", radius: " + radius);
        }

		return radius;
	}

	/**
	* Defines what happens if you hover over a hospital with your mouse
	* @param {Object} item = the hospital you are hovering over
	* @param {Object} e = the circlemarker object you are hovering over
	*/
	onMouseOver = (item, e) => {
		e.target.bindPopup("<dd>" + item.name + "</dd><dd>" + item.street + "</dd><dd>" + item.city + "</dd><dd>" + this.props.returnData(item) + "</dd>", {closeButton: false});
		e.target.openPopup();
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
        					weight = "1" // defining how big the outer line of circle is
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
