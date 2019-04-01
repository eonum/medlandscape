import React, { Component } from "react";
import { Map, TileLayer, CircleMarker, Popup, GeoJSON, Marker, LayerGroup } from 'react-leaflet'
import cantons from './cantons/cantons.json';
import Legend from './Legend.js'

class CantonMap extends Component {
	constructor(props){
		super(props);
		this.state = {
			data: props.data,
		};
	}
	
	/* defining canton color classes and color of each canton*/
	// TODO: extract color definition and color class making into individual functions
	getCantonStyle(item, keys){
		const maxAndMin = this.props.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.props.returnData(item, keys)-min)/(max-min);
		let color;
		// defining color upon classing
		// array classCollors contains the colors for the classes
		const classColors = Array("250, 215, 33", "255, 177, 28", "255, 115, 19", "171, 28, 0", "127, 36, 0")
		for (let i = 0; i < 5; i++){
			if (normedVal <= (i+1)*0.2 && normedVal >= (i)*0.2)
				color = classColors[i];
		}
		var cantonStyle = {
			"color": "rgb("+color+")", // outline color
    		"fillColor": "rgb("+color+")",
    		"weight": 1,  // defining how big the outline of canton is
    		"opacity": 0.4, // outline opacity
    		"fillOpacity": 0.5
			};
		return cantonStyle;
	}
	
	drawCantons(item){
			return(
				<GeoJSON 
					data = {cantons[item.name]}
				 	style = {this.getCantonStyle(item, this.props.data.keys)}
					>	
					<Popup>
						{this.props.returnData(item, this.props.data.keys)}
					</Popup>
				</GeoJSON>
				)
	}
	
	
	render() {
		return ( 
				<LayerGroup>
					{
						this.props.data.data.map((item) => (
							this.drawCantons(item)
						))
					}
					<Legend data={undefined}/>
				
				</LayerGroup>
		)
	}
}
export default CantonMap;
