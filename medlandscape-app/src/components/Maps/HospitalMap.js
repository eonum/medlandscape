import React, { Component } from "react";
import { CircleMarker, Popup, LayerGroup, Tooltip } from 'react-leaflet'
import { withTranslation } from 'react-i18next';

class HospitalMap extends Component {

    /**
     * Calculates and returns a rgb color
     * @return {String} The rgb color as a string.
     */
	calculateCircleColor = (item) => {
		let color;
		switch (item.attributes["Typ"][this.props.year]) {
			case ("K111"):
				color = "aqua";
				break;
			case ("K112"):
				color = "fuchsia";
				break;
			case ("K121"):
				color = "red";
				break;
			case ("K122"):
				color = "red";
				break;
			case ("K123"):
				color = "red";
				break;
			case ("K211"):
				color = "LimeGreen";
				break;
			case ("K212"):
				color = "LimeGreen";
				break;
			case ("K221"):
				color = "SaddleBrown";
				break;
			// other 5 cases, too lazy to switch them out
			default :
				color = "navy";
				break;
		}
		return color;
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
		//const standardVal = ((this.props.returnData(item)-mean)/std);
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
	* Changes hospital style if you hover on a hospital with your mouse
	* @param {Object} e the event
	*/
	setNewStyle = (e) => {
		e.target.setStyle({weight: 2});
	}

	/**
	* Set back hospital style if you hover off a hospital with your mouse
	* @param {Object} e the event
	*/
	onMouseOut = (e) => {
		if (!e.target.isPopupOpen())
			this.resetStyle(e);
	}

	/**
	* Set back hospital style
	* @param {Object} e the event
	*/
	resetStyle = (e) => {
		e.target.setStyle({weight: 0});
	}

    /**
     * Creates circles to represent hospitals on a Map
	 * Adds popup an tooltip with hospital information to each circle
	 * @return {JSX}
     */
	render() {
		return (
			<LayerGroup>
				{
					this.props.data.map((item) => (
          				<CircleMarker
          					key = {this.props.data.indexOf(item)}
        					center={{lon: item.longitude, lat: item.latitude}}
        					color = {this.calculateCircleColor(item)}
        					opacity = "0.9"
        					weight = "0" // defining how big the outline of circle is
        					radius={this.getNormedRadius(item)} // norming function is here
							onMouseOver = {this.setNewStyle.bind(this)}
							onMouseOut = {this.onMouseOut.bind(this)}
							onClick = {this.setNewStyle.bind(this)}
							onPopupClose = {this.resetStyle.bind(this)}
        				>
        					<Tooltip>
        						{item.name}
        					</Tooltip>
							<Popup
								maxWidth = "250"
								closeButton = {false}
							>
								<table>
									<tr>
										<td>{this.props.t("popup.hospital")}</td>
										<td>{item.name}</td>
									</tr>
									<tr>
										<td>{this.props.t("popup.address")}</td>
										<td><dd>{item.street},</dd>{item.city}</td>
									</tr>
									<tr>
										<td>{this.props.variableInfo.text}:</td>
										<td>{this.props.returnData(item)}</td>
									</tr>
								</table>
							</Popup>
        				</CircleMarker>
      	             ))
				}
			</LayerGroup>
		)
	}
}
const LocalizedHospitalMap = withTranslation()(HospitalMap);
export default LocalizedHospitalMap;
