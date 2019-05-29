import React, { Component } from "react";
import PropTypes from 'prop-types';
import { CircleMarker, Popup, LayerGroup, Tooltip } from 'react-leaflet'
import { withTranslation } from 'react-i18next';
import { numberFormat, calculateCircleColor } from './../../../utils.mjs';

/*
* Component to display the different hosptials on our map. Also displays the selected
* HosptialVariable in context with our selected Hospitals on to our map
*/



class HospitalMap extends Component {



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
			const biggestRadius = 50;

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
			weight: 3,
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
		let oldColor = calculateCircleColor(item, this.props.year);
		e.target.setStyle({
			weight: 2,
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
		const {t,data,selectedVariable,returnData,year} = this.props;
		return (
			<LayerGroup>
				{
					this.props.data.map((item) => (
          				<CircleMarker
          					key = {data.indexOf(item)}
        					center={{lon: item.longitude, lat: item.latitude}}
							color= {calculateCircleColor(item, year)}
							weight = "2" // defining how big the outline of circle is
							opacity = "1"
        					fillColor = {calculateCircleColor(item, year)}
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
											<td>{t("popup.hospital")}</td>
											<td>{item.name}</td>
										</tr>
										<tr>
											<td>{t("popup.address")}</td>
											<td><dd>{item.street},</dd>{item.city}</td>
										</tr>
										<tr>
											<td>{selectedVariable.text}:</td>
											<td>{numberFormat(returnData(item))}</td>
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


/**
 * PropTypes:
 * t: used to translate
 * data: Passes the Data from the corresponding selections
 * selectedVarialbe: The Variable that has been selected in the Controlpanel
 * returnData: returns the selected data
 * year: The year picked in the Slider componentToRender
 */


HospitalMap.propTypes = {
	t: PropTypes.string.isRequired,
	data: PropTypes.func.isRequired,
	selectedVariable: PropTypes.object.isRequired,
	returnData: PropTypes.func.isRequired,
	year: PropTypes.func.isRequired,

}
const LocalizedHospitalMap = withTranslation()(HospitalMap);
export default LocalizedHospitalMap;
