import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
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
						<GeoJSON data = {cantons[item.name]}>
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