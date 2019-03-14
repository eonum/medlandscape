import React, { Component } from 'react';

class Map extends Component {
	constructor(props) {
    	super(props);
   		console.log("hallo");
  		this.state = {};
  		loadMap();
   	}
    render() {
        return (
        	<div 
        		id="mapid">
        	</div>
        );
    }
}

export default Map;

function loadMap(){
	var mymap = L.map('mapid').setView([46.87, 8.24], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; ' +
            '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(mymap);
  }
