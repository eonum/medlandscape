import React, { Component } from 'react'
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import './HospitalMap.css';

class HospitalMap extends Component {  


	constructor(props){
		super(props);
		this.state = {
			data: props.data,
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
			};
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

	/*calculates and returns a rgb color*/
	calculateColor(){
		return "rgb(255, 5, 0)";
	}

	getNormedRadius(item, keys){
		const maxAndMin = this.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.returnData(item, keys)-min)/(max-min);
		const smallest = 4  // minimum pixel size of smallest value
		const factor = 40; // factor + smallest = maximal size of biggest value
		return normedVal*factor+smallest;
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
						<CircleMarker 
							center={{lon: item.longitude, lat: item.latitude}} 
							color = {this.calculateColor()}
							opacity = "0.8"
							weight = "3" // defining how big the outer line of circle is
							radius={this.getNormedRadius(item, this.props.data.keys)} // norming function is here
							>
								<Popup>
									{this.returnData(item, this.props.data.keys)}
								</Popup>
						</CircleMarker>
					))
				}
			</Map>
		)
	}
}

export default HospitalMap;