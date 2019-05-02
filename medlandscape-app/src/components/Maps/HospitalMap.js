import React, { Component } from "react";
import { CircleMarker, Popup, LayerGroup, Tooltip } from 'react-leaflet'
import { withTranslation } from 'react-i18next';

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
	* @param {Object} e = the circlemarker (hospital) object you are hovering over
	*/
	onMouseOver = (e) => {
		e.target.setStyle({
			color: '#1996fa',
			opacity: 1
		});
	}

	/**
	* Set back hospital style if you hover off a hospital with your mouse
	* @param {Object} e = the circlemarker (hospital) object you are hovering off
	*/
	onMouseOut = (e) => {
		const oldColor = this.calculateCircleColor();
		e.target.setStyle({color: oldColor});
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
        					color = {this.calculateCircleColor()}
        					opacity = "0.8"
        					weight = "1" // defining how big the outer line of circle is
        					radius={this.getNormedRadius(item)} // norming function is here
							onMouseOver = {this.onMouseOver.bind(this)}
							onMouseOut = {this.onMouseOut.bind(this)}
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
