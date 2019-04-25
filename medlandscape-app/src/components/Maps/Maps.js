import React, { Component } from 'react'
import { Map, TileLayer } from 'react-leaflet'
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
        //let data = (values[this.props.year]) ? values[this.props.year] : 0;
        // CMI brutto, siehe Wallis
        let data = (values[this.props.year]);
		return data;
	}

	/**
   * Iterates through this.props.objects and finds mean, standard deviation, max and min values.
   * @return {Object} Object.min minimum, Object.max maximum, Object.mean mean, Object.std standard deviation,
 	*/
	setMaxAndMin = () => {
        let min = 1000000000000, max = 0, sum = 0, counter = 0;

        this.props.objects.map((obj) => {
            let val = this.returnData(obj);
            if (val === 0) {
                //console.log(obj.name + " has value of 0.");
            }
            if (obj.name !== "Ganze Schweiz") {
                max = (max < val) ? val : max;
                min = (min > val) ? val : min;
                sum += val;
                counter++;
            }
        })

        const mean = sum/counter;
        sum = 0;

        this.props.objects.map((obj) => {
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
    let type = this.props.variableInfo.variable_type;
    return (type === "float" || type === "number" || type === "percentage" || type === "relevance");
  }

	render() {
        let ready = (this.props.hasLoaded && this.isNormable());
        let componentToRender = null;

        if (ready) {
          componentToRender = (this.props.variableInfo.variable_model === "Canton")
          ? <CantonMap data={this.props.objects} returnData={this.returnData} maxAndMin={this.setMaxAndMin()} />
          : <HospitalMap data={this.props.objects} returnData={this.returnData} maxAndMin={this.setMaxAndMin()} />
        }

        return (
        	<Map // set up map
                className="map"
        		center={[this.state.lat, this.state.lng]}
        		zoom={this.state.zoom}
        		minZoom={8} // set minimum zoom level
        		maxZoom={16} // set maximum zoom level
        		>
        		<TileLayer // add background layer
        			attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        			url="https://api.mapbox.com/styles/v1/nathi/cjf8cggx93p3u2qrqrgwoh5nh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF0aGkiLCJhIjoiY2pmOGJ4ZXJmMXMyZDJ4bzRoYWRxbzhteCJ9.x2dbGjsVZTA9HLw6VWaQow"
        		/>
        		{componentToRender}
        	</Map>
        )
	}
}

export default Maps;
