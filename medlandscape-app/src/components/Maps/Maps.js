import React, { Component } from 'react'
import { Map, TileLayer, ZoomControl } from 'react-leaflet'
import './Maps.css';
import Control from 'react-leaflet-control';
import MapInfo from '../MapInfo/MapInfo.js';
import HospitalMap from './HospitalMap.js';
import CantonMap from './CantonMap.js';

/**
* Maps is the entity we use to draw a map.
* The rendered JSX also consists of the buttons and mapInfo that should be rendered.
* The current position of the map center and zoom are stored in the state.
*/
class Maps extends Component {
	state = {
		lat : 46.798473,
		lng : 8.231726,
		zoom : 8,
	}

	filterObjects = () => {
		return this.props.objects.filter((object) => {
			return (this.returnData(object) !== "noValue");
		});
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
	setMaxAndMin = (objects) => {
        let min = 1000000000000, max = 0; //sum = 0, counter = 0;

		objects.map((obj) => {
			let val = this.returnData(obj);
			if (obj.name !== "Ganze Schweiz") {
				max = (max < val) ? val : max;
				min = (min > val) ? val : min;
				// sum += val;
				// counter++;
			}
		})

		return {
            // mean: mean,
            // std: std,
            max: max,
            min: min
        }

        // const mean = sum/counter;
        // sum = 0;
		//
        // objects.map((obj) => {
        //     let val = this.returnData(obj);
        //     if (obj.name !== "Ganze Schweiz") {
        //         const squareDif = Math.pow(val - mean, 2);
        //         sum += squareDif;
        //     }
        // })
		//
        // const meanSquareDif = sum/counter;
        // const std = Math.sqrt(meanSquareDif);

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
		const {objects, selectedVariable, view, mapView, year, hasLoaded} = this.props;
		const {lat, lng, zoom} = this.state;

		let mapInfo = null;
		let componentToRender = null;


        if (view === 1) {
			let filteredObjects = this.filterObjects();
			if (filteredObjects.length > 0 && hasLoaded) {
				let maxAndMin;

				if (mapView === 1) {
					maxAndMin = (this.isNormable()) ? this.setMaxAndMin(filteredObjects) : 0;
				} else {
					maxAndMin = this.setMaxAndMin(filteredObjects);
				}

				componentToRender = (mapView === 1)
				? (
					<HospitalMap
						data={filteredObjects}
						returnData={this.returnData}
						maxAndMin={maxAndMin}
						selectedVariable={selectedVariable}
						year={year}
					/>
				)
				: (
					<CantonMap
						data={filteredObjects}
						returnData={this.returnData}
						maxAndMin={maxAndMin}
						selectedVariable={selectedVariable}
					/>
				);
			}

			mapInfo = (
				<MapInfo
				mapView={mapView}
				year={year}
				selectedVariable={selectedVariable}
				nrOfObjects={filteredObjects.length}
				/>
			)
        }


        return (
        	<Map // set up map
                className="map"
        		center={[lat, lng]}
        		zoom={zoom}
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
