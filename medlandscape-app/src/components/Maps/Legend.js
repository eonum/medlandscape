import React, { Component, Row, Col } from 'react';
import Control from 'react-leaflet-control';

class Legend extends Component {

	returnClassValues = () => {
		const numberOfClasses = this.props.classColors.length;
		const min = this.props.maxAndMin.min;
		const max = this.props.maxAndMin.max;
		const range = max-min;
		const classSize = range/numberOfClasses;
		let classValues = [];
		for (let i = 0; i < numberOfClasses; i++){
			const upperBoundary = max-classSize*i;
			const lowerBoundary = max-classSize*(i+1);
			// string representation, rounded to have no decimals (0)
			const value =  lowerBoundary.toFixed(0).toString() + ' - ' + upperBoundary.toFixed(0).toString() ;
			classValues.push(value);
			}
		return classValues;
	}

	returnLegendStyle = () => {
		const styles = {
			borderRadius: '5px', // round edges for the box
			margin: '20px', // how far from the map edges it is
			width: '200px',//this.props.maxAndMin.max,
			height: this.props.classColors.length*30+'px',
			backgroundColor: 'white',
			opacity: '0.7',
			fontSize: '16px',
			lineHeight: '30px'
			}
		return styles;
	}

	returnBoxStyle = (color) => {
		const styles = {
			borderRadius: '5px', // round edges for the box
			margin: '0px', // how far from the map edges it is
			width: '30px',
			height: '30px',
			backgroundColor: 'rgb('+color+')',
			opacity: '0.7'
			}
		return styles;
	}

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
						<div className="row">
							<div className="col-md-6">
									{this.returnColorBoxes()}
							</div>
							<div className="col-md-6">
									{this.returnClassValues()}
							</div>
						</div>
					</div>
      </Control>
		)
	}
}

export default Legend;
