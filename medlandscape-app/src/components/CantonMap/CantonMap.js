import React, { Component } from 'react';
import { Map, TileLayer, Popup, GeoJSON } from 'react-leaflet';
import './CantonMap.css';
import cantons from './cantons/cantons.json';
import Legend from './Legend.js'

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
		
	getNormedStyle(item, keys){
		const maxAndMin = this.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.returnData(item, keys)-min)/(max-min);
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
		
	render() {
		const position = [this.state.lat, this.state.lng]
		return (
			<Map 
				center={position} 
				zoom={this.state.zoom}
				minZoom={8} // set minimum zoom level
				maxZoom={14} // set maximum zoom level
				>
				<TileLayer
				  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
				/>
				{
					this.props.data.data.map((item) => (
						<GeoJSON 
							data = {cantons[item.name]}
						 	style = {this.getNormedStyle(item, this.props.data.keys)}
						>
							<Popup>
								{this.returnData(item, this.props.data.keys)}
							</Popup>
						</GeoJSON>
					))
				}
				<Legend data={undefined} />
			</Map>

		)
	}
}

export default CantonMap;