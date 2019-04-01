import React, { Component } from 'react'
import { Map, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet'
import './Maps.css';
import cantons from './cantons/cantons.json';
import Legend from './Legend.js'

class Maps extends Component {  
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

	/* defining canton color classes and color of each canton*/
	// TODO: extract color definition and color class making into individual functions
	getCantonStyle(item, keys){
		const maxAndMin = this.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.returnData(item, keys)-min)/(max-min);
		let color;
		// defining color upon classing
		// array classCollors contains the colors for the classes
		const classColors = Array("250, 215, 33", "255, 177, 28", "255, 115, 19", "171, 28, 0", "127, 36, 0")
		for (let i = 0; i < 5; i++){
			if (normedVal <= (i+1)*0.2 && normedVal >= (i)*0.2)
				color = classColors[i];
		}
		var cantonStyle = {
			"color": "rgb("+color+")", // outline color
    		"fillColor": "rgb("+color+")",
    		"weight": 1,  // defining how big the outline of canton is
    		"opacity": 0.4, // outline opacity
    		"fillOpacity": 0.5
			};
		return cantonStyle;
	}

	/*calculates and returns a rgb color*/
	calculateCircleColor(){
		return "rgb(255, 5, 0)";
	}

	/*return normed circle radii*/
	getNormedRadius(item, keys){
		const maxAndMin = this.getMaxAndMin();
		const min = maxAndMin.min;
		const max = maxAndMin.max;
		// norming variable value to a number from 0 (lowest value) to 1 (highest value) 
		const normedVal = (this.returnData(item, keys)-min)/(max-min);
		const smallest = 4  // minimum pixel size of smallest value
		const factor = 40; // factor + smallest = maximal size of biggest value
		return normedVal*factor+smallest;
	}

	drawCantons(item){
			return(
				<GeoJSON 
					data = {cantons[item.name]}
				 	style = {this.getCantonStyle(item, this.props.data.keys)}
					>	
					<Popup>
						{this.returnData(item, this.props.data.keys)}
					</Popup>
				</GeoJSON>
				)
	}

	drawHospitals(item){
		return (
			<CircleMarker 
					center={{lon: item.longitude, lat: item.latitude}} 
					color = {this.calculateCircleColor()}
					opacity = "0.8"
					weight = "3" // defining how big the outer line of circle is
					radius={this.getNormedRadius(item, this.props.data.keys)} // norming function is here
					>
						<Popup>
							{this.returnData(item, this.props.data.keys)}
						</Popup>
				</CircleMarker>
			)
	}

	/* simple function deciding*/
	drawDecision(item){
		const model = this.props.data.model;
		if (model == "Canton")
			return this.drawCantons(item);
		if (model == "hospital")
			return this.drawHospitals(item);
		/* TODO: add else statement with error message to control if props are handed in correctly*/
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
				{ // go through array and decide what to display
					this.props.data.data.map((item) => (
						this.drawDecision(item)
					))
				}
				{ this.props.data.model == "Canton" // add Legend if canton map is displayed, else add nothing
        			? <Legend data={undefined} />
       				: null
      			}
			</Map>
		)
	}
}

export default Maps;