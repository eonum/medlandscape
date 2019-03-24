import React, { Component } from 'react'
import { Map, TileLayer, CircleMarker, Popup, getZoom } from 'react-leaflet'
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
	getMax(){
		let max = 0;
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
							if (max < item[keys[1]]) //put year instead of 1 here
    							max = item[keys[1]]
							console.log(max); 
						}
					}
				}
			}
		}
		return max;
	}

	/*calculates and returns a rgb color*/
	calculateColor(){
		return "rgb(255, 5, 0)";
	}

	render() {
		const position = [this.state.lat, this.state.lng]
		const max = this.getMax()
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
							radius={this.returnData(item, this.props.data.keys)/max*50}> // norming function is here
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