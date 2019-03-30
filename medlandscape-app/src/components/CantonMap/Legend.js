import React, { Component } from 'react';
import Control from 'react-leaflet-control';

class Legend extends Component {
	constructor(props){
		super(props);
	}
	render() {
		let styles = {
    	margin: '20px',
	    width: '250px',
   		height: '250px',
   		backgroundColor: 'yellow',
  		}
		return (
			<Control position="bottomright">
					<div className="legend" style={styles}>
  							this is the legend
					</div>
      		</Control>
		)
	}
}

export default Legend;