import React, { Component } from 'react'
import { Map, TileLayer, CircleMarker, Popup, GeoJSON, Marker, LayerGroup } from 'react-leaflet'
import './Maps.css';

import TestComponent from './TestComponent.js';
import HospitalMap from './HospitalMap.js';
import CantonMap from './CantonMap.js';

let maxAndMin = {};
class Maps extends Component {
	constructor(props){
		super(props);
		this.state = {
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
		};
	}

	/*returns data value*/
	returnData = (item) => {
        let varName = this.props.variableInfo.name;
		let values = item.attributes[varName];
        let keys = Object.keys(values);
        let firstEntry = values[keys[0]];
		return firstEntry;
	}

	/*iterates through all values of the given key variable and returns the maximum value*/
	setMaxAndMin = () => {
        let min = 1000000000000, max = 0;
        this.props.objects.map((obj) => {
            let val = this.returnData(obj);
            if (val) {
                max = (max < val) ? val : max;
                min = (min > val) ? val : max;
            }
        })

        return {
            max : max,
            min : min
        }
	}

    componentDidMount() {
        maxAndMin = this.setMaxAndMin();
        console.log(maxAndMin);
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

				{ this.props.variableInfo.model == "Canton"
        			?
						<CantonMap data={this.props.objects} returnData={this.returnData} maxAndMin={maxAndMin} />
       				:
						<HospitalMap data={this.props.objects} returnData={this.returnData} maxAndMin={maxAndMin} />
      			}
			</Map>
		)
	}
}

export default Maps;
