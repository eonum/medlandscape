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

	returnData(item, keys){
		let temp = item.attributes;
		for (let i = 0; i < keys.length; i++){
			if(temp == null) {
				console.log(typeof temp);
				return 0;
			} else {
				temp = temp[keys[i]];
			}
		}
		if (temp === undefined)
			temp = 0;
		return 2*temp;
	}

	componentDidUpdate() {
		console.log(this.props.data);
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
					<CircleMarker center={{lon: item.longitude, lat: item.latitude}} radius={this.returnData(item, this.props.data.keys)}>
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