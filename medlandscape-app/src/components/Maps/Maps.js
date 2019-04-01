import React, { Component } from 'react'
import { Map, TileLayer, CircleMarker, Popup, GeoJSON, Marker, LayerGroup } from 'react-leaflet'
import './Maps.css';

import TestComponent from './TestComponent.js';
import HospitalMap from './HospitalMap.js';
import CantonMap from './CantonMap.js';

class Maps extends Component {  
	constructor(props){
		super(props);
		this.state = {
			data: props.data,
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
		};
		
		this.returnData = this.returnData.bind(this); //with those bindings, we can pass methods to children components as props
		this.getMaxAndMin = this.getMaxAndMin.bind(this);
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

	render() {
		return ( 
			<Map // set up map
				center={[this.state.lat, this.state.lng]} 
				zoom={this.state.zoom}
				minZoom={8} // set minimum zoom level
				maxZoom={14} // set maximum zoom level
				>
				<TileLayer // add background layer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
				/> 
			
				{ this.props.data.model == "Canton" // add Legend if canton map is displayed, else add nothing
        			?
						<CantonMap data={this.props.data} returnData={this.returnData} getMaxAndMin={this.getMaxAndMin} />
       				:
						<HospitalMap data={this.props.data} returnData={this.returnData} getMaxAndMin={this.getMaxAndMin} />
      			}
			</Map>
		)
	}
}

export default Maps;