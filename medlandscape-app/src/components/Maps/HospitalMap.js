import React, { Component } from "react";
import { Map, TileLayer, CircleMarker, Popup, GeoJSON, Marker, LayerGroup } from 'react-leaflet'

class HospitalMap extends Component {
	constructor(props){
		super(props);
		this.state = {
			data: props.data,
		};
	}
	
	/*calculates and returns a rgb color*/
	calculateCircleColor(){
		return "rgb(255, 5, 0)";
	}

	/*return normed circle radii*/
	getNormedRadius(item, keys){
		const maxAndMin = this.props.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.props.returnData(item, keys)-min)/(max-min);
		const smallest = 4  // minimum pixel size of smallest value
		const factor = 40; // factor + smallest = maximal size of biggest value
		return normedVal*factor+smallest;
	}
	
	
	drawHospitals(item){
		return (
			<CircleMarker 
					center={{lon: item.longitude, lat: item.latitude}} 
					color = {this.calculateCircleColor()}
					opacity = "0.8"
					weight = "3" // defining how big the outer line of circle is
					radius={this.getNormedRadius(item, this.props.data.keys)} // norming function is here
					>
						<Popup>
							{this.props.returnData(item, this.props.data.keys)}
						</Popup>
				</CircleMarker>
			)
	}
	
	render() {
		return ( 
				<LayerGroup>
					{
						this.props.data.data.map((item) => (
							this.drawHospitals(item)
						))
					}
				</LayerGroup>
		)
	}
}
export default HospitalMap;
