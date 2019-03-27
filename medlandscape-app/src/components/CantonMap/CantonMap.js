import React, { Component } from 'react'
import { Map, TileLayer, Popup, GeoJSON } from 'react-leaflet'
import './CantonMap.css';
import cantons from './cantons/cantons.json';
import NW from './cantons/NW.json';
import OW from './cantons/OW.json';

class CantonMap extends Component {
	constructor(props){
		super(props);
		this.state = {
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
		};
	}
	
	componentDidUpdate() {
		console.log(this.props.cantons);
	}

	/*returns data value*/
	returnData(item, keys){
		let temp = item.attributes;
		for (let i = 0; i < keys.length; i++){
			if(temp == null) {
				return 0;
			} else {
				temp = temp[keys[i]];
			}
		}
		if (temp === undefined)
			temp = 0;
		return temp;
	}

		/*iterates through all values of the given key variable and returns the maximum value*/
	getMaxAndMin(){
		let max = 0;
		let min = 1000000000000;
		const array = this.props.data.data.map((item) => item);
		const keys = this.props.data.keys;
		for (let i = 0; i < array.length; i++){
			let item = array[i].attributes;
			for (let j = 0; j < keys.length; j++){
				if(item == null) {
				continue;
				} else {
					if (item !== undefined){
						item = item[keys[j]];
						if (item !== undefined){
							if (max < item[keys[1]]) //1 equals the year
    							max = item[keys[1]]
    						if (item[keys[1]] < min) //1 equals the year
    							min = item[keys[1]]
							console.log("min: " + min); 
						}
					}
				}
			}
		}
		return {
			max: max,
			min: min
		}
	}
		
	getStyle(item, keys){
		const maxAndMin = this.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.returnData(item, keys)-min)/(max-min);
		let color;
		if (normedVal <= 0.2)
			color = "249, 213, 213"
		if (normedVal <= 0.4 && normedVal > 0.2)
			color = "243, 155, 155"
		if (normedVal <= 0.6 && normedVal > 0.4)
			color = "240, 112, 112"
		if (normedVal <= 0.8 && normedVal > 0.6)
			color = "223, 61, 61"
		if (normedVal <= 1 && normedVal > 0.8)
			color = "255, 0, 0"
	
		var cantonStyle = {
    		"color": "rgb("+color+")",
    		"weight": 0,  // defining how big the outer line of canton is
    		"opacity": 1
			};
		return cantonStyle;
	}
		
	render() {
		const position = [this.state.lat, this.state.lng]
		return (
			<Map center={position} zoom={this.state.zoom}>
				<TileLayer
				  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
				/>
				{
					this.props.data.data.map((item) => (
						<GeoJSON 
							data = {cantons[item.name]}
						 	style = {this.getStyle(item, this.props.data.keys)}
						>
							<Popup>
								{this.returnData(item, this.props.data.keys)}
							</Popup>
						</GeoJSON>
					))
				}
			</Map>
		)
	}
}

export default CantonMap;