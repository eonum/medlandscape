import React, { Component, Row, Col } from 'react';
import Control from 'react-leaflet-control';
import './Legend.css'

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
			if (i == 0)
				value = '< ' + upperBoundary + '\n' ;
			else if (i == this.props.boundaries.length - 1)
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
                                return (<div key={legendLines.indexOf(line)} className="line"><div className="box" style={line.color}></div>{line.value}</div>)
                            })
                        }
					</div>
            </Control>
		)
	}
}

export default Legend;
