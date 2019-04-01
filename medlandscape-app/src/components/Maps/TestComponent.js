import React, { Component } from "react";
import { MapControl, Marker, LayerGroup } from "react-leaflet";

class TestComponent extends Component {
	render() {
		return ( 
				<LayerGroup>
					<Marker position={[47, 8]}></Marker>
					<Marker position={[47.005, 8.005]}></Marker>
				</LayerGroup>
		)
	}
}
export default TestComponent;
