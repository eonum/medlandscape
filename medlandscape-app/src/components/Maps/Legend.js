import React, { Component, Row, Col } from 'react';
import Control from 'react-leaflet-control';
import './Legend.css'

class Legend extends Component {

	/**
	 * takes the class values the legend should display and writes them to strings
	 * @return {Array} classValues as strings
	*/
	returnClassValues = () => {
		const classValues =[];
		for (let i = 0; i < this.props.classColors.length && i < this.props.boundaries.length; i++){
			const upperBoundary = this.props.boundaries[i].upper.toString();
			const lowerBoundary = this.props.boundaries[i].lower.toString();
			// string representation
			let value;
			if (i == 0) // lowest color class string
				value = '< ' + upperBoundary + '\n' ;
			else if (i == this.props.boundaries.length-1) //highest color class string
				value = lowerBoundary + ' <' + '\n' ;
			else value =  lowerBoundary + ' - ' + upperBoundary + '\n' ;
			classValues.push(value);
			}
		return classValues;
	}

	returnLegendStyle = () => {
		return {height: this.props.classColors.length*30+'px'};
	}

	returnBoxStyle = (color) => {
		return {backgroundColor: 'rgb('+color+')'};
	}

	/**
	 * making the colored boxes the legend should display
	 * @return {Array} box in html
	*/
	returnColorBoxes = () => {
		let boxes = [];
		for (let i = 0; i < this.props.classColors.length; i++){
			const color = this.props.classColors[i];
			boxes.push(<div className="box" style={this.returnBoxStyle(color)}></div>);
		}
		return boxes;
	}

	render() {
		return (
			<Control position="bottomright">
					<div className="legend" style={this.returnLegendStyle()}>
						<div className="clrBoxes">
                            {this.returnColorBoxes().map((line) => {
                                return line;
                            })}
                        </div>
						<div className="values">
                            {this.returnClassValues().map((line) => {
                                return <p>{line}</p>;
                            })}
                        </div>
					</div>
      </Control>
		)
	}
}

export default Legend;
