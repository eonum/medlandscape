import React, { Component, Row, Col } from 'react';
import Control from 'react-leaflet-control';
import './Legend.css'

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
			const value =  lowerBoundary.toFixed(0).toString() + ' - ' + upperBoundary.toFixed(0).toString() + '\n' ;
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
