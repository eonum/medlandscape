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
			lat: 46.87,
			lng: 8.24,
			zoom: 8,
		};
	}

	/**
     * Returns the values stored in a this.props.objects canton/hospital
     * !! Currently always returns firstEntry (first available year)
     * @param  {Canton || Hospital Object} item The object to extract the values from
     * @return {int || float} The selected entry in the item.values object
     */
	returnData = (item) => {
        let varName = this.props.variableInfo.name;
		let values = item.attributes[varName];
        let keys = Object.keys(values);
        let firstEntry = values[keys[0]];
		return firstEntry;
	}

    /**
     * Iterates through this.props.objects and finds max and min values.
     */
	setMaxAndMin = () => {
        let min = 1000000000000, max = 0;
        this.props.objects.map((obj) => {
            let val = this.returnData(obj);
            if (val) {
                max = (max < val) ? val : max;
                min = (min > val) ? val : min;
            }
        })

        return {
            max : max,
            min : min
        }
	}

    /**
     * Checks if the selected Variable passed through this.props.varInfo
     * is normable (a number or similar).
     * @return {Boolean}
     */
    isNormable = () => {
        let type = this.props.variableInfo.variable_type;
        return (type === "float" || type === "number" || type === "percentage" || type === "relevance");
    }

	render() {
        let ready = (this.props.hasLoaded && this.isNormable());
        let componentToRender = null;
        if (ready) {
            componentToRender = (this.props.variableInfo.variable_model === "Canton")
                ?
                    <CantonMap data={this.props.objects} returnData={this.returnData} maxAndMin={this.setMaxAndMin()} />
                :
                    <HospitalMap data={this.props.objects} returnData={this.returnData} maxAndMin={this.setMaxAndMin()} />
        }

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

				{componentToRender}

			</Map>
		)
	}
}

export default Maps;
