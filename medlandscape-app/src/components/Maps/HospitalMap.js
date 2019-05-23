import React, { Component } from "react";
import { CircleMarker, Popup, LayerGroup, Tooltip } from 'react-leaflet'
import { withTranslation } from 'react-i18next';
import { numberFormat } from './../../utils.mjs';

/*
* Component to display the different hosptials on our map. Also displays the selected
* HosptialVariable in context with our selected Hospitals on to our map
*/



class HospitalMap extends Component {

    /**
     * Calculates and returns a rgb color
     * @return {String} The rgb color as a string.
     */
	calculateCircleColor = (item) => {
		let color;
		switch (item.attributes["Typ"][this.props.year]) {
			case ("K111"):
				color = "#fdfd96";
				break;
			case ("K112"):
				color = "#cafd96";
				break;
			case ("K121"):
				color = "#96fdfd";
				break;
			case ("K122"):
				color = "#96fdfd";
				break;
			case ("K123"):
				color = "#96fdfd";
				break;
			case ("K211"):
				color = "#9696fd";
				break;
			case ("K212"):
				color = "#9696fd";
				break;
			case ("K221"):
				color = "#ca96fd";
				break;
			// other 5 cases, too lazy to switch them out
			default :
				color = "#fd9696";
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
		if (this.props.maxAndMin === 0) {
			return 7;
		} else {
			const max = this.props.maxAndMin.max;
			const min = this.props.maxAndMin.min;
			//const mean = this.props.maxAndMin.mean;
			//const std = this.props.maxAndMin.std;
			//const standardVal = ((this.props.returnData(item)-mean)/std);
			const data = this.props.returnData(item);
			const biggestRadius = 60;

			const a = ((data + Math.abs(min)) / (max + Math.abs(min))) * Math.pow(biggestRadius, 2) * Math.PI;
			let radius = Math.round(Math.sqrt(a / Math.PI));

			return (radius <= 7) ? 7 : radius;
		}
	}

	/**
	* Changes hospital style if you hover on a hospital with your mouse
	* @param {Object} e the event
	*/
	setNewStyle = (e) => {
		e.target.setStyle({
			weight: 4,
			fillColor: "#1996fa",
			color: "#1996fa"
		});
	}

	/**
	* Set back hospital style if you hover off a hospital with your mouse
	* @param {Object} e the event
	*/
	onMouseOut = (item, e) => {
		if (!e.target.isPopupOpen())
			this.resetStyle(item, e);
	}

	/**
	* Set back hospital style
	* @param {Object} e the event
	*/
	resetStyle = (item, e) => {
		let oldColor = this.calculateCircleColor(item);
		e.target.setStyle({
			weight: 3,
			color: oldColor,
			fillColor: oldColor,
		});
	}

	/**
	* Define behaviour of click on hospital
	* @param {Object} e the event
	*/
	onClick = (e) => {
		this.setNewStyle(e);
		e.target.closeTooltip();
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
							color= {this.calculateCircleColor(item)}
							weight = "2" // defining how big the outline of circle is
							opacity = "1"
        					fillColor = {this.calculateCircleColor(item)}
							fillOpacity = "0.7"
        					radius={this.getNormedRadius(item)} // norming function is here
							onMouseOver = {this.setNewStyle.bind(this)}
							onMouseOut = {this.onMouseOut.bind(this, item)}
							onClick = {this.onClick.bind(this)}
							onPopupClose = {this.resetStyle.bind(this, item)}
        				>
        					<Tooltip
								sticky = {true}>
        						{item.name}
        					</Tooltip>
							<Popup
								maxWidth = "250"
								closeButton = {false}
							>
								<table>
									<tbody>
										<tr>
											<td>{this.props.t("popup.hospital")}</td>
											<td>{item.name}</td>
										</tr>
										<tr>
											<td>{this.props.t("popup.address")}</td>
											<td><dd>{item.street},</dd>{item.city}</td>
										</tr>
										<tr>
											<td>{this.props.selectedVariable.text}:</td>
											<td>{numberFormat(this.props.returnData(item))}</td>
										</tr>
									</tbody>
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
