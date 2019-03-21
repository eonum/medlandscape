import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import './CantonMap.css';
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

  render() {
    const position = [this.state.lat, this.state.lng]
    const nw = NW;
    const ow = OW;
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <GeoJSON data = {nw}/>
        <GeoJSON data = {ow}/>
      </Map>
    )
  }
}

export default CantonMap;