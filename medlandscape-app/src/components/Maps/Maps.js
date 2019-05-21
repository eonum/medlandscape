import React, { Component } from 'react'
import { Map, TileLayer, ZoomControl } from 'react-leaflet'
import './Maps.css';
import Control from 'react-leaflet-control';
import MapInfo from '../MapInfo/MapInfo.js';
import TestComponent from './TestComponent.js';
import HospitalMap from './HospitalMap.js';
import CantonMap from './CantonMap.js';

/**
* Maps is the entity we use to draw a map.
* The rendered JSX also consists of the buttons and mapInfo that should be rendered.
* The current position of the map center and zoom are stored in the state.
*/
class Maps extends Component {
	state = {
		filteredObjects : [],
		filtered : false,
		lat : 46.798473,
		lng : 8.231726,
		zoom : 8,
	}

	componentDidUpdate(prevProps) {
		if (this.state.filtered && !prevProps.hasLoaded) {
			this.setState({
				filtered : false
			})
		}
		if (this.props.hasLoaded && !prevProps.hasLoaded) {
			let filteredObjects = this.props.objects.filter((object) => {
				let value = this.returnData(object)
				if (value === "noVariable") {
					console.log("object does not contain variable " + this.props.selectedVariable.name);
					console.log(object);
				}
				return (value !== "noValue");
			});
			this.setState({
				filteredObjects : filteredObjects,
				filtered : true
			});
		}
	}

	/**
     * Returns the values stored in a this.props.objects canton/hospital
     * @param  {Canton || Hospital Object} item The object to extract the values from
     * @return {int || float || string} The selected entry in the item.values object
     */
	returnData = (item) => {
        let varName = this.props.selectedVariable.name;
		let values = item.attributes[varName];
		let data;
		if (values !== undefined) {
			data = (values[this.props.year]) ? values[this.props.year] : "noValue";
		} else {
			data = "noVariable"
		}
		return data;
	}

	/**
   * Iterates through this.props.objects and finds mean, standard deviation, max and min values.
   * @return {Object} Object.min minimum, Object.max maximum, Object.mean mean, Object.std standard deviation,
 	*/
	setMaxAndMin = () => {
        let min = 1000000000000, max = 0, sum = 0, counter = 0;

        this.state.filteredObjects.map((obj) => {
            let val = this.returnData(obj);

            if (obj.name !== "Ganze Schweiz") {
                max = (max < val) ? val : max;
                min = (min > val) ? val : min;
                sum += val;
                counter++;
            }
        })

        const mean = sum/counter;
        sum = 0;

        this.state.filteredObjects.map((obj) => {
            let val = this.returnData(obj);
            if (obj.name !== "Ganze Schweiz") {
                const squareDif = Math.pow(val - mean, 2);
                sum += squareDif;
            }
        })

        const meanSquareDif = sum/counter;
        const std = Math.sqrt(meanSquareDif);

        return {
            mean: mean,
            std: std,
            max: max,
            min: min
        }
	}

	/**
	* Checks if the selected Variable passed through this.props.varInfo
	* is normable (a number or similar).
	* @return {Boolean}
	*/
	isNormable = () => {
		let type = this.props.selectedVariable.variable_type;
		return (type === "float" || type === "number" || type === "percentage" || type === "relevance");
	}

	/**
	* Resets view to original position.
	* Math.random is needed so react does detect a state change and re-renders.
	*/
 	resetView = () => {
		this.setState({
			lat : 46.798473 + 0.1 * Math.random(),
			lng : 8.231726 + 0.1 * Math.random(),
			zoom : 8,
		})
	}

	render() {
		const {selectedVariable, view, mapView, year, objects, hasLoaded} = this.props;
		const {filteredObjects, filtered, lat, lng, zoom} = this.state;
		let variableIsTypeHospital = (selectedVariable.variable_model === "Hospital");

		let componentToRender = null;
		let mapInfo = null;

        if (hasLoaded && filtered && view === 1) {
			let hospitalObjects = (variableIsTypeHospital) ? filteredObjects : [];
			let cantonObjects = (!variableIsTypeHospital) ? filteredObjects : [];
			let maxAndMin = (this.isNormable()) ? this.setMaxAndMin() : 0;

            mapInfo = (
                <MapInfo
					mapView={mapView}
                    year={year}
                    selectedVariable={selectedVariable}
                    nrOfObjects={filteredObjects.length}
                />
            )
            componentToRender = (mapView === 1)
            ? (
				<HospitalMap data={hospitalObjects}
					returnData={this.returnData}
					maxAndMin={maxAndMin}
					selectedVariable={selectedVariable}
					year={year}
				/>
            )
            : (
				<CantonMap
					data={cantonObjects}
					returnData={this.returnData}
					maxAndMin={this.setMaxAndMin()}
					selectedVariable={selectedVariable}
				/>
            );
        }

        return (
        	<Map // set up map
                className="map"
        		center={[lat, lng]}
        		zoom={this.state.zoom}
        		minZoom={8} // set minimum zoom level
        		maxZoom={16} // set maximum zoom level
				zoomControl={false}
        	>
				<ZoomControl
					style="borderRadius=25px;"
					position="topright"
				/>

				<Control position="topright">
			          	<div
							id="rV"
							className="resetView"
							onClick={() => this.resetView()}
						>
						</div>
		      	</Control>
        		<TileLayer // add background layer
        			attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        			url="https://api.mapbox.com/styles/v1/nathi/cjf8cggx93p3u2qrqrgwoh5nh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF0aGkiLCJhIjoiY2pmOGJ4ZXJmMXMyZDJ4bzRoYWRxbzhteCJ9.x2dbGjsVZTA9HLw6VWaQow"
        		/>
                {mapInfo}
        		{componentToRender}
        	</Map>
        )
	}
}

export default Maps;
