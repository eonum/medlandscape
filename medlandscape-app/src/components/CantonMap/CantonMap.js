import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import './CantonMap.css';
import neuchatel from './cantons/Neuchatel.json';

class CantonMap extends Component {
  state = {
    lat: 46.87,
    lng: 8.24,
    zoom: 8,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const ne = neuchatel
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