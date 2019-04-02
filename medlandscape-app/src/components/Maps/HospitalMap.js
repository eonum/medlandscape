import React, { Component } from "react";
import { Map, TileLayer, CircleMarker, Popup, GeoJSON, Marker, LayerGroup } from 'react-leaflet'

class HospitalMap extends Component {

	/*calculates and returns a rgb color*/
	calculateCircleColor(){
		return "rgb(255, 5, 0)";
	}

	/*return normed circle radii*/
	getNormedRadius = (item) => {
		const min = this.props.maxAndMin.min;
		const max = this.props.maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value)
		const normedVal = (this.props.returnData(item) - min) / (max - min);
		const smallest = 4  // minimum pixel size of smallest value
		const factor = 40; // factor + smallest = maximal size of biggest value
		return normedVal*factor+smallest;
	}


	drawHospitals(item){
		return (
			<CircleMarker
                    key = {this.props.data.indexOf(item)}
					center={{lon: item.longitude, lat: item.latitude}}
					color = {this.calculateCircleColor()}
					opacity = "0.8"
					weight = "3" // defining how big the outer line of circle is
					radius={this.getNormedRadius(item)} // norming function is here
					>
						<Popup>
							{this.props.returnData(item)}
						</Popup>
				</CircleMarker>
			)
	}

	render() {
		return (
				<LayerGroup>
					{
						this.props.data.map((item) => {
                            this.drawHospitals(item)
                        })
					}
				</LayerGroup>
		)
	}
}
export default HospitalMap;
