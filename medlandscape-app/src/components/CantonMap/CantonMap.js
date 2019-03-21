import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import './CantonMap.css';
import NE from './cantons/Neuchatel.json';

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

  render() {
    const position = [this.state.lat, this.state.lng]
    const ne = NE;
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data = {ne}/>
      </Map>
    )
  }
}

export default CantonMap;