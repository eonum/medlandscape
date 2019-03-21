import React, { Component } from 'react'
import { Map, TileLayer, Circle, Popup } from 'react-leaflet'
import './HospitalMap.css';

class HospitalMap extends Component {  
	constructor(props){
		super(props);
		this.state = {
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
		};
	}
	componentDidUpdate() {
		console.log(this.props.hospitals);
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
				this.props.hospitals.map((item) => (
					<Circle center={{lon: item.longitude, lat: item.latitude}} radius={40}>
						<Popup>
							{JSON.stringify(item.attributes)}
						</Popup>
					</Circle>
				))
			}
			</Map>
		)
	}
}

export default HospitalMap;