import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Control from 'react-leaflet-control';
import './Legend.css'

/*
*A simple component that displays a legend to better discern the shown values on
*the map
*/

class Legend extends Component {

	returnBoxStyle = (color) => {
		return {backgroundColor: 'rgb(' + color + ')'};
	}

	/**
	 * Returns a line for the Legend.
	 * @return {Array} Array containing the lines to display.
	*/
	returnLegendLines = () => {
		let legendObj = [];
		for (let i = 0; i < this.props.classColors.length && i < this.props.boundaries.length; i++){
			let color = this.props.classColors[i];
            let upperBoundary = this.props.boundaries[i].upper;
            let lowerBoundary = this.props.boundaries[i].lower;
            let legendLine = {};

            legendLine.color = this.returnBoxStyle(color);

            let value;
			if (i === 0)
				value = '< ' + upperBoundary + '\n' ;
			else if (i === this.props.boundaries.length - 1)
				value = '> ' +  lowerBoundary + '\n' ;
            else value =  lowerBoundary + ' - ' + upperBoundary + '\n' ;

            legendLine.value = value;
            legendObj.push(legendLine);
		}
		return legendObj;
	}

	render() {
        let legendLines = this.returnLegendLines();
		return (
			<Control position="bottomright">
					<div className="legend">
                        {
                            legendLines.map((line) => {
                                return (<div key={legendLines.indexOf(line)} className="line"><div className="legendBox" style={line.color}></div>{line.value}</div>)
                            })
                        }
					</div>
            </Control>
		)
	}
}

/**
 * PropTypes:
 * classColors: The different colors that will be displayed in the legend and on the map
 * boundaries: Showing the boundaries for the classes
 */
 Legend.propTypes = {
	 classColors: PropTypes.array.isRequired,
	 boundaries: PropTypes.func.isRequired

 }
export default Legend;
